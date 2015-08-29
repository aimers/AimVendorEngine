jQuery.sap.declare("sap.ui.medApp.Component");
var oService;
sap.ui.core.UIComponent.extend("sap.ui.medApp.Component", {

 /* Meta data of Component */
 metadata : {
  rootView : null, // Root View of the App
  routing : {
   config : {
    routerClass : sap.ui.medApp.MyRouter,
    viewType : "XML",
    viewPath : "sap.ui.medApp.view",
    targetAggregation : "detailPages",
    clearTarget : true
   },
   routes : [ {
    pattern : "",
    name : "login",
    view : "Login",
    targetAggregation : "pages",
    targetControl : "idAppControl"
   }, {
    pattern : "home",
    name : "home",
    view : "Home",
    targetAggregation : "masterPages",
    targetControl : "idSplitAppControl"
   }, {
    pattern : "detailshome",
    name : "detailshome",
    view : "DetailsHome",
    viewLevel : 1,
    targetAggregation : "detailPages",
    targetControl : "idSplitAppControl"
   }, {
    pattern : "bookinghome",
    name : "bookinghome",
    view : "Calendar",
    targetAggregation : "masterPages",
    targetControl : "idSplitAppControl",
    subroutes : [ {
     pattern : "bookinghome/bookings/{date}",
     name : "bookings",
     view : "Booking",
     viewLevel : 1,
     targetAggregation : "detailPages",
     targetControl : "idSplitAppControl"
    } ]
   }, {
    pattern : "profile",
    name : "profile",
    view : "ProfileMaster",
    targetAggregation : "masterPages",
    targetControl : "idSplitAppControl",
    subroutes : [ {
     pattern : "profile/characteristics",
     name : "characteristics",
     view : "Characteristics",
     viewLevel : 1,
     targetAggregation : "detailPages",
     targetControl : "idSplitAppControl"
    }, {
     pattern : "profile/personalinfo",
     name : "personalinfo",
     view : "PersonalInfo",
     viewLevel : 1,
     targetAggregation : "detailPages",
     targetControl : "idSplitAppControl"
    }, {
     pattern : "profile/address",
     name : "address",
     view : "Address",
     viewLevel : 1,
     targetAggregation : "detailPages",
     targetControl : "idSplitAppControl"
    } , {
     pattern : "profile/speciality",
     name : "speciality",
     view : "Entity",
     viewLevel : 1,
     targetAggregation : "detailPages",
     targetControl : "idSplitAppControl"
    }]
   }, {
    pattern : "rules/:ruleid:",
    name : "rules",
    view : "RuleMaster",
    targetAggregation : "masterPages",
    targetControl : "idSplitAppControl",
    subroutes : [ {
     pattern : "rules/{rule}",
     name : "ruledetails",
     view : "RuleDetails",
     viewLevel : 1,
     targetAggregation : "detailPages",
     targetControl : "idSplitAppControl"
    }, {
     pattern : "addrule",
     name : "addrule",
     view : "AddRule",
     viewLevel : 2,
     targetAggregation : "detailPages",
     targetControl : "idSplitAppControl"
    } ]
   }, {
    pattern : "signup",
    name : "_Signup",
    view : "Signup",
    targetAggregation : "pages",
    targetControl : "idAppControl"
   } ]
  }
 },

 /**
  * !!! The steps in here are sequence dependent !!!
  */
 init : function() {
  // 1. some very generic requires
  jQuery.sap.require("sap.m.routing.RouteMatchedHandler");
  jQuery.sap.require("sap.ui.core.routing.Router");
  jQuery.sap.require("sap.ui.medApp.global.util");
  jQuery.sap.require("sap.ui.medApp.global.globalFormatter");
  // 1.a Loading MyRouter

  jQuery.sap.require("sap.ui.medApp.MyRouter");
  jQuery.sap.require("sap.m.MessageBox");
  // jQuery.sap.require("sap.ui.medApp.util.Context");

  // 2. call overwritten init (calls createContent)
  sap.ui.core.UIComponent.prototype.init.apply(this, arguments);

  // 3a. monkey patch the router
  var oRouter = this.getRouter();

  oRouter.myNavBack = sap.ui.medApp.MyRouter.myNavBack;
  oRouter.myNavToWithoutHash = sap.ui.medApp.MyRouter.myNavToWithoutHash;
  // 4. initialize the router
  this.oRouteHandler = new sap.m.routing.RouteMatchedHandler(oRouter);
  oRouter.initialize();
 },
 createContent : function() {

  // create root view
  var oView = sap.ui.view({
   id : "medApp",
   viewName : "sap.ui.medApp.view.App",
   type : "XML",
   viewData : {
    component : this
   }
  });
  // i18n Model Initialization
  var i18nModel = new sap.ui.model.resource.ResourceModel({
   bundleUrl : "assets/text/i18n.properties"
  });
  oView.setModel(i18nModel, "i18n");
  var oDeviceModel = new sap.ui.model.json.JSONModel({
   isTouch : sap.ui.Device.support.touch,
   isNoTouch : !sap.ui.Device.support.touch,
   isPhone : sap.ui.Device.system.phone,
   isNoPhone : !sap.ui.Device.system.phone,
   listMode : (sap.ui.Device.system.phone) ? "None" : "SingleSelectMaster",
   listItemType : (sap.ui.Device.system.phone) ? "Active" : "Inactive"
  });
  oDeviceModel.setDefaultBindingMode("OneWay");
  sap.ui.getCore().setModel(oDeviceModel, "device");
  oView.setModel(oDeviceModel, "device");
  oView.setDisplayBlock(true);
  return oView
 },

 destroy : function() {
  if (this.oRouteHandler) {
   this.oRouteHandler.destroy();
  }
  // call overwritten destroy
  sap.ui.core.UIComponent.prototype.destroy.apply(this, arguments);
 }
});