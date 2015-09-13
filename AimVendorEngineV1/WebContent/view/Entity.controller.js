sap.ui.core.mvc.Controller
  .extend(
    "sap.ui.medApp.view.Entity",
    {
     // onInit
     // ******************************************
     onInit : function() {
     
      sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(
        this.onRouteMatched, this);
     },
     // onRouteMatched
     // ******************************************
     onRouteMatched : function(oEvent) {
      this.oModel = sap.ui.medApp.global.util.getMainModel();
      this.getView().setModel(this.oModel);
      var _this = this;
      _this.oLoginDetails = _this.oModel.getProperty("/LoggedUser");
      var sName = oEvent.getParameter("name");
      if (sName === "speciality") {
       if (!_this.oModel.getProperty("/vendorsCategory")) {
        var fnSuccess = function() {
         _this._bindVendorEntities();
         _this._toggleSaveButton();
         sap.ui.medApp.global.util.loadListCategory();
         sap.ui.medApp.global.busyDialog.close();
        };
        var param = [ {
         "key" : "INTENT",
         "value" : "1"
        }, {
         "key" : "UID",
         "value" : this.oLoginDetails.USRID.toString()
        } ];
        sap.ui.medApp.global.busyDialog.open();
        sap.ui.medApp.global.util.loadVendorCategory(param, fnSuccess);
       }
      }
     },
     // _toggleSaveButton
     // ******************************************
     _toggleSaveButton : function() {
      if (this.getView().byId("entityList").getItems().length) {
       this.getView().byId("btnSave").setEnabled(true);
      } else {
       this.getView().byId("btnSave").setEnabled(false);
      }
     },
     // handleAddEntity
     // ******************************************
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
     // handleEntitySearch
     // ******************************************
     handleEntitySearch : function(oEvent) {
      var sValue = oEvent.getParameter("value");
      var oFilter = new sap.ui.model.Filter("DESCR",
        sap.ui.model.FilterOperator.Contains, sValue);
      var oBinding = oEvent.getSource().getBinding("items");
      oBinding.filter([ oFilter ]);
     },
     // handleSaveEntity
     // ******************************************
     handleSaveEntity : function(oEvent) {
      var aContexts = oEvent.getParameter("selectedContexts");
      if (aContexts.length) {
       var aData = this.oModel.getProperty("/vendorsCategory");
       var newData = this.oModel.getProperty(aContexts[0].getPath());
       aData.push(newData);
       this.oModel.refresh(true);
       this.oModel.setProperty("/vendorsList/0/Entities", this.oModel
         .getProperty("/vendorsCategory"));
       this._toggleSaveButton();
      }
      oEvent.getSource().getBinding("items").filter([]);
     },
     // handleClose
     // ******************************************
     handleClose : function(oEvent) {
      this._oDialog.close();
     },
     // _bindVendorEntities
     // ******************************************
     _bindVendorEntities : function() {
      this.getView().setModel(this.oModel);
     },
     // handleDelete
     // ******************************************
     handleDelete : function(oEvent) {
      var oList = oEvent.getSource(), oItem = oEvent.getParameter("listItem"), sPath = oItem
        .getBindingContext().getPath();
      oList.attachEventOnce("updateFinished", oList.focus, oList);
      var pathArray = sPath.split("/");
      var index = pathArray[pathArray.length - 1];
      sPath = sPath.substring(0, sPath.length - 2);
      var aData = this.oModel.getProperty(sPath);
      aData.splice(index, 1);
      this.oModel.refresh(true);
      this._toggleSaveButton();
     },
     // onExit
     // ******************************************
     onExit : function() {
      if (this._oDialog) {
       this._oDialog.destroy();
      }
     },
     // handleSave
     // ******************************************
     handleSave : function() {
      var fnSuccess = function(oData) {
       sap.ui.medApp.global.busyDialog.close();
       sap.m.MessageToast.show("Speciality saved");
      };
      sap.ui.medApp.global.busyDialog.open();
      sap.ui.medApp.global.util.updateUserDetails(fnSuccess);
     },
     // navBack
     // ******************************************
     navBack : function() {
      var bReplace = jQuery.device.is.phone ? false : true;
      sap.ui.core.UIComponent.getRouterFor(this).navTo("profile", {}, bReplace);
     }

    });