sap.ui.core.mvc.Controller
  .extend(
    "sap.ui.medApp.view.Characteristics",
    {
     // onInit
     // ******************************************
     onInit : function() {

      sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(
        this.onRouteMatched, this);
     },
     // onRouteMatched
     // ******************************************
     onRouteMatched : function(oEvent) {
      this.oModel = sap.ui.medApp.global.util.getMainModel();
      this.getView().setModel(this.oModel);
      this.oLoginDetails = this.oModel.getProperty("/LoggedUser");
      var sName = oEvent.getParameter("name");
      if (sName === "characteristics") {
       this._bindChar();
       this._toggleSaveButton();
      }
     },
     // _bindChar
     // ******************************************
     _bindChar : function() {
      var oTable = this.getView().byId("idCharTable");
      oTable.bindItems({
       path : "/vendorsList/0/Characteristics",
       template : new sap.m.ColumnListItem({
        cells : [ new sap.m.Text({
         text : "{DESCR}"
        }), new sap.m.Input({
         value : "{VALUE}",
         enabled : {
          path : 'CHRID',
          formatter : function(sCHRID) {
           if (sCHRID == 12) {
            return false;
           } else {
            return true;
           }
          }
         }
        }) ]
       }),
       filters : [ new sap.ui.model.Filter({
        path : "CHRID",
        operator : sap.ui.model.FilterOperator.NE,
        value1 : "8"
       }) ]
      });
     },
     // _toggleSaveButton
     // ******************************************
     _toggleSaveButton : function() {
      if (this.getView().byId("idCharTable").getItems().length) {
       this.getView().byId("btnSave").setEnabled(true);
      } else {
       this.getView().byId("btnSave").setEnabled(false);
      }
     },
     // handleDelete
     // ******************************************
     handleDelete : function(oEvent) {
      var oList = oEvent.getSource(), oItem = oEvent.getParameter("listItem"), sPath = oItem
        .getBindingContext().getPath();
      oList.attachEventOnce("updateFinished", oList.focus, oList);
      var pathArray = sPath.split("/");
      var index = pathArray[pathArray.length - 1];
      sPath = sPath.substring(0, sPath.length - 2);
      var aData = this.oModel.getProperty(sPath);
      aData.splice(index, 1);
      this.oModel.refresh(true);
      this._toggleSaveButton();
     },
     // handleSave
     // ******************************************
     handleSave : function() {
      var fnSuccess = function(oData) {
       if (oData.results) {
        sap.ui.medApp.global.busyDialog.close();
        sap.m.MessageToast.show("User information saved");
       } else {
        sap.ui.medApp.global.busyDialog.close();
        sap.m.MessageToast
          .show("An error occured while updating user information");
       }
      };
      sap.ui.medApp.global.busyDialog.open();
      sap.ui.medApp.global.util.updateUserDetails(fnSuccess);
     },
     // navBack
     // ******************************************
     navBack : function() {
      var bReplace = jQuery.device.is.phone ? false : true;
      sap.ui.core.UIComponent.getRouterFor(this).navTo("profile", {}, bReplace);
     },
     // addCharacteristics
     // ******************************************
     addCharacteristics : function(oEvent) {
      var _this = this;
      if (!this.oModel.getProperty("/Char")) {
       var fnSuccess = function() {
        sap.ui.medApp.global.busyDialog.close();
       }
       sap.ui.medApp.global.busyDialog.open();
       sap.ui.medApp.global.util.getCharecteristics(fnSuccess);
      }
      if (!_this._oCharDialog) {
       _this._oCharDialog = new sap.m.Dialog({
        title : "{i18n>ADD_CHAR}",
        content : sap.ui.xmlfragment("sap.ui.medApp.view.AddChar", this),
        beginButton : new sap.m.Button({
         text : "{i18n>ADD_BUTTON}",
         press : function() {
          var oSelectedChar = sap.ui.getCore().byId("selChar")
            .getSelectedItem();
          var oNewChar = _this.oModel.getProperty(oSelectedChar
            .getBindingContext().getPath());
          var charData = _this.oModel
            .getProperty("/vendorsList/0/Characteristics");
          charData.push({
           "CHRID" : oSelectedChar.getKey().toString(),
           "DESCR" : oNewChar.DESCR,
           "LNTXT" : oNewChar.LNTXT,
           "MDTEXT" : oNewChar.MDTEXT,
           "REGXT" : oNewChar.REGXT,
           "SRTXT" : oNewChar.SRTXT,
           "USRID" : _this.oLoginDetails.USRID,
           "VALUE" : sap.ui.getCore().byId("charValue").getValue()
          });
          // _this.getView().byId("idCharTable")
          _this.oModel.refresh(true);
          _this._toggleSaveButton();
          sap.m.MessageToast.show("User information saved");
          _this._oCharDialog.close();
         }
        }),
        endButton : new sap.m.Button({
         text : "{i18n>CANCEL_BUTTON}",
         press : function() {
          _this._oCharDialog.close();
         }
        })
       });
       _this.getView().addDependent(_this._oCharDialog);
      }
      sap.ui.getCore().byId("charValue").setValue("");
      _this._oCharDialog.setModel(this.oModel);
      _this._oCharDialog.bindElement("/Char");
      _this._oCharDialog.open();
     }
    });
