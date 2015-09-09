sap.ui.core.mvc.Controller.extend("sap.ui.medApp.view.Address", {
 // onInit
 // ******************************************
 onInit : function() {
  this.oModel = sap.ui.medApp.global.util.getHomeModel();
  sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(
    this.onRouteMatched, this);
 },
 // onRouteMatched
 // ******************************************
 onRouteMatched : function(oEvent) {
  var _this = this;
  if (!_this.oModel.getProperty("/City")) {
   var fnSuccess = function() {
    _this.getView().setModel(_this.oModel);
   };
   sap.ui.medApp.global.util.getAllCities(fnSuccess);
  }
  _this.oLoginDetails = _this.oModel.getProperty("/LoggedUser");
 },
 // handleSave
 // ******************************************
 handleSave : function() {
  var fnSuccess = function(oData) {
   sap.ui.medApp.global.busyDialog.close();
   sap.m.MessageToast.show("Address saved");
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