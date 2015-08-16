sap.ui.core.mvc.Controller.extend("sap.ui.medApp.view.resetPassword", {

	onInit : function() {

	},
	onRouteMatched : function(oEvent) {
		this.getView().setModel(this.oModel);
	}

});