sap.ui.core.mvc.Controller.extend("sap.ui.medApp.view.DetailsHome", {
 onInit : function() {
  sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(
    this.onRouteMatched, this);
 },
 onRouteMatched : function(oEvent) {
  this.oModel = sap.ui.medApp.global.util.getHomeModel();
  if (!this.oModel.getProperty("/LoggedUser")) {
   sap.ui.core.UIComponent.getRouterFor(this).navTo("login", {}, true);
   return false;
  }
 },
});