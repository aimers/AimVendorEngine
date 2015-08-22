jQuery.sap.require("sap.ui.medApp.formatter.formatHelper");
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
			var oEntities = oView.byId("entitySelect");
			var oSeletedItem = oEntities.getSelectedItem();
			if (!oSeletedItem) {
				oEntities.setSelectedItem(oEntities.getFirstItem());
				oSeletedItem = oEntities.getFirstItem();
			}
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

							var cls = "";
							if (oBookingHistory[item1].STATS == "1") {
								cls = "btnBookingApproved";
							} else if (oBookingHistory[item1].STATS == "2") {
								cls = "btnBookingPending";
							}

							aBookings.push({
								DSPNM : oBookingHistory[item1].DSPNM,
								STATS : oBookingHistory[item1].STATS,
								VLTNAM : oBookingHistory[item1].VLTNAM,
								URDOB : oBookingHistory[item1].URDOB,
								URCOD : oBookingHistory[item1].URCOD,
								VURDOB : oBookingHistory[item1].VURDOB,
								VURCOD : oBookingHistory[item1].VURCOD,
								VTRMI : oBookingHistory[item1].VTRMI,
								ETYID : oBookingHistory[item1].ETYID,
								BOETM : oBookingHistory[item1].BOETM,
								VPREFIX : oBookingHistory[item1].VPREFIX,
								ENTID : oBookingHistory[item1].ENTID,
								BOSTM : oBookingHistory[item1].BOSTM,
								VFRNAM : oBookingHistory[item1].VFRNAM,
								USRID : oBookingHistory[item1].USRID,
								VTITLE : oBookingHistory[item1].VTITLE,
								VGENDR : oBookingHistory[item1].VGENDR,
								CUSID : oBookingHistory[item1].CUSID,
								LTNAM : oBookingHistory[item1].LTNAM,
								CUTID : oBookingHistory[item1].CUTID,
								RTYPE : oBookingHistory[item1].RTYPE,
								VUSRID : oBookingHistory[item1].VUSRID,
								BTIMZ : oBookingHistory[item1].BTIMZ,
								FRNAM : oBookingHistory[item1].FRNAM,
								VDSPNM : oBookingHistory[item1].VDSPNM,
								RULID : oBookingHistory[item1].RULID,
								VSUID : oBookingHistory[item1].VSUID,
								VUTID : oBookingHistory[item1].VUTID,
								BDTIM : oBookingHistory[item1].BDTIM,
								GENDR : oBookingHistory[item1].GENDR,
								TITLE : oBookingHistory[item1].TITLE,
								ETCID : oBookingHistory[item1].ETCID

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

	},
	navBack : function() {
		var bReplace = jQuery.device.is.phone ? false : true;
		sap.ui.core.UIComponent.getRouterFor(this).navTo("bookinghome", {},
				bReplace);
	},
	handlePatientViewPress : function(oEvent) {
		var sPath = oEvent.getSource().getBindingContext().sPath;
		this.openPatientView(oEvent, this.oModel, sPath);
	},

	openPatientView : function(oEvent, oModel, sPath) {
		this.createPopover();

		this._oPatientView.setModel(oModel);
		this._oPatientView.bindElement(sPath);
		var oButton = oEvent.getSource();
		jQuery.sap.delayedCall(0, this, function() {
			this._oPatientView.openBy(oButton);
		});
	},

	createPopover : function() {
		if (!this._oPatientView) {
			this._oPatientView = sap.ui.xmlfragment(
					"sap.ui.medApp.view.PatientView", this);
			this.getView().addDependent(this._oPatientView);
		}
	},
	onExit : function() {
		if (this._oPatientView) {
			this._oPatientView.destroy();
		}
	}

});