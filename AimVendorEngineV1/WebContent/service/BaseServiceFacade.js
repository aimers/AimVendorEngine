(function() {
  "use strict";

  jQuery.sap.declare("sap.ui.medApp.service.BaseServiceFacade");

  sap.ui.base.Object.extend("sap.ui.medApp.service.BaseServiceFacade", /** @lends app.home.service.BaseServiceFacade */
  {

    constructor : function(oModel) {
      // call parent constructor
      sap.ui.base.Object.apply(this, arguments);

      // Initialize the member attributes
      this.oModel = oModel;
    },

    _setCSRFTokenToHeader : function(xhr) {
      // xhr.setRequestHeader("X-CSRF-Token",pdms.fdn.config.token);
    },

    _get : function(sServicePath, sModelPath, sMeasurePath, fnSuccess, fnError,
        fnGetData) {
      $.sap.log.debug("services.BaseServiceFacade->_get");
      var _this = this;
      var _fnSuccess = function(oData) {
        var oPostProcessedData = {};
        if (fnGetData) {
          oPostProcessedData = fnGetData(oData);
        } else {
          oPostProcessedData = oData;
        }
        _this.oModel.setProperty(sModelPath, oPostProcessedData);
        if (sMeasurePath) {
          _this.oModel.setProperty(sMeasurePath,
              oPostProcessedData[sMeasurePath.slice(1)]);
        }

        if (fnSuccess) {
          fnSuccess(oData);
        }
      };
      // _executeAjax : function(sServicePath, fnSuccess, fnError,
      // sRequetstType, oPayload,
      // bNoAbort, fnBeforeSend)
      this._executeAjax(sServicePath, _fnSuccess, fnError, "GET", null, true,
          null);
    },

    /**
     * internal map to store the pending request
     */
    _mRequestsByServicePathCache : {},

    /**
     * Cancels pending requests for the given path
     * 
     * @param {string}
     *          sServicePath the path to which the service would write the data
     *          upon return.
     */
    cancelPendingRequestForServicePath : function(sServicePath) {
      if (this._mRequestsByServicePathCache[sServicePath]) {
        var oXhr = this._mRequestsByServicePathCache[sServicePath];
        oXhr.abort();
      }
    },

    _send : function(sServicePath, fnSuccess, fnError, oData,
        sModelDataFileName) {
      var oPayload = {};
      this._executeAjax(sServicePath, fnSuccess, fnError, "GET", oPayload,
          sModelDataFileName);
    },

    _executeAjax : function(sServicePath, fnSuccess, fnError, sRequetstType,
        oPayload, bNoAbort, fnBeforeSend) {
      var oAjax, that;
      // abort the pending service if required.
      if (!bNoAbort) {
        this.cancelPendingRequestForServicePath(sServicePath);
      }

      var sMyRequestType = sRequetstType || "GET";

      // Check if payload was set and change it to a string values
      var sPayload = "";
      if (oPayload !== null) {
        sPayload = JSON.stringify(oPayload);
      }

      $.sap.log.debug("Requesting service path '" + sServicePath + "'");
      var sAjaxUrl = sServicePath;
      that = this;
      $.sap.log.info("the request type is " + sRequetstType
          + " and json payload is" + sPayload);
      this._mRequestsByServicePathCache[sServicePath] = oAjax = $.ajax({// store
        // ajax
        // request in
        // request cache.
        type : sMyRequestType,
        contentType : "application/json",
        url : sAjaxUrl,
        data : sPayload,
        dataType : "json",
        beforeSend : fnBeforeSend,
        async : false,
        success : function(oData, textStatus, jqXHR) {
          $.sap.log.debug("Success: The server send the following response: "
              + JSON.stringify(oData));

          // Call nested function
          if (fnSuccess) {
            fnSuccess(oData);
          }

          // Reset request cache
          that._mRequestsByServicePathCache[sServicePath] = null;
        },
        error : function(XMLHttpRequest, textStatus, errorThrown) {
          if (textStatus == 'abort') {
            // The request has been aborted, probably by the facade because a
            // new
            // request to the same URL has been triggered, so we
            // don't need to do anything.
            $.sap.log.debug("Request to service path '" + sServicePath
                + "' aborted");
          } else {
            $.sap.log.fatal("Error: The following problem occurred: "
                + textStatus, XMLHttpRequest.responseText + ","
                + XMLHttpRequest.status + "," + XMLHttpRequest.statusText);

            // Call nested function
            if (fnError) {
              fnError(XMLHttpRequest, textStatus, errorThrown);
            }
          }

          // Reset request cache
          that._mRequestsByServicePathCache[sServicePath] = null;
        }

      }, this);

      if (sAjaxUrl !== undefined) {
        $.sap.log.debug("Request send to URL: " + sAjaxUrl);
      }

      return oAjax;
    }
  });

}());