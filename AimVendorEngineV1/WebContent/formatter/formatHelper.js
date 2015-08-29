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
 },
 am_pm_to_hours : function(time) {
  if (time) {
   var hours = Number(time.match(/^(\d+)/)[1]);
   var minutes = Number(time.match(/:(\d+)/)[1]);
   var AMPM = time.match(/\s(.*)$/)[1];
   if (AMPM == "pm" && hours < 12)
    hours = hours + 12;
   if (AMPM == "am" && hours == 12)
    hours = hours - 12;
   var sHours = hours.toString();
   var sMinutes = minutes.toString();
   if (hours < 10)
    sHours = "0" + sHours;
   if (minutes < 10)
    sMinutes = "0" + sMinutes;
   return new Date("October 13, 2014 " + sHours + ':00:00');

  } else {
   return new Date();
  }
 }
};