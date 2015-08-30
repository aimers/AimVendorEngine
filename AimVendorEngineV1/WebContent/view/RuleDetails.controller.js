jQuery.sap.require("sap.ui.medApp.formatter.formatHelper");
sap.ui.core.mvc.Controller.extend("sap.ui.medApp.view.RuleDetails", {

 onInit : function() {
  sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(
    this.onRouteMatched, this);

 },
 // Handler for routing event
 onRouteMatched : function(oEvent) {
  this.oModel = sap.ui.medApp.global.util.getHomeModel();
  this.oLoginDetails = this.oModel.getProperty("/LoggedUser");
  var oView = this.getView();
  if (oEvent.getParameter("name") === "ruledetails") {

   this.sRulePath = "/vendorRulesDefn/ruleDefinitions/"
     + oEvent.getParameter("arguments").rule;
   oView.setModel(this.oModel);
   oView.byId("rulesForm").bindElement(this.sRulePath);
   if (!this.oModel.getProperty("/vendorsCategory")) {
    var param = [ {
     "key" : "INTENT",
     "value" : "1"
    }, {
     "key" : "UID",
     "value" : this.oLoginDetails.USRID.toString()
    } ]
    sap.ui.medApp.global.util.loadVendorCategory(param);
   }
  }
 },
 navBack : function() {
  var bReplace = jQuery.device.is.phone ? false : true;
  sap.ui.core.UIComponent.getRouterFor(this).navTo("rules", {}, bReplace);
 },

 handleDaysSelectionChange : function(oEvent) {
  // var changedItem = oEvent.getParameter("changedItem");
  // var isSelected = oEvent.getParameter("selected");
  //
  // var state = "Selected";
  // if (!isSelected) {
  // state = "Deselected"
  // }
  //
  // sap.m.MessageToast.show("Event 'selectionChange': " + state + " '"
  // + changedItem.getText() + "'", {
  // width : "auto"
  // });
 },

 handleDaysSelectionFinish : function(oEvent) {

  var oSource = oEvent.getSource();
  var selectedKey = oSource.getSelectedKeys();
  for (k in selectedKey) {
   if (selectedKey[k] === ",") {
    selectedKey.splice(k);
   }
  }

  this.oModel.setProperty(oSource.getBindingContext().getPath() + "/DAYS",
    selectedKey.toString());

  // var selectedItems = oEvent.getParameter("selectedItems");

  // var messageText = "Event 'selectionFinished': [";
  //
  // for (var i = 0; i < selectedItems.length; i++) {
  // messageText += "'" + selectedItems[i].getText() + "'";
  // if (i != selectedItems.length - 1) {
  // messageText += ",";
  // }
  // }
  //
  // messageText += "]";
  //
  // sap.m.MessageToast.show(messageText, {
  // width : "auto"
  // });
 },
 handleRuleCancel : function(oEvent) {
  var bReplace = jQuery.device.is.phone ? false : true;
  sap.ui.core.UIComponent.getRouterFor(this).navTo("rules", {}, bReplace);
 },
 handleRuleSave : function(oEvent) {

  var data = this.oModel.getProperty(this.sRulePath);
  var param = [ {
   "key" : "details",
   "value" : {
    "UTYID" : 2,
    "DAYS" : data.DAYS.toString(),
    "DETIM" : data.DETIM.toString(),
    "OSTSL" : data.OSTSL.toString(),
    "VTRID" : data.VTRID.toString(),
    "DSTIM" : data.DSTIM.toString(),
    "TIMZN" : data.TIMZN.toString(),
    "OETSL" : data.OETSL.toString(),
    "RECUR" : "1",
    "RULID" : data.RULID.toString(),
    "ETYID" : data.ETYID.toString(),
    "ENTID" : data.ENTID.toString(),
    "USRID" : data.USRID.toString(),
    "ETCID" : data.ETCID.toString(),
    "DESCR" : data.DESCR.toString()
   }

  } ];

  var fnSuccess = function(oData) {
   sap.m.MessageToast.show("Rule Updated");

  };
  var fnError = function(oData) {
   sap.m.MessageToast.show("Error occured while updating rule");

  };

  sap.ui.medApp.global.util.updateRule(param, fnSuccess, fnError);
 },
 onChangeOETSLTime : function(oEvent) {
  var oSource = oEvent.getSource();
  var time = oSource.getDateValue();
  this.oModel.setProperty(oSource.getBindingContext().getPath() + "/OESTL",
    time.toString().substring(24, 16));
 },

 onChangeOSTSLTime : function(oEvent) {
  var oSource = oEvent.getSource();
  var time = oSource.getDateValue();
  this.oModel.setProperty(oSource.getBindingContext().getPath() + "/OSTSL",
    time.toString().substring(24, 16));
 },

 onChangeDETIMTime : function(oEvent) {
  var oSource = oEvent.getSource();
  var time = oSource.getDateValue();
  this.oModel.setProperty(oSource.getBindingContext().getPath() + "/DETIM",
    time.toString().substring(24, 16));
 },

 onChangeDSTIMTime : function(oEvent) {
  var oSource = oEvent.getSource();
  var time = oSource.getDateValue();
  this.oModel.setProperty(oSource.getBindingContext().getPath() + "/DSTIM",
    time.toString().substring(24, 16));
 }

});