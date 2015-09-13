sap.ui.core.mvc.Controller.extend("sap.ui.medApp.view.Home",
  {
   // onInit
   // ******************************************
   onInit : function() {

    sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(
      this.onRouteMatched, this);

   },
   // onRouteMatched
   // ******************************************
   onRouteMatched : function(oEvent) {
    // if (!sessionStorage.medAppUID || !this.oModel.getProperty("/LoggedUser"))
    // {
    // this._naveToLogin();
    // return false;
    // }
    this.getView().byId("menu").clearSelection();
    if (oEvent.getParameter("name") === "home") {
     var _this = this;
     this.oModel = sap.ui.medApp.global.util.getHomeModel();

     if (!this.oModel.getProperty("/vendorsList")) {
      var fnSuccess = function() {
       sap.ui.medApp.global.busyDialog.close();
      };
      param = {
       "USRID" : this.oModel.getProperty("/LoggedUser/USRID")
      };
      sap.ui.medApp.global.busyDialog.open();
      sap.ui.medApp.global.util.loadVendorFILTERData(param, fnSuccess);
     }
     if (!sap.ui.Device.system.phone) {
      this._showDetailsHome();
     }
    }
   },
   // _naveToLogin
   // ******************************************
   _naveToLogin : function() {
    sap.ui.core.UIComponent.getRouterFor(this).navTo("login", {}, true);
   },
   // _showDetailsHome
   // ******************************************
   _showDetailsHome : function() {
    var bReplace = jQuery.device.is.phone ? false : true;
    sap.ui.core.UIComponent.getRouterFor(this).navTo("detailshome");
   },
   // handleSelectionChange
   // ******************************************
   handleSelectionChange : function(oControlEvent) {
    var oItem = oControlEvent.oSource;
    var oSelectedKey = oItem.getSelectedItem().getKey();
    if (oSelectedKey === "booking") {
     this._showCalendar();
    } else if (oSelectedKey === "rules") {
     this._showRule();
    }
   },
   // _showCalendar
   // ******************************************
   _showCalendar : function(oCalendar) {
    var bReplace = jQuery.device.is.phone ? false : true;
    sap.ui.core.UIComponent.getRouterFor(this).navTo("bookinghome", {},
      bReplace);
   },
   // _showRule
   // ******************************************
   _showRule : function(oCalendar) {
    var bReplace = jQuery.device.is.phone ? false : true;
    sap.ui.core.UIComponent.getRouterFor(this).navTo("rules", {}, bReplace);
   }
  });