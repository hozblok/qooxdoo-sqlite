# -*- coding: utf-8 -*-
##########################################################################
#
# qooxdoo - the new era of web development
#
# http://qooxdoo.org
#
# Copyright:
# 2006-2013 1&1 Internet AG, Germany, http://www.1und1.de
#
# License:
# LGPL: http://www.gnu.org/licenses/lgpl.html
# EPL: http://www.eclipse.org/org/documents/epl-v10.php
# See the LICENSE file in the project"s top-level directory for details.
#
# Authors:
#    * Richard Sternagel (rsternagel)
#
##########################################################################

from flask import Flask
from flask import request
from flask import jsonify
from flask import json

from .validation import CatalogEntryValidator

import codecs
import os
import sqlite3

CUR_DIR = os.path.dirname(os.path.abspath(__file__))
CONTRIB_DIR = "catalog"
ABS_CONTRIB_DIR = CUR_DIR + "/../" + CONTRIB_DIR
ABS_FRONT_DIR = CUR_DIR + "/../../source-output"

app = Flask(__name__, 
            static_folder=ABS_FRONT_DIR,
            static_url_path='')

# write stacktraces to apache error log
# TODO: wrap with condition cause "must never be used on production machines"
app.debug = True



connect = sqlite3.connect('database.sqlite')

class RestApi(object):
    """Main entry point for REST-Requests.
    """

    @app.route('/')
    def root():
        return app.send_static_file('index.html')

    @app.route('/database/')
    def get_table_names():
        cursor = connect.cursor()
        # type|name|tbl_name|rootpage|sql
        cursor.execute('SELECT name FROM sqlite_master WHERE type="table";')
        return jsonify(list(map(lambda x : x[0], cursor.fetchall())))

    @app.route('/database/field_names/<table_name>', methods=["GET"])
    def get_table_field_names(table_name):
        cursor = connect.cursor()
        cursor.execute('SELECT * FROM {} LIMIT 1;'.format(table_name))
        return jsonify(list(map(lambda x: x[0], cursor.description)))

    @app.route('/database/data/<table_name>', methods=["GET"])
    def get_table_data(table_name):
        cursor = connect.cursor()
        cursor.execute('SELECT * FROM {};'.format(table_name))
        return jsonify(list(cursor.fetchall()))

    @app.route("/catalog/", methods=["GET"])
    def get_contribs_index():
        """Gets contribs index
        """
        filenames = os.listdir(ABS_CONTRIB_DIR)
        RESOURCE = "catalog"
        index = {}

        for name in [name[:-5] for name in filenames]:
            index[name] = request.url_root + RESOURCE + "/" + name

        return jsonify(index)

    @app.route("/catalog/<contrib_name>", methods=["GET", "PUT"])
    def process_contrib_detail(contrib_name):
        """Gets/Adds/Updates a contribition identified by <contrib_name>.

        .. seealso:: http://flask.pocoo.org/docs/api/#incoming-request-data
        """
        if request.method == "GET":
            entry_filepath = ABS_CONTRIB_DIR+"/"+contrib_name+".json"
            entry_file = codecs.open(entry_filepath, encoding="utf8")
            return jsonify(json.load(entry_file))  # 200 OK

        if request.method == "PUT" and request.json:
            errors = []
            entry_file = None
            entry_filepath = ABS_CONTRIB_DIR+"/"+contrib_name+".json"

            # validate request payload
            if os.path.exists(entry_filepath):
                old_entry_file = codecs.open(entry_filepath, "r", "utf8")
                old_entry = json.load(old_entry_file)
                vali = CatalogEntryValidator()
                errors = vali.validate(
                    request.json,
                    vali.schema_v1_0(expected_author=old_entry["author"])
                )
                old_entry_file.close()
            else:
                vali = CatalogEntryValidator()
                errors = vali.validate(request.json, vali.schema_v1_0())

            if errors:
                return jsonify(errors=errors), 400  # Bad Request

            raw_json = json.dumps(request.json)
            entry_file = codecs.open(entry_filepath, "w", "utf8")
            entry_file.write(raw_json)
            entry_file.close()
            return jsonify(request.json), 201  # Created

if __name__ == "__main__":
    app.run()
