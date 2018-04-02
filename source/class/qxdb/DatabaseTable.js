/* ************************************************************************

************************************************************************ */

qx.Class.define("qxdb.DatabaseTable", {
  extend: qx.ui.container.Composite,

  statics : {
    getDefaultConfig : function() {
      var config = {
        tableName : "sqlite_master",
        sortBy : "type",
        selectionMode : qx.ui.table.selection.Model.MULTIPLE_INTERVAL_SELECTION
      };
      return config;
    }
  },

  events : {
    "tableSelectionChanged" : "qx.event.type.Data"
  },

  /**
   * 
   */
  construct: function(model, config) {
    this.base(arguments);

    if (model) {
      this.__model = model;
    }

    if (config) {
      this.__config = config;
    } else {
      this.__config = qxdb.DatabaseTable.getDefaultConfig();
    }

    this.add(this.getChildControl("mainContainer"));

    var fieldNames = ["test"];
    var rowData = [["test"]];
    // table model
    this.__tableModel = new qx.ui.table.model.Simple();
    this.__tableModel.setColumns(fieldNames);
    this.__tableModel.setData(rowData);
  },

  members : {

    __model : null,
    __config : null,
    __tableModel : null,

    /**
     * overridden
     * @param id
     * @param hash
     * @return {Object} Child control
     */
    _createChildControlImpl: function (id, hash) {
      var control;

      switch (id) {
        case "mainContainer":
          control = new qx.ui.container.Composite();
          control.setLayout(new qx.ui.layout.Grow());
          control.add(this.getChildControl("table"));
          break;
        case "table":
          control = new qx.ui.table.Table(this.__tableModel);
          control.set({
            width: 640,
            height: 480,
            decorator : null
          });
          control.getSelectionModel().setSelectionMode(this.__config.selectionMode);
          // control.setTableModel();
          break;
      }
      return control || this.base(arguments, id);
    }
  }
});
