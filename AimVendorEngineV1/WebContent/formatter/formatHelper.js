jQuery.sap.declare("sap.ui.medApp.formatter.formatHelper");
sap.ui.medApp.formatter.formatHelper = {
	getImageUrl : function(oValue) {
		if (oValue != null && oValue != undefined) {

			return "assets/img/" + oValue;
		}
	},

	isBooked : function(bookings) {
		var visible = true;
		if (bookings)
			if (bookings.length > 0) {
				visible = false;
			}
		return visible;
	},
	
	getCssClass : function(status) {
		var cls="";
		if (status === "1") {
			cls = "btnBookingApproved";
		} else if (status === "2") {
			cls = "btnBookingPending";
		}

		return cls;
	}
};