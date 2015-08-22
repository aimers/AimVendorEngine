sap.ui.core.mvc.Controller.extend("sap.ui.medApp.view.RuleDetails", {

 onInit : function() {
  this.oModel = sap.ui.medApp.global.util.getHomeModel();
  sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(
    this.onRouteMatched, this);
 },
 // Handler for routing event
 onRouteMatched : function(oEvent) {

  var oView = this.getView();
  if (oEvent.getParameter("name") === "ruledetails") {

   var sRulePath = "/vendorRulesDefn/ruleDefinitions/"
     + oEvent.getParameter("arguments").rule;
   oView.byId("rulesForm").setModel(this.oModel);
   oView.bindElement(sRulePath);
   oView.byId("rulesForm").bindElement(sRulePath);
   

  }
 }
});