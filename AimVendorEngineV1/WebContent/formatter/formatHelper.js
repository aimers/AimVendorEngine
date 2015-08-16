
	jQuery.sap.declare("sap.ui.medApp.formatter.formatHelper");
	sap.ui.medApp.formatter.formatHelper = {
			getImageUrl : function(oValue) {
				if (oValue != null && oValue != undefined) {
					
					return "assets/img/" + oValue;
				}
			}
	};