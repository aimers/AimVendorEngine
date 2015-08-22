sap.ui.core.mvc.Controller.extend("sap.ui.medApp.view.PersonalInfosap.ui.medApp.view.PersonalInfo", {

	onInit : function() {
		this.oModel = sap.ui.medApp.global.util.getHomeModel();
		sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(
				this.onRouteMatched, this);
	},
	// Handler for routing event
	onRouteMatched : function(oEvent) {

	}
});