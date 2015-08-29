sap.ui.core.mvc.Controller
  .extend(
    "sap.ui.medApp.view.Characteristics",
    {

     onInit : function() {
      this.oModel = sap.ui.medApp.global.util.getHomeModel();
      sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(
        this.onRouteMatched, this);
     },
     // Handler for routing event
     onRouteMatched : function(oEvent) {

     },
     handleDelete : function(oEvent) {
      var oList = oEvent.getSource(), oItem = oEvent.getParameter("listItem"), sPath = oItem
        .getBindingContext().getPath();

      // after deletion put the focus back to the list
      oList.attachEventOnce("updateFinished", oList.focus, oList);

      // send a delete request to the odata service
      this.oModel.remove(sPath);
     },
     handleSave : function() {
      var fnSuccess = function(oData) {
       sap.m.MessageToast.show("Characteristics saved");

      };
      this._vendorListServiceFacade = new sap.ui.medApp.service.vendorListServiceFacade(
        this.oModel);
      this._vendorListServiceFacade.updateParameters(null, fnSuccess, null,
        "updateUserDetails");
     },
     navBack : function() {
      var bReplace = jQuery.device.is.phone ? false : true;
      sap.ui.core.UIComponent.getRouterFor(this).navTo("profile", {}, bReplace);
     }
    });