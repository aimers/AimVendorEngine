sap.ui.core.mvc.Controller.extend("sap.ui.medApp.view.ProfileMaster", {

 onInit : function() {
  this.oModel = sap.ui.medApp.global.util.getHomeModel();
  sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(
    this.onRouteMatched, this);
 },
 // Handler for routing event
 onRouteMatched : function(oEvent) {
  if (oEvent.getParameter("name") === "profile") {

   if (!this.oModel.getProperty("/vendorsList")) {
    param = {
     "USRID" : this.oModel.getProperty("/LoggedUser/USRID")
    };
    sap.ui.medApp.global.util.loadVendorFILTERData(param);
   }
   if (!sap.ui.Device.system.phone) {
    var menuList = this.getView().byId("menu");
    if (!menuList.getSelectedKey()) {
     menuList.setSelectedKey("personal");
     this._showPersonalInfo();
    }
   }

  }
 },
 handleSelectionChange : function(oControlEvent) {
  var oItem = oControlEvent.oSource;
  var oSelectedKey = oItem.getSelectedItem().getKey();
  if (oSelectedKey === "personal") {
   this._showPersonalInfo();
  } else if (oSelectedKey === "char") {
   this._showCharacteristics();
  } else if (oSelectedKey === "address") {
   this._showAddress();
  } else if (oSelectedKey === "speciality") {
   this._showSpeciality();
  }
 },
 _showPersonalInfo : function() {
  var bReplace = jQuery.device.is.phone ? false : true;
  sap.ui.core.UIComponent.getRouterFor(this)
    .navTo("personalinfo", {}, bReplace);
 },
 _showCharacteristics : function() {
  var bReplace = jQuery.device.is.phone ? false : true;
  sap.ui.core.UIComponent.getRouterFor(this).navTo("characteristics", {},
    bReplace);
 },
 _showAddress : function() {
  var bReplace = jQuery.device.is.phone ? false : true;
  sap.ui.core.UIComponent.getRouterFor(this).navTo("address", {}, bReplace);
 },
 _showSpeciality : function() {
  var bReplace = jQuery.device.is.phone ? false : true;
  sap.ui.core.UIComponent.getRouterFor(this).navTo("speciality", {}, bReplace);
 },
 navBack : function() {
  var bReplace = jQuery.device.is.phone ? false : true;
  sap.ui.core.UIComponent.getRouterFor(this).navTo("home", {}, bReplace);
 }
});