sap.ui.core.mvc.Controller.extend("sap.ui.medApp.view.ProfileMaster", {

	onInit : function() {
		this.oModel = sap.ui.medApp.global.util.getHomeModel();
		sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(
				this.onRouteMatched, this);
	},
	// Handler for routing event
	onRouteMatched : function(oEvent) {

	},
	handleSelectionChange : function(oControlEvent) {
		var oItem = oControlEvent.oSource;
		var oSelectedKey = oItem.getSelectedItem().getKey();
		if (oSelectedKey === "personal") {
			this._showPersonalInfo();
		} else if (oSelectedKey === "char") {
			this._showCharacteristics();
		}else if (oSelectedKey === "address") {
			this._showAddress();
		}
	},
	_showPersonalInfo : function() {
		var bReplace = jQuery.device.is.phone ? false : true;
		sap.ui.core.UIComponent.getRouterFor(this).navTo("personalInfo", {},
				bReplace);
	},
	_showCharacteristics : function() {
		var bReplace = jQuery.device.is.phone ? false : true;
		sap.ui.core.UIComponent.getRouterFor(this).navTo("characteristics", {},
				bReplace);
	},
	_showAddress : function() {
		var bReplace = jQuery.device.is.phone ? false : true;
		sap.ui.core.UIComponent.getRouterFor(this).navTo("address", {},
				bReplace);
	}
});