jQuery.sap.require("sap.ui.medApp.formatter.formatHelper");
sap.ui.core.mvc.Controller.extend("sap.ui.medApp.view.PersonalInfo", {
  // onInit
  // ******************************************
  onInit : function() {

    sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(
        this.onRouteMatched, this);
  },
  // onRouteMatched
  // ******************************************
  onRouteMatched : function(oEvent) {
    this.oModel = sap.ui.medApp.global.util.getHomeModel();
    this.getView().setModel(this.oModel);
    this.oLoginDetails = this.oModel.getProperty("/LoggedUser");
  },
  // handleSave
  // ******************************************
  handleSave : function() {
    var fnSuccess = function(oData) {
      if (oData.results) {
        sap.ui.medApp.global.busyDialog.close();
        sap.m.MessageToast.show("User information saved");
      } else {
        sap.ui.medApp.global.busyDialog.close();
        sap.m.MessageToast
            .show("An error occured while updating user information");
      }
    };
    sap.ui.medApp.global.busyDialog.open();
    sap.ui.medApp.global.util.updateUserDetails(fnSuccess);
  },
  // navBack
  // ******************************************
  navBack : function() {
    var bReplace = jQuery.device.is.phone ? false : true;
    sap.ui.core.UIComponent.getRouterFor(this).navTo("profile", {}, bReplace);
  },
  // handleChange
  // ******************************************
  handleChange : function(oEvent) {
    var oSave = this.getView().byId("btnSave");
    var oDP = oEvent.oSource;
    var sValue = oEvent.getParameter("value");
    var bValid = oEvent.getParameter("valid");
    if (bValid) {
      oDP.setValueState(sap.ui.core.ValueState.None);
      oSave.setEnabled(true);
    } else {
      oDP.setValueState(sap.ui.core.ValueState.Error);
      oSave.setEnabled(false);
    }
  }
});