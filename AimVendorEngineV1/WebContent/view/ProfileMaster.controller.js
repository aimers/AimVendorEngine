sap.ui.core.mvc.Controller.extend("sap.ui.medApp.view.ProfileMaster", {
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
  var _this = this;
  _this.oLoginDetails = _this.oModel.getProperty("/LoggedUser");
  if (oEvent.getParameter("name") === "profile") {
   var fnSuccess = function() {
    if(!_this.oModel.getProperty("/vendorsList").length){
     _this.oModel.setProperty("/vendorsList/0",_this.oModel.getProperty("/LoggedUser"));
    }
    sap.ui.medApp.global.busyDialog.close();
    _this._selectItem();
   };
   sap.ui.medApp.global.busyDialog.open();
   if (!_this.oModel.getProperty("/vendorsList")) {
    param = {
     "USRID" : _this.oLoginDetails.USRID
    };
    sap.ui.medApp.global.util.loadVendorFILTERData(param, fnSuccess);
   } else {
    sap.ui.medApp.global.busyDialog.close();
    _this._selectItem();
   }
  }
 },
 // _selectItem
 // ******************************************
 _selectItem : function() {
  if (!sap.ui.Device.system.phone) {
   var menuList = this.getView().byId("menu");
   var oSelectedKey = menuList.getSelectedKey();
   if (!oSelectedKey) {
    menuList.setSelectedKey("personal");
    this._showPersonalInfo();
   } else {
    if (oSelectedKey === "personal") {
     this._showPersonalInfo();
    } else if (oSelectedKey === "char") {
     this._showCharacteristics();
    } else if (oSelectedKey === "address") {
     this._showAddress();
    } else if (oSelectedKey === "speciality") {
     this._showSpeciality();
    } else if (oSelectedKey === "images") {
     this._showImages();
    }else if (oSelectedKey === "changepwd") {
     this._showChangePassword();
    }
   }

  }
 },
 // handleSelectionChange
 // ******************************************
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
  } else if (oSelectedKey === "images") {
   this._showImages();
  }else if (oSelectedKey === "changepwd") {
   this._showChangePassword();
  }
 },
 // _showPersonalInfo
 // ******************************************
 _showPersonalInfo : function() {
  var bReplace = jQuery.device.is.phone ? false : true;
  sap.ui.core.UIComponent.getRouterFor(this)
    .navTo("personalinfo", {}, bReplace);
 },
 // _showCharacteristics
 // ******************************************
 _showCharacteristics : function() {
  var bReplace = jQuery.device.is.phone ? false : true;
  sap.ui.core.UIComponent.getRouterFor(this).navTo("characteristics", {},
    bReplace);
 },
 // _showAddress
 // ******************************************
 _showAddress : function() {
  var bReplace = jQuery.device.is.phone ? false : true;
  sap.ui.core.UIComponent.getRouterFor(this).navTo("address", {}, bReplace);
 },
 // _showSpeciality
 // ******************************************
 _showSpeciality : function() {
  var bReplace = jQuery.device.is.phone ? false : true;
  sap.ui.core.UIComponent.getRouterFor(this).navTo("speciality", {}, bReplace);
 },
 // _showImages
 // ******************************************
 _showImages : function() {
  var bReplace = jQuery.device.is.phone ? false : true;
  sap.ui.core.UIComponent.getRouterFor(this).navTo("images", {}, bReplace);
 }, 
 // _showChangePassword
 // ******************************************
 _showChangePassword : function() {
  var bReplace = jQuery.device.is.phone ? false : true;
  sap.ui.core.UIComponent.getRouterFor(this).navTo("changepwd", {}, bReplace);
 },
 // navBack
 // ******************************************
 navBack : function() {
  var bReplace = jQuery.device.is.phone ? false : true;
  sap.ui.core.UIComponent.getRouterFor(this).navTo("home", {}, bReplace);
 }
});