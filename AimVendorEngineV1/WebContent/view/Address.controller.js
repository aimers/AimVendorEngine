sap.ui.core.mvc.Controller.extend("sap.ui.medApp.view.Address", {

 onInit : function() {
  this.oModel = sap.ui.medApp.global.util.getHomeModel();
  sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(
    this.onRouteMatched, this);
 },
 // Handler for routing event
 onRouteMatched : function(oEvent) {
  this.getView().setModel(this.oModel);
 },
 handleSave : function() {
  var fnSuccess = function(oData) {
   sap.m.MessageToast.show("Address saved");

  };
  this._vendorListServiceFacade = new sap.ui.medApp.service.vendorListServiceFacade(
    this.oModel);
  this._vendorListServiceFacade.updateParameters(null, fnSuccess, null,
    "updateUserDetails");
 },
 navBack : function() {
  var bReplace = jQuery.device.is.phone ? false : true;
  sap.ui.core.UIComponent.getRouterFor(this).navTo("profile", {}, bReplace);
 }
});