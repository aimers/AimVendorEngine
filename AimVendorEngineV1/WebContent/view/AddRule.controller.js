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
      var oData = {
       "DAYS" : "",
       "ETYID" : "",
       "OETSL" : "",
       "TIMZN" : "IST",
       "OSTSL" : "",
       "DETIM" : "",
       "RULID" : "",
       "USRID" : this.oLoginDetails.USRID.toString(),
       "ENTID" : "",
       "RECUR" : "1",
       "DSTIM" : "",
       "ETCID" : "",
       "UTYID" : this.oLoginDetails.UTYID.toString(),
       "DESCR" : ""
      };
      this.oModel.setProperty("/newRule", oData);
      this._onEntitySelection(this.getView().byId("entitySelect")
        .getSelectedItem());
      this.oModel.setProperty("/newRule/RULID", this.getView().byId("ruleType")
        .getSelectedKey());
      this.oModel.setProperty("/valueState", "None");
     },
     handleRuleSave : function(oEvent) {
      if (this._validateInputs()) {
       var param = [ {
        "key" : "details",
        "value" : {
         "DAYS" : this.oModel.getProperty("/newRule/DAYS").toString(),
         "ETYID" : this.oModel.getProperty("/newRule/ETYID").toString(),
         "OETSL" : this.oModel.getProperty("/newRule/OETSL").toString(),
         "TIMZN" : this.oModel.getProperty("/newRule/TIMZN").toString(),
         "OSTSL" : this.oModel.getProperty("/newRule/OSTSL").toString(),
         "DETIM" : this.oModel.getProperty("/newRule/DETIM").toString(),
         "RULID" : this.oModel.getProperty("/newRule/RULID").toString(),
         "USRID" : this.oModel.getProperty("/newRule/USRID").toString(),
         "ENTID" : this.oModel.getProperty("/newRule/ENTID").toString(),
         "RECUR" : this.oModel.getProperty("/newRule/RECUR").toString(),
         "DSTIM" : this.oModel.getProperty("/newRule/DSTIM").toString(),
         "ETCID" : this.oModel.getProperty("/newRule/ETCID").toString(),
         "UTYID" : this.oModel.getProperty("/newRule/UTYID").toString(),
         "DESCR" : this.oModel.getProperty("/newRule/DESCR").toString()
        }
       } ];
       var fnSuccess = function(oData) {
        sap.m.MessageToast.show("Rule Added");

       };
       this._vendorListServiceFacade = new sap.ui.medApp.service.vendorListServiceFacade(
         this.oModel);
       this._vendorListServiceFacade.updateParameters(param, fnSuccess, null,
         "createRule");
      }
     },
     handleRuleCancel : function() {
      var bReplace = jQuery.device.is.phone ? false : true;
      sap.ui.core.UIComponent.getRouterFor(this).navTo("rules", {}, bReplace);
     },

     onChangeOETSLTime : function(oEvent) {
      var oSource = oEvent.getSource();
      var time = oSource.getDateValue();
      this.oModel.setProperty("/newRule/OETSL", time.toString().substring(24,
        16));
     },

     onChangeOSTSLTime : function(oEvent) {
      var oSource = oEvent.getSource();
      var time = oSource.getDateValue();
      this.oModel.setProperty("/newRule/OSTSL", time.toString().substring(24,
        16));
     },

     onChangeDETIMTime : function(oEvent) {
      var oSource = oEvent.getSource();
      var time = oSource.getDateValue();
      this.oModel.setProperty("/newRule/DETIM", time.toString().substring(24,
        16));
     },

     onChangeDSTIMTime : function(oEvent) {
      var oSource = oEvent.getSource();
      var time = oSource.getDateValue();
      this.oModel.setProperty("/newRule/DSTIM", time.toString().substring(24,
        16));
     },

     onEntitySelect : function(oEvent) {
      var SelectedItem = oEvent.getSource();
      this._onEntitySelection(SelectedItem);
     },

     _onEntitySelection : function(SelectedItem) {
      var sPath = SelectedItem.getBindingContext().getPath();

      this.oModel.setProperty("/newRule/ENTID", SelectedItem.getKey());
      this.oModel.setProperty("/newRule/ETYID", this.oModel.getProperty(sPath
        + "/ETYID"));
      this.oModel.setProperty("/newRule/ETCID", this.oModel.getProperty(sPath
        + "/ETCID"));
     },

     handleDaysSelectionFinish : function(oEvent) {
      var oSource = oEvent.getSource();
      this.oModel.setProperty("/newRule/DAYS", oSource.getSelectedKeys()
        .toString());
     },

     handleRuleTypeSelection : function(oEvent) {
      var oSectedKey = oEvent.getSource().getSelectedKey();
      this.oModel.setProperty("/newRule/RULID", oSectedKey.toString());
     },

     navBack : function() {
      var bReplace = jQuery.device.is.phone ? false : true;
      sap.ui.core.UIComponent.getRouterFor(this).navTo("rules", {}, bReplace);
     },

     _validateInputs : function() {
      var regxRequired = /([^\s])/;
      var oView = this.getView();
      var oDays = oView.byId("daysCombo");
      var oOestl = oView.byId("dtiOestl");
      var oOstsl = oView.byId("dtiOstsl");
      var oDetim = oView.byId("dtiDetim");
      var oDstim = oView.byId("dtiDstim");
      var oDescr = oView.byId("ipDescr");
      var invalidInputs = false;

      if (!regxRequired.test(this.oModel.getProperty("/newRule/DAYS")
        .toString())) {
       invalidInputs = true;
       oDays.setValueState(sap.ui.core.ValueState.Error);
      } else {
       oDays.setValueState(sap.ui.core.ValueState.None);
      }

      if (!regxRequired.test(this.oModel.getProperty("/newRule/OETSL")
        .toString())) {
       invalidInputs = true;
       oOestl.setValueState(sap.ui.core.ValueState.Error);
      } else {
       oOestl.setValueState(sap.ui.core.ValueState.None);
      }

      if (!regxRequired.test(this.oModel.getProperty("/newRule/OSTSL")
        .toString())) {
       invalidInputs = true;
       oOstsl.setValueState(sap.ui.core.ValueState.Error);
      } else {
       oOstsl.setValueState(sap.ui.core.ValueState.None);

      }
      if (!regxRequired.test(this.oModel.getProperty("/newRule/DETIM")
        .toString())) {
       invalidInputs = true;
       oDetim.setValueState(sap.ui.core.ValueState.Error);
      } else {
       oDetim.setValueState(sap.ui.core.ValueState.None);

      }

      if (!regxRequired.test(this.oModel.getProperty("/newRule/DSTIM")
        .toString())) {
       invalidInputs = true;
       oDstim.setValueState(sap.ui.core.ValueState.Error);
      } else {
       oDstim.setValueState(sap.ui.core.ValueState.None);
      }

      if (!regxRequired.test(this.oModel.getProperty("/newRule/DESCR")
        .toString())) {
       invalidInputs = true;
       oDescr.setValueState(sap.ui.core.ValueState.Error);

      } else {
       oDescr.setValueState(sap.ui.core.ValueState.None);
      }

      return !invalidInputs;
     }

    });