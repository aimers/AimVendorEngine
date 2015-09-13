(function() {
  "use strict";

  jQuery.sap.declare("sap.ui.medApp.service.vendorListServiceFacade");
  jQuery.sap.require("sap.ui.medApp.service.BaseServiceFacade");

  /**
   * 
   * @name sap.ui.medApp.service.vendorListServiceFacade
   * @extends sap.ui.medAppe.service.BaseServiceFacade
   */
  sap.ui.medApp.service.BaseServiceFacade
      .extend(
          "sap.ui.medApp.service.vendorListServiceFacade",
          /** @lends app.home.service.DinmensionServiceFacade */
          {
            getRecords : function(fnSuccess, fnError, modelPath, fnPath, param) {
              var sServicePath = "";
              var sModelPath = modelPath;
              var extractListVendor;
              var paramString = this.convertParamToString(param);
              if (medApp.global.config.applicationMode) {
                sServicePath = encodeURI(medApp.global.config.endPoint.vendorData
                    + fnPath + "&" + paramString);
              } else {
                sServicePath = encodeURI(medApp.global.config.endPoint.vendorData
                    + fnPath + ".json");
              }
              extractListVendor = function(oData) {
                return oData.results;
              };
              this._get(sServicePath, sModelPath, undefined, fnSuccess,
                  fnError, extractListVendor);
            },
            convertParamToString : function(param) {
              var paramStr = "";
              if (param.length > 0) {
                for (var i = 0; i < param.length; i++) {
                  if (typeof param[i].value === 'object') {
                    param[i].value = JSON.stringify(param[i].value);
                  }
                  if (paramStr == "") {
                    paramStr = param[i].key + "=" + param[i].value + "&";
                  } else {
                    paramStr = paramStr + param[i].key + "=" + param[i].value
                        + "&";
                  }
                }
              }
              return paramStr;
            },
            updateParameters : function(param, fnSuccess, fnError, fnPath) {
              // Set service path
              var sServicePath;
              var paramString = this.convertParamToString(param);
              if (medApp.global.config.applicationMode) {
                sServicePath = encodeURI(medApp.global.config.endPoint.vendorData
                    + fnPath + "&" + paramString);
              } else {
                return false;
              }

              // Set test data file name
              var sModelDataFileName = "userDetail.json";
              this._send(sServicePath, fnSuccess, fnError, [ {} ],
                  sModelDataFileName);
            },
            updateParametersS : function(param, fnSuccess, fnError, fnPath) {
             // Set service path
             var sServicePath;
             var paramString = this.convertParamToString(param);
             if (medApp.global.config.applicationMode) {
               sServicePath = encodeURI(medApp.global.config.endPoint.vendorData
                   + fnPath + "&" + paramString);
             } else {
               return false;
             }

             // Set test data file name
             var sModelDataFileName = "userDetail.json";
             this._sendS(sServicePath, fnSuccess, fnError, [ {} ],
                 sModelDataFileName);
           },
            getThirdPartyData : function(param, fnSuccess, fnError, fnPath) {
              var sServicePath;
              sServicePath = encodeURI(fnPath);
              this._send(sServicePath, fnSuccess, fnError, [ {} ], "");
            }
          });
})();
