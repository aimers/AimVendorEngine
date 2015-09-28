sap.ui.core.mvc.Controller.extend("sap.ui.medApp.view.ForgetPassword", {

 onInit : function() {
  this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
  this._oRouter.attachRoutePatternMatched(this._handleRouteMatched, this);
 },

 _handleRouteMatched : function(oEvent) {
  this._resetValues();
 },

 // navBack
 // ******************************************
 navBack : function() {
  var bReplace = jQuery.device.is.phone ? false : true;
  this._oRouter.navTo("login", {}, bReplace);
 },

 handleCancel : function() {
  var bReplace = jQuery.device.is.phone ? false : true;
  this._oRouter.navTo("login", {}, bReplace);
 },

 _resetValues : function() {
  var oView = this.getView();
  var oPswd = oView.byId("inputPassword");
  var oMobile = oView.byId("inputMobile");
  oPswd.setValue("");
  oMobile.setValue("");
  oPswd.setValueState(sap.ui.core.ValueState.None);
  oMobile.setValueState(sap.ui.core.ValueState.None);
 },

 handleSave : function(oEvent) {
  var _this = this;

  if (_this.validateInput()) {

   var fnError = function() {
    sap.ui.medApp.global.busyDialog.close();
    sap.m.MessageToast.show("Error occured while updating password");
   };

   var fnSuccess = function() {
    sap.ui.medApp.global.busyDialog.close();
    sap.m.MessageToast
      .show("Password updated successfully. Please login with new password");
    _this._resetValues();
   };
   var oPswd = oView.byId("inputPassword");
   var oMobile = oView.byId("inputMobile");
   var param = [ {
    "key" : "details",
    "value" : {
     "USRNM" : oMobile.getValue().toString(),
     "UERPW" : oPswd.getValue().toString()
    }
   } ];
   sap.ui.medApp.global.busyDialog.open();
   sap.ui.medApp.global.util.updatePassword(param, fnSuccess, fnErro);
  }

 },
 validateInput : function() {
  var regxRequired = /([^\s])/;
  var mobile = /^[0-9]{10}$/;
  var oView = this.getView();
  var oPswd = oView.byId("inputPassword");
  var oMobile = oView.byId("inputMobile");
  var invalidInputs = false;
  // Mobile
  if (!mobile.test(oMobile.getValue().toString())) {
   invalidInputs = true;
   oMobile.setValueState(sap.ui.core.ValueState.Error);
  } else {
   oMobile.setValueState(sap.ui.core.ValueState.None);
  }
  // Password
  if (!regxRequired.test(oPswd.getValue().toString())) {
   invalidInputs = true;
   oPswd.setValueState(sap.ui.core.ValueState.Error);
  } else {
   oPswd.setValueState(sap.ui.core.ValueState.None);
  }
  return !invalidInputs;
 }

});