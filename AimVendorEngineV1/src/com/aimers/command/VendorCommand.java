package com.aimers.command;

import java.sql.ResultSet;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;

import com.aimers.dbaccess.ConnectionManager;
import com.aimers.utils.Convertor;

public class VendorCommand extends aimCommand {

	@SuppressWarnings("null")
	@Override
	public Object execute(HashMap myInfo, ConnectionManager dbcon) {
		// TODO Auto-generated method stub
		//STEP 1: get subaction info from myInfo // TODO
		String aimAction = (String) myInfo.get("AimAction");
		//STEP 2: goto respective methods base on subaction // TODO
		if(aimAction.equals("getVendorCategory")){
			return getVendorCategory(myInfo, dbcon);
		}else if(aimAction.equals("getVendorData")){
			return getVendorData(myInfo, dbcon);
		}else if(aimAction.equals("getVendorRuleDetail")){
			return getVendorRuleDetail(myInfo, dbcon);
		}else if(aimAction.equals("getUniqueAddress")){
			return getUniqueAddress(myInfo, dbcon);
		}else if(aimAction.equals("getAllCities")){
			return getAllCities(myInfo, dbcon);
		}else if(aimAction.equals("getCharList")){
			return getCharList(myInfo, dbcon);
		}
		return new JSONObject();

	}

	private Object getCharList(HashMap myInfo, ConnectionManager dbcon) {
		ResultSet rs=null;
		try{
			if(dbcon == null){
				try{
					dbcon.Connect("MYSQL");
				}
				catch(Exception ex){
					System.out.println(""+ex);
				}
			}
			String query =
			" SELECT `chrmt`.`CHRID`, `chrmt`.`DESCR`, `chrmt`.`REGXT`, "
			+ " `chrmt`.`MDTEXT`, `chrmt`.`LNTXT`, `chrmt`.`SRTXT`, "
			+ " `chrmt`.`LOGOI`, `chrmt`.`ACTIV`, `chrmt`.`CRTDT`, "
			+ " `chrmt`.`CHNDT`, `chrmt`.`CRTBY`, `chrmt`.`CHNBY` FROM `bookingdb`.`chrmt` ";
			
			System.out.println(query);
			rs=dbcon.stm.executeQuery(query);
			return Convertor.convertToJSON(rs);
		}
		catch(Exception ex){
			System.out.println("Error from VENDOR Cities Command "+ex +"==dbcon=="+dbcon);
			return null;
		}
	}

	private Object getAllCities(HashMap myInfo, ConnectionManager dbcon) {
		ResultSet rs=null;
		try{
			if(dbcon == null){
				try{
					dbcon.Connect("MYSQL");
				}
				catch(Exception ex){
					System.out.println(""+ex);
				}
			}
			String query =
			" SELECT `ctymt`.`CTYID`, `ctymt`.`CTYNM`, `ctymt`.`STTID`, "
			+ " `ctymt`.`ACTIV`, `ctymt`.`CRTDT`, `ctymt`.`CRTBY`, "
			+ "`ctymt`.`CHNDT`, `ctymt`.`CHNBY` FROM `bookingdb`.`ctymt` ";
			
			System.out.println(query);
			rs=dbcon.stm.executeQuery(query);
			return Convertor.convertToJSON(rs);
		}
		catch(Exception ex){
			System.out.println("Error from VENDOR Cities Command "+ex +"==dbcon=="+dbcon);
			return null;
		}
	}

	private Object getUniqueAddress(HashMap myInfo, ConnectionManager dbcon) {
		// TODO: Add skip/top
		String etyid =  myInfo.get("ETYID")+"";
		String etcid =  myInfo.get("ETCID")+"";
		String entid =  myInfo.get("ENTID")+"";
		ResultSet rs=null;
		try{
			if(dbcon == null){
				try{
					dbcon.Connect("MYSQL");
				}
				catch(Exception ex){
					System.out.println(""+ex);
				}
			}
			String query =
			" SELECT `usrmt`.`USRID`, "+
			" `uadmp`.`PRIMR`, "+
			" `addmt`.`STREET`, "+
			" `addmt`.`LNDMK`, "+
			" `addmt`.`LOCLT`, "+
			" `addmt`.`CTYID`, "+
			" `ctymt`.`CTYNM`, "+
			" `addmt`.`PINCD`, "+
			" `addmt`.`LONGT`, "+
			" `addmt`.`LATIT` "+
			" FROM `usrmt` "+ 
			"  left outer join "+
			" `uetmp` "+
			"  on "+
			" `usrmt`.`USRID` = `uetmp`.`USRID` "+
			" left outer join "+
			" `uadmp` "+
			" on "+
			" `usrmt`.`USRID` = `uadmp`.`USRID` "+
			" left outer join "+
			" `addmt` "+
			" on "+
			" `addmt`.`ADRID` = `uadmp`.`ADRID` "
			+ "left outer join  `ctymt`  "
			+ " on  "
			+ " `addmt`.`CTYID` = `ctymt`.`CTYID`"+
			//" left outer join `BOOKINGDB`.`VEMPT`  "+
			//" on  `usrmt`.`USRID` = `VEMPT`.`USRID`   "+
			" where `uetmp`.ACTIV = 1 and `uetmp`.UTYID = 2 ";
			//+ "and "
			//		+ " `VEMPT`.`ETYID` in (\""
			//		+entid+"\") ";
			
			/*if(!etcid.equals("null")){
				query += " and `VEMPT`.`ETCID` in (\""+etcid+"\") ";
				if(!entid.equals("null")){
					query += " and `VEMPT`.`ENTID` in (\""+entid+"\") ";
				}
			}*/
			System.out.println(query);
			rs=dbcon.stm.executeQuery(query);
			return Convertor.convertToJSON(rs);
		}
		catch(Exception ex){
			System.out.println("Error from VENDOR Address Command "+ex +"==dbcon=="+dbcon);
			return null;
		}
	}

	private Object getVendorRuleDetail(HashMap myInfo, ConnectionManager dbcon) {

		/* INPUTS: 
					"USRID": 32,
			        "rulid": 3,
			        "ETYID": 1,
			        "ETCID": 1,
			        "ENTID": 9

			       Rule can be set at type/category or id so category and id are optional
		 */
		String userid =  myInfo.get("USRID")+"";
		String rulid =  myInfo.get("RULID")+"";
		String etyid =  myInfo.get("ETYID")+"";
		String etcid =  myInfo.get("ETCID")+"";
		String entid =  myInfo.get("ENTID")+"";
		String stDate =  myInfo.get("STDATE")+"";
		String enDate =  myInfo.get("ENDATE")+"";

		if(!rulid.equals("3")){
			JSONArray timeslots		= getTimeSlots(dbcon, userid, rulid, etyid, etcid, entid, stDate, enDate);
			JSONArray bookedslots	= getBookedSlots(dbcon, rulid, etyid, etcid, entid, stDate, enDate);
			return markSlotStatus(timeslots,bookedslots);
		}else{
			JSONArray ruleCharValues = getRuleChars(dbcon, userid, rulid, etyid, etcid, entid, stDate, enDate);
			return ruleCharValues;
			
		}
	}

	private JSONArray getRuleChars(ConnectionManager dbcon, String userid, String rulid, String etyid, String etcid,
			String entid, String stDate, String enDate) {

		JSONArray ruleDetails = new JSONArray();
		ResultSet rs=null;

		String query = "SELECT `vgrdt`.`VGDID`, "+
				" 	  `vgrdt`.`CHRID`, "+
				"     `vgrdt`.`UTYID`, "+
				"     `vgrdt`.`USRID`, "+
				"     `vgrdt`.`ETCID`, "+
				"     `vgrdt`.`ETYID`, "+
				"     `vgrdt`.`ACTIV`, "+
				"     `vgrdt`.`RULID`, "+
				"     `vgrdt`.`ENTID` "+
				"     FROM `vgrdt` where `vgrdt`.`USRID` = \""+userid+"\" and "
						+" `vgrdt`.`ETYID` = \""+etyid+"\" ";

		if(!etcid.equals("null")){
			query += " and `vgrdt`.`ETCID` = \""+etcid+"\" ";
			if(!entid.equals("null")){
				query += " and `vgrdt`.`ENTID` = \""+entid+"\" ";
			}
		}

		try{
			if(dbcon == null){
				try{
					dbcon.Connect("MYSQL");
				}
				catch(Exception ex){
					System.out.println(""+ex);
				}
			}
			//TODO: ENTID must be checked against VEMP
			System.out.println(query);
			rs=dbcon.stm.executeQuery(query);
			ruleDetails = Convertor.convertToJSON(rs);

			return ruleDetails;
		}


		catch(Exception ex){
			System.out.println("Error from VENDOR Rule Chars Command "+ex +"==dbcon=="+dbcon);
			return ruleDetails;
		}
	}

	private JSONArray getBookedSlots(ConnectionManager dbcon, String rulid, String etyid, String etcid, String entid,
			String stDate, String enDate) {

		JSONArray ruleDetails = new JSONArray();
		ResultSet rs=null;

		String query = "SELECT "
				+ "`vtrmt`.`VTRMI`, "
				+ "	 `vtrmt`.`VSUID`, "
				+ "    `vtrmt`.`VUTID`, "
				+ "    `vtrmt`.`CUSID`, "
				+ "    `vtrmt`.`CUTID`, "
				+ "    `vtrmt`.`ENTID`, "
				+ "    `vtrmt`.`RULID`, "
				+ "    `vtrmt`.`BDTIM`, "
				+ "    `vtrmt`.`BTIMZ`, "
				+ "   `vtrmt`.`BOSTM`, "
				+ "   `vtrmt`.`BOETM`, "
				+ "   `vtrmt`.`RTYPE`, "
				+ "   `vtrmt`.`STATS`, "
				+ "   `vtrmt`.`ACTIV` "
				+ "FROM `vtrmt` ";
		if(stDate.equals(enDate)){
			query = query + "where BDTIM = STR_TO_DATE('"+stDate+"', '%d-%m-%Y') ";
					
		}else{
			query = query + "where BDTIM >= STR_TO_DATE('"+stDate+"', '%d-%m-%Y') "
					+ "and BDTIM <= STR_TO_DATE('"+enDate+"', '%d-%m-%Y') ";
		}
		


		try{
			if(dbcon == null){
				try{
					dbcon.Connect("MYSQL");
				}
				catch(Exception ex){
					System.out.println(""+ex);
				}
			}
			//TODO: ENTID must be checked against VEMP
			System.out.println(query);
			rs=dbcon.stm.executeQuery(query);
			JSONArray bookedSlots = Convertor.convertToJSON(rs);

			return bookedSlots;
		}


		catch(Exception ex){
			System.out.println("Error from VENDOR Command "+ex +"==dbcon=="+dbcon);
			return ruleDetails;
		}
	}

	private JSONArray getTimeSlots(ConnectionManager dbcon, String userid, String rulid,
			String etyid, String etcid, String entid, String stDate, String enDate) {

		JSONArray ruleDetails = new JSONArray();
		ResultSet rs=null;

		String query = "SELECT `vtrdt`.`VTRID`, "+
				" `vtrdt`.`UTYID`, "+
				" `vtrdt`.`USRID`, "+
				" `vtrdt`.`ENTID`, "+
				" `vtrdt`.`ETCID`, "+
				" `vtrdt`.`ETYID`, "+
				" `vtrdt`.`RULID`, "+
				" `vtrdt`.`DSTIM`, "+
				" `vtrdt`.`DETIM`, "+
				" `vtrdt`.`TIMZN`, "+
				" `vtrdt`.`OSTSL`, "+
				" `vtrdt`.`OETSL`, "+
				" `vtrdt`.`RECUR`, "+
				" `vtrdt`.`DAYS`, "+
				" `vtrdt`.`DESCR` "+
				" FROM `vtrdt` where `vtrdt`.`USRID` = \""+userid+"\" and ";
			if(rulid.contains(",")){
				rulid = rulid.replaceAll("'", "");
				query = query + " `vtrdt`.`RULID` in ( "+rulid+" ) and";
			}else{
				query = query + " `vtrdt`.`RULID` = \""+rulid+"\" and ";
			}
				
				query = query + " `vtrdt`.`ETYID` = \""+etyid+"\" ";

		if(!etcid.equals("null")){
			query += " and `vtrdt`.`ETCID` = \""+etcid+"\" ";
			if(!entid.equals("null")){
				query += " and `vtrdt`.`ENTID` = \""+entid+"\" ";
			}
		}

		try{
			if(dbcon == null){
				try{
					dbcon.Connect("MYSQL");
				}
				catch(Exception ex){
					System.out.println(""+ex);
				}
			}
			//TODO: ENTID must be checked against VEMP
			System.out.println(query);
			rs=dbcon.stm.executeQuery(query);
			JSONArray ruleDetailsJSON = Convertor.convertToJSON(rs);

			JSONArray timeSlots = Convertor.convertRulestoTimeSlots(ruleDetailsJSON,stDate, enDate);


			return timeSlots;
		}


		catch(Exception ex){
			System.out.println("Error from VENDOR Command "+ex +"==dbcon=="+dbcon);
			return ruleDetails;
		}
	}

	private Object markSlotStatus(JSONArray timeSlots, JSONArray bookedSlots) {
		try{
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd h:m:s");
			SimpleDateFormat ndf = new SimpleDateFormat("EEE MMM d HH:mm:ss z yyyy");
			for(int rIndex=0;rIndex<timeSlots.length();rIndex++){
				JSONObject record = ((JSONObject) timeSlots.get(rIndex));
				record.put("BookingExists", false);
				JSONArray timeSlotsArray = 	(JSONArray) record.get("TimeSlots");
				for(int tIndex=0;tIndex<timeSlotsArray.length();tIndex++){
					JSONObject tSlot = ((JSONObject) timeSlotsArray.get(tIndex));
					tSlot.put("STATUS", 0);
					for(int bIndex=0;bIndex<bookedSlots.length();bIndex++){
						JSONObject bSlot = ((JSONObject) bookedSlots.get(bIndex));
						//System.out.println(sdf.parse(bSlot.get("BDTIM")+"").equals(ndf.parse(record.get("Date")+"")));
						if(sdf.parse(bSlot.get("BDTIM")+"").equals(ndf.parse(record.get("Date")+""))){
							if(tSlot.get("START").equals(bSlot.get("BOSTM")+"")
									&& 	
									tSlot.get("END").equals(bSlot.get("BOETM")+"")){
								tSlot.put("STATUS",  bSlot.get("STATS")+"");
								record.put("BookingExists", true);
							}
						}

					}	
				}
			}
		}catch(Exception ex){

		}


		return timeSlots;
	}

	private Object getVendorData(HashMap myInfo, ConnectionManager dbcon) {
		//TODO: Consider filtering
		JSONArray vendorHeaderList 			= (JSONArray) getVendorHeaderList(myInfo, dbcon);
		JSONArray vendorAddressList 		= (JSONArray) getVendorAddressList(myInfo, dbcon);
		JSONArray vendorCharacteristics 	= (JSONArray) getVendorCharacteristics(myInfo, dbcon);
		JSONArray vendorRules 				= (JSONArray) getVendorRules(myInfo, dbcon);

		//STEP 3: return the combined result
		return formVendorDataResultEntities(vendorHeaderList, vendorAddressList, vendorCharacteristics, vendorRules);
	}

	private JSONArray getVendorRules(HashMap myInfo, ConnectionManager dbcon) {
		// TODO: Add skip/top
		String etyid =  myInfo.get("ETYID")+"";
		String etcid =  myInfo.get("ETCID")+"";
		String entid =  myInfo.get("ENTID")+"";
		ResultSet rs=null;
		try{
			if(dbcon == null){
				try{
					dbcon.Connect("MYSQL");
				}
				catch(Exception ex){
					System.out.println(""+ex);
				}
			}
			
			String query = " SELECT "+
					" `vrumt`.`VRMID`, "+
					" `vrumt`.`RULID`, "+
					" `vrumt`.`USRID`, "+
					" `rulmt`.`RSTXT`, "+
					" `rulmt`.`DESCR`, "+
					" `vrumt`.`ETYID`, "+
					" `vrumt`.`ETCID`, "+
					" `vrumt`.`ENTID`, "+
					" `entmt`.`DESCR` "+
					" FROM `vrumt` "+
					" left outer join `rulmt` on  "+
					" `vrumt`.`RULID` = `rulmt`.`RULID`  "
					+ " left outer join `entmt` on   "
					+ " `vrumt`.`ENTID` = `entmt`.`ENTID` "+
					" where `rulmt`.`ACTIV` = 1 and `vrumt`.`ACTIV` = 1  and "
					+ " `vrumt`.`ETYID` in (\""
					+etyid+"\") ";
			
			if(!etcid.equals("null")){
				query += " and `vrumt`.`ETCID` in (\""+etcid+"\") ";
				if(!entid.equals("null")){
					query += " and `vrumt`.`ENTID` in (\""+entid+"\") ";
				}
			}
			System.out.println(query);
			rs=dbcon.stm.executeQuery(query);
			return Convertor.convertToJSON(rs);

		}
		catch(Exception ex){
			System.out.println("Error from VENDOR Rules Command "+ex +"==dbcon=="+dbcon);
			return null;
		}
	}

	private JSONArray getVendorAddressList(HashMap myInfo, ConnectionManager dbcon) {
		// TODO: Add skip/top
		String etyid =  myInfo.get("ETYID")+"";
		String etcid =  myInfo.get("ETCID")+"";
		String entid =  myInfo.get("ENTID")+"";
		ResultSet rs=null;
		try{
			if(dbcon == null){
				try{
					dbcon.Connect("MYSQL");
				}
				catch(Exception ex){
					System.out.println(""+ex);
				}
			}
			String query =
			" SELECT `usrmt`.`USRID`, "+
			" `uadmp`.`PRIMR`, "+
			" `addmt`.`STREET`, "+
			" `addmt`.`LNDMK`, "+
			" `addmt`.`LOCLT`, "+
			" `addmt`.`CTYID`, "+
			" `ctymt`.`CTYNM`, "+
			" `addmt`.`PINCD`, "+
			" `addmt`.`LONGT`, "+
			" `addmt`.`LATIT` "+
			" FROM `usrmt` "+ 
			"  left outer join "+
			" `uetmp` "+
			"  on "+
			" `usrmt`.`USRID` = `uetmp`.`USRID` "+
			" left outer join "+
			" `uadmp` "+
			" on "+
			" `usrmt`.`USRID` = `uadmp`.`USRID` "+
			" left outer join "+
			" `addmt` "+
			" on "+
			" `addmt`.`ADRID` = `uadmp`.`ADRID` "
			+ "left outer join  `ctymt`  "
			+ " on  "
			+ " `addmt`.`CTYID` = `ctymt`.`CTYID`"+
			//" left outer join `BOOKINGDB`.`VEMPT`  "+
			//" on  `usrmt`.`USRID` = `VEMPT`.`USRID`   "+
			" where `uetmp`.ACTIV = 1 and `uetmp`.UTYID = 2 ";
			//+ "and "
			//		+ " `VEMPT`.`ETYID` in (\""
			//		+entid+"\") ";
			
			/*if(!etcid.equals("null")){
				query += " and `VEMPT`.`ETCID` in (\""+etcid+"\") ";
				if(!entid.equals("null")){
					query += " and `VEMPT`.`ENTID` in (\""+entid+"\") ";
				}
			}*/
			System.out.println(query);
			rs=dbcon.stm.executeQuery(query);
			return Convertor.convertToJSON(rs);
		}
		catch(Exception ex){
			System.out.println("Error from VENDOR Address Command "+ex +"==dbcon=="+dbcon);
			return null;
		}
	}

	private Object formVendorDataResultEntities(JSONArray vendorHeaderList, JSONArray vendorAddressList, 
			JSONArray vendorCharacteristics, JSONArray vendorRules) {
		JSONArray charValues = new JSONArray();
		JSONArray addValues = new JSONArray();
		JSONArray ruleValues = new JSONArray();
		for(int vIndex=0;vIndex<vendorHeaderList.length();vIndex++){
			try{
				charValues = new JSONArray();
				addValues  = new JSONArray();
				ruleValues  = new JSONArray();
				((JSONObject)vendorHeaderList.get(vIndex)).put("Characteristics", charValues);

				for(int cIndex=0;cIndex<vendorCharacteristics.length();cIndex++){

					if(
							((JSONObject)vendorHeaderList.get(vIndex)).get("USRID") 
							== 
							((JSONObject)vendorCharacteristics.get(cIndex)).get("USRID") 
							){
						JSONObject vendorChars = ((JSONObject)vendorCharacteristics.get(cIndex));
						charValues.put(vendorChars);

					}

				}

				((JSONObject)vendorHeaderList.get(vIndex)).put("Address", addValues);
				for(int cIndex=0;cIndex<vendorAddressList.length();cIndex++){

					if(
							((JSONObject)vendorHeaderList.get(vIndex)).get("USRID") 
							== 
							((JSONObject)vendorAddressList.get(cIndex)).get("USRID") 
							){
						JSONObject vendorAdds = ((JSONObject)vendorAddressList.get(cIndex));
						addValues.put(vendorAdds);

					}

				}
				((JSONObject)vendorHeaderList.get(vIndex)).put("Rules", ruleValues);
				for(int cIndex=0;cIndex<vendorRules.length();cIndex++){

					if(
							((JSONObject)vendorHeaderList.get(vIndex)).get("USRID") 
							== 
							((JSONObject)vendorRules.get(cIndex)).get("USRID") 
							){
						JSONObject vendorRule= ((JSONObject)vendorRules.get(cIndex));
						ruleValues.put(vendorRule);

					}

				}
			}catch(Exception ex){

			}
		}

		return vendorHeaderList;
	}

	
	private JSONArray getVendorCharacteristics(HashMap myInfo, ConnectionManager dbcon) {
		// TODO: Add skip/top
		String etyid =  myInfo.get("ETYID")+"";
		String etcid =  myInfo.get("ETCID")+"";
		String entid =  myInfo.get("ENTID")+"";
		
		ResultSet rs=null;
		try{
			if(dbcon == null){
				try{
					dbcon.Connect("MYSQL");
				}
				catch(Exception ex){
					System.out.println(""+ex);
				}
			}
			String query = "SELECT `uchmt`.`USRID`, `chrmt`.`CHRID`, `uchmt`.`CHRID`, "
					+ "`uchmt`.`VALUE`,  "
					+ "`chrmt`.`DESCR`, `chrmt`.`REGXT`, `chrmt`.`MDTEXT`,  "
					+ "`chrmt`.`LNTXT`, `chrmt`.`SRTXT`  "
					+ " FROM `uchmt`    "    
					+ " left outer join      " 
					+ " `chrmt`  "       
					+ " on 	   "
					+ "  `uchmt`.`CHRID` = `chrmt`.`CHRID`  ";
					//+" left outer join `BOOKINGDB`.`VEMPT`  "
					//+" on  `UCHMT`.`USRID` = `VEMPT`.`USRID`  where "
					//+ " `VEMPT`.`ETYID` in (\""
					//+entid+"\") ";
			/*if(!etcid.equals("null")){
				query += " and `VEMPT`.`ETCID` in (\""+etcid+"\") ";
				if(!entid.equals("null")){
					query += " and `VEMPT`.`ENTID` in (\""+entid+"\") ";
				}
			}*/
			System.out.println(query);
			rs=dbcon.stm.executeQuery(query);
			return Convertor.convertToJSON(rs);

		}
		catch(Exception ex){
			System.out.println("Error from VENDOR Char Command "+ex +"==dbcon=="+dbcon);
			return null;
		}
	}

	private JSONArray getVendorHeaderList(HashMap myInfo, ConnectionManager dbcon) {
		// TODO: Add skip/top
		String etyid =  myInfo.get("ETYID")+"";
		String etcid =  myInfo.get("ETCID")+"";
		String entid =  myInfo.get("ENTID")+"";
		
		ResultSet rs=null;
		try{
			if(dbcon == null){
				try{
					dbcon.Connect("MYSQL");
				}
				catch(Exception ex){
					System.out.println(""+ex);
				}
			}
			String query = 
					" SELECT `usrmt`.`USRID`, "+
							" `uacmt`.`USRNM`, "+
							" `uetmp`.`UTYID`, "+
							" `usrmt`.`URCOD`, "+
							" `usrmt`.`PRFIX`, "+
							" `usrmt`.`TITLE`, "+
							" `usrmt`.`FRNAM`, "+
							" `usrmt`.`LTNAM`, "+
							" `usrmt`.`URDOB`, "+
							" `usrmt`.`GENDR`, "+
							" `usrmt`.`DSPNM` "+
							" FROM `usrmt` "+ 
							"  left outer join "+
							" `uetmp` "+
							"  on "+
							" `usrmt`.`USRID` = `uetmp`.`USRID` "+
							"  left outer join "+
							" `uacmt` "+
							"  on "+
							" `usrmt`.`USRID` = `uacmt`.`USRID` "+
							" left outer join "+
							" `uadmp` "+
							" on "+
							" `usrmt`.`USRID` = `uadmp`.`USRID` "+
							" left outer join `vempt`  "+
							" on  `usrmt`.`USRID` = `vempt`.`USRID`   "+
					" where `uetmp`.ACTIV = 1 and `uetmp`.UTYID = 2 and "
					+ " `vempt`.`ETYID` in (\""
					+etyid+"\") ";
					
					if(!etcid.equals("null")){
						query += " and `vempt`.`ETCID` in (\""+etcid+"\") ";
						if(!entid.equals("null")){
							query += " and `vempt`.`ENTID` in (\""+entid+"\") ";
						}
					}	
					if(myInfo.get("filters") != null){
						JSONObject filterJSON = new JSONObject(myInfo.get("filters")+"");
						if(filterJSON.has("USRID")){
							query += " and `usrmt`.`USRID` in ("+filterJSON.get("USRID")+") ";
						}
					}
			
			System.out.println(query);
			rs=dbcon.stm.executeQuery(query);
			return Convertor.convertToJSON(rs);
		}
		catch(Exception ex){
			System.out.println("Error from VENDOR Command "+ex +"==dbcon=="+dbcon);
			return null;
		}
	}

	private Object getVendorCategory(HashMap myInfo, ConnectionManager dbcon) {
		JSONArray vendorCategoryList 			= (JSONArray) getVendorCategoryList(myInfo, dbcon);
		JSONArray vendorCharacteristics 		= (JSONArray) getVendorCategoryCharacteristics(myInfo, dbcon);

		//STEP 3: return the combined result
		return formVendorCategoryResultEntities(vendorCategoryList, vendorCharacteristics);
	}

	private Object formVendorCategoryResultEntities(JSONArray vendorList, JSONArray vendorCharacteristics) {
		JSONArray charValues = new JSONArray();

		for(int vIndex=0;vIndex<vendorList.length();vIndex++){
			try{
				charValues = new JSONArray();
				((JSONObject)vendorList.get(vIndex)).put("Characteristics", charValues);
				for(int cIndex=0;cIndex<vendorCharacteristics.length();cIndex++){
					if(
							((JSONObject)vendorList.get(vIndex)).get("ENTID") 
							== 
							((JSONObject)vendorCharacteristics.get(cIndex)).get("ENTID") 
							){
						JSONObject vendorChars = ((JSONObject)vendorCharacteristics.get(cIndex));
						charValues.put(vendorChars);

					}

				}
			}catch(Exception ex){

			}
		}

		return vendorList;
	}

	private Object getVendorCategoryCharacteristics(HashMap myInfo, ConnectionManager dbcon) {
		ResultSet rs=null;
		try{
			if(dbcon == null){
				try{
					dbcon.Connect("MYSQL");
				}
				catch(Exception ex){
					System.out.println(""+ex);
				}
			}
			System.out.println("SELECT "+
					"`echmp`.`ENTID`, "+
					"`chrmt`.`CHRID`, "+
					"`echmp`.`CHRID`, "+
					"`echmt`.`VALUE`, "+
					"`chrmt`.`DESCR`, "+
					"`chrmt`.`REGXT`, "+
					"`chrmt`.`MDTEXT`, "+
					"`chrmt`.`LNTXT`, "+
					"`chrmt`.`SRTXT` "+
					"FROM `echmp`  "+
					"     left outer join "+
					"     `chrmt`  "+
					"     on "+
					"	  `echmp`.`CHRID` = `chrmt`.`CHRID` "+
					"     right join "+
					"     `echmt`  "+
					"     on "+
					"		`echmp`.`MPNID` = `echmt`.`MPNID` "+
					" where `chrmt`.`ACTIV` = 1 and `echmp`.`ACTIV` = 1 order by ENTID");
			rs=dbcon.stm.executeQuery("SELECT "+
					"`echmp`.`ENTID`, "+
					"`chrmt`.`CHRID`, "+
					"`echmp`.`CHRID`, "+
					"`echmt`.`VALUE`, "+
					"`chrmt`.`DESCR`, "+
					"`chrmt`.`REGXT`, "+
					"`chrmt`.`MDTEXT`, "+
					"`chrmt`.`LNTXT`, "+
					"`chrmt`.`SRTXT` "+
					"FROM `echmp`  "+
					"     left outer join "+
					"     `chrmt`  "+
					"     on "+
					"	  `echmp`.`CHRID` = `chrmt`.`CHRID` "+
					"     right join "+
					"     `echmt`  "+
					"     on "+
					"		`echmp`.`MPNID` = `echmt`.`MPNID` "+
					" where `chrmt`.`ACTIV` = 1 and `echmp`.`ACTIV` = 1 order by ENTID");
			return Convertor.convertToJSON(rs);

		}
		catch(Exception ex){
			System.out.println("Error from VENDOR Command "+ex +"==dbcon=="+dbcon);
			return null;
		}
	}

	private Object getVendorCategoryList(HashMap myInfo, ConnectionManager dbcon) {
		//Step 1: Read Intent, UserID
		String intent =  myInfo.get("INTENT").toString();
		String userid =  myInfo.get("UID").toString();
		//Step 2: Read Entities Based in Intent
		//TODO: add type and category 
		ResultSet rs=null;
		try{
			if(dbcon == null){
				try{
					dbcon.Connect("MYSQL");
				}
				catch(Exception ex){
					System.out.println(""+ex);
				}
			}
			System.out.println("SELECT `ienmp`.`ENTID`,`ienmp`.`ETYID`,`ienmp`.`ETCID`,  `entmt`.`DESCR`,  "
					+ " `entmt`.`ACTIV`,  `entmt`.`CRTDT`,   `entmt`.`CRTBY`,    "
					+ " `entmt`.`CHNDT`,   `entmt`.`CHNBY`   FROM `vempt`  "
					+ " left outer join `entmt`   "
					+ " on `vempt`.`ENTID` = `entmt`.`ENTID`   "
					+ " left outer join `ienmp`  "
					+ " on `vempt`.`USRID` = `ienmp`.`USRID`   and `vempt`.`ENTID` = `ienmp`.`ENTID` "
					+ " where `vempt`.USRID = "+
					userid + " and  "
					+ " `ienmp`.INTID = 1 and  "
					+ " `vempt`.ACTIV = 1  order by `vempt`.`ENTID`");
			rs=dbcon.stm.executeQuery("SELECT `ienmp`.`ENTID`,`ienmp`.`ETYID`,`ienmp`.`ETCID`,  `entmt`.`DESCR`,  "
					+ " `entmt`.`ACTIV`,  `entmt`.`CRTDT`,   `entmt`.`CRTBY`,    "
					+ " `entmt`.`CHNDT`,   `entmt`.`CHNBY`   FROM `vempt`  "
					+ " left outer join `entmt`   "
					+ " on `vempt`.`ENTID` = `entmt`.`ENTID`   "
					+ " left outer join `ienmp`  "
					+ " on `vempt`.`USRID` = `ienmp`.`USRID`   and `vempt`.`ENTID` = `ienmp`.`ENTID` "
					+ " where `vempt`.USRID = "+
					userid + " and  "
					+ " `ienmp`.INTID = 1 and  "
					+ " `vempt`.ACTIV = 1  order by `vempt`.`ENTID`");
			return Convertor.convertToJSON(rs);

		}
		catch(Exception ex){
			System.out.println("Error from VENDOR Command "+ex +"==dbcon=="+dbcon);
			return null;
		}
	}

}
