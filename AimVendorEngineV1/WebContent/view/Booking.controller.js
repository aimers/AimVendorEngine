sap.ui.core.mvc.Controller.extend("sap.ui.medApp.view.Booking", {

	onInit : function() {
		this.oModel = sap.ui.medApp.global.util.getMainModel();
		sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(
				this.onRouteMatched, this);
	},
	onRouteMatched : function(oEvent) {
		var oView = this.getView();
		if (oEvent.getParameter("name") === "bookings") {


			if (!this.oModel.getProperty("/vendorList")) {
				param = {
					"USRID" : this.oModel.getProperty("/LoggedUser/USRID")
				};
				sap.ui.medApp.global.util.loadVendorFILTERData(param);
				oView.setModel(this.oModel);
			}
			var oLoginDetails = this.oModel.getProperty("/LoggedUser");
			var oDate = oEvent.getParameter("arguments").date;
			var oSeletedItem = oView.byId("entitySelect").getSelectedItem();
			var sPath = oSeletedItem.getBindingContext().sPath;
			param = {
				"USRID" : this.oModel.getProperty("/LoggedUser/USRID"),
				"RULID" : this.oModel.getProperty(sPath + "/RULID"),
				"ETYID" : this.oModel.getProperty(sPath + "/ETYID"),
				"ETCID" : this.oModel.getProperty(sPath + "/ETCID"),
				"ENTID" : oView.byId("entitySelect").getSelectedKey(),
				"STDATE" : oDate,
				"ENDATE" : oDate
			};
			sap.ui.medApp.global.util.loadVendorRules(param);
			
			
			
			
			
			
			oView.byId("dateTitle").setText(oDate);
		}
		oView.setModel(this.oModel);
	},
	handleEntityChange : function() {

	}

});