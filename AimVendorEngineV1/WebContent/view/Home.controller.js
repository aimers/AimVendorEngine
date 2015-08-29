sap.ui.core.mvc.Controller.extend("sap.ui.medApp.view.Home",
  {

   onInit : function() {
    this.oModel = sap.ui.medApp.global.util.getHomeModel();
    sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(
      this.onRouteMatched, this);

    if (!this.oModel.getProperty("/vendorList")) {
     param = {
      "USRID" : this.oModel.getProperty("/LoggedUser/USRID")
     };
     sap.ui.medApp.global.util.loadVendorFILTERData(param);
    }

   },
   // Handler for routing event
   onRouteMatched : function(oEvent) {
    this.getView().byId("menu").clearSelection();
    if (oEvent.getParameter("name") === "home") {

     if (!sessionStorage.medAppUID) {
      this._naveToLogin();
      return false;
     }
     if (!sap.ui.Device.system.phone) {
      this._showDetailsHome();
     }

    }

   },

   _naveToLogin : function() {
    sap.ui.core.UIComponent.getRouterFor(this).navTo("login", {}, true);
   },

   _showDetailsHome : function() {
    var bReplace = jQuery.device.is.phone ? false : true;
    sap.ui.core.UIComponent.getRouterFor(this).navTo("detailshome");
   },

   handleSelectionChange : function(oControlEvent) {

    var oItem = oControlEvent.oSource;
    var oSelectedKey = oItem.getSelectedItem().getKey();
    if (oSelectedKey === "booking") {
     this._showCalendar();
    } else if (oSelectedKey === "rules") {
     this._showRule();
    }
   },

   _showCalendar : function(oCalendar) {
    var bReplace = jQuery.device.is.phone ? false : true;
    sap.ui.core.UIComponent.getRouterFor(this).navTo("bookinghome", {},
      bReplace);
   },
   _showRule : function(oCalendar) {
    var bReplace = jQuery.device.is.phone ? false : true;
    sap.ui.core.UIComponent.getRouterFor(this).navTo("rules", {}, bReplace);
   }
  });