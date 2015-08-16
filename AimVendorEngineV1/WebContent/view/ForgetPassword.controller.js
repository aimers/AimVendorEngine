sap.ui.core.mvc.Controller.extend("sap.ui.medApp.view.ForgetPassword", {

	onInit : function() {

	},
	onRouteMatched : function(oEvent) {
		this.getView().setModel(this.oModel);
	}

});