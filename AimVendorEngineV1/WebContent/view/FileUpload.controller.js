jQuery.sap.require("sap.ui.medApp.formatter.formatHelper");
sap.ui.core.mvc.Controller
  .extend(
    "sap.ui.medApp.view.FileUpload",
    {

     onInit : function() {
      this.oModel = sap.ui.medApp.global.util.getHomeModel();
      sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(
        this.onRouteMatched, this);
      this.oLoginDetails = this.oModel.getProperty("/LoggedUser");
      this.oHtml = new sap.ui.core.HTML();

      this.oHtml
        .setContent('<form id="myform" enctype="multipart/form-data">Select File to Upload:<input id="myFile" type="file" name="fileName"></form>');
     },

     onRouteMatched : function(oEvent) {
      var sName = oEvent.getParameter("name");
      this._bindImage();
     },

     _bindImage : function() {
      var oTable = this.getView().byId("idCharTable");
      oTable.bindItems({
       path : "/vendorsList/0/Characteristics",
       template : new sap.m.ColumnListItem({
        cells : [ new sap.m.Image({
         src : "/Users/Dev/files/{VALUE}"
        }) ]
       }),
       filters : [ new sap.ui.model.Filter({
        path : "DESCR",
        operator : sap.ui.model.FilterOperator.EQ,
        value1 : "Image"
       }) ]
      });

     },

     navBack : function() {
      var bReplace = jQuery.device.is.phone ? false : true;
      sap.ui.core.UIComponent.getRouterFor(this).navTo("profile", {}, bReplace);
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
      var fnSuccess = function(oData) {
       sap.m.MessageToast.show("Image deleted");
      };
      sap.ui.medApp.global.util.updateUserDetails(fnSuccess);
     },
     navBack : function() {
      var bReplace = jQuery.device.is.phone ? false : true;
      sap.ui.core.UIComponent.getRouterFor(this).navTo("profile", {}, bReplace);
     },

     addCharacteristics : function(oEvent) {
      var _this = this;
      if (!_this._oCharDialog) {

       _this._oCharDialog = new sap.m.Dialog({
        title : "{i18n>ADD_IMAGE}",
        content : [ new sap.m.Text("txtNoFileMsg"), _this.oHtml ],
        beginButton : new sap.m.Button({
         text : "{i18n>ADD_BUTTON}",
         press : function() {
          _this.charData = _this.oModel
            .getProperty("/vendorsList/0/Characteristics");
          var x = document.getElementById("myFile");
          var txt = sap.ui.getCore().byId("txtNoFileMsg");
          if ('files' in x) {
           if (x.files.length == 0 || x.files.length > 1) {
            txt.setText("Select one file to upload");
           } else {
            _this.fnSuccess = function(oData) {

             sap.m.MessageToast.show("Images saved");
            };

            var fnFileUploadError = function(err) {
             sap.m.MessageToast.show("Erorr occured while uploading file");
            }

            var fnFileUploadSuccess = function(response) {
             _this.charData.push({
              "CHRID" : "8",
              "DESCR" : "Image",
              "LNTXT" : "Image",
              "MDTEXT" : "Image",
              "REGXT" : "img",
              "SRTXT" : "Image",
              "USRID" : _this.oLoginDetails.USRID,
              "VALUE" : "image.jpeg"
             });

             _this.oModel.refresh(true);
             sap.ui.medApp.global.util.updateUserDetails(_this.fnSuccess);
            };

            sap.ui.medApp.global.util.uploadFile(_this.oLoginDetails.USRID,
              $('#myform'), fnFileUploadSuccess, fnFileUploadError);

            _this._oCharDialog.close();
           }
          }

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
      _this._oCharDialog.setModel(this.oModel);
      _this._oCharDialog.bindElement("/Char");
      _this._oCharDialog.open();

     }
    });
