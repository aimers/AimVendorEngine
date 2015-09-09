jQuery.sap.declare("sap.ui.medApp.global.util");
jQuery.sap.require("sap.ui.medApp.service.vendorListServiceFacade");
sap.ui.medApp.global.util = { // Get Home Model
 // ******************************************
 getHomeModel : function(_oRouter) {
  if (!this._mainModel) {
   var _this = this;
   this._mainModel = new sap.ui.model.json.JSONModel();
   if (sessionStorage.medAppUID != undefined
     && sessionStorage.medAppPWD != undefined) {
    var param = [ {
     "key" : "details",
     "value" : {
      "USRID" : sessionStorage.medAppUID,
      "UERPW" : sessionStorage.medAppPWD
     }
    } ];
    var fnSuccess = function(oData) {
     _this._mainModel.setProperty("/LoggedUser", oData.results);
    }
    var oData = this.getLoginData(param, fnSuccess);
   }
  }
  return this._mainModel;
 },
 // Get Login Data
 // ******************************************
 getLoginData : function(param, fnSuccess) {
  var _this = this;
  var bool;
  this._vendorListServiceFacade = new sap.ui.medApp.service.vendorListServiceFacade(
    this._mainModel);
  this._vendorListServiceFacade.updateParameters(param, fnSuccess, null,
    "loginUser");
 },
 // Get Main Model
 // ******************************************
 getMainModel : function() {
  if (!this._mainModel) {
   this._mainModel = this.getHomeModel();
  }
  return this._mainModel;
 },
 // Get All Categories ( Entities )
 // ******************************************
 loadListCategory : function(facade) {
  this._vendorListServiceFacade = new sap.ui.medApp.service.vendorListServiceFacade(
    this._mainModel);
  param = [ {
   "key" : "INTENT",
   "value" : "1"
  }, {
   "key" : "UID",
   "value" : "1"
  } ]
  this._vendorListServiceFacade.getRecords(null, null, "/allCategory",
    "getVendorCategory", param);

 },
 // Get Vendor's Categories ( Entities )
 // ******************************************
 loadVendorCategory : function(param, fnSuccess) {
  this._vendorListServiceFacade = new sap.ui.medApp.service.vendorListServiceFacade(
    this._mainModel);
  this._vendorListServiceFacade.getRecords(fnSuccess, null, "/vendorsCategory",
    "getVendorCategory", param);
 },
 // Get Vendor Data
 // ******************************************
 getVendorFilterModel : function(paramValue) {
  if (!this._mainModel) {
   this._mainModel = this.getHomeModel();
  }
  var fnSuccess = function() {
   return this._mainModel;
  }
  this.loadVendorFILTERData(paramValue, fnSuccess);
 },
 // Load All Vendor Data
 // ******************************************
 loadVendorData : function(paramValue, fnSuccess) {
  this._vendorListServiceFacade = new sap.ui.medApp.service.vendorListServiceFacade(
    this._mainModel);
  var param = [ {
   "key" : "INTENT",
   "value" : "1"
  }, {
   "key" : "UID",
   "value" : paramValue.USRID
  }, {
   "key" : "ETCID",
   "value" : "1"
  }, {
   "key" : "ETYID",
   "value" : "1"
  }, {
   "key" : "ENTID",
   "value" : "1"
  } ]
  this._vendorListServiceFacade.getRecords(fnSuccess, null, "/vendorsList",
    "getVendorData", param);
 },
 // Load Vendor Data with ID
 // ******************************************
 loadVendorFILTERData : function(paramValue, fnSuccess) {
  this._vendorListServiceFacade = new sap.ui.medApp.service.vendorListServiceFacade(
    this._mainModel);
  var param = [ {
   "key" : "INTENT",
   "value" : "1"
  }, {
   "key" : "ETCID",
   "value" : "1"
  }, {
   "key" : "ETYID",
   "value" : "1"
  }, {
   "key" : "ENTID",
   "value" : "1"
  }, {
   "key" : "filters",
   "value" : '{"USRID" = ' + paramValue.USRID + '}'
  } ];
  this._vendorListServiceFacade.getRecords(fnSuccess, null, "/vendorsList",
    "getVendorData", param);
 },
 // Handle Booking
 // ******************************************
 handleBooking : function(oEvent, oRouter) {
  var sTime = oEvent.oSource.getText();
  var sContextPath = oEvent.oSource.oParent.getBindingContext().getPath();
  var vendorIndexPath;
  var modelData = this._mainModel.getProperty(sContextPath);
  if (sContextPath == "/vendorsAvailableTime/0") {
   vendorIndexPath = modelData.SPATH;
  } else {
   var modelData1 = this._mainModel.getProperty("/vendorsAvailableTime/0");
   vendorIndexPath = modelData1.SPATH;
  }
  var vendordata = this._mainModel.getProperty(vendorIndexPath);
  var sDate = modelData.Date;
  var BookingData = [ {
   bookTime : sTime,
   bookDate : sDate,
   IPATH : vendorIndexPath,
   DSPNM : vendordata.DSPNM
  } ];
  this._mainModel.setProperty("/bookingdata", BookingData);
  if (!sessionStorage.medAppUID) {
   oRouter.navTo("_loginPage", {
    "flagID" : 2
   });
  } else {
   oRouter.navTo("ConfirmBooking", {
    "UID" : sessionStorage.medAppUID
   });
  }
 },
 // Get Register Data
 // ******************************************
 getRegisterData : function(param, fnSuccess) {
  var _this = this;
  this._vendorListServiceFacade = new sap.ui.medApp.service.vendorListServiceFacade(
    this._mainModel);
  this._vendorListServiceFacade.updateParameters(param, fnSuccess, null,
    "registerUser");
 },
 // Load Vendor Booking History
 // ******************************************
 loadVendorBookingHistory : function(param, fnSuccess) {
  this._vendorListServiceFacade = new sap.ui.medApp.service.vendorListServiceFacade(
    this._mainModel);
  this._vendorListServiceFacade.getRecords(fnSuccess, null, "/bookingHistory",
    "getBookingHistory", param);
 },
 // Load Vendor Rules
 // ******************************************
 loadVendorRules : function(paramValue, fnSuccess) {
  this._vendorListServiceFacade = new sap.ui.medApp.service.vendorListServiceFacade(
    this._mainModel);
  var param = [ {
   "key" : "USRID",
   "value" : paramValue.USRID
  }, {
   "key" : "RULID",
   "value" : paramValue.RULID
  }, {
   "key" : "ETYID",
   "value" : paramValue.ETYID
  }, {
   "key" : "ETCID",
   "value" : paramValue.ETCID
  }, {
   "key" : "ENTID",
   "value" : paramValue.ENTID
  }, {
   "key" : "STDATE",
   "value" : paramValue.STDATE
  }, {
   "key" : "ENDATE",
   "value" : paramValue.ENDATE
  } ]
  this._vendorListServiceFacade.getRecords(fnSuccess, null, "/vendorRules",
    "getVendorRuleDetail", param);
 },
 // Load Vendor Rule Definition
 // ******************************************
 loadVendorRulesDef : function(param, fnSuccess) {
  this._vendorListServiceFacade = new sap.ui.medApp.service.vendorListServiceFacade(
    this._mainModel);
  this._vendorListServiceFacade.getRecords(fnSuccess, null, "/vendorRulesDefn",
    "getVendorRuleDef", param);
 },
 // Get User With ID
 // ******************************************
 getUsers : function(param, fnSuccess) {
  this._vendorListServiceFacade = new sap.ui.medApp.service.vendorListServiceFacade(
    this._mainModel);
  this._vendorListServiceFacade.getRecords(fnSuccess, null, "/searchUser",
    "getAllUsers", param);
 },
 // Get All Users
 // ******************************************
 getAllUsers : function(param, fnSuccess) {
  this._vendorListServiceFacade = new sap.ui.medApp.service.vendorListServiceFacade(
    this._mainModel);
  this._vendorListServiceFacade.getRecords(null, null, "/allUsers",
    "getAllUsers", param);
 },
 // Create Rule
 // ******************************************
 createRule : function(param, fnSuccess) {
  this._vendorListServiceFacade = new sap.ui.medApp.service.vendorListServiceFacade(
    this._mainModel);
  this._vendorListServiceFacade.updateParameters(param, fnSuccess, null,
    "createRule");
 },
 // Update Rule
 // ******************************************
 updateRule : function(param, fnSuccess, fnError) {
  this._vendorListServiceFacade = new sap.ui.medApp.service.vendorListServiceFacade(
    this._mainModel);
  this._vendorListServiceFacade.updateParameters(param, fnSuccess, fnError,
    "updateRule");
 },
 // Update Vendor Details
 // ******************************************
 updateUserDetails : function(fnSuccess) {
  this._mainModel.setProperty("/vendorsList/0/Entities", this._mainModel
    .getProperty("/vendorsCategory"))
  var userData = this._mainModel.getProperty("/vendorsList/0");
  param = [ {
   "key" : "details",
   "value" : userData
  } ];
  this._vendorListServiceFacade = new sap.ui.medApp.service.vendorListServiceFacade(
    this._mainModel);
  this._vendorListServiceFacade.updateParameters(param, fnSuccess, null,
    "updateVendor");
 },
 // Reject Appointment - Cancel Booking
 // ******************************************
 cancelBooking : function(bookingData, VERNM, fnSuccess, fnError) {
  var param = [ {
   "key" : "details",
   "value" : {
    "VTRMI" : bookingData.booking.VTRMI.toString(),
    "RULID" : bookingData.booking.RULID.toString(),
    "USRID" : bookingData.booking.USRID.toString(),
    "BDTIM" : bookingData.booking.BDTIM.toString(),
    "BTIMZ" : bookingData.booking.BTIMZ.toString(),
    "BOSTM" : bookingData.booking.BOSTM.toString(),
    "BOETM" : bookingData.booking.BOETM.toString(),
    "CUEML" : bookingData.patient[0].USRNM.toString(),
    "VSEML" : VERNM.toString()
   }
  } ];
  this._vendorListServiceFacade.updateParameters(param, fnSuccess, fnError,
    "cancelBooking");
 },
 // Accept Appointment - Approve Booking
 // ******************************************
 acceptBooking : function(bookingData, VERNM, fnSuccess, fnError) {
  var param = [ {
   "key" : "details",
   "value" : {
    "VTRMI" : bookingData.booking.VTRMI.toString(),
    "RULID" : bookingData.booking.RULID.toString(),
    "USRID" : bookingData.booking.USRID.toString(),
    "BDTIM" : bookingData.booking.BDTIM.toString(),
    "BTIMZ" : bookingData.booking.BTIMZ.toString(),
    "BOSTM" : bookingData.booking.BOSTM.toString(),
    "BOETM" : bookingData.booking.BOETM.toString(),
    "CUEML" : bookingData.patient[0].USRNM.toString(),
    "VSEML" : VERNM.toString()
   }
  } ];
  this._vendorListServiceFacade.updateParameters(param, fnSuccess, fnError,
    "acceptBooking");
 },
 // Get All Characteristics
 // ******************************************
 getCharecteristics : function(fnSuccess) {
  var param = [ {} ];
  this._vendorListServiceFacade = new sap.ui.medApp.service.vendorListServiceFacade(
    this._mainModel);
  this._vendorListServiceFacade.getRecords(fnSuccess, null, "/Char",
    "getCharList", param);
 },
 // Get All Cities
 // ******************************************
 getAllCities : function(fnSuccess) {
  var param = [ {} ];
  this._vendorListServiceFacade = new sap.ui.medApp.service.vendorListServiceFacade(
    this._mainModel);
  this._vendorListServiceFacade.getRecords(fnSuccess, null, "/City",
    "getAllCities", param);
 },
 // Image Upload
 // ******************************************
 uploadFile : function(user, form, fnSuccess, fnError) {
  $.ajax({
   url : 'FileUploadServlet?USRID=' + user,
   data : form,
   type : "POST",
   contentType : false,
   processData : false,
   success : fnSuccess,
   enctype : 'multipart/form-data',
   error : fnError
  })
 },
 // Delete Image
 // ******************************************
 deleteFile : function(user, filename, fnSuccess, fnError) {
  $.ajax({
   url : 'FileUploadServlet?USRID=' + user + "&DelfileName=" + filename,
   type : "POST",
   contentType : false,
   processData : false,
   success : fnSuccess,
   enctype : 'multipart/form-data',
   error : fnError
  })
 }
}
