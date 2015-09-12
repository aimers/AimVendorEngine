sap.ui
  .controller(
    "sap.ui.medApp.view.Signup",
    {
     onInit : function() {
      this.oModel = sap.ui.medApp.global.util.getHomeModel();
      sap.ui.medApp.global.util.loadListCategory();
      this.oView = this.getView();
      sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(
        this.onRouteMatched, this);
      this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
     },

     onRouteMatched : function(oEvent) {
      var oFname = this.oView.byId("fname");
      var oLname = this.oView.byId("lname");
      var oUsrNm = this.oView.byId("usrNme");
      // var oPswd = this.oView.byId("pswd");
      // var oCpwd = this.oView.byId("cpswd");
      var oSpeciality = this.oView.byId("entitySelect");

      oFname.setValueState(sap.ui.core.ValueState.None);
      oLname.setValueState(sap.ui.core.ValueState.None);
      oUsrNm.setValueState(sap.ui.core.ValueState.None);
      // oPswd.setValueState(sap.ui.core.ValueState.None);
      // oCpwd.setValueState(sap.ui.core.ValueState.None);
      oSpeciality.setSelectedItem(oSpeciality.getFirstItem());
     },
     onExit : function() {

     },
     handleRegister : function(oEvent) {

      if (this._validateInputs()) {

       var _this = this;
       var username = this.oView.byId("usrNme").getValue();
       var oFname = _this.oView.byId("fname");
       var oLname = _this.oView.byId("lname");
       var oUsrNm = _this.oView.byId("usrNme");
       // var oPswd = _this.oView.byId("pswd");
       // var oCpwd = _this.oView.byId("cpswd");
       var oSpeciality = _this.oView.byId("entitySelect");
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
        if (!oData.results.USRID) {
         _this.oView.byId("MessageBox").setVisible(true);
         _this.oView.byId("MessageBox").setText("User cannot be registered");
        } else {
         _this.oView.byId("MessageBox").setVisible(false);
         sessionStorage.setItem("medAppUID", oData.results.USRID);
         sessionStorage.setItem("medAppPWD", oData.results.UERPW);
         _this.oModel.setProperty("/LoggedUser", oData.results);

         _this.oModel.setProperty("/vendorsList", []);
         _this.oModel.setProperty("/vendorsList/0", _this.oModel
           .getProperty("/LoggedUser"));

         _this.oModel.setProperty("/vendorsList/0/Address", [ {
          CTYID : "",
          CTYNM : "",
          LATIT : "0",
          LNDMK : "",
          LOCLT : "",
          LONGT : "0",
          PINCD : "",
          PRIMR : true,
          STREET : "",
          USRID : oData.results.USRID
         } ]);
         _this.oModel.setProperty("/vendorsList/0/Characteristics", []);

         var sPath = oSpeciality.getSelectedItem().getBindingContext().sPath;

         var Data = _this.oModel.getProperty(sPath);

         _this.oModel.setProperty("/vendorsList/0/Entities", [ Data ]);
         _this.oModel.setProperty("/vendorsList/0/Rules", []);

         _this.oModel.setProperty("/vendorsList/0/FRNAM", oFname.getValue()
           .toString().trim());
         _this.oModel.setProperty("/vendorsList/0/LTNAM", oLname.getValue()
           .toString().trim());

         var fnSuccess = function(oData) {
          sap.ui.medApp.global.busyDialog.close();
          _this._oRouter.navTo('home');
         };

         sap.ui.medApp.global.util.updateUserDetails(fnSuccess);

        }
       };
       sap.ui.medApp.global.busyDialog.open();
       sap.ui.medApp.global.util.getRegisterData(param, fnSuccess);
      }
     },
     handleCancel : function() {
      sap.ui.core.UIComponent.getRouterFor(this).navTo("login");
     },
     // _validateInputs
     // ******************************************
     _validateInputs : function() {
      var regxRequired = /([^\s])/;
      var email = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
      var oView = this.getView();
      var oFname = oView.byId("fname");
      var oLname = oView.byId("lname");
      var oUsrNm = oView.byId("usrNme");
      // var oPswd = oView.byId("pswd");
      // var oCpwd = oView.byId("cpswd");
      var invalidInputs = false;
      // FirstName
      if (!regxRequired.test(oFname.getValue().toString())) {
       invalidInputs = true;
       oFname.setValueState(sap.ui.core.ValueState.Error);
      } else {
       oFname.setValueState(sap.ui.core.ValueState.None);
      }
      // LastName
      if (!regxRequired.test(oLname.getValue().toString())) {
       invalidInputs = true;
       oLname.setValueState(sap.ui.core.ValueState.Error);
      } else {
       oLname.setValueState(sap.ui.core.ValueState.None);
      }

      if (oUsrNm.getValue()) {
       // User Name
       if (!regxRequired.test(oUsrNm.getValue().toString())) {
        invalidInputs = true;
        oUsrNm.setValueState(sap.ui.core.ValueState.Error);
       } else {
        oUsrNm.setValueState(sap.ui.core.ValueState.None);
       }
      }
      // User Name
      if (!email.test(oUsrNm.getValue().toString())) {
       invalidInputs = true;
       oUsrNm.setValueState(sap.ui.core.ValueState.Error);
      } else {
       oUsrNm.setValueState(sap.ui.core.ValueState.None);
      }
      // Password
      // if (!regxRequired.test(oPswd.getValue().toString())) {
      // invalidInputs = true;
      // oPswd.setValueState(sap.ui.core.ValueState.Error);
      // } else {
      // oPswd.setValueState(sap.ui.core.ValueState.None);
      // }
      // // Confirm password
      // if (!regxRequired.test(oCpwd.getValue().toString())) {
      // invalidInputs = true;
      // oCpwd.setValueState(sap.ui.core.ValueState.Error);
      // } else {
      // oCpwd.setValueState(sap.ui.core.ValueState.None);
      // }
      // if (oPswd.getValue() && oCpwd.getValue()) {
      // // Password Match
      // if (oPswd.getValue().toString() != oCpwd.getValue().toString()) {
      // invalidInputs = true;
      // oPswd.setValueState(sap.ui.core.ValueState.Error);
      // oCpwd.setValueState(sap.ui.core.ValueState.Error);
      // } else {
      // oPswd.setValueState(sap.ui.core.ValueState.None);
      // oCpwd.setValueState(sap.ui.core.ValueState.None);
      // }
      // }
      return !invalidInputs;
     }
    });