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
  var type = "Default";
  if (status == "1") {
   type = "Accept";
  } else if (status == "2") {
   type = "Emphasized";
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
  var a = [];
  if (days) {
   for (d in days) {
    a.push(days[d]);
   }
  }

  return a;
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
 },
 getTitle : function(title) {
  var key = "1";
  if (title == "Mr.") {
   key = "1";
  } else {
   key = "2";
  }

  return key;

 },
 getApproveButtonVisibility : function(status) {
  var vsbl = true;
  if (status == "1")
   vsbl = false;
  else
   vsbl = true;

  return vsbl;
 },
 getMobile : function(char) {
  var mobile;
  for (c in char) {
   if (char[c].DESCR === "Mobile") {
    mobile = char[c].VALUE;
    break;
   }
   return mobile;
  }

 },
 getEmail : function(char) {
  var email;
  for (c in char) {
   if (char[c].DESCR === "Email") {
    email = char[c].VALUE;
    break;
   }
  }
  return email;
 },
 getPhone : function(char) {
  var phone;
  for (c in char) {
   if (char[c].DESCR === "Landline") {
    phone = char[c].VALUE;
    break;
   }
  }
  return phone;
 },

 getImagesOnly : function(char) {
  var imgs = [];
  for (c in char) {
   if (char[c].DESCR === "Image") {
    imgs.push({
     "VALUE" : char[c].VALUE,
     "DESCR" : char[c].DESCR,
     "CHRID" : char[c].CHRID
    });
    break;
   }
  }
  return imgs;
 },

 getUser : function(uid) {
  var name;
  var param = [ {
   "key" : "details",
   "value" : {
    "USRID" : uid
   }
  } ];

  var fnSuccess = function() {
   var oModel = sap.ui.medApp.global.util.getMainModel();

   name = oModel.getProperty("/searchUser/0/TITLE") + " "
     + oModel.getProperty("/searchUser/0/FRNAM") + " "
     + oModel.getProperty("/searchUser/0/LTNAM");

   if (!name.toString().trim()) {
    name = oModel.getProperty("/searchUser/0/USRNM");
   }
   return name;
  }

  sap.ui.medApp.global.util.getUsers(param, fnSuccess);

 },
 getAddButtonVisible : function(status) {

  var vsbl = true;
  if (status == "3")
   vsbl = false;
  else
   vsbl = true;

  return vsbl;
 },

 getCityName : function(cityid) {
  var CityName;
  var oModel = sap.ui.medApp.global.util.getMainModel();
  var oCity = oModel.getProperty("/City");
  if (oCity) {
   for (c in oCity) {
    if (oCity[c].CTYID == cityid) {
     CityName = oCity[c].CTYNM;
     break;
    }
   }
   return CityName;
  }
 }
};