medApp = {};
medApp.global = {};
medApp.global.config = {};
medApp.global.config.applicationMode = true;

medApp.global.config.development = {
  base : "http://vendorbookingdemo.aimersinfosoft.com/",
  endPoints : {
    vendorData : "assets/data/",
    vendorDataList : "assets/data/vendorsData.json",
    vendorDataDetail : "assets/data/vendorDetailData.json",
    vendorCatList : "assets/data/vendorCatList.json",
    vendorTileCatList : "assets/data/vendorCatTileList.json",
    vendorAvailbleTime : "assets/data/vendorTimeData.json"
  },
  user : {}
};

medApp.global.config.production = {
  base : "http://vendorbookingdemo.aimersinfosoft.com/",
  endPoints : {
    vendorData : "MasterServlet?AimAction=",
    vendorDataList : "assets/data/vendorsData.json",
    vendorDataDetail : "assets/data/vendorDetailData.json",
    vendorCatList : "MasterServlet?AimAction=getVendorCategory&INTENT=1&UID=1",
    vendorTileCatList : "assets/data/vendorCatTileList.json",
    vendorAvailbleTime : "assets/data/vendorTimeData.json",
  }
};
medApp.global.config.user = {
  Address : {
    LATIT : 12.9715742,
    LONGT : 77.6806213
  }
};

medApp.global.config.endPoint = function() {
  var obj = {};
  var mode = medApp.global.config.applicationMode ? "production"
      : "development";
  for ( var index in medApp.global.config[mode]["endPoints"]) {
    obj[index] = medApp.global.config[mode]["base"]
        + medApp.global.config[mode]["endPoints"][index];
  }
  return obj;
}();
