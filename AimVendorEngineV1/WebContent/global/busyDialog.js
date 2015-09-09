jQuery.sap.declare("sap.ui.medApp.global.busyDialog");

var BusyDialog = new sap.m.BusyDialog({
 id : "BusyDialog"
});
sap.ui.medApp.global.busyDialog = {

 open : function() {
  BusyDialog.open();
 },
 close : function() {
  BusyDialog.close();
 }
}
