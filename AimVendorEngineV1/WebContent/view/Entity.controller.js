sap.ui.core.mvc.Controller
  .extend(
    "sap.ui.medApp.view.Entity",
    {

     onInit : function() {
      this.oModel = sap.ui.medApp.global.util.getMainModel();
      sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(
        this.onRouteMatched, this);
     },

     onRouteMatched : function(oEvent) {
      if (oEvent.getParameter("name") === "speciality") {
       sap.ui.medApp.global.util.loadListCategory();
       this._bindVendorEntities();
      }
     },

     handleAddEntity : function(oEvent) {
      var _this = this;
      if (!this._oDialog) {
       this._oDialog = sap.ui.xmlfragment("sap.ui.medApp.view.AddEntity", this);
       this._oDialog.setModel(this.oModel);
       this._oDialog.setRememberSelections(false);
       this._oDialog.setMultiSelect(false);
      }
      // clear the old search filter
      this._oDialog.getBinding("items").filter([]);
      // toggle compact style
      this._oDialog.open();
     },

     handleEntitySearch : function(oEvent) {
      var sValue = oEvent.getParameter("value");
      var oFilter = new sap.ui.model.Filter("DESCR",
        sap.ui.model.FilterOperator.Contains, sValue);
      var oBinding = oEvent.getSource().getBinding("items");
      oBinding.filter([ oFilter ]);
     },

     handleSaveEntity : function(oEvent) {
      var aContexts = oEvent.getParameter("selectedContexts");
      if (aContexts.length) {
       sap.m.MessageToast.show("You have chosen "
         + aContexts.map(function(oContext) {
          return oContext.getObject().DESCR;
         }).join(", "));
      }
      oEvent.getSource().getBinding("items").filter([]);
     },

     handleClose : function(oEvent) {
      this._oDialog.close();
     },

     _bindVendorEntities : function() {
      this.getView().setModel(this.oModel);
     },

     handleDelete : function() {
      var oList = oEvent.getSource(), oItem = oEvent.getParameter("listItem"), sPath = oItem
        .getBindingContext().getPath();

      // after deletion put the focus back to the list
      oList.attachEventOnce("updateFinished", oList.focus, oList);

      // send a delete request to the odata service
      this.oModel.remove(sPath);
     },

     onExit : function() {
      if (this._oDialog) {
       this._oDialog.destroy();
      }
     }

    });