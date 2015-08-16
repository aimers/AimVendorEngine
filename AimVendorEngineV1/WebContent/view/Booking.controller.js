sap.ui.core.mvc.Controller.extend("sap.ui.medApp.view.Booking", {

	onInit : function() {
        this.oModel = sap.ui.medApp.global.util.getMainModel();
        this.getView().setModel(this.oModel);
		this.oData = {
			"Bookings" : [ {
				"time" : "8:00 AM",
				"appointment" : [ {
					"name" : "Rakesh Joshi",
					"usrid" : "10001",
					"status" : "A"
				}, {
					"name" : "Rakesh Joshi",
					"usrid" : "10006"
				} ]
			}, {
				"time" : "9:00 AM",
				"appointment" : [ {
					"name" : "Rakesh Joshi",
					"usrid" : "10001",
					"status" : "A"
				} ]
			}, {
				"time" : "10:00 AM",
				"appointment" : [ {
					"name" : "Rakesh Joshi",
					"usrid" : "10001",
					"status" : "A"
				}, {
					"name" : "Rakesh Joshi",
					"usrid" : "10006",
					"status" : "R"
				} ]
			}, {
				"time" : "11:00 AM",
				"appointment" : [ {
					"name" : "Rakesh Joshi",
					"usrid" : "10006",
					"status" : "R"
				}, {
					"name" : "Rakesh Joshi",
					"usrid" : "10006",
					"status" : "A"
				} ]
			}, {
				"time" : "12:00 Noon",
				"appointment" : [ {
					"name" : "Rakesh Joshi",
					"usrid" : "10004",
					"status" : "A"
				} ]
			}, {
				"time" : "1:00 PM",
				"appointment" : [ {
					"name" : "Rakesh Joshi",
					"usrid" : "10005"
				} ]
			}, {
				"time" : "2:00 PM",
				"appointment" : [ {
					"name" : "Rakesh Joshi",
					"usrid" : "10003",
					"status" : "A"
				} ]
			}, {
				"time" : "3:00 PM",
				"appointment" : [ {
					"name" : "Rakesh Joshi",
					"usrid" : "10002",
					"status" : "A"
				} ]
			}, {
				"time" : "4:00 PM",
				"appointment" : [ {
					"name" : "Rakesh Joshi",
					"usrid" : "10001",
					"status" : "A"
				} ]
			}, {
				"time" : "5:00 PM",
				"appointment" : [ {
					"name" : "Rakesh Joshi",
					"usrid" : "10001",
					"status" : "A"
				} ]
			}, {
				"time" : "6:00 PM",
				"appointment" : [ {
					"name" : "Rakesh Joshi",
					"usrid" : "10001",
					"status" : "A"
				}, {
					"time" : "7:00 PM",
					"appointment" : [ {
						"name" : "Rakesh Joshi",
						"usrid" : "10001",
						"status" : "A"
					} ]
				} ]
			}

			]
		};

		//this.oModel = new sap.ui.model.json.JSONModel();
		//this.oModel.setData(this.oData);

		// set a handler to handle the routing event
		sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(
				this.onRouteMatched, this);
	},
	onRouteMatched : function(oEvent) {
		var oView = this.getView();
		var oLoginDetails = this.oModel.getProperty("/LoggedUser");
		
		//sap.ui.medApp.global.util.loadVendorRules();
		
		if (oEvent.getParameter("name") === "bookings") {
			var oTable = oView.byId("idBookings");
			oTable.setHeaderText("Appointment Date: "+ oEvent.getParameter("arguments").date);
		}
		this.getView().setModel(this.oModel);
	},
	handleEntityChange:function(){
		
	}

});