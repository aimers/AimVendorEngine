jQuery.sap.require("jquery.sap.history");
sap.ui
		.controller(
				"sap.ui.medApp.view.App",
				{

					onInit : function() {

						/*
						 * For getting user information
						 */
						this.oModel = sap.ui.medApp.global.util.getHomeModel();

						/*
						 * if(!this.oLoadingDialog){ this.oLoadingDialog = new
						 * sap.m.BusyDialog({text: "Please Wait Data is
						 * Loading..."}); console.log(this.oLoadingDialog); }
						 */
						this.fullWidthApp = new sap.m.App("idAppControl", {
							defaultTransitionName : "slide"
						});

						this.splitApp = new sap.m.SplitApp("idSplitAppControl",
								{
									mode : "PopoverMode",
									defaultTransitionNameDetail : "slide"
								});
						this.getView().byId('myShell').setModel(this.oModel);
						var bus = sap.ui.getCore().getEventBus();
						this._oRouter = sap.ui.core.UIComponent
								.getRouterFor(this);
						this.router = sap.ui.core.UIComponent
								.getRouterFor(this);
						this.router.attachRoutePatternMatched(
								this._handleRouteMatched, this);
						this.oLoadingDialog = sap.ui.getCore().byId(
								"loadingDialog");
						bus.subscribe("nav", "back", this.navHandler, this);
						jQuery(".loader").remove();
					},
					navHandler : function(channelId, eventId, data) {
						if (data && data.id) {
							this.navBack(data.id);
						} else {
							jQuery.sap.history.back();
						}
					},
					_handleRouteMatched : function(oEvent) {

						var scope = oEvent.getParameter("config").name;
						var showHeaderItemsRoutes = [ "home", "bookinghome",
								"bookings" ];
						var fullWidthRoutes = [ "login" ];
						var bIsFullWidthRoute = (jQuery.inArray(scope,
								fullWidthRoutes) >= 0);

						var bShowHederItems = (jQuery.inArray(scope,
								showHeaderItemsRoutes) >= 0);
						var bIsHomeRoute = (scope === "home");
						var app = (bIsFullWidthRoute) ? this.fullWidthApp
								: this.splitApp;
						var oShell = this.getView().byId("myShell");
						var oHeadItems = oShell.getHeadItems();
						var oHeadEndItems = oShell.getHeadEndItems();

						if (oShell.getContent()[0] === undefined
								|| oShell.getContent()[0].getId() !== app
										.getId()) {
							oShell.removeAllContent();
							oShell.addContent(app);
						}

						if (bShowHederItems) {
							for ( var item in oHeadItems) {
								oHeadItems[item].setVisible(true);
							}
							for ( var item in oHeadEndItems) {
								oHeadEndItems[item].setVisible(true);
							}

						} else {
							for ( var item in oHeadItems) {
								oHeadItems[item].setVisible(false);
							}
							for ( var item in oHeadEndItems) {
								oHeadEndItems[item].setVisible(false);
							}
						}
					},
					onAfterRendering : function() {

					},
					handelHomeBtn : function(evt) {
						this._oRouter.navTo('home');
					},
					okCallback : function() {
						var oService = new oDataService();
						oService.handleLogout(this);
					},
					settingsSelect : function(oEvent) {
						var oController = this;
						if (!this.oSettingsLogoutHeaderActionSheet) {
							this.oSettingsLogoutHeaderActionSheet = new sap.m.ActionSheet(
									{
										placement : sap.m.PlacementType.Bottom,
										buttons : [
												new sap.m.Button(
														{
															icon : "sap-icon://account",
															text : "Profile",
															tooltip : "Profile",
															press : oController.handleProfile
																	.bind(oController)
														}),
												new sap.m.Button({
													icon : "sap-icon://log",
													text : "Logout",
													tooltip : "Logout",
													press : oController.logout
															.bind(oController)
												}) ]
									});
						}
						if (sessionStorage.medAppUID != undefined
								&& sessionStorage.medAppPWD != undefined) {
							this.oSettingsHeaderActionSheet = this.oSettingsLogoutHeaderActionSheet;
						} else {
							this.oSettingsHeaderActionSheet = this.oSettingsloginHeaderActionSheet;
						}

						this.oSettingsHeaderActionSheet.openBy(oEvent.oSource);
					},

					handleProfile : function(evt) {

					},
					logout : function(evt) {
						sessionStorage.removeItem("medAppUID");
						sessionStorage.removeItem("medAppPWD");
						this.oModel.setProperty("/LoggedUser", []);
						this._oRouter.navTo('login');
					}
				});