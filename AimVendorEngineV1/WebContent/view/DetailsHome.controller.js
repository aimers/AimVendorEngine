sap.ui.core.mvc.Controller.extend("sap.ui.medApp.view.DetailsHome", {
 onInit : function() {
  sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(
    this.onRouteMatched, this);
 },
 onRouteMatched : function(oEvent) {
 },
});