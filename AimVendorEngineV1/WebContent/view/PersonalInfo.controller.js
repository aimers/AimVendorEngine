jQuery.sap.require("sap.ui.medApp.formatter.formatHelper");
sap.ui.core.mvc.Controller.extend("sap.ui.medApp.view.PersonalInfo", {

 onInit : function() {
  this.oModel = sap.ui.medApp.global.util.getHomeModel();
  sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(
    this.onRouteMatched, this);
 },
 // Handler for routing event
 onRouteMatched : function(oEvent) {

 },
 handleSave : function() {
  var fnSuccess = function(oData) {
   sap.m.MessageToast.show("Personal details saved");

  };
  sap.ui.medApp.global.util.updateUserDetails(fnSuccess);
 },

 navBack : function() {
  var bReplace = jQuery.device.is.phone ? false : true;
  sap.ui.core.UIComponent.getRouterFor(this).navTo("profile", {}, bReplace);
 },
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