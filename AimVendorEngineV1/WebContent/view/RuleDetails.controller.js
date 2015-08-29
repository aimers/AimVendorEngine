jQuery.sap.require("sap.ui.medApp.formatter.formatHelper");
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
   // oView.byId("rulesForm").bindElement(sRulePath);

  }
 },
 navBack : function() {
  var bReplace = jQuery.device.is.phone ? false : true;
  sap.ui.core.UIComponent.getRouterFor(this).navTo("rules", {}, bReplace);
 },

 handleDaysSelectionChange : function(oEvent) {
  var changedItem = oEvent.getParameter("changedItem");
  var isSelected = oEvent.getParameter("selected");

  var state = "Selected";
  if (!isSelected) {
   state = "Deselected"
  }

  sap.m.MessageToast.show("Event 'selectionChange': " + state + " '"
    + changedItem.getText() + "'", {
   width : "auto"
  });
 },

 handleDaysSelectionFinish : function(oEvent) {
  var selectedItems = oEvent.getParameter("selectedItems");
  var messageText = "Event 'selectionFinished': [";

  for (var i = 0; i < selectedItems.length; i++) {
   messageText += "'" + selectedItems[i].getText() + "'";
   if (i != selectedItems.length - 1) {
    messageText += ",";
   }
  }

  messageText += "]";

  sap.m.MessageToast.show(messageText, {
   width : "auto"
  });
 }

});