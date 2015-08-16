sap.ui.controller("sap.ui.medApp.view.Signup", {
	onInit : function() {

	},
	onBeforeRendering : function() {

	},
	onAfterRendering : function() {

	},

	onExit : function() {

	},
	handleRegister : function() {
		sap.ui.core.UIComponent.getRouterFor(this).navTo("home");
	},
	handleCancel : function() {
		sap.ui.core.UIComponent.getRouterFor(this).navTo("login");
	}
});