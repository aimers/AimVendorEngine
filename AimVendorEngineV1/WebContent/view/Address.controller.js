sap.ui.core.mvc.Controller.extend("sap.ui.medApp.view.Address", {
  // onInit
  // ******************************************
  onInit : function() {
    sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(
        this.onRouteMatched, this);
  },
  // onRouteMatched
  // ******************************************
  onRouteMatched : function(oEvent) {
    this.oModel = sap.ui.medApp.global.util.getMainModel();
    this.getView().setModel(this.oModel);
    var _this = this;
    if (!_this.oModel.getProperty("/City")) {
      var fnSuccess = function() {
        _this.getView().setModel(_this.oModel);
      };
      sap.ui.medApp.global.util.getAllCities(fnSuccess);
    }
    _this.oLoginDetails = _this.oModel.getProperty("/LoggedUser");
    this.getView().bindElement("/vendorsList/0/Address/0/");
  },
  // handleSave
  // ******************************************
  handleSave : function() {
    var _this = this;
    var sPath = this.getView().getBindingContext().getPath();
    sap.ui.medApp.global.busyDialog.open();
    var fnSuccess = function(oData) {
      if (oData.results) {
        sap.ui.medApp.global.busyDialog.close();
        sap.m.MessageToast.show("User information saved");
      } else {
        sap.ui.medApp.global.busyDialog.close();
        sap.m.MessageToast.show("An error occured while updating user information");
      }
    };
    var fnSuccessGeo = function(res) {
      if (res.results.length) {
        var location = res.results[0].geometry.location;
        _this.oModel.setProperty(sPath + "/LATIT", location.lat.toString());
        _this.oModel.setProperty(sPath + "/LONGT", location.lng.toString());
      } else {
        _this.oModel.setProperty(sPath + "/LATIT", "0");
        _this.oModel.setProperty(sPath + "/LONGT", "0");
      }
      sap.ui.medApp.global.util.updateUserDetails(fnSuccess);
    };
    var fnErroGeo = function() {
      _this.oModel.setProperty(sPath + "/LATIT", "0");
      _this.oModel.setProperty(sPath + "/LONGT", "0");
      sap.ui.medApp.global.util.updateUserDetails(fnSuccess);
    };

    var address = _this.oModel.getProperty(sPath + "/STREET")
        + ","
        + _this.oModel.getProperty(sPath + "/LOCLT")
        + ","
        + _this.oModel.getProperty(sPath + "/LNDMK")
        + ","
        + _this.getView().byId("selCity").getSelectedItem().getText()
            .toString();
    sap.ui.medApp.global.util.getCordinates(address, fnSuccessGeo, fnErroGeo);
  },
  // navBack
  // ******************************************
  navBack : function() {
    var bReplace = jQuery.device.is.phone ? false : true;
    sap.ui.core.UIComponent.getRouterFor(this).navTo("profile", {}, bReplace);
  }
});