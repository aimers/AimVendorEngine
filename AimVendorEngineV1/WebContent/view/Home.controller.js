sap.ui.core.mvc.Controller.extend("sap.ui.medApp.view.Home", {

	onInit : function() {
		this.oModel = sap.ui.medApp.global.util.getHomeModel();
		sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(
				this.onRouteMatched, this);
	},
	// Handler for routing event
	onRouteMatched : function(oEvent) {
//		var oLoginDetails = this.oModel.getProperty("/LoggedUser");
//		if (!oLoginDetails || !sessionStorage.medAppUID) {
//			this._naveToLogin();
//			return false;
//		}
		this.getView().byId("menu").clearSelection();
		if (oEvent.getParameter("name") === "home") {
			
			//this._showDetailsHome();
		}
	},

	_naveToLogin : function() {
		sap.ui.core.UIComponent.getRouterFor(this).navTo("login");
	},

	_showDetailsHome : function() {
		var bReplace = jQuery.device.is.phone ? false : true;
		sap.ui.core.UIComponent.getRouterFor(this).navTo("detailshome", {},
				bReplace);
	},

	handleSelectionChange : function(oControlEvent) {

		var oItem = oControlEvent.oSource;
		var oSelectedKey = oItem.getSelectedItem().getKey();
		if (oSelectedKey === "booking") {
			this._showCalendar();
		} else if (oSelectedKey === "entity") {
			var bReplace = jQuery.device.is.phone ? false : true;
			sap.ui.core.UIComponent.getRouterFor(this).navTo("bookinghome", {},
					bReplace);
		}
	},

	_showCalendar : function(oCalendar) {
		var bReplace = jQuery.device.is.phone ? false : true;
		sap.ui.core.UIComponent.getRouterFor(this).navTo("bookinghome", {},
				bReplace);
	}
});