sap.ui.core.mvc.Controller
  .extend(
    "sap.ui.medApp.view.Characteristics",
    {

     onInit : function() {
      this.oModel = sap.ui.medApp.global.util.getHomeModel();
      sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(
        this.onRouteMatched, this);
      this.oLoginDetails = this.oModel.getProperty("/LoggedUser");
     },

     // Handler for routing event
     onRouteMatched : function(oEvent) {
      var sName = oEvent.getParameter("name");
      if (sName === "characteristics") {
       this._bindImage();
       this._toggleSaveButton();
      }
     },

     _bindImage : function() {
      var oTable = this.getView().byId("idCharTable");
      oTable.bindItems({
       path : "/vendorsList/0/Characteristics",
       template : new sap.m.ColumnListItem({
        cells : [ new sap.m.Text({
         text : "{DESCR}"
        }), new sap.m.Input({
         value : "{VALUE}"
        }) ]
       }),
       filters : [ new sap.ui.model.Filter({
        path : "DESCR",
        operator : sap.ui.model.FilterOperator.NE,
        value1 : "Image"
       }) ]
      });

     },

     _toggleSaveButton : function() {
      if (this.getView().byId("idCharTable").getItems().length) {
       this.getView().byId("btnSave").setEnabled(true);
      } else {
       this.getView().byId("btnSave").setEnabled(false);
      }
     },

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

     handleSave : function() {
      var fnSuccess = function(oData) {
       sap.m.MessageToast.show("Characteristics saved");
      };
      sap.ui.medApp.global.util.updateUserDetails(fnSuccess);
     },

     navBack : function() {
      var bReplace = jQuery.device.is.phone ? false : true;
      sap.ui.core.UIComponent.getRouterFor(this).navTo("profile", {}, bReplace);
     },

     addCharacteristics : function(oEvent) {
      var _this = this;
      if (!this.oModel.getProperty("/Char")) {
       sap.ui.medApp.global.util.getCharecteristics();
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
          sap.m.MessageToast.show("Characteristics Added");
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
       // to get access to the global model
       _this.getView().addDependent(_this._oCharDialog);
      }
      sap.ui.getCore().byId("charValue").setValue("");
      _this._oCharDialog.setModel(this.oModel);
      _this._oCharDialog.bindElement("/Char");
      _this._oCharDialog.open();

     }
    });
