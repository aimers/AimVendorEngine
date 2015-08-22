sap.ui.core.mvc.Controller.extend("sap.ui.medApp.view.Calendar", {

	onInit : function() {

		sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(
				this.onRouteMatched, this);
		this.DateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
			pattern : "dd-MM-yyyy"
		});
	},
	// Handler for routing event
	onRouteMatched : function(oEvent) {
		var oView = this.getView();

		if (oEvent.getParameter("name") === "bookinghome") {
			var oCalendar = oView.byId("calendar1");
			if (!sap.ui.Device.system.phone) {
				var oDate = this._getSelectedDate(oCalendar);
				this._showBookings(oDate);
			}
		}	
	},

	_getSelectedDate : function(oCalendar) {
		var aSelectedDates = oCalendar.getSelectedDates();
		var oDate;
		if (aSelectedDates.length > 0) {
			oDate = aSelectedDates[0].getStartDate();
		} else {
			oDate = new Date();
		}
		return this.DateFormat.format(oDate);
	},

	onDateSelectionChanged : function(oControlEvent) {
		var oCalendar = oControlEvent.oSource;
		var oDate = this._getSelectedDate(oCalendar);
		this._showBookings(oDate);
	},

	_showBookings : function(oDate) {

		var bReplace = jQuery.device.is.phone ? false : true;
		sap.ui.core.UIComponent.getRouterFor(this).navTo("bookings", {
			date : oDate
		}, bReplace);
	},
	navBack : function() {
		var bReplace = jQuery.device.is.phone ? false : true;
		sap.ui.core.UIComponent.getRouterFor(this).navTo("home", {}, bReplace);
	}

});