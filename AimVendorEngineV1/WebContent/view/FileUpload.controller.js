jQuery.sap.require("sap.ui.medApp.formatter.formatHelper");
sap.ui.core.mvc.Controller
  .extend(
    "sap.ui.medApp.view.FileUpload",
    {
     // onInit
     // ******************************************
     onInit : function() {

      sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(
        this.onRouteMatched, this);
      this.oHtml = new sap.ui.core.HTML();
      this.oHtml
        .setContent('<form id="myform" action="FileUploadServlet?USRID=3" method="post" enctype="multipart/form-data">Select File to Upload:<input id="myFile" type="file" name="fileName"></form>');
     },
     // onRouteMatched
     // ******************************************
     onRouteMatched : function(oEvent) {
      this.oModel = sap.ui.medApp.global.util.getMainModel();
      this.getView().setModel(this.oModel);
      this.oLoginDetails = this.oModel.getProperty("/LoggedUser");
      var sName = oEvent.getParameter("name");
      if (sName = "images") {
       this._bindImage();
      }
     },
     // _bindImage
     // ******************************************
     _bindImage : function() {
      var oTable = this.getView().byId("idCharTable");
      oTable.bindItems({
       path : "/vendorsList/0/Characteristics",
       template : new sap.m.ColumnListItem({
        cells : [ new sap.m.Image({
         height : "2rem",
         width : "2rem",
         src : "{VALUE}",
         densityAware : false
        }) ]
       }),
       filters : [ new sap.ui.model.Filter({
        path : "DESCR",
        operator : sap.ui.model.FilterOperator.EQ,
        value1 : "Image"
       }) ]
      });
     },
     // navBack
     // ******************************************
     navBack : function() {
      var bReplace = jQuery.device.is.phone ? false : true;
      sap.ui.core.UIComponent.getRouterFor(this).navTo("profile", {}, bReplace);
     },
     // handleDelete
     // ******************************************
     handleDelete : function(oEvent) {
      var _this = this;
      var oList = oEvent.getSource(), oItem = oEvent.getParameter("listItem"), sPath = oItem
        .getBindingContext().getPath();
      oList.attachEventOnce("updateFinished", oList.focus, oList);
      var fileNamevalue = _this.oModel.getProperty(sPath).VALUE;
      fileNameValue = fileNamevalue.split("/");
      var filename = fileNameValue[fileNameValue.length - 1];
      var pathArray = sPath.split("/");
      var index = pathArray[pathArray.length - 1];
      sPath = sPath.substring(0, sPath.length - 2);
      var usrid = this.oLoginDetails.USRID;
      _this.fnSuccess = function(oData) {
       sap.ui.medApp.global.busyDialog.close();
       sap.m.MessageToast.show("Image deleted");
       var aData = _this.oModel.getProperty(sPath);
       aData.splice(index, 1);
       _this.oModel.refresh(true);
      };
      var fnDelSuccess = function(oData) {
       sap.ui.medApp.global.util.updateUserDetails(_this.fnSuccess);
      };
      var fnDelError = function(oData) {
       sap.ui.medApp.global.busyDialog.close();
       sap.m.MessageToast.show("Error occured while deleting image");
      };
      sap.ui.medApp.global.busyDialog.open();
      sap.ui.medApp.global.util.deleteFile(usrid, filename, fnDelSuccess,
        fnDelError);
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
             sap.ui.medApp.global.busyDialog.close();
             sap.m.MessageToast.show("User information saved");

            };

            var fnFileUploadError = function(err) {
             sap.ui.medApp.global.busyDialog.close();
             sap.m.MessageToast.show("Erorr occured while uploading file");
            }

            var fnFileUploadSuccess = function(response) {
             response = JSON.parse(response);
             _this.charData.push({
              "CHRID" : "8",
              "DESCR" : "Image",
              "LNTXT" : "Image",
              "MDTEXT" : "Image",
              "REGXT" : "img",
              "SRTXT" : "Image",
              "USRID" : _this.oLoginDetails.USRID,
              "VALUE" : response.relativePath
             });

             _this.oModel.refresh(true);
             sap.ui.medApp.global.util.updateUserDetails(_this.fnSuccess);
            };
            sap.ui.medApp.global.busyDialog.open();
            sap.ui.medApp.global.util.uploadFile(_this.oLoginDetails.USRID,
              new FormData(document.getElementById("myform")),
              fnFileUploadSuccess, fnFileUploadError);

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
