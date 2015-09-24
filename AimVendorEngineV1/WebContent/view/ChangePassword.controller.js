sap.ui.core.mvc.Controller.extend("sap.ui.medApp.view.ChangePassword", {
  // onInit
  // ******************************************
  onInit : function() {
    this.oModel = sap.ui.medApp.global.util.getHomeModel();
    sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(
        this.onRouteMatched, this);
  },
  // onRouteMatched
  // ******************************************
  onRouteMatched : function(oEvent) {
    this.getView().setModel(this.oModel);
    var oPswd = this.oView.byId("pswd");
    var oCpwd = this.oView.byId("cpswd");
    oPswd.setValueState(sap.ui.core.ValueState.None);
    oCpwd.setValueState(sap.ui.core.ValueState.None);
    oCpwd.setValue("");
    oPswd.setValue("");
  },
  navBack : function() {
    var bReplace = jQuery.device.is.phone ? false : true;
    sap.ui.core.UIComponent.getRouterFor(this).navTo("profile", {}, bReplace);
  },
  // handleSave
  // ******************************************
  handleSave : function(oEvent) {
    if (this._validateInputs()) {
      var oPswd = this.oView.byId("pswd");
      this.oModel.setProperty("/vendorsList/0/UERPW", oPswd.getValue()
          .toString());
      var fnSuccess = function(oData) {
        if (oData.results) {
          sap.ui.medApp.global.busyDialog.close();
          sap.m.MessageToast.show("User information saved");
        } else {
          sap.ui.medApp.global.busyDialog.close();
          sap.m.MessageToast
              .show("An error occured while updating user information");
        }
      };
      sap.ui.medApp.global.busyDialog.open();
      sap.ui.medApp.global.util.updateUserDetails(fnSuccess);
    }
  },
  // _validateInputs
  // ******************************************
  _validateInputs : function() {
    var regxRequired = /([^\s])/;

    var oPswd = this.getView().byId("pswd");
    var oCpwd = this.getView().byId("cpswd");
    var invalidInputs = false;

    // Password
    if (!regxRequired.test(oPswd.getValue().toString())) {
      invalidInputs = true;
      oPswd.setValueState(sap.ui.core.ValueState.Error);
    } else {
      oPswd.setValueState(sap.ui.core.ValueState.None);
    }
    // Confirm password
    if (!regxRequired.test(oCpwd.getValue().toString())) {
      invalidInputs = true;
      oCpwd.setValueState(sap.ui.core.ValueState.Error);
    } else {
      oCpwd.setValueState(sap.ui.core.ValueState.None);
    }
    if (oPswd.getValue() && oCpwd.getValue()) {
      // Password Match
      if (oPswd.getValue().toString() != oCpwd.getValue().toString()) {
        invalidInputs = true;
        oPswd.setValueState(sap.ui.core.ValueState.Error);
        oCpwd.setValueState(sap.ui.core.ValueState.Error);
      } else {
        oPswd.setValueState(sap.ui.core.ValueState.None);
        oCpwd.setValueState(sap.ui.core.ValueState.None);
      }
    }
    return !invalidInputs;
  }
});