sap.ui.core.mvc.Controller.extend("sap.ui.medApp.view.RuleMaster", {
 // onInit
 // ******************************************
 onInit : function() {
  this.oModel = sap.ui.medApp.global.util.getHomeModel();
  this.ruleId = "1";
  sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(
    this.onRouteMatched, this);
 },
 // onRouteMatched
 // ******************************************
 onRouteMatched : function(oEvent) {
  this.oLoginDetails = this.oModel.getProperty("/LoggedUser");
  var rule, aPath;
  var oList = this.getView().byId("ruleList");
  var oArguments = oEvent.getParameter("arguments");
  var sName = oEvent.getParameter("name");
  if (sName === "rules") {
   this._bindViewModel();
   this._selectFirstRule();
  }
 },
 // onRouteMatched
 // ******************************************
 _selectFirstRule : function() {
  if (!sap.ui.Device.system.phone) {
   var oList = this.getView().byId("ruleList");
   var aItems = oList.getItems();
   if ((aItems.length && !oList.getSelectedItem()) || aItems.length === 1) {
    oList.setSelectedItem(aItems[0]);
    this._showRuleDetails(aItems[0]);
   }
  }
 },
 // _showRuleDetails
 // ******************************************
 _showRuleDetails : function(oSelectedItem) {
  var bReplace = jQuery.device.is.phone ? false : true;
  var aPath = oSelectedItem.getBindingContext().getPath().split("/");
  var Rule = aPath[aPath.length - 1].toString();
  sap.ui.core.UIComponent.getRouterFor(this).navTo("ruledetails", {
   from : "rules",
   rule : Rule
  }, bReplace);
 },
 // _bindViewModel
 // ******************************************
 _bindViewModel : function() {
  sap.ui.medApp.global.busyDialog.open();
  var _this = this;
  var oView = this.getView();
  var oList = oView.byId("ruleList");
  var param = [ {
   "key" : "details",
   "value" : {
    "USRID" : this.oLoginDetails.USRID,
    "RULID" : this.ruleId,
    "UTYID" : this.oLoginDetails.UTYID
   }
  } ];
  var fnSuccess = function() {
   sap.ui.medApp.global.busyDialog.close();
   oView.setModel(_this.oModel);
   if (!oList.getSelectedItem()) {
    _this._selectFirstRule();
   } else {
    if (!sap.ui.Device.system.phone) {
     // _this._showRuleDetails(oList.getSelectedItem());
    }
   }

  };
  sap.ui.medApp.global.util.loadVendorRulesDef(param, fnSuccess);
 },
 // handlePressAddRule
 // ******************************************
 handlePressAddRule : function() {
  var bReplace = jQuery.device.is.phone ? false : true;
  sap.ui.core.UIComponent.getRouterFor(this).navTo("addrule");
  //  
  //  
  // sap.ui.core.UIComponent.getRouterFor(this).myNavToWithoutHash(
  // "sap.ui.medApp.view.AddRule", "XML", false, null);
  // // .navTo("addrule", {}, bReplace);
 },
 // onRuleItemPress
 // ******************************************
 onRuleItemPress : function(oEvent) {
  var oSelectedItem = oEvent.getParameter("listItem") || oEvent.getSource();
  this._showRuleDetails(oSelectedItem);
 },
 // navBack
 // ******************************************
 navBack : function() {
  var bReplace = jQuery.device.is.phone ? false : true;
  sap.ui.core.UIComponent.getRouterFor(this).navTo("home", {}, bReplace);
 },
 // handleFilterPress
 // ******************************************
 handleFilterPress : function(oEvent) {
  var oController = this;
  if (!this.oFilters) {
   this.oFilters = new sap.m.ActionSheet({
    placement : sap.m.PlacementType.Bottom,
    buttons : [ new sap.m.Button({
     text : "Auto Approval",
     press : oController._filterRules.bind(oController)
    }), new sap.m.Button({
     text : "Manual Approval",
     press : oController._filterRules.bind(oController)
    }), new sap.m.Button({
     text : "Receieve Call",
     press : oController._filterRules.bind(oController)
    }), ]
   });
  }
  this.oFilters.openBy(oEvent.oSource);
 },
 // _filterRules
 // ******************************************
 _filterRules : function(oEvent) {
  var label = this.getView().byId("lblRuleTyp");
  var ruleid;
  var source = oEvent.getSource();
  var sourceText = source.getText();
  if (sourceText === "Auto Approval") {
   label.setText(sourceText);
   this.ruleId = "1";
  } else if (sourceText === "Manual Approval") {
   this.ruleId = "2";
   label.setText(sourceText);
  } else if (sourceText === "Receieve Call") {
   this.ruleId = "3";
   label.setText(sourceText);
  }
  this._bindViewModel(this.ruleId);
 }
});