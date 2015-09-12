jQuery.sap.require("sap.ui.medApp.formatter.formatHelper");
sap.ui.core.mvc.Controller
  .extend(
    "sap.ui.medApp.view.AddRule",
    {
     // onInit
     // ******************************************
     onInit : function() {
      this.oModel = sap.ui.medApp.global.util.getHomeModel();
      sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(
        this.onRouteMatched, this);
      this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
     },
     // onRouteMatched
     // ******************************************
     onRouteMatched : function(oEvent) {
      var _this = this;
      _this.oLoginDetails = _this.oModel.getProperty("/LoggedUser");
      if (oEvent.getParameter("name") === "addrule") {
       var oData = {
        "DAYS" : "",
        "ETYID" : "",
        "OETSL" : "",
        "TIMZN" : "IST",
        "OSTSL" : "",
        "DETIM" : "",
        "RULID" : "",
        "USRID" : _this.oLoginDetails.USRID.toString(),
        "ENTID" : "",
        "RECUR" : "1",
        "DSTIM" : "",
        "ETCID" : "",
        "UTYID" : _this.oLoginDetails.UTYID.toString(),
        "DESCR" : ""
       };
       _this.oModel.setProperty("/newRule", oData);
       _this.oModel.setProperty("/newRule/RULID", _this.getView().byId(
         "ruleType").getSelectedKey());
       _this.oModel.setProperty("/valueState", "None");
       var fnSuccess = function() {
        _this.getView().setModel(_this.oModel);
        _this._onEntitySelection(_this.getView().byId("entitySelect")
          .getSelectedItem());
       };
       if (!_this.oModel.getProperty("/vendorsCategory")) {
        var param = [ {
         "key" : "INTENT",
         "value" : "1"
        }, {
         "key" : "UID",
         "value" : _this.oLoginDetails.USRID.toString()
        } ];
        sap.ui.medApp.global.util.loadVendorCategory(param, fnSuccess);
       } else {
        _this._onEntitySelection(_this.getView().byId("entitySelect")
          .getSelectedItem());
       }
      }
     },
     // handleRuleSave
     // ******************************************
     handleRuleSave : function(oEvent) {
      sap.ui.medApp.global.busyDialog.open();
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
        sap.ui.medApp.global.busyDialog.close();
        var bReplace = jQuery.device.is.phone ? false : true;
        sap.ui.core.UIComponent.getRouterFor(this).navTo("rules", {}, bReplace);
       };
       this._vendorListServiceFacade = new sap.ui.medApp.service.vendorListServiceFacade(
         this.oModel);
       this._vendorListServiceFacade.updateParameters(param, fnSuccess, null,
         "createRule");
      }
     },
     // handleRuleCancel
     // ******************************************
     handleRuleCancel : function() {
      var bReplace = jQuery.device.is.phone ? false : true;
      sap.ui.core.UIComponent.getRouterFor(this).navTo("rules", {}, bReplace);
     },
     // onChangeOETSLTime
     // ******************************************
     onChangeOETSLTime : function(oEvent) {
      var oSource = oEvent.getSource();
      var time = oSource.getDateValue();
      this.oModel.setProperty("/newRule/OETSL", time.toString().substring(24,
        16));
     },
     // onChangeOSTSLTime
     // ******************************************
     onChangeOSTSLTime : function(oEvent) {
      var oSource = oEvent.getSource();
      var time = oSource.getDateValue();
      this.oModel.setProperty("/newRule/OSTSL", time.toString().substring(24,
        16));
     },
     // onChangeDETIMTime
     // ******************************************
     onChangeDETIMTime : function(oEvent) {
      var oSource = oEvent.getSource();
      var time = oSource.getDateValue();
      this.oModel.setProperty("/newRule/DETIM", time.toString().substring(24,
        16));
     },
     // onChangeDSTIMTime
     // ******************************************
     onChangeDSTIMTime : function(oEvent) {
      var oSource = oEvent.getSource();
      var time = oSource.getDateValue();
      this.oModel.setProperty("/newRule/DSTIM", time.toString().substring(24,
        16));
     },
     // onEntitySelect
     // ******************************************
     onEntitySelect : function(oEvent) {
      var oSource = oEvent.getSource();
      this._onEntitySelection(oSource.getSelectedItem());
     },
     // _onEntitySelection
     // ******************************************
     _onEntitySelection : function(SelectedItem) {
      if (SelectedItem) {
       var sPath = SelectedItem.getBindingContext().getPath();
       this.oModel.setProperty("/newRule/ENTID", SelectedItem.getKey());
       this.oModel.setProperty("/newRule/ETYID", this.oModel.getProperty(sPath
         + "/ETYID"));
       this.oModel.setProperty("/newRule/ETCID", this.oModel.getProperty(sPath
         + "/ETCID"));
      }
     },
     // handleDaysSelectionFinish
     // ******************************************
     handleDaysSelectionFinish : function(oEvent) {
      var oSource = oEvent.getSource();
      this.oModel.setProperty("/newRule/DAYS", oSource.getSelectedKeys()
        .toString());
     },
     // handleRuleTypeSelection
     // ******************************************
     handleRuleTypeSelection : function(oEvent) {
      var oSectedKey = oEvent.getSource().getSelectedKey();
      this.oModel.setProperty("/newRule/RULID", oSectedKey.toString());
     },
     // navBack
     // ******************************************
     navBack : function() {
      var bReplace = jQuery.device.is.phone ? false : true;
      sap.ui.core.UIComponent.getRouterFor(this).navTo("rules", {}, bReplace);
     },
     // _validateInputs
     // ******************************************
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
      // Days
      if (!regxRequired.test(this.oModel.getProperty("/newRule/DAYS")
        .toString())) {
       invalidInputs = true;
       oDays.setValueState(sap.ui.core.ValueState.Error);
      } else {
       oDays.setValueState(sap.ui.core.ValueState.None);
      }
      // OETLS
      if (!regxRequired.test(this.oModel.getProperty("/newRule/OETSL")
        .toString())) {
       invalidInputs = true;
       oOestl.setValueState(sap.ui.core.ValueState.Error);
      } else {
       oOestl.setValueState(sap.ui.core.ValueState.None);
      }
      // OSTSL
      if (!regxRequired.test(this.oModel.getProperty("/newRule/OSTSL")
        .toString())) {
       invalidInputs = true;
       oOstsl.setValueState(sap.ui.core.ValueState.Error);
      } else {
       oOstsl.setValueState(sap.ui.core.ValueState.None);
      }
      // DETIM
      if (!regxRequired.test(this.oModel.getProperty("/newRule/DETIM")
        .toString())) {
       invalidInputs = true;
       oDetim.setValueState(sap.ui.core.ValueState.Error);
      } else {
       oDetim.setValueState(sap.ui.core.ValueState.None);
      }
      // DSTIM
      if (!regxRequired.test(this.oModel.getProperty("/newRule/DSTIM")
        .toString())) {
       invalidInputs = true;
       oDstim.setValueState(sap.ui.core.ValueState.Error);
      } else {
       oDstim.setValueState(sap.ui.core.ValueState.None);
      }
      // DESCR
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