jQuery.sap.require("sap.ui.medApp.formatter.formatHelper");
sap.ui.core.mvc.Controller
  .extend(
    "sap.ui.medApp.view.AddRule",
    {

     onInit : function() {
      this.oModel = sap.ui.medApp.global.util.getHomeModel();
      sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(
        this.onRouteMatched, this);
      this.oLoginDetails = this.oModel.getProperty("/LoggedUser");
      this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
     },
     // Handler for routing event
     onRouteMatched : function(oEvent) {
      this.RuleModel = new sap.ui.model.json.JSONModel();
      var oData = {
       "DAYS" : "",
       "ETYID" : oLoginDetails.ETYID.toString(),
       "OETSL" : "",
       "TIMZN" : "IST",
       "OSTSL" : "",
       "DETIM" : "",
       "RULID" : "",
       "USRID" : oLoginDetails.USRID.toString(),
       "ENTID" : oLoginDetails.ENTID.toString(),
       "RECUR" : "1",
       "DSTIM" : "",
       "ETCID" : oLoginDetails.ETCID.toString(),
       "UTYID" : oLoginDetails.UTYID.toString(),
       "DESCR" : ""
      };
      this.RuleModel.setData(oData);
      this.setModel("rule", this.RuleModel);
     },
     handleRuleSave : function() {

      var param = [ {
       "key" : "details",
       "value" : {
        "DAYS" : this.RuleModel.getProperty("DAYS").toString(),
        "ETYID" : this.RuleModel.getProperty("ETYID").toString(),
        "OETSL" : this.RuleModel.getProperty("OETSL").toString(),
        "TIMZN" : this.RuleModel.getProperty("TIMZN").toString(),
        "OSTSL" : this.RuleModel.getProperty("OSTSL").toString(),
        "DETIM" : this.RuleModel.getProperty("DETIM").toString(),
        "RULID" : this.RuleModel.getProperty("RULID").toString(),
        "USRID" : this.RuleModel.getProperty("USRID").toString(),
        "ENTID" : this.RuleModel.getProperty("ENTID").toString(),
        "RECUR" : this.RuleModel.getProperty("RECUR").toString(),
        "DSTIM" : this.RuleModel.getProperty("DSTIM").toString(),
        "ETCID" : this.RuleModel.getProperty("ETCID").toString(),
        "UTYID" : this.RuleModel.getProperty("UTYID").toString(),
        "DESCR" : this.RuleModel.getProperty("DESCR").toString()
       }
      } ];
      var fnSuccess = function(oData) {
       sap.m.MessageToast.show("Rule Added");
      };
      this._vendorListServiceFacade = new sap.ui.medApp.service.vendorListServiceFacade(
        this.oModel);
      this._vendorListServiceFacade.updateParameters(param, fnSuccess, null,
        "createRule");

     },
     handleRuleCancel : function() {
      this._oRouter.myNavBack();
     }
    });