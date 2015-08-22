sap.ui.core.mvc.Controller.extend("sap.ui.medApp.view.RuleMaster", {

 onInit : function() {
  this.oUpdateFinishedDeferred = jQuery.Deferred();
  this.getView().byId("ruleList").attachEventOnce("updateFinished", function() {
   this.oUpdateFinishedDeferred.resolve();
  }, this);
  this.oModel = sap.ui.medApp.global.util.getHomeModel();
  sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(
    this.onRouteMatched, this);
 },
 // Handler for routing event
 onRouteMatched : function(oEvent) {
  var oList = this.getView().byId("ruleList");
  this.oLoginDetails = this.oModel.getProperty("/LoggedUser");
  var ruleId = oEvent.getParameter("arguments").ruleid;
  this._bindViewModel(ruleId);
  var sName = oEvent.getParameter("name");

  // Wait for the list to be loaded once
  jQuery.when(this.oUpdateFinishedDeferred).then(jQuery.proxy(function() {
   var aItems;

   // On the empty hash select the first item
   if (sName === "rules") {
    this._selectFirstRule();
   }

   // Try to select the item in the list
   if (sName === "ruledetails") {

    aItems = oList.getItems();
    for (var i = 0; i < aItems.length; i++) {
     if (aItems[i].getBindingContext().getPath() === "/" + ruleId) {
      oList.setSelectedItem(aItems[i], true);
      break;
     }
    }
   }

  }, this));

 },
 _selectFirstRule : function() {

  if (!sap.ui.Device.system.phone) {
   var oList = this.getView().byId("ruleList");
   var aItems = oList.getItems();
   if (aItems.length && !oList.getSelectedItem()) {
    oList.setSelectedItem(aItems[0], true);
    this._showRuleDetails(aItems[0]);
   }
  }

 },
 _showRuleDetails : function(oSelectedItem) {

  var bReplace = jQuery.device.is.phone ? false : true;
  var aPath = oSelectedItem.getBindingContext().getPath().split("/");

  var rule = aPath[aPath.length - 1].toString();
  sap.ui.core.UIComponent.getRouterFor(this).navTo("ruledetails", {
   rule : rule
  }, bReplace);
 },

 _bindViewModel : function(ruleId) {
  var oView = this.getView();

  if (!ruleId)
   ruleId = "1";
  var param = [ {
   "key" : "details",
   "value" : {
    "USRID" : this.oLoginDetails.USRID,
    "RULID" : ruleId,
    "UTYID" : this.oLoginDetails.UTYID
   }
  } ];
  sap.ui.medApp.global.util.loadVendorRulesDef(param);
  oView.setModel(this.oModel);

 },
 handlePressAddRule : function() {
  var bReplace = jQuery.device.is.phone ? false : true;
  sap.ui.core.UIComponent.getRouterFor(this).navTo("addrule", {}, bReplace);
 },

 onRuleItemPress : function(oEvent) {
  var oSelectedItem = oEvent.getSource();
  this._showRuleDetails(oSelectedItem);
 },
 navBack : function() {
  var bReplace = jQuery.device.is.phone ? false : true;
  sap.ui.core.UIComponent.getRouterFor(this).navTo("home", {}, bReplace);
 },
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
 _filterRules : function(oEvent) {
  var label = this.getView().byId("lblRuleTyp");
  var ruleid;
  var source = oEvent.getSource();
  var sourceText = source.getText();
  if (sourceText === "Auto Approval") {
   label.setText(sourceText);
   ruleid = "1";
  } else if (sourceText === "Manual Approval") {
   ruleid = "2";
   label.setText(sourceText);
  } else if (sourceText === "Receieve Call") {
   ruleid = "3";
   label.setText(sourceText);
  }
  this._bindViewModel(ruleid);
 }
});