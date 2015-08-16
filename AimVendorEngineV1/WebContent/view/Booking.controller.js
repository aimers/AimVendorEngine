jQuery.sap.require("sap.ui.medApp.global.globalFormatter");
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
				"USRID" : oLoginDetails.USRID,
				"RULID" : this.oModel.getProperty(sPath + "/RULID"),
				"ETYID" : this.oModel.getProperty(sPath + "/ETYID"),
				"ETCID" : this.oModel.getProperty(sPath + "/ETCID"),
				"ENTID" : oView.byId("entitySelect").getSelectedKey(),
				"STDATE" : oDate,
				"ENDATE" : oDate
			};
			sap.ui.medApp.global.util.loadVendorRules(param);

			var param = [ {
				"key" : "details",
				"value" : {
					"VSUID" : oLoginDetails.USRID,
					"VUTID" : oLoginDetails.UTYID,
					"BDTIM" : oDate
				}
			} ];
			sap.ui.medApp.global.util.loadVendorBookingHistory(param);

			var oVendorRules = this.oModel.getProperty("/vendorRules");
			var oBookingHistory = this.oModel.getProperty("/bookingHistory");
			if (oVendorRules[0].TimeSlots) {
				var finalArray = oVendorRules[0].TimeSlots.map(function(item) {
					var aBookings = [];
					for (item1 in oBookingHistory) {
						if (item.START === oBookingHistory[item1].BOSTM) {
							aBookings.push({
								TITLE : oBookingHistory[item1].TITLE,
								FRNAM : oBookingHistory[item1].FRNAM,
								LTNAM : oBookingHistory[item1].LTNAM,
								STATS : oBookingHistory[item1].STATS
							})
						}
					}
					return {
						START : item.START,
						BOOKINGS : aBookings
					};

				});
				this.oModel.setProperty("/vendorRules", finalArray);
			}

			oView.byId("dateTitle").setText(oDate);

		}
		oView.setModel(this.oModel);
	},
	handleEntityChange : function() {

	}

});