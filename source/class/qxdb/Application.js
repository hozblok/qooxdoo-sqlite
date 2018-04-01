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

qx.Class.define("qxdb.Application",
{
  extend : qx.application.Standalone,

  statics :
  {
    // dokuwiki logged in user
    CURRENT_USER : "test2"//(typeof JSINFO !== "undefined" && typeof JSINFO.user !== "undefined") ? JSINFO.user : null
  },

  members :
  {

    createTable : function(fieldNames, rowData)
    {
      if (!fieldNames) {
        fieldNames = [];
      }
      if (!rowData) {
        rowData = [];
      }

      // table model
      this._tableModel = new qx.ui.table.model.Simple();
      this._tableModel.setColumns(fieldNames);
      this._tableModel.setData(rowData);
      // tableModel.setColumnEditable(1, true);
      // tableModel.setColumnEditable(2, true);
      // tableModel.setColumnSortable(3, false);

      // table
      this._table = new qx.ui.table.Table(this._tableModel);

      this._table.set({
        width: 600,
        height: 400,
        decorator : null
      });

      this._table.getSelectionModel().setSelectionMode(qx.ui.table.selection.Model.MULTIPLE_INTERVAL_SELECTION);

      this._tcm = this._table.getTableColumnModel();

      // Display a checkbox in column 3
      // this._tcm.setDataCellRenderer(3, new qx.ui.table.cellrenderer.Boolean());

      // use a different header renderer
      // this._tcm.setHeaderCellRenderer(2, new qx.ui.table.headerrenderer.Icon("icon/16/apps/office-calendar.png", "A date"));
    },

    main : function()
    {
      this.base(arguments);

      this.createTable();
      var container = new qx.ui.container.Composite(new qx.ui.layout.VBox());
      this.win = new qx.ui.container.Composite();
      this.win.setLayout(new qx.ui.layout.VBox());
      this.win.add(this._table, {flex : 1});
      container.add(this.win, {flex : 1});

      var formItems = new qxdb.FormItems(qxdb.Application.CURRENT_USER);
      // var contribService = new qxdb.ContribService();
      var databaseService = new qxdb.DatabaseService();

      // contribService.addListener("changeIndex", function(e) {
        // if (e.getData() !== null) {
        //    formItems.updateContribIndex(e.getData());
        // }
      // }, this);

      // contribService.addListener("changeContrib", function(e) {
      //   if (e.getData() !== null) {
      //      formItems.updateContribFormWith(e.getData());
      //   }
      // }, this);

      databaseService.addListener("changeIndex", function(e) {
        if (e.getData() !== null) {
          formItems.updateContribIndex(e.getData());
        }
      }, this);

      databaseService.addListener("changeFieldNames", function(e) {
        if (e.getData() !== null) {
          console.log("changeFieldNames");
          // var fieldNames = qx.util.Serializer.toNativeObject(e.getData());
          // console.log(databaseService.getData(formItems.tableName));
          // var data = qx.util.Serializer.toNativeObject(databaseService.getData(formItems.tableName));
          // var model = new qx.data.Array(index);//allContribNames);
          // this.getRoot().add(win, {left:100, top:250});
          // this._tableModel = new qx.ui.table.model.Simple();
          // this._tableModel.setColumns(fieldNames);
          // this._tableModel.setData(data);
          // this._table.setTableModel(tableModel);
          // this._tableModel.setData(data);
        }
      }, this);

      databaseService.addListener("changeTableData", function(e) {
        if (e.getData() !== null) {
          console.log("changeTableData");
          var fieldNames = qx.util.Serializer.toNativeObject(databaseService.getFieldNames());
          var data = qx.util.Serializer.toNativeObject(e.getData());
          // console.log(databaseService.getData(formItems.tableName));
          // var data = qx.util.Serializer.toNativeObject(databaseService.getData(formItems.tableName));
          // var model = new qx.data.Array(index);//allContribNames);
          // this.getRoot().add(win, {left:100, top:250});
          this._tableModel = new qx.ui.table.model.Simple();
          this._tableModel.setColumns(fieldNames);
          this._tableModel.setData(data);
          this._table.setTableModel(this._tableModel);
        }
      }, this);

      

      // databaseService.addListener("changeContrib", function(e) {
      //   console.log("changeContrib");
      // }, this);

      formItems.addListener("datatableSelected", function(e) {
        console.log("datatableSelected");
        databaseService.getTableData(e.getData());
      }, this);


      // formItems.addListener("publish", function(e) {
      //   contribService.publish(e.getData());
      // }, this);

      // contribService.addListener("publishSuccess", function(e) {
      //   contribService.getIndex();
      //   contribService.getTableData(e.getData());
      // }, this);

      container.add(formItems, {flex : 1});
      this.getRoot().add(container, {edge: 0});
    }
  }
});
