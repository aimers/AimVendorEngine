jQuery.sap.require("sap.ui.medApp.formatter.formatHelper");
sap.ui.core.mvc.Controller
  .extend(
    "sap.ui.medApp.view.Booking",
    {

     onInit : function() {
      this.oModel = sap.ui.medApp.global.util.getMainModel();
      sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(
        this.onRouteMatched, this);
      if (!this.oModel.getProperty("/City")) {
       sap.ui.medApp.global.util.getAllCities();
      }
     },

     onRouteMatched : function(oEvent) {
      this.AddAppointmentUser = "";
      var oView = this.getView();
      if (oEvent.getParameter("name") === "bookings") {
       this.oLoginDetails = this.oModel.getProperty("/LoggedUser");
       this.oDate = oEvent.getParameter("arguments").date;
       oView.byId("dateTitle").setText(this.oDate);
       if (!this.oModel.getProperty("/vendorList")) {
        param = {
         "USRID" : this.oLoginDetails.USRID.toString()
        };
        sap.ui.medApp.global.util.loadVendorFILTERData(param);
        oView.setModel(this.oModel);
       }
       this.oEntities = oView.byId("entitySelect");
       var oSeletedItem = this.oEntities.getSelectedItem();
       if (!oSeletedItem) {
        this.oEntities.setSelectedItem(this.oEntities.getFirstItem());
        oSeletedItem = this.oEntities.getFirstItem();
       }
       var sPath = oSeletedItem.getBindingContext().sPath;
       this._getVendorRules(sPath);
       this._bindBookings(this);

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

     _getUser : function(sPath) {
      var oUserId = this.oModel.getProperty(sPath);
      oUserId = oUserId.USRID;

      var param = [ {
       "key" : "details",
       "value" : {
        "USRID" : oUserId
       }
      } ];
      sap.ui.medApp.global.util.getUsers(param);

      var patientBookingInfo = {
       "booking" : this.oModel.getProperty(sPath),
       "patient" : this.oModel.getProperty("/searchUser")

      };
      this.oModel.setProperty("/patientInfo", patientBookingInfo);
     },

     _bindBookings : function(that) {

      that._getVendorBookingHistory();
      var oVendorRules = that.oModel.getProperty("/vendorRules");
      var oBookingHistory = that.oModel.getProperty("/bookingHistory");
      if (oVendorRules[0])
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
          END : item.END,
          BOOKINGS : aBookings
         };

        });
        if (finalArray.length) {
         that.oModel.setProperty("/vendorRulesB", finalArray);
         that.oModel.refresh(true);
        }

       }
     },

     handleEntityChange : function(oEvent) {
      this._bindBookings(this);
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
      this._getUser(sPath);
      this._oPatientView.setModel(oModel);
      this._oPatientView.bindElement("/patientInfo");
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
      var _this = this;
      var fnSuccess = function(oData) {
       sap.m.MessageToast.show("Appointment Accepted");
       _this._bindBookings(_this);
      };
      fnError = function() {
       sap.m.MessageToast.show("Can't accept appointment");
      }
      var sPath = oEvent.getSource().getBindingContext().getPath();
      sap.ui.medApp.global.util.acceptBooking(this.oModel.getProperty(sPath),
        this.oLoginDetails.USRNM, fnSuccess, fnError);
     },

     handleRejectPress : function(oEvent) {
      var _this = this;
      var fnSuccess = function(oData) {
       sap.m.MessageToast.show("Appointment Cancelled");
       _this._bindBookings(_this);
      };
      fnError = function() {
       sap.m.MessageToast.show("Can't cancel appointment");
      }
      var sPath = oEvent.getSource().getBindingContext().getPath();
      sap.ui.medApp.global.util.cancelBooking(this.oModel.getProperty(sPath),
        this.oLoginDetails.USRNM, fnSuccess, fnError);
     },

     handleAddAppointment : function(oEvent) {

      var _this = this;
      var oItem = oEvent.getSource().getParent();
      _this.oBookingData = _this.oModel.getProperty(oItem.getBindingContext()
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

              var oEntity = _this.getView().byId("entitySelect")
                .getSelectedItem();
              var entityData = _this.oModel.getProperty(oEntity
                .getBindingContext().getPath());

              if (entityData) {

               oDate = _this.oDate;
               oDate = oDate.substring(6, 10) + "/" + oDate.substring(3, 5)
                 + "/" + oDate.substring(0, 2) + " 00:00:00";
               var param = [ {
                "key" : "details",
                "value" : {
                 "VSUID" : _this.oLoginDetails.USRID.toString(),
                 "VUTID" : "2",
                 "CUSID" : oData.USRID.toString(),
                 "CUTID" : "3",// oData.UTYID.toString(),
                 "CUEML" : oData.USRNM.toString(),
                 "ETYID" : entityData.ETYID.toString(),
                 "ETCID" : entityData.ETCID.toString(),
                 "ENTID" : entityData.ENTID.toString(),
                 "RULID" : entityData.RULID.toString(),
                 "VSEML" : _this.oLoginDetails.USRNM,
                 "BDTIM" : oDate,
                 "BTIMZ" : "IST",
                 "BOSTM" : _this.oBookingData.START.toString(),
                 "BOETM" : _this.oBookingData.END.toString(),
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
              }

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
      sap.ui.medApp.global.util.getAllUsers(param);

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
      var oUserName = sap.ui.getCore().byId("inputUserName");
      if (selectedButton === "sbExisting") {
       oUserName.setShowSuggestion(true);
      } else {
       oUserName.setShowSuggestion(false);
      }
     },

     _registerNewUser : function(email) {

     }

    });