jQuery.sap.require("sap.ui.medApp.formatter.formatHelper");
sap.ui.core.mvc.Controller
  .extend(
    "sap.ui.medApp.view.PersonalInfo",
    {

     onInit : function() {
      this.oModel = sap.ui.medApp.global.util.getHomeModel();
      sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(
        this.onRouteMatched, this);
     },
     // Handler for routing event
     onRouteMatched : function(oEvent) {

     },
     handleSave : function() {
      var fnSuccess = function(oData) {
       sap.m.MessageToast.show("Personal details saved");

      };
      sap.ui.medApp.global.util.updateUserDetails(fnSuccess);
     },

     navBack : function() {
      var bReplace = jQuery.device.is.phone ? false : true;
      sap.ui.core.UIComponent.getRouterFor(this).navTo("profile", {}, bReplace);
     }
    });