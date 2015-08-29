jQuery.sap.declare("sap.ui.medApp.formatter.formatHelper");
sap.ui.medApp.formatter.formatHelper = {
 getImageUrl : function(oValue) {
  if (oValue != null && oValue != undefined) {

   return "assets/img/" + oValue;
  }
 },

 isBooked : function(bookings) {
  var visible = true;
  if (bookings)
   if (bookings.length > 0) {
    visible = false;
   }
  return visible;
 },

 getButtonType : function(status) {
  var type = "Emphasized";
  if (status == "1") {
   type = "Accept";
  } else if (status == "2") {
   type = "Default";
  }

  return type;
 },

 getRuleTime : function(time) {
  if (time)
   return new Date("October 13, 2014 " + time.toString());
  else
   return time;
 },
 getSelectedDays : function(days) {
  if (days)
   return days.toString().split(",");
  else
   return days;
 }
};