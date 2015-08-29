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
     handleDelete : function() {
      var oList = oEvent.getSource(), 
      oItem = oEvent.getParameter("listItem"), 
      sPath = oItem.getBindingContext().getPath();

      // after deletion put the focus back to the list
      oList.attachEventOnce("updateFinished", oList.focus, oList);

      // send a delete request to the odata service
      this.oModel.remove(sPath);
     }
    });