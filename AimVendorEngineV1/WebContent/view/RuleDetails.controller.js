jQuery.sap.require("sap.ui.medApp.formatter.formatHelper");
sap.ui.core.mvc.Controller.extend("sap.ui.medApp.view.RuleDetails", {
 // onInit
 // ******************************************
 onInit : function() {
  sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(
    this.onRouteMatched, this);
 },
 // onRouteMatched
 // ******************************************
 onRouteMatched : function(oEvent) {
  var oView = this.getView();
  this.oModel = sap.ui.medApp.global.util.getHomeModel();
  oView.setModel(this.oModel);
  this.oLoginDetails = this.oModel.getProperty("/LoggedUser");

  if (oEvent.getParameter("name") === "ruledetails") {
   this.sRulePath = "/vendorRulesDefn/ruleDefinitions/"
     + oEvent.getParameter("arguments").rule;
   oView.setModel(this.oModel);
   oView.byId("rulesForm").bindElement(this.sRulePath);
   this.RuleId = this.oModel.getProperty(this.sRulePath).RULID;
   this.VtrId = this.oModel.getProperty(this.sRulePath).VTRID;
   this.VrmId = this.oModel.getProperty(this.sRulePath).VRMID;
   if (!this.oModel.getProperty("/vendorsCategory")) {
    var fnSuccess = function() {
     sap.ui.medApp.global.busyDialog.close();
    };
    var param = [ {
     "key" : "INTENT",
     "value" : "1"
    }, {
     "key" : "UID",
     "value" : this.oLoginDetails.USRID.toString()
    } ]
    sap.ui.medApp.global.busyDialog.open();
    sap.ui.medApp.global.util.loadVendorCategory(param, fnSuccess);
   }
  }
 },
 // navBack
 // ******************************************
 navBack : function() {
  var bReplace = jQuery.device.is.phone ? false : true;
  sap.ui.core.UIComponent.getRouterFor(this).navTo("rules", {}, bReplace);
 },
 // handleDaysSelectionChange
 // ******************************************
 handleDaysSelectionChange : function(oEvent) {
 },
 // handleDaysSelectionFinish
 // ******************************************
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
 },
 // handleRuleCancel
 // ******************************************
 handleRuleCancel : function(oEvent) {
  var bReplace = jQuery.device.is.phone ? false : true;
  sap.ui.core.UIComponent.getRouterFor(this).navTo("rules", {}, bReplace);
 },
 // handleRuleSave
 // ******************************************
 handleRuleSave : function(oEvent) {
  sap.ui.medApp.global.busyDialog.open();
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
    "DESCR" : data.DESCR.toString(),
    "VRMID" : this.VrmId
   }
  } ];
  var fnSuccess = function(oData) {
   sap.ui.medApp.global.busyDialog.close();
   sap.m.MessageToast.show("Rule Updated");
  };
  var fnError = function(oData) {
   sap.ui.medApp.global.busyDialog.close();
   sap.m.MessageToast.show("Error occured while updating rule");
  };
  sap.ui.medApp.global.util.updateRule(param, fnSuccess, fnError);
 },
 // onChangeOETSLTime
 // ******************************************
 onChangeOETSLTime : function(oEvent) {
  var oSource = oEvent.getSource();
  var time = oSource.getDateValue();
  this.oModel.setProperty(oSource.getBindingContext().getPath() + "/OESTL",
    time.toString().substring(24, 16));
 },
 // onChangeOSTSLTime
 // ******************************************
 onChangeOSTSLTime : function(oEvent) {
  var oSource = oEvent.getSource();
  var time = oSource.getDateValue();
  this.oModel.setProperty(oSource.getBindingContext().getPath() + "/OSTSL",
    time.toString().substring(24, 16));
 },
 // onChangeDETIMTime
 // ******************************************
 onChangeDETIMTime : function(oEvent) {
  var oSource = oEvent.getSource();
  var time = oSource.getDateValue();
  this.oModel.setProperty(oSource.getBindingContext().getPath() + "/DETIM",
    time.toString().substring(24, 16));
 },
 // onChangeDSTIMTime
 // ******************************************
 onChangeDSTIMTime : function(oEvent) {
  var oSource = oEvent.getSource();
  var time = oSource.getDateValue();
  this.oModel.setProperty(oSource.getBindingContext().getPath() + "/DSTIM",
    time.toString().substring(24, 16));
 },
 handleRuleDelete : function(oEvent) {
  var _this = this;
  var param = [ {
   "key" : "details",
   "value" : {
    "RULID" : this.RuleId.toString(),
    "VTRID" : this.VtrId.toString(),
    "VRMID" : this.VrmId.toString()
   }
  } ];
  var fnSuccess = function(oData) {
   sap.ui.medApp.global.busyDialog.close();
   sap.m.MessageToast.show("Rule Deleted");
   var bReplace = jQuery.device.is.phone ? false : true;
   sap.ui.core.UIComponent.getRouterFor(_this).navTo("rules", {}, bReplace);
  };
  var fnError = function(oData) {
   sap.ui.medApp.global.busyDialog.close();
   sap.m.MessageToast.show("Error occured while deleting rule");
  };
  sap.ui.medApp.global.util.deleteRule(param, fnSuccess, fnError);
 }

});