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

qx.Class.define("qxdb.DatabaseTable", {
  extend: qx.ui.container.Composite,

  events: {
    "datatableSelected": "qx.event.type.Data"
  },

  construct: function () {
    this.base(arguments);
  },

  members: {

    /**
     * overridden
     * @param id
     * @param hash
     * @return {Object} Child control
     */
    _createChildControlImpl: function (id, hash) {
      var control;

      switch (id) {
        case "table":
          control = new qx.ui.basic.Label().set({
            allowGrowX: true
          });
          break;
        case "icon":
          control = new qx.ui.basic.Image().set({
            width: 26,
            height: 26,
            scale: true
          });
          break;
        case "statusIcon":
          control = new qx.ui.basic.Image();
          break;
      }
      return control || this.base(arguments, id);
    },

  }
});
