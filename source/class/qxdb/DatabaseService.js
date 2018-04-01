/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2013 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Richard Sternagel (rsternagel)

************************************************************************ */

qx.Class.define("qxdb.DatabaseService",
{
  extend : qx.core.Object,

  properties : {
    contrib : {
      nullable: true
      // event: "changeContrib"
    },
    tableNames : {
      nullable: true,
      event: "changeIndex"
    },
    fieldNames : {
      nullable: true,
      event: "changeFieldNames"
    },
    tableData : {
      nullable: true,
      event: "changeTableData"
    }
  },

  events : {
    "publishSuccess" : "qx.event.type.Event"
  },

  statics :
  {
    BASE_URL : "http://localhost:8081/database/"
  },

  construct : function() {
    this.base(arguments);

    this.__tableNames = new qx.data.store.Json(qxdb.DatabaseService.BASE_URL);
    this.__tableNames.bind("model", this, "tableNames");
    console.log(this.__tableNames);
    this.__fieldNames = new qx.data.store.Json();
    this.__fieldNames.bind("model", this, "fieldNames");
    this.__tableData = new qx.data.store.Json();
    this.__tableData.bind("model", this, "tableData");
  },

  members :
  {
    __tableNames : null,
    __fieldNames : null,

    getTableData : function(tableName)
    {
      var url = qxdb.DatabaseService.BASE_URL + "field_names/" + tableName;
      // this.__fieldNames = new qx.data.store.Json(url);
      this.__fieldNames.setUrl(url);
      this.__tableData.setUrl(qxdb.DatabaseService.BASE_URL + "data/" + tableName);
      // var BASE_URL = qxdb.DatabaseService.BASE_URL,
      //     prevFetchUrl = (this.__fieldNames !== null) ? this.__fieldNames.getUrl() : '',
      //     nextFetchUrl = BASE_URL+contribName;

      // if (this.__fieldNames === null) {
      //   this.__fieldNames = new qx.data.store.Json(nextFetchUrl);
      //   this.__fieldNames.bind("model", this, "contrib");
      // } else {
      //   if (nextFetchUrl === prevFetchUrl) {
      //     this.__fieldNames.reload();
      //   } else {
      //     this.__fieldNames.setUrl(nextFetchUrl);
      //   }
      // }
    },

    getData : function(tableName)
    {
      var url = qxdb.DatabaseService.BASE_URL + "data/" + tableName;
      this.__tableData.setUrl(url);
      this.__tableData.reload();
    },

    getIndex : function(forceReload)
    {
      this.__tableNames.reload();
    },

    __tailorDataObjectFrom : function(model) {
      var dataObj = {},
          found = false,
          lastFetchedContrib = this.getContrib();

      dataObj.name = model.getName();
      dataObj.author = model.getAuthor();
      dataObj.projecturl = model.getProjecturl();
      dataObj.category = model.getCategory();

      if (lastFetchedContrib === null || lastFetchedContrib.getName() !== model.getName()) {
        // new catalog entry with first download entry
        dataObj.downloads = [];
        dataObj.downloads.push([model.getVersion(), model.getUrl()]);
      } else {
        dataObj.downloads = qx.util.Serializer.toNativeObject(this.getContrib().getDownloads()) || {};
        dataObj.downloads.forEach(function(elem, i, arr) {
          // version edit
          if (arr[i][0] === model.getVersion()) {
            arr[i][1] = model.getUrl();
            found = true;
          }
        });
        // version create
        if (found === false) {
          dataObj.downloads.push([model.getVersion(), model.getUrl()]);
        }
        dataObj.downloads.sort();
      }

      return dataObj;
    }
  }
});

