sap.ui.core.mvc.Controller.extend("sap.ui.medApp.view.Entity", {

	onInit : function() {

		// set a handler to handle the routing event
		sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(
				this.onRouteMatched, this);
	},
	onRouteMatched : function(oEvent) {

	}

});