jQuery.sap.require("sap.ui.medApp.formatter.formatHelper");
sap.ui.core.mvc.Controller
  .extend(
    "sap.ui.medApp.view.Booking",
    {
     // onInit
     // ******************************************
     onInit : function() {
      this.oModel = sap.ui.medApp.global.util.getMainModel();
      sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(
        this.onRouteMatched, this);
      if (!this.oModel.getProperty("/City")) {
       sap.ui.medApp.global.busyDialog.open();
       var fnSuccess = function(oData) {
       };
       sap.ui.medApp.global.util.getAllCities(fnSuccess);
      }
     },
     // onRouteMatched
     // ******************************************
     onRouteMatched : function(oEvent) {
 
      var sName = oEvent.getParameter("name");
      if (sName === "bookings") {
       this.oDate = oEvent.getParameter("arguments").date;
       this._showBookings();
      }
     },
     // onRouteMatched
     // ******************************************
     _showBookings : function() {
      var _this = this;
      var oView = _this.getView();
      _this.oLoginDetails = _this.oModel.getProperty("/LoggedUser");
      var fnSuccess = function() {
       _this.getView().setModel(_this.oModel);
       _this.AddAppointmentUser = "";
       oView.byId("dateTitle").setText(_this.oDate);
       _this.oEntities = oView.byId("entitySelect");
       var oSeletedItem = _this.oEntities.getSelectedItem();
       if (!oSeletedItem) {
        _this.oEntities.setSelectedItem(_this.oEntities.getFirstItem());
        oSeletedItem = _this.oEntities.getFirstItem();
       }
       var sPath = oSeletedItem.getBindingContext().sPath;
       _this._getVendorRules(sPath);
       oView.setModel(_this.oModel);
      }
      var param = [ {
       "key" : "INTENT",
       "value" : "1"
      }, {
       "key" : "UID",
       "value" : _this.oLoginDetails.USRID.toString()
      } ];
      sap.ui.medApp.global.util.loadVendorCategory(param, fnSuccess);
     },
     // _getVendorBookingHistory
     // ******************************************
     _getVendorBookingHistory : function(fnSuccess) {
      var param = [ {
       "key" : "details",
       "value" : {
        "VSUID" : this.oLoginDetails.USRID,
        "VUTID" : this.oLoginDetails.UTYID,
        "BDTIM" : this.oDate
       }
      } ];
      sap.ui.medApp.global.util.loadVendorBookingHistory(param, fnSuccess);
     },
     // _getVendorRules
     // ******************************************
     _getVendorRules : function(sPath) {
      var _this = this;
      var oView = _this.getView();
      var param = {
       "USRID" : _this.oLoginDetails.USRID,
       "RULID" : '"1","2"',// Now hard coded in query as
       // RULID in (1,2,3)
       "ETYID" : _this.oModel.getProperty(sPath + "/ETYID"),
       "ETCID" : _this.oModel.getProperty(sPath + "/ETCID"),
       "ENTID" : oView.byId("entitySelect").getSelectedKey(),
       "STDATE" : _this.oDate,
       "ENDATE" : _this.oDate
      };
      var fnSuccess = function() {
       _this._bindBookings(_this);
      }

      sap.ui.medApp.global.util.loadVendorRules(param, fnSuccess);
     },
     // _getUser
     // ******************************************
     _getUser : function(sPath) {
      var _this = this;
      var oUserId = this.oModel.getProperty(sPath);
      oUserId = oUserId.USRID;

      var fnSuccess = function() {
       var patientBookingInfo = {
        "booking" : _this.oModel.getProperty(sPath),
        "patient" : _this.oModel.getProperty("/searchUser")
       };
       _this.oModel.setProperty("/patientInfo", patientBookingInfo);
      };
      var param = [ {
       "key" : "details",
       "value" : {
        "USRID" : oUserId
       }
      } ];
      sap.ui.medApp.global.util.getUsers(param, fnSuccess);
     },
     // _bindBookings
     // ******************************************
     _bindBookings : function(that) {
      var finalArray;
      var fnSuccess = function() {
       var oVendorRules = that.oModel.getProperty("/vendorRules");
       var oBookingHistory = that.oModel.getProperty("/bookingHistory");
       if (oVendorRules[0])
        if (oVendorRules[0].TimeSlots) {
         sap.ui.medApp.global.busyDialog.open();
         finalArray = oVendorRules[0].TimeSlots.map(function(item) {
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
             ETCID : oBookingHistory[item1].ETCID,
             USRNM : oBookingHistory[item1].USRNM,
             BTYPE : oBookingHistory[item1].BTYPE,
             BNOTE : oBookingHistory[item1].BNOTE
            })
           }
          }
          return {
           START : item.START,
           END : item.END,
           RULID : item.RULID,
           BOOKINGS : aBookings
          };
         });
        }
       if (finalArray) {
        if (finalArray.length)
         that.oModel.setProperty("/vendorRulesB", finalArray);
        else
         that.oModel.setProperty("/vendorRulesB", []);
       } else {
        that.oModel.setProperty("/vendorRulesB", []);
       }
       sap.ui.medApp.global.busyDialog.close();
       that.oModel.refresh(true);
      };
      that._getVendorBookingHistory(fnSuccess);
     },
     // handleEntityChange
     // ******************************************
     handleEntityChange : function(oEvent) {
      this._showBookings();
     },
     // navBack
     // ******************************************
     navBack : function() {
      var bReplace = jQuery.device.is.phone ? false : true;
      sap.ui.core.UIComponent.getRouterFor(this).navTo("bookinghome", {},
        bReplace);
     },
     // handlePatientViewPress
     // ******************************************
     handlePatientViewPress : function(oEvent) {
      var sPath = oEvent.getSource().getBindingContext().sPath;
      this.openPatientView(oEvent, this.oModel, sPath);
     },
     // openPatientView
     // ******************************************
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
     // createPopover
     // ******************************************
     createPopover : function() {
      if (!this._oPatientView) {
       this._oPatientView = sap.ui.xmlfragment(
         "sap.ui.medApp.view.PatientView", this);
       this.getView().addDependent(this._oPatientView);
      }
     },
     // onExit
     // ******************************************
     onExit : function() {
      if (this._oPatientView) {
       this._oPatientView.destroy();
      }
     },
     // handleApprovePress
     // ******************************************
     handleApprovePress : function(oEvent) {
      sap.ui.medApp.global.busyDialog.open();
      var _this = this;
      var fnSuccess = function(oData) {
       sap.ui.medApp.global.busyDialog.close();
       sap.m.MessageToast.show("Appointment Accepted");
       _this._bindBookings(_this);
      };
      fnError = function() {
       sap.m.MessageToast.show("Can't accept appointment");
       sap.ui.medApp.global.busyDialog.close();
      }
      var sPath = oEvent.getSource().getBindingContext().getPath();
      sap.ui.medApp.global.util.acceptBooking(this.oModel.getProperty(sPath),
        this.oLoginDetails.USRNM, fnSuccess, fnError);
     },
     // handleRejectPress
     // ******************************************
     handleRejectPress : function(oEvent) {
      sap.ui.medApp.global.busyDialog.open();
      var _this = this;
      var fnSuccess = function(oData) {
       sap.ui.medApp.global.busyDialog.close();
       sap.m.MessageToast.show("Appointment Rejected");
       _this._bindBookings(_this);
      };
      fnError = function() {
       sap.ui.medApp.global.busyDialog.close();
       sap.m.MessageToast.show("Can't cancel appointment");
      }
      var sPath = oEvent.getSource().getBindingContext().getPath();
      sap.ui.medApp.global.util.cancelBooking(this.oModel.getProperty(sPath),
        this.oLoginDetails.USRNM, fnSuccess, fnError);
     },
     // handleAddAppointment
     // ******************************************
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
             id : "btnSaveBooking",
             icon : "sap-icon://save",
             enabled : false,
             text : "{i18n>SAVE_BUTTON}",
             press : function() {
              var sPath, oData, oDate;
              var oUserSelection = sap.ui.getCore().byId("userSelectButton");
              // Existing User
              if (oUserSelection.getSelectedButton() === "sbExisting") {

               if (!_this.validateExistingUser()) {
                sap.ui.getCore().byId("MessageBox").setVisible(true);
                sap.ui.getCore().byId("MessageBox").setText("Invalid Username");
               } else {
                sap.ui.medApp.global.busyDialog.open();
                sap.ui.getCore().byId("MessageBox").setVisible(false);
                sap.ui.getCore().byId("MessageBox").setText("");
                var oMobile = sap.ui.getCore().byId("inputExtMobile");
                sPath = oMobile.getCustomData()[0].getValue();
                oData = _this.oModel.getProperty(sPath);
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
                   "RULID" : _this.oBookingData.RULID.toString(),
                   "VSEML" : _this.oLoginDetails.USRNM,
                   "BDTIM" : oDate,
                   "BTIMZ" : "IST",
                   "BOSTM" : _this.oBookingData.START.toString(),
                   "BOETM" : _this.oBookingData.END.toString(),
                   "RTYPE" : "1",
                   "BTYPE" : "1",
                   "BNOTE" : ""
                  }
                 } ];

                 var fnSuccess = function(oData) {
                  if (oData.results) {
                   _this.resetExistingUser();
                   _this._bindBookings(_this);
                   sap.m.MessageToast.show("Appointment Booked");
                  } else {
                   sap.ui.medApp.global.busyDialog.close();
                   sap.m.MessageToast
                     .show("An error occured while booking appointment");
                  }
                 };
                 var fnError = function(oData) {
                  sap.ui.medApp.global.busyDialog.close();
                  sap.m.MessageToast
                    .show("An error occured while booking appointment");
                 };

                 this._vendorListServiceFacade = new sap.ui.medApp.service.vendorListServiceFacade(
                   this.oModel);
                 this._vendorListServiceFacade.updateParameters(param,
                   fnSuccess, fnError, "book");
                 _this.Appointmentdialog.close();
                }
               }

               // New User
              } else {

               if (!_this.validateNewUser()) {
                sap.ui.getCore().byId("MessageBox").setVisible(true);
                sap.ui.getCore().byId("MessageBox").setText(
                  "Invalid values found");
               } else {
                sap.ui.medApp.global.busyDialog.open();
                sap.ui.getCore().byId("MessageBox").setVisible(false);
                sap.ui.getCore().byId("MessageBox").setText("");
                var oFname = sap.ui.getCore().byId("inputFname");
                var oLname = sap.ui.getCore().byId("inputLname");
                var oMobile = sap.ui.getCore().byId("inputUserName");
                var oPassword = sap.ui.getCore().byId("inputPassword");
                var param = [ {
                 "key" : "details",
                 "value" : {
                  "USRNM" : oMobile.getValue().toString(),
                  "UTYID" : "3",
                  "PRFIX" : "",
                  "UERPW" : oPassword.getValue().toString(),
                  "TITLE" : "",
                  "FRNAM" : oFname.getValue().toString(),
                  "LTNAM" : oLname.getValue().toString(),
                  "URDOB" : "1900/01/01",
                  "GENDR" : "2",
                  "DSPNM" : ""
                 }
                } ];
                var fnSuccess = function(oData) {
                 oData = oData.results;
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
                    "RULID" : _this.oBookingData.RULID.toString(),
                    "VSEML" : _this.oLoginDetails.USRNM,
                    "BDTIM" : oDate,
                    "BTIMZ" : "IST",
                    "BOSTM" : _this.oBookingData.START.toString(),
                    "BOETM" : _this.oBookingData.END.toString(),
                    "RTYPE" : "1",
                    "BTYPE" : "1",
                    "BNOTE" : ""
                   }
                  } ];

                  var fnSuccess = function(oData) {

                   _this._bindBookings(_this);
                   _this.resetNewUser();
                   sap.m.MessageToast.show("Appointment Booked");
                  };
                  var fnError = function(oData) {
                   sap.ui.medApp.global.busyDialog.close();
                   sap.m.MessageToast
                     .show("Error occured while booking appointment");
                  };

                  this._vendorListServiceFacade = new sap.ui.medApp.service.vendorListServiceFacade(
                    this.oModel);
                  this._vendorListServiceFacade.updateParameters(param,
                    fnSuccess, fnError, "book");
                  _this.Appointmentdialog.close();
                 }
                };
                sap.ui.medApp.global.util.getRegisterData(param, fnSuccess);
               }

              }

             }
            }),
          endButton : new sap.m.Button({
           text : "{i18n>CANCEL_BUTTON}",
           icon : "sap-icon://sys-cancel",
           press : function(oEvent) {
            _this.resetExistingUser();
            _this.resetNewUser();
            sap.ui.getCore().byId("MessageBox").setVisible(false);
            sap.ui.getCore().byId("MessageBox").setText("");
            _this.Appointmentdialog.close();
           }
          })
         });
       // to get access to the global model
       _this.getView().addDependent(this.Appointmentdialog);
      }
      _this.Appointmentdialog.open();
     },
     // userSuggestHandle
     // ******************************************
     userSuggestHandle : function(oEvent) {
      var _this = this;
      var source = oEvent.getSource();
      var oMobile = sap.ui.getCore().byId("inputExtMobile");

      var param = [ {
       "key" : "details",
       "value" : {
        "USRNM" : oMobile.getValue().toString()
       }
      } ];
      var fnSuccess = function() {
       source.bindAggregation("suggestionItems", "/allUsers",
         new sap.ui.core.Item({
          text : "{USRNM}"
         }));
       sap.ui.medApp.global.busyDialog.close();

       sap.ui.getCore().byId("btnSaveBooking").setEnabled(false);

      }
      sap.ui.medApp.global.busyDialog.open();
      sap.ui.medApp.global.util.getAllUsers(param, fnSuccess);

     },
     // userSelectedHandle
     // ******************************************
     userSelectedHandle : function(oEvent) {
      var oMobile = oEvent.getSource();
      var oSave = sap.ui.getCore().byId("btnSaveBooking");
      var sPath = oMobile._oList.getSelectedItem()._oItem.getBindingContext()
        .getPath();
      oMobile.removeAllCustomData();
      oMobile.addCustomData(new sap.ui.core.CustomData({
       key : "path",
       value : sPath
      }));
      oSave.setEnabled(true);
     },
     // handleUserSelection
     // ******************************************
     handleUserSelection : function(oEvent) {
      var selectedButton = oEvent.getSource().getSelectedButton();
      var extUser = sap.ui.getCore().byId("extUser");
      var newUser = sap.ui.getCore().byId("newUser");
      if (selectedButton === "sbExisting") {
       this.resetExistingUser();
       extUser.setVisible(true);
       newUser.setVisible(false);
      } else {
       this.resetNewUser();
       extUser.setVisible(false);
       newUser.setVisible(true);
      }
     },

     resetExistingUser : function() {
      var oSave = sap.ui.getCore().byId("btnSaveBooking");
      var oMobile = sap.ui.getCore().byId("inputExtMobile");
      oMobile.setValue("");
      oMobile.setValueState(sap.ui.core.ValueState.None);
      oSave.setEnabled(false);
     },

     resetNewUser : function() {
      var oSave = sap.ui.getCore().byId("btnSaveBooking");
      var oFname = sap.ui.getCore().byId("inputFname");
      var oLname = sap.ui.getCore().byId("inputLname");
      var oMobile = sap.ui.getCore().byId("inputUserName");
      var oPassword = sap.ui.getCore().byId("inputPassword");
      oFname.setValue("");
      oLname.setValue("");
      oMobile.setValue("");
      oPassword.setValue("");
      oFname.setValueState(sap.ui.core.ValueState.None);
      oLname.setValueState(sap.ui.core.ValueState.None);
      oMobile.setValueState(sap.ui.core.ValueState.None);
      oPassword.setValueState(sap.ui.core.ValueState.None);
      oSave.setEnabled(true);
     },

     validateExistingUser : function() {
      var oMobile = sap.ui.getCore().byId("inputExtMobile");
      var re = /^[0-9]{10}$/;
      if (re.test(oMobile.getValue())) {
       oMobile.setValueState(sap.ui.core.ValueState.None);

       return true;
      } else {
       oMobile.setValueState(sap.ui.core.ValueState.Error);
       return false;
      }
     },

     validateNewUser : function() {
      var regxRequired = /([^\s])/;
      var regxEmail = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
      var regxMobile = /^[0-9]{10}$/;
      var oSave = sap.ui.getCore().byId("btnSaveBooking");
      var oFname = sap.ui.getCore().byId("inputFname");
      var oLname = sap.ui.getCore().byId("inputLname");
      var oMobile = sap.ui.getCore().byId("inputUserName");
      var oPassword = sap.ui.getCore().byId("inputPassword");

      var invalidInputs = 0;

      if (regxRequired.test(oFname.getValue())) {
       oFname.setValueState(sap.ui.core.ValueState.None);
      } else {
       oFname.setValueState(sap.ui.core.ValueState.Error);
       invalidInputs++;
      }

      if (regxRequired.test(oLname.getValue())) {
       oLname.setValueState(sap.ui.core.ValueState.None);
      } else {
       oLname.setValueState(sap.ui.core.ValueState.Error);
       invalidInputs++;
      }

      if (regxMobile.test(oMobile.getValue())) {
       oMobile.setValueState(sap.ui.core.ValueState.None);
      } else {
       oMobile.setValueState(sap.ui.core.ValueState.Error);
       invalidInputs++;
      }
      if (regxRequired.test(oPassword.getValue())) {
       oPassword.setValueState(sap.ui.core.ValueState.None);
      } else {
       oPassword.setValueState(sap.ui.core.ValueState.Error);
       invalidInputs++;
      }
      if (invalidInputs) {
       return false;
      } else {
       return true;
      }
     },

     handleNotifyUser : function(oEvent) {

      var oSource = oEvent.getSource();
      var sPath = oSource.getBindingContext().getPath();
      var oData = this.oModel.getProperty(sPath);
      var _this = this;
      var oDate = oData.BDTIM.toString().substring(8, 10) + "/"
        + oData.BDTIM.toString().substring(5, 7) + "/"
        + oData.BDTIM.toString().substring(0, 4);
      var oMsg = "Your appointment with doctor " + oData.VPREFIX + " "
        + oData.VFRNAM + " " + oData.VLTNAM + " is scheduled on Date: " + oDate
        + " Time: " + oData.BOSTM;
      _this.cusId = oData.CUSID.toString();
      if (!_this.notifyDialog) {
       _this.notifyDialog = new sap.m.Dialog({
        title : 'Notify',
        type : 'Message',
        content : [ new sap.m.TextArea('notifyTA', {
         width : '100%',
         placeholder : 'Add note (optional)',
         value : oMsg

        }) ],
        beginButton : new sap.m.Button({
         text : 'Send',
         press : function() {
          var sText = sap.ui.getCore().byId('notifyTA').getValue();
          var param = [ {
           "key" : "details",
           "value" : {
            "USRID" : _this.cusId.toString(),
            "MESSAGE" : sText.toString()
           }
          } ];

          var fnSuccess = function(oData) {
           sap.ui.medApp.global.busyDialog.close();
           sap.m.MessageToast.show("Notification sent");
           _this.notifyDialog.close();
          };

          var fnError = function() {
           sap.ui.medApp.global.busyDialog.close();
           sap.m.MessageToast
             .show('An error occured while sending notification');
           _this.notifyDialog.close();
          };
          sap.ui.medApp.global.busyDialog.open();
          sap.ui.medApp.global.util.notifyUser(param, fnSuccess, fnError);
         }
        }),
        endButton : new sap.m.Button({
         text : 'Cancel',
         press : function() {
          _this.notifyDialog.close();
         }
        }),
        afterClose : function() {
         _this.notifyDialog.destroy();
         _this.notifyDialog = undefined;
        }
       });
      }
      _this.notifyDialog.open();
     }
    });