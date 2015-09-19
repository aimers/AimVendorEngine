sap.ui.core.mvc.Controller.extend("sap.ui.medApp.view.Calendar", {
 // onInit
 // ******************************************
 onInit : function() {
  sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(
    this.onRouteMatched, this);
  this.DateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
   pattern : "dd-MM-yyyy"
  });
 },
 // onRouteMatched
 // ******************************************
 onRouteMatched : function(oEvent) {
  var oView = this.getView();
  if (oEvent.getParameter("name") === "bookinghome") {
   var oCalendar = oView.byId("calendar1");
   if (!sap.ui.Device.system.phone) {
    var oDate = this._getSelectedDate(oCalendar);
    this._showBookings(oDate);
   }
  }
 },

 // _getVendorRules
 // ******************************************
 _getVendorRules : function(sPath) {
  var _this = this;
  var oView = _this.getView();
  var param = {
   "USRID" : _this.oLoginDetails.USRID,
   "RULID" : '"1","2"',// Now hard coded in query as RULID in (1,2,3)
   "ETYID" : _this.oModel.getProperty(sPath + "/ETYID"),
   "ETCID" : _this.oModel.getProperty(sPath + "/ETCID"),
   "ENTID" : oView.byId("entitySelect").getSelectedKey(),
   "STDATE" : _this.oDate,
   "ENDATE" : _this.oDate
  };
  var fnSuccess = function() {
   _this._bindBookings(_this);
  }

  sap.ui.medApp.global.util.loadVendorRules(param, fnSuccess);
 },

 // _getSelectedDate
 // ******************************************
 _getSelectedDate : function(oCalendar) {
  var aSelectedDates = oCalendar.getSelectedDates();
  var oDate;
  if (aSelectedDates.length > 0) {
   oDate = aSelectedDates[0].getStartDate();
  } else {
   oDate = new Date();
  }
  return this.DateFormat.format(oDate);
 },
 // onDateSelectionChanged
 // ******************************************
 onDateSelectionChanged : function(oControlEvent) {
  var oCalendar = oControlEvent.oSource;
  var oDate = this._getSelectedDate(oCalendar);
  this._showBookings(oDate);
 },
 // _showBookings
 // ******************************************
 _showBookings : function(oDate) {
  var bReplace = jQuery.device.is.phone ? false : true;
  sap.ui.core.UIComponent.getRouterFor(this).navTo("bookings", {
   date : oDate
  }, bReplace);
 },
 // navBack
 // ******************************************
 navBack : function() {
  var bReplace = jQuery.device.is.phone ? false : true;
  sap.ui.core.UIComponent.getRouterFor(this).navTo("home", {}, bReplace);
 }

});