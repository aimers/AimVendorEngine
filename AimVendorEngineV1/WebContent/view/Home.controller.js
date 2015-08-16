sap.ui.core.mvc.Controller.extend("sap.ui.medApp.view.Home", {

  onInit: function() {

    sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(
        this.onRouteMatched, this);
  },
  // Handler for routing event
  onRouteMatched: function(oEvent) {
	  this.getView().byId("menu").clearSelection();
  },

  handleSelectionChange: function(oControlEvent) {
	  
    var oItem = oControlEvent.oSource;
    var oSelectedKey = oItem.getSelectedItem().getKey();
    if(oSelectedKey === "booking"){
    	this._showCalendar();	
    } else if(oSelectedKey === "entity"){
    	sap.ui.core.UIComponent.getRouterFor(this).navTo("bookinghome");
    }
    
    
  },

  _showCalendar: function(oCalendar) {
      sap.ui.core.UIComponent.getRouterFor(this).navTo("bookinghome");
  }
});