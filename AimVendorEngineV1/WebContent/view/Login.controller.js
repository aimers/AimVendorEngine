sap.ui
  .controller(
    "sap.ui.medApp.view.Login",
    {
     // onInit
     // ******************************************
     onInit : function() {
      // getting Router
      this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      this.oView = this.getView();
      this._oRouter.attachRoutePatternMatched(this._handleRouteMatched, this);
     },
     // _handleRouteMatched
     // ******************************************
     _handleRouteMatched : function(oEvent) {
      var sName = oEvent.getParameter("name");
      if (sName === "login") {
       if (sap.ui.medApp.global.util._mainModel) {
        this.oModel = sap.ui.medApp.global.util._mainModel;
       } else {
        this.oModel = new sap.ui.model.json.JSONModel();
       }
       this.getView().setModel(this.oModel);
       if (this.oModel.getProperty("/LoggedUser")) {
        this._oRouter.navTo('home');
       }
      }

     },
     // handleLogin
     // ******************************************
     handleLogin : function() {
      sap.ui.medApp.global.busyDialog.open();
      var _this = this;
      var username = this.oView.byId("usrNme").getValue();
      var password = this.oView.byId("pswd").getValue();
      var param = [ {
       "key" : "details",
       "value" : {
        "USRNM" : username,
        "UERPW" : password
       }
      } ];
      var fnSuccess = function(oData) {
       if (!oData.results.USRID) {
        _this.oView.byId("MessageBox").setVisible(true);
        _this.oView.byId("MessageBox").setText("Email/Password is incorrect");
        sap.ui.medApp.global.busyDialog.close();
       } else {
        _this.oView.byId("MessageBox").setVisible(false);
        sessionStorage.setItem("medAppUID", oData.results.USRID);
        sessionStorage.setItem("medAppPWD", oData.results.UERPW);
        _this.oModel.setProperty("/LoggedUser", oData.results);

        var fnSuccess1 = function() {

         if (!_this.oModel.getProperty("/vendorsList/0")) {
          !_this.oModel.setProperty("/vendorsList/0", _this.oModel
            .getProperty("/LoggedUser"));
         }

         sap.ui.medApp.global.busyDialog.close();
         $("#medApp--myShell-header-hdr-end").css("display", "block");

         if (sap.ui.Device.system.phone) {
          // Code to register device Id to User
          // *************************************
          var oChar = _this.oModel
            .getProperty("/vendorsList/0/Characteristics");
          var bFound = false;
          if (oChar) {
           for (c in oChar) {
            if (oChar[c].CHRID == 12) {
             bFound = true;
             if (oChar[c].VALUE != vEngine.RegisteredId) {
              oChar[c].VALUE = vEngine.RegisteredId;
              var fnSuccess2 = function() {
               _this._oRouter.navTo('home');
              }
              sap.ui.medApp.global.util.updateUserDetails(fnSuccess2);
              break;
             }
            }
           }
          } else {
           _this.oModel.setProperty("/vendorsList/0/Characteristics", []);
          }
          if (!bFound) {
           oChar.push({
            "CHRID" : "12",
            "DESCR" : "Device Registration Id",
            "LNTXT" : "Device Registration Id",
            "MDTEXT" : "Device Reg Id",
            "REGXT" : "regid",
            "SRTXT" : "Dev Reg Id",
            "USRID" : _this.oModel.getProperty("/LoggedUser/USRID"),
            "VALUE" : vEngine.RegisteredId.toString()
           });
           var fnSuccess3 = function() {
            _this._oRouter.navTo('home');
           }
           sap.ui.medApp.global.util.updateUserDetails(fnSuccess3);
          } else {
           _this._oRouter.navTo('home');
          }
         } else {
          _this._oRouter.navTo('home');
         }
        };
        param = {
         "USRID" : _this.oModel.getProperty("/LoggedUser/USRID")
        };
        sap.ui.medApp.global.util.loadVendorFILTERData(param, fnSuccess1);
       }
      };

      sap.ui.medApp.global.busyDialog.open();
      sap.ui.medApp.global.util.getLoginData(param, fnSuccess);
     },

     signupPress : function(oEvent) {
      this._oRouter.navTo('signup');
     },
     // handleRegister
     // ******************************************
     handleRegister : function() {
      var _this = this;
      var username = this.oView.byId("usrNme").getValue();
      if (!this.validateEmail(username)) {
       this.oView.byId("MessageBox").setVisible(true);
       this.oView.byId("MessageBox").setText("Enter valid Email Address");
       return false;
      }
      var param = [ {
       "key" : "details",
       "value" : {
        "USRNM" : username,
        "UTYID" : "2",
        "PRFIX" : "",
        "TITLE" : "",
        "FRNAM" : "",
        "LTNAM" : "",
        "URDOB" : "1900/01/01",
        "GENDR" : "2",
        "DSPNM" : ""
       }
      } ];
      var fnSuccess = function(oData) {
       sap.ui.medApp.global.busyDialog.close();
       if (!oData.results.USRID) {
        _this.oView.byId("MessageBox").setVisible(true);
        _this.oView.byId("MessageBox").setText("User cannot be registered");
       } else {
        _this.oView.byId("MessageBox").setVisible(false);
        sessionStorage.setItem("medAppUID", oData.results.USRID);
        sessionStorage.setItem("medAppPWD", oData.results.UERPW);
        _this.oModel.setProperty("/LoggedUser", oData.results);
        _this._oRouter.navTo('home');
       }
      };
      sap.ui.medApp.global.busyDialog.open();
      sap.ui.medApp.global.util.getRegisterData(param, fnSuccess);
     },
     validateEmail : function(email) {
      var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
      return re.test(email);
     },

     // handleForgetPassword
     // ******************************************
     handleForgetPassword : function(oEvent) {
      this._oRouter.navTo('forgetpassword');
     }
    });