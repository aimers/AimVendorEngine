jQuery.sap.require("sap.ui.medApp.formatter.formatHelper");
sap.ui.core.mvc.Controller
  .extend(
    "sap.ui.medApp.view.Booking",
    {

     onInit : function() {
      this.oModel = sap.ui.medApp.global.util.getMainModel();
      sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(
        this.onRouteMatched, this);
     },

     onRouteMatched : function(oEvent) {
      this.AddAppointmentUser = "";
      var oView = this.getView();
      if (oEvent.getParameter("name") === "bookings") {

       if (!this.oModel.getProperty("/vendorList")) {
        param = {
         "USRID" : this.oModel.getProperty("/LoggedUser/USRID")
        };
        sap.ui.medApp.global.util.loadVendorFILTERData(param);
        oView.setModel(this.oModel);
       }
       this.oLoginDetails = this.oModel.getProperty("/LoggedUser");
       this.oDate = oEvent.getParameter("arguments").date;
       this.oEntities = oView.byId("entitySelect");
       var oSeletedItem = this.oEntities.getSelectedItem();
       if (!oSeletedItem) {
        this.oEntities.setSelectedItem(this.oEntities.getFirstItem());
        oSeletedItem = this.oEntities.getFirstItem();
       }
       var sPath = oSeletedItem.getBindingContext().sPath;
       this._getVendorRules(sPath);
       this._getVendorBookingHistory();
       this._bindBookings(this);
       oView.byId("dateTitle").setText(this.oDate);

      }
      oView.setModel(this.oModel);
     },

     _getVendorBookingHistory : function() {
      var param = [ {
       "key" : "details",
       "value" : {
        "VSUID" : this.oLoginDetails.USRID,
        "VUTID" : this.oLoginDetails.UTYID,
        "BDTIM" : this.oDate
       }
      } ];
      sap.ui.medApp.global.util.loadVendorBookingHistory(param);
     },

     _getVendorRules : function(sPath) {
      var oView = this.getView();
      var param = {
       "USRID" : this.oLoginDetails.USRID,
       "RULID" : this.oModel.getProperty(sPath + "/RULID"),
       "ETYID" : this.oModel.getProperty(sPath + "/ETYID"),
       "ETCID" : this.oModel.getProperty(sPath + "/ETCID"),
       "ENTID" : oView.byId("entitySelect").getSelectedKey(),
       "STDATE" : this.oDate,
       "ENDATE" : this.oDate
      };
      sap.ui.medApp.global.util.loadVendorRules(param);
     },

     _bindBookings : function(that) {
      var oVendorRules = that.oModel.getProperty("/vendorRules");
      var oBookingHistory = that.oModel.getProperty("/bookingHistory");
      if (oVendorRules[0].TimeSlots) {
       var finalArray = oVendorRules[0].TimeSlots.map(function(item) {
        var aBookings = [];
        for (item1 in oBookingHistory) {
         if (item.START === oBookingHistory[item1].BOSTM) {

          aBookings.push({
           DSPNM : oBookingHistory[item1].DSPNM,
           STATS : oBookingHistory[item1].STATS,
           VLTNAM : oBookingHistory[item1].VLTNAM,
           URDOB : oBookingHistory[item1].URDOB,
           URCOD : oBookingHistory[item1].URCOD,
           VURDOB : oBookingHistory[item1].VURDOB,
           VURCOD : oBookingHistory[item1].VURCOD,
           VTRMI : oBookingHistory[item1].VTRMI,
           ETYID : oBookingHistory[item1].ETYID,
           BOETM : oBookingHistory[item1].BOETM,
           VPREFIX : oBookingHistory[item1].VPREFIX,
           ENTID : oBookingHistory[item1].ENTID,
           BOSTM : oBookingHistory[item1].BOSTM,
           VFRNAM : oBookingHistory[item1].VFRNAM,
           USRID : oBookingHistory[item1].USRID,
           VTITLE : oBookingHistory[item1].VTITLE,
           VGENDR : oBookingHistory[item1].VGENDR,
           CUSID : oBookingHistory[item1].CUSID,
           LTNAM : oBookingHistory[item1].LTNAM,
           CUTID : oBookingHistory[item1].CUTID,
           RTYPE : oBookingHistory[item1].RTYPE,
           VUSRID : oBookingHistory[item1].VUSRID,
           BTIMZ : oBookingHistory[item1].BTIMZ,
           FRNAM : oBookingHistory[item1].FRNAM,
           VDSPNM : oBookingHistory[item1].VDSPNM,
           RULID : oBookingHistory[item1].RULID,
           VSUID : oBookingHistory[item1].VSUID,
           VUTID : oBookingHistory[item1].VUTID,
           BDTIM : oBookingHistory[item1].BDTIM,
           GENDR : oBookingHistory[item1].GENDR,
           TITLE : oBookingHistory[item1].TITLE,
           ETCID : oBookingHistory[item1].ETCID

          })
         }

        }
        return {
         START : item.START,
         ETYID : item.ETYID,
         ETCID : item.ETCID,
         ENTID : item.ENTID,
         RULID : item.RULID,
         BTIMZ : item.BTIMZ,
         BOSTM : item.BOSTM,
         BOETM : item.BOETM,
         BOOKINGS : aBookings
        };

       });
       that.oModel.setProperty("/vendorRules", finalArray);
      }
     },

     handleEntityChange : function() {

     },

     navBack : function() {
      var bReplace = jQuery.device.is.phone ? false : true;
      sap.ui.core.UIComponent.getRouterFor(this).navTo("bookinghome", {},
        bReplace);
     },

     handlePatientViewPress : function(oEvent) {
      var sPath = oEvent.getSource().getBindingContext().sPath;
      this.openPatientView(oEvent, this.oModel, sPath);
     },

     openPatientView : function(oEvent, oModel, sPath) {
      this.createPopover();
      this._oPatientView.setModel(oModel);
      this._oPatientView.bindElement(sPath);
      var oButton = oEvent.getSource();
      jQuery.sap.delayedCall(0, this, function() {
       this._oPatientView.openBy(oButton);
      });
     },

     createPopover : function() {
      if (!this._oPatientView) {
       this._oPatientView = sap.ui.xmlfragment(
         "sap.ui.medApp.view.PatientView", this);
       this.getView().addDependent(this._oPatientView);
      }
     },

     onExit : function() {
      if (this._oPatientView) {
       this._oPatientView.destroy();
      }
     },

     handleApprovePress : function(oEvent) {

     },

     handleRejectPress : function(oEvent) {

     },

     handleAddAppointment : function(oEvent) {

      var _this = this;
      var oItem = oEvent.getSource().getParent();
      var oBookingData = _this.oModel.getProperty(oItem.getBindingContext()
        .getPath());

      if (!_this.Appointmentdialog) {

       _this.Appointmentdialog = new sap.m.Dialog(
         {
          title : "{i18n>BOOK_APPOINTMENT}",
          content : sap.ui.xmlfragment("sap.ui.medApp.view.AddAppointment",
            this),
          beginButton : new sap.m.Button(
            {
             text : "{i18n>SAVE_BUTTON}",
             press : function() {
              var sPath, oData, oDate;
              var oUserName = sap.ui.getCore().byId("inputUserName");
              if (oUserName.getShowSuggestion()) {
               sPath = oUserName.getCustomData()[0].getValue();
               oData = _this.oModel.getProperty(sPath);

              } else {
               oData = _this._registerNewUser(oUserName.getValue());
              }
              oDate = _this.oDate.replace(/-/g, "/").toString() + " 00:00:00";
              var param = [ {
               "key" : "details",
               "value" : {
                "VSUID" : _this.oLoginDetails.USRID.toString(),
                "VUTID" : "2",
                "CUSID" : oData.USRID.toString(),
                "CUTID" : oData.UTYID.toString(),
                "CUEML" : oData.USRNM.toString(),
                "ETYID" : "1",// oBookingData.ETYID.toString(),
                "ETCID" : oBookingData.ETCID.toString(),
                "ENTID" : oBookingData.ENTID.toString(),
                "RULID" : oBookingData.RULID.toString(),
                "VSEML" : _this.oLoginDetails.USRNM,
                "BDTIM" : oDate,
                "BTIMZ" : oBookingData.BTIMZ.toString(),
                "BOSTM" : oBookingData.BOSTM.toString(),
                "BOETM" : oBookingData.BOETM.toString(),
                "RTYPE" : "1"
               }
              } ];
              var fnSuccess = function(oData) {
               sap.m.MessageToast.show("Appointment Booked");
               _this._bindBookings(_this);
              };
              this._vendorListServiceFacade = new sap.ui.medApp.service.vendorListServiceFacade(
                this.oModel);
              this._vendorListServiceFacade.updateParameters(param, fnSuccess,
                null, "book");
              oUserName.setValue("");
              _this.Appointmentdialog.close();
             }
            }),
          endButton : new sap.m.Button({
           text : "{i18n>CANCEL_BUTTON}",
           press : function() {
            var oUserName = sap.ui.getCore().byId("inputUserName");
            oUserName.setValue("");
            _this.Appointmentdialog.close();
           }
          })
         });
       // to get access to the global model
       _this.getView().addDependent(this.Appointmentdialog);
      }

      _this.Appointmentdialog.open();
     },

     userSuggestHandle : function(oEvent) {
      var param = [ {
       "key" : "details",
       "value" : {}
      } ];
      sap.ui.medApp.global.util.getUsers(param);

      oEvent.getSource().bindAggregation("suggestionItems", "/allUsers",
        new sap.ui.core.Item({
         text : "{USRNM}"
        }));
     },

     userSelectedHandle : function(oEvent) {
      var oUserName = oEvent.getSource();
      var sPath = oUserName._oList.getSelectedItem()._oItem.getBindingContext()
        .getPath();
      oUserName.removeAllCustomData();
      oUserName.addCustomData(new sap.ui.core.CustomData({
       key : "path",
       value : sPath
      }));

     },

     handleUserSelection : function(oEvent) {
      var selectedButton = oEvent.getSource().getSelectedButton();
      var oUserName = this.Appointmentdialog.byId("inputUserName");
      if (selectedButton === "sbExisting") {
       oUserName.setShowSuggestion(true);
      } else {
       oUserName.setShowSuggestion(false);
      }
     },
     _registerNewUser : function(email) {

     }

    });