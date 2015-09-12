package com.aimers.command;

import java.sql.ResultSet;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;

import com.aimers.dbaccess.ConnectionManager;
import com.aimers.utils.Convertor;
import com.aimers.utils.mail.SendMailUsingAuthentication;

public class UserCommand extends aimCommand {

	@SuppressWarnings("null")
	@Override
	public Object execute(HashMap myInfo, ConnectionManager dbcon) {
		// TODO Auto-generated method stub
		//STEP 1: get subaction info from myInfo // TODO
		String aimAction = (String) myInfo.get("AimAction");
		//STEP 2: goto respective methods base on subaction // TODO
		if(aimAction.equals("registerUser")){
			return registerUser(myInfo, dbcon);
		}else if(aimAction.equals("registerVendor")){
			return registerVendor(myInfo, dbcon);
		}else if(aimAction.equals("updateUser")){
			return updateUser(myInfo, dbcon);
		}else if(aimAction.equals("updateVendor")){
			return updateVendor(myInfo, dbcon);
		}else if(aimAction.equals("loginUser")){
			return loginUser(myInfo, dbcon);
		}else if(aimAction.equals("getBookingHistory")){
			return getBookingHistory(myInfo, dbcon);
		}else if(aimAction.equals("getAllUsers")){
			return getAllUsers(myInfo, dbcon);
		}
		
		return new JSONObject();

	}

private Object updateVendor(HashMap myInfo, ConnectionManager dbcon) {
	try{
		myInfo.put("details",  updateUserAccount(myInfo, dbcon));
		String details 	=  myInfo.get("details")+"";
		JSONObject detailsJSON 	= new JSONObject(details);
		if(detailsJSON.has("USRID")){
			myInfo.put("details",  updateUserMaster(myInfo, dbcon));
			deleteUserEntityMapping(myInfo, dbcon);
			myInfo.put("details",  createUserEntityMapping(myInfo, dbcon));
			if(detailsJSON.has("Entities")){
				deleteVendorEntities(myInfo, dbcon);
				myInfo.put("details",  createVendorEntityMapping(myInfo, dbcon));
			}
			if(detailsJSON.has("Characteristics")){
				deleteUserCharachteristics(myInfo, dbcon);
				myInfo.put("details",  createUserCharachteristics(myInfo, dbcon));
			}
			if(detailsJSON.has("Address")){
				deleteUserAddress(myInfo, dbcon);
				myInfo.put("details",  createUserAddress(myInfo, dbcon));
			}
		}
	}catch(Exception ex){
		return new JSONObject();
	}
	
	return myInfo.get("details");
	
}

private void deleteVendorEntities(HashMap myInfo, ConnectionManager dbcon) {
	ResultSet rs=null;
	try{
		String details 	=  myInfo.get("details")+"";
		JSONObject detailsJSON 	= new JSONObject(details);
		
		String query = "DELETE FROM `vempt`"
				+ " where `USRID` = '"+detailsJSON.get("USRID")+"'";				
		System.out.println(query);
		int rowCount=dbcon.stm.executeUpdate(query);
		
		String query1 = "DELETE FROM `ienmp`"
				+ " where `USRID` = '"+detailsJSON.get("USRID")+"'";				
		System.out.println(query1);
		int rowCount1=dbcon.stm.executeUpdate(query1);
		
		//return detailsJSON;

	}
	catch(Exception ex){
		System.out.println("Error from USER usermaster Command "+ex +"==dbcon=="+dbcon);
		//return null;
	}

	
}

private Object registerVendor(HashMap myInfo, ConnectionManager dbcon) {
	try{
		myInfo.put("details",  createUserAccount(myInfo, dbcon));
		String details 	=  myInfo.get("details")+"";
		JSONObject detailsJSON 	= new JSONObject(details);
		if(detailsJSON.has("USRID")){
			myInfo.put("details",  createUserMaster(myInfo, dbcon));
			myInfo.put("details",  createUserEntityMapping(myInfo, dbcon));
			if(detailsJSON.has("Entities")){
				myInfo.put("details",  createVendorEntityMapping(myInfo, dbcon));
			}
			if(detailsJSON.has("Characteristics")){
				myInfo.put("details",  createUserCharachteristics(myInfo, dbcon));
			}
			if(detailsJSON.has("Address")){
				myInfo.put("details",  createUserAddress(myInfo, dbcon));
			}
		}
	}catch(Exception ex){
		return new JSONObject();
	}
	
	return myInfo.get("details");
	
}

private Object createVendorEntityMapping(HashMap myInfo, ConnectionManager dbcon) {
	
	
	ResultSet rs=null;
	try{
		String details 	=  myInfo.get("details")+"";
		JSONObject detailsJSON 	= new JSONObject(details);
		JSONArray entJSONArray = (JSONArray) detailsJSON.get("Entities");
		JSONArray entOutJARRAY = new JSONArray();
		if(dbcon == null){
			try{
				dbcon.Connect("MYSQL");
			}
			catch(Exception ex){
				System.out.println(""+ex);
			}
		}
		for(int cIndex=0;cIndex<entJSONArray.length();cIndex++){
			JSONObject entJSON = (JSONObject) entJSONArray.get(cIndex);
			DateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
			Date date = new Date();
			entJSON.put("UTYID", detailsJSON.get("UTYID"));
			entJSON.put("USRID", detailsJSON.get("USRID"));
			entJSON.put("MPNID", getNewEntityMapId(dbcon));
			entJSON.put("CRTDT", dateFormat.format(date)+"");
			entJSON.put("CRTBY", entJSON.get("USRID"));
			entJSON.put("CHNDT", dateFormat.format(date)+"");
			entJSON.put("CHNBY", entJSON.get("USRID"));
			entJSON.put("ACTIV", "1");
			
			String query = "INSERT INTO `bookingdb`.`vempt` (`MPNID`, `USRID`, `UTYID`, "
					+ " `ETYID`, `ETCID`, `ENTID`, `ACTIV`, `CRTDT`, `CRTBY`, `CHNDT`, "
					+ " `CHNBY`) values("
					//+ "'"+uchid+ "',"//AI
					+ "'"+entJSON.get("MPNID")+ "', "
					+ "'"+entJSON.get("USRID")+ "', "
					+ "'"+entJSON.get("UTYID")+ "', "
					+ "'"+entJSON.get("ETYID")+ "', "
					+ "'"+entJSON.get("ETCID")+ "', "
					+ "'"+entJSON.get("ENTID")+ "', "
					+ "'"+entJSON.get("ACTIV")+ "', "
					+ "'"+entJSON.get("CRTDT")+ "', "
					+ "'"+entJSON.get("CRTBY")+ "', "
					+ "'"+entJSON.get("CHNDT")+ "', "
					+ "'"+entJSON.get("CHNBY")+ "')";

		
			System.out.println(query);
			int rowCount=dbcon.stm.executeUpdate(query);
			
			if(rowCount > 0 && cIndex == 0){
				String query1 = "INSERT INTO `bookingdb`.`ienmp` "
						+ " (`USRID`, `UTYID`, `ITCMT`, `ITYID`, `INTID`, "
						+ " `ETYID`, `ETCID`, `ENTID`, `ACTIV`, `CRTDT`, `CRTBY`, `CHNDT`, `CHNBY`) "
						+ " SELECT " 
						+ " '"+entJSON.get("USRID")+ "', "
						+ "  `UTYID`, `ITCMT`, `ITYID`, `INTID`, "
						+ " `ETYID`, `ETCID`, `ENTID`,  "
						+ " `ACTIV`, `CRTDT`, `CRTBY`, `CHNDT`, `CHNBY` "
						+ " FROM bookingdb.ienmp where USRID = 1";
				

			
				System.out.println(query1);
				int rowCount1=dbcon.stm.executeUpdate(query1);
				
				if(rowCount1 > 0){
					entOutJARRAY.put(entJSON);
				}
			}else{
				//TODO: Consider Raising Error
				entOutJARRAY.put((JSONObject) entJSONArray.get(cIndex));
			}
		}
		
		detailsJSON.put("Entities",entOutJARRAY );
		return detailsJSON;

	}
	catch(Exception ex){
		System.out.println("Error from USER usermaster Command "+ex +"==dbcon=="+dbcon);
		return null;
	}
}

private String getNewEntityMapId(ConnectionManager dbcon) {
	
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
				"MAX(`MPNID`)+1"+
				" FROM `vempt`  ");
		rs=dbcon.stm.executeQuery("SELECT "+
				"MAX(`MPNID`)+1"+
				" FROM `vempt`  ");
		if(rs.next()){
			return rs.getString(1);
		}
		return "";

	}
	catch(Exception ex){
		System.out.println("Error from USER next ID Command "+ex +"==dbcon=="+dbcon);
		return "";
	}
}

private Object getAllUsers(HashMap myInfo, ConnectionManager dbcon) {
	JSONArray response = new JSONArray();
	try{
		
		JSONArray details 	=  (JSONArray) selectAllUserAccount(myInfo, dbcon);
		for(int dIndex=0;dIndex<details.length();dIndex++){
			JSONObject detailsJSON 	= details.getJSONObject(dIndex);
			myInfo = new HashMap();
			myInfo.put("details", detailsJSON);
			myInfo.put("details",  selectUserCharachteristics(myInfo, dbcon));
			myInfo.put("details",  selectUserAddress(myInfo, dbcon));
			response.put((JSONObject)myInfo.get("details"));
		}
		
		
	}catch(Exception ex){
		return new JSONObject();
	}
	
	return response;
	
}

private Object selectAllUserAccount(HashMap myInfo, ConnectionManager dbcon) {
	//TODO: Send email
	ResultSet rs=null;
	try{
		String details 	=  myInfo.get("details")+"";
		JSONObject detailsJSON 	= new JSONObject(details);
		
		if(dbcon == null){
			try{
				dbcon.Connect("MYSQL");
			}
			catch(Exception ex){
				System.out.println(""+ex);
			}
		}
		
		String query = "SELECT `uacmt`.`USRID`,"
				+ " `uacmt`.`USRNM`,"
				+ " `uacmt`.`UERPW`, `usrmt`.`URCOD`, `usrmt`.`PRFIX`, `usrmt`.`TITLE`, "
				+ " `usrmt`.`FRNAM`, `usrmt`.`LTNAM`, `usrmt`.`URDOB`, `usrmt`.`GENDR`, "
				+ " `usrmt`.`DSPNM`, `uacmt`.`ACTIV`, `uacmt`.`CRTDT`, `uacmt`.`CRTBY`,"
				+ " `uacmt`.`CHNDT`, `uacmt`.`CHNBY` "
				+ " FROM `uacmt` left outer join "
				+ " `usrmt` on `uacmt`.`USRID` = `usrmt`.`USRID`";
		
		if(detailsJSON.has("USRID")){
			query = query + "where `usrmt`.`USRID` in ("+detailsJSON.get("USRID")+") ";
		}
		if(detailsJSON.has("USRNM")){
			query = query + "where `uacmt`.`USRNM` like \"%"+detailsJSON.get("USRNM")+"%\" ";
		}
		System.out.println(query);
		rs=dbcon.stm.executeQuery(query);
		JSONArray userArray = Convertor.convertToJSON(rs);
		return userArray;
	}
	catch(Exception ex){
		System.out.println("Error from USER Command "+ex +"==dbcon=="+dbcon);
		return null;
	}
}

private Object getBookingHistory(HashMap myInfo, ConnectionManager dbcon) {
	
	
	ResultSet rs=null;
	try{
		String details 	=  myInfo.get("details")+"";
		JSONObject detailsJSON 	= new JSONObject(details);
		
		String query1 = "SELECT `vtrmt`.`VTRMI`, `vtrmt`.`VSUID`, `vtrmt`.`VUTID`, "
				+ " `vtrmt`.`CUSID`, `vtrmt`.`CUTID`, "
				+ " `usrmt`.`USRID`, `uacmt`.`USRNM`, `usrmt`.`URCOD`, `usrmt`.`PRFIX`, `usrmt`.`TITLE`, `usrmt`.`FRNAM`, "
				+ " `usrmt`.`LTNAM`, `usrmt`.`URDOB`, `usrmt`.`GENDR`, `usrmt`.`DSPNM`, "
				+ " `vendor`.`USRID` as `VUSRID`, `vacct`.`USRNM` as `VERNM`, `vendor`.`URCOD` as `VURCOD`, `vendor`.`PRFIX` as `VPREFIX`, "
				+ " `vendor`.`TITLE` as `VTITLE`, `vendor`.`FRNAM` as `VFRNAM`, `vendor`.`LTNAM` as `VLTNAM`, "
				+ " `vendor`.`URDOB` as `VURDOB`, `vendor`.`GENDR` as `VGENDR`, `vendor`.`DSPNM` as `VDSPNM`, "
				+ "`vtrmt`.`ETYID`, `vtrmt`.`ETCID`, `vtrmt`.`ENTID`, "
				+ " `vtrmt`.`RULID`, "
				+ " `vtrmt`.`BDTIM`, `vtrmt`.`BTIMZ`, `vtrmt`.`BOSTM`, `vtrmt`.`BOETM`, "
				+ " `vtrmt`.`RTYPE`, `vtrmt`.`STATS` "
				+ " FROM `bookingdb`.`vtrmt` left outer join  `bookingdb`.`usrmt` "
				+ " on `vtrmt`.`CUSID` = `usrmt`.`USRID` "
				+ " left outer join  `bookingdb`.`usrmt` as `vendor` "
				+ " on `vtrmt`.`VSUID` = `vendor`.`USRID` "
				+ " left outer join  `bookingdb`.`uacmt` "
				+ " on `vtrmt`.`CUSID` = `uacmt`.`USRID`  "
				+" left outer join  `bookingdb`.`uacmt` as `vacct`  "
				+ " on `vtrmt`.`VSUID` = `vacct`.`USRID` ";
		if(detailsJSON.has("CUSID") && detailsJSON.has("CUTID")){
			query1 = query1+ "where `CUSID` = '"+detailsJSON.get("CUSID")+"' "
					+ " and `CUTID` = '"+detailsJSON.get("CUTID")+"' ";	
		}else if(detailsJSON.has("VSUID") && detailsJSON.has("VUTID")){
			query1 = query1+ "where `VSUID` = '"+detailsJSON.get("VSUID")+"' "
					+ " and `VUTID` = '"+detailsJSON.get("VUTID")+"' ";	
		}
		
		if(detailsJSON.has("BDTIM")){
			query1 = query1+ " and `BDTIM` = STR_TO_DATE('"+detailsJSON.get("BDTIM")+"', '%d-%m-%Y')  ";	
		}
		
		query1 = query1 + " and `vtrmt`.`ACTIV` = '1'";
		
		System.out.println(query1);
		rs =dbcon.stm.executeQuery(query1);
		return Convertor.convertToJSON(rs);

	}
	catch(Exception ex){
		System.out.println("Error from USER usermaster Command "+ex +"==dbcon=="+dbcon);
		return null;
	}
}

	/*CREATE USER METHODS START*/	
	private Object registerUser(HashMap myInfo, ConnectionManager dbcon) {
		try{
			myInfo.put("details",  createUserAccount(myInfo, dbcon));
			String details 	=  myInfo.get("details")+"";
			JSONObject detailsJSON 	= new JSONObject(details);
			if(detailsJSON.has("USRID")){
				myInfo.put("details",  createUserMaster(myInfo, dbcon));
				myInfo.put("details",  createUserEntityMapping(myInfo, dbcon));
				if(detailsJSON.has("Characteristics")){
					myInfo.put("details",  createUserCharachteristics(myInfo, dbcon));
				}
				if(detailsJSON.has("Address")){
					myInfo.put("details",  createUserAddress(myInfo, dbcon));
				}
			}
		}catch(Exception ex){
			return new JSONObject();
		}
		
		return myInfo.get("details");
		
	}
	private Object createUserAddress(HashMap myInfo, ConnectionManager dbcon) {
		
		
		ResultSet rs=null;
		try{
			String details 	=  myInfo.get("details")+"";
			JSONObject detailsJSON 	= new JSONObject(details);
			JSONArray addJSONArray = (JSONArray) detailsJSON.get("Address");
			JSONArray addOutJARRAY = new JSONArray();
			if(dbcon == null){
				try{
					dbcon.Connect("MYSQL");
				}
				catch(Exception ex){
					System.out.println(""+ex);
				}
			}
			int iAdridNext = getNextAdrid(dbcon);
			for(int cIndex=0;cIndex<addJSONArray.length();cIndex++){
				JSONObject addJSON = (JSONObject) addJSONArray.get(cIndex);
				addJSON.put("USRID", detailsJSON.get("USRID"));
				addJSON.put("ACTIV", detailsJSON.get("ACTIV"));
				addJSON.put("CRTDT", detailsJSON.get("CRTDT"));
				addJSON.put("CRTBY", detailsJSON.get("CRTBY"));
				addJSON.put("CHNDT", detailsJSON.get("CHNDT"));
				addJSON.put("CHNBY", detailsJSON.get("CHNBY"));
				
				String adrid = iAdridNext+"";
				iAdridNext++;

				//THINK IF WE NEED STATE AND COUNTRY DENORMALIZED!!
				String query1 = "INSERT INTO `addmt`"
						+ "(`ADRID`, `STREET`, `LNDMK`, `LOCLT`, `CTYID`, `PINCD`, `LONGT`, `LATIT`, "
						+ "`CHNDT`, `CRTDT`, `ACTIV`, `CHNBY`, `CRTBY`)"
						+ "VALUES "
						+ "( "
						+ "'"+adrid+ "', "
						+ "'"+addJSON.get("STREET")+ "', "
						+ "'"+addJSON.get("LNDMK")+ "', "
						+ "'"+addJSON.get("LOCLT")+ "', "
						+ "'"+addJSON.get("CTYID")+ "', "
						+ "'"+addJSON.get("PINCD")+ "', "
						+ "'"+addJSON.get("LONGT")+ "', "
						+ "'"+addJSON.get("LATIT")+ "', "
						+ "'"+addJSON.get("CHNDT")+ "', "
						+ "'"+addJSON.get("CRTDT")+ "', "
						+ "'"+addJSON.get("ACTIV")+ "', "
						+ "'"+addJSON.get("CHNBY")+ "', "
						+ "'"+addJSON.get("CRTBY")+ "' "
								+ ")";				
				String query2 = "INSERT INTO `uadmp`"
						+ "(`USRID`, `ADRID`, `PRIMR`, "
						+ "`ACTIV`, `CHNDT`, `CRTDT`, `CRTBY`, `CHNBY`) "
						+ "VALUES "
						+ "( "
						//+ "'"+uchid+ "',"//AI
						+ "'"+addJSON.get("USRID")+ "', "
						+ "'"+adrid+ "', "
						+ "'"+(addJSON.get("PRIMR")+"" == "true"? 1:0 )+ "', "
						+ "'"+addJSON.get("ACTIV")+ "', "
						+ "'"+addJSON.get("CHNDT")+ "', "
						+ "'"+addJSON.get("CRTDT")+ "', "
						+ "'"+addJSON.get("CRTBY")+ "', "
						+ "'"+addJSON.get("CHNBY")+ "')";
				

			
				System.out.println(query1);
				int rowCount1=dbcon.stm.executeUpdate(query1);
				System.out.println(query2);
				int rowCount2=dbcon.stm.executeUpdate(query2);
				if(rowCount1 > 0){
					addOutJARRAY.put(addJSON);
				}else{
					//TODO: Consider Raising Error
					addOutJARRAY.put((JSONObject) addJSONArray.get(cIndex));
				}
			}
			
			detailsJSON.put("Address",addOutJARRAY );
			return detailsJSON;

		}
		catch(Exception ex){
			System.out.println("Error from USER usermaster Command "+ex +"==dbcon=="+dbcon);
			return null;
		}
	}
	private Object createUserCharachteristics(HashMap myInfo, ConnectionManager dbcon) {
		
		
		ResultSet rs=null;
		try{
			String details 	=  myInfo.get("details")+"";
			JSONObject detailsJSON 	= new JSONObject(details);
			JSONArray charJSONArray = (JSONArray) detailsJSON.get("Characteristics");
			JSONArray charOutJARRAY = new JSONArray();
			if(dbcon == null){
				try{
					dbcon.Connect("MYSQL");
				}
				catch(Exception ex){
					System.out.println(""+ex);
				}
			}
			for(int cIndex=0;cIndex<charJSONArray.length();cIndex++){
				JSONObject charJSON = (JSONObject) charJSONArray.get(cIndex);
				charJSON.put("UTYID", detailsJSON.get("UTYID"));
				charJSON.put("USRID", detailsJSON.get("USRID"));
				charJSON.put("ACTIV", detailsJSON.get("ACTIV"));
				charJSON.put("CRTDT", detailsJSON.get("CRTDT"));
				charJSON.put("CRTBY", detailsJSON.get("CRTBY"));
				charJSON.put("CHNDT", detailsJSON.get("CHNDT"));
				charJSON.put("CHNBY", detailsJSON.get("CHNBY"));
				
				String query = "INSERT INTO `uchmt`"
						+ "( `CHRID`, `UTYID`, `USRID`, `VALUE`, "
						+ "`ACTIV`, `CRTDT`, `CRTBY`, `CHNDT`, `CHNBY`) "
						+ "VALUES "
						+ "( "
						//+ "'"+uchid+ "',"//AI
						+ "'"+charJSON.get("CHRID")+ "', "
						+ "'"+charJSON.get("UTYID")+ "', "
						+ "'"+charJSON.get("USRID")+ "', "
						+ "'"+charJSON.get("VALUE")+ "', "
						+ "'"+charJSON.get("ACTIV")+ "', "
						+ "'"+charJSON.get("CRTDT")+ "', "
						+ "'"+charJSON.get("CRTBY")+ "', "
						+ "'"+charJSON.get("CHNDT")+ "', "
						+ "'"+charJSON.get("CHNBY")+ "')";

			
				System.out.println(query);
				int rowCount=dbcon.stm.executeUpdate(query);
				if(rowCount > 0){
					charOutJARRAY.put(charJSON);
				}else{
					//TODO: Consider Raising Error
					charOutJARRAY.put((JSONObject) charJSONArray.get(cIndex));
				}
			}
			
			detailsJSON.put("Characteristics",charOutJARRAY );
			return detailsJSON;

		}
		catch(Exception ex){
			System.out.println("Error from USER usermaster Command "+ex +"==dbcon=="+dbcon);
			return null;
		}
	}
	private Object createUserEntityMapping(HashMap myInfo, ConnectionManager dbcon) {
		
		
		ResultSet rs=null;
		try{
			String details 	=  myInfo.get("details")+"";
			JSONObject detailsJSON 	= new JSONObject(details);
			
			
			if(dbcon == null){
				try{
					dbcon.Connect("MYSQL");
				}
				catch(Exception ex){
					System.out.println(""+ex);
				}
			}
			String mpnid = getNewTypeMapId(dbcon);
			String query = "INSERT INTO `uetmp`"
					+ "(`MPNID`, `UTYID`, `USRID`, `ACTIV`, `CRTDT`, `CRTBY`, `CHNDT`, `CHNBY`)"
					+ " VALUES "
					+ " ("
					+ "'"+mpnid+ "',"
					+ "'"+detailsJSON.get("UTYID")+ "',"
					+ "'"+detailsJSON.get("USRID")+ "',"
					+ "'"+detailsJSON.get("ACTIV")+ "',"
					+ "'"+detailsJSON.get("CRTDT")+ "',"
					+ "'"+detailsJSON.get("CRTBY")+ "',"
					+ "'"+detailsJSON.get("CHNDT")+ "',"
					+ "'"+detailsJSON.get("CHNBY")+ "')";
					
			System.out.println(query);
			int rowCount=dbcon.stm.executeUpdate(query);
			if(rowCount > 0){
				return detailsJSON;
			}else{
				//TODO: Consider Raising Error
				return new JSONObject(details);
			}
			
			

		}
		catch(Exception ex){
			System.out.println("Error from USER usermaster Command "+ex +"==dbcon=="+dbcon);
			return null;
		}
	}
	private Object createUserMaster(HashMap myInfo, ConnectionManager dbcon) {
		
		
		ResultSet rs=null;
		try{
			String details 	=  myInfo.get("details")+"";
			JSONObject detailsJSON 	= new JSONObject(details);
			
			if(dbcon == null){
				try{
					dbcon.Connect("MYSQL");
				}
				catch(Exception ex){
					System.out.println(""+ex);
				}
			}
			
			String query = "INSERT INTO `usrmt`"
					+ "(`USRID`, `URCOD`, `PRFIX`, `TITLE`, `FRNAM`, `LTNAM`, "
					+ "`URDOB`, `GENDR`, `DSPNM`, `ACTIV`, `CRTDT`, `CRTBY`, `CHNDT`, `CHNBY`)"
					+ " VALUES "
					+ " ("
					+ "'"+detailsJSON.get("USRID")+ "',"
					+ "'"+detailsJSON.get("USRID")+ "'," //URCOD???WHY IS THIS NEEDED
					+ "'"+detailsJSON.get("PRFIX")+ "',"
					+ "'"+detailsJSON.get("TITLE")+ "',"
					+ "'"+detailsJSON.get("FRNAM")+ "',"
					+ "'"+detailsJSON.get("LTNAM")+ "',"
					+ "'"+detailsJSON.get("URDOB")+ "',"
					+ "'"+detailsJSON.get("GENDR")+ "',"
					+ "'"+detailsJSON.get("DSPNM")+ "',"
					+ "'"+detailsJSON.get("ACTIV")+ "',"
					+ "'"+detailsJSON.get("CRTDT")+ "',"
					+ "'"+detailsJSON.get("CRTBY")+ "',"
					+ "'"+detailsJSON.get("CHNDT")+ "',"
					+ "'"+detailsJSON.get("CHNBY")+ "')";
					
			System.out.println(query);
			int rowCount=dbcon.stm.executeUpdate(query);
			if(rowCount > 0){
				return detailsJSON;
			}else{
				//TODO: Consider Raising Error
				return new JSONObject(details);
			}
			
			

		}
		catch(Exception ex){
			System.out.println("Error from USER usermaster Command "+ex +"==dbcon=="+dbcon);
			return null;
		}
	}
	private JSONObject createUserAccount(HashMap myInfo, ConnectionManager dbcon) {
		
		//TODO: Send email
		
		
		ResultSet rs=null;
		try{
			String details 	=  myInfo.get("details")+"";
			JSONObject detailsJSON 	= new JSONObject(details);
			
			if(dbcon == null){
				try{
					dbcon.Connect("MYSQL");
				}
				catch(Exception ex){
					System.out.println(""+ex);
				}
			}
			
			DateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
			Date date = new Date();
			String newId = getNewUserID(dbcon);
			detailsJSON.put("USRID", newId);
			detailsJSON.put("ACTIV", 1+"");
			detailsJSON.put("CRTDT", dateFormat.format(date)+"");
			detailsJSON.put("CRTBY", newId);
			detailsJSON.put("CHNDT", dateFormat.format(date)+"");
			detailsJSON.put("CHNBY", newId);
			if(!detailsJSON.has("UERPW")){
				detailsJSON.put("UERPW", detailsJSON.get("USRID").hashCode()+"");
			}
			
			String query = "INSERT INTO `uacmt`"
					+ "(`USRID`, `USRNM`, `UERPW`,`ACTIV`, `CRTDT`, `CRTBY`, `CHNDT`, `CHNBY`)"
					+ " VALUES "
					+ " ("
					+ "'"+detailsJSON.get("USRID")+ "',"
					+ "'"+detailsJSON.get("USRNM")+ "',"
					+ "'"+detailsJSON.get("UERPW")+ "',"
					+ "'"+detailsJSON.get("ACTIV")+ "',"
					+ "'"+detailsJSON.get("CRTDT")+ "',"
					+ "'"+detailsJSON.get("CRTBY")+ "',"
					+ "'"+detailsJSON.get("CHNDT")+ "',"
					+ "'"+detailsJSON.get("CHNBY")+ "')";
					
			System.out.println(query);
			int rowCount=dbcon.stm.executeUpdate(query);
			if(rowCount > 0){
				SendMailUsingAuthentication sendEmail = new SendMailUsingAuthentication();
				String message = "Welcome to Aimmedics, Your user id is registered with us :"
						+ "user id: "+detailsJSON.get("USRNM")+" and "
						+ "password :"+detailsJSON.get("UERPW")+".";
				String[] recipients = new String[2];
				recipients[0] = detailsJSON.get("USRNM")+"";
				recipients[1] = "uxdevsupport@aimersinfosoft.com";
				String from = "uxdevsupport@aimersinfosoft.com";
				String subject = "User Registered";
				sendEmail.postMail(recipients, subject, message, from);
				
				return detailsJSON;
			}else{
				//TODO: Consider Raising Error
				return new JSONObject(details);
			}
			
			

		}
		catch(Exception ex){
			System.out.println("Error from USER Command "+ex +"==dbcon=="+dbcon);
			return null;
		}
	}
	private String getNewTypeMapId(ConnectionManager dbcon) {
		
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
					"MAX(`MPNID`)+1"+
					" FROM `uetmp`  ");
			rs=dbcon.stm.executeQuery("SELECT "+
					"MAX(`MPNID`)+1"+
					" FROM `uetmp`  ");
			if(rs.next()){
				return rs.getString(1);
			}
			return "";

		}
		catch(Exception ex){
			System.out.println("Error from USER next type map ID Command "+ex +"==dbcon=="+dbcon);
			return "";
		}
	}
	private int getNextAdrid(ConnectionManager dbcon) {
		
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
					"MAX(`ADRID`)+1"+
					" FROM `addmt`  ");
			rs=dbcon.stm.executeQuery("SELECT "+
					"MAX(`ADRID`)+1"+
					" FROM `addmt`  ");
			if(rs.next()){
				return rs.getInt(1);
			}
			return 0;

		}
		catch(Exception ex){
			System.out.println("Error from adrid next ID Command "+ex +"==dbcon=="+dbcon);
			return 0;
		}
	}
	private String getNewUserID(ConnectionManager dbcon) {
		
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
					"MAX(`USRID`)+1"+
					" FROM `uacmt`  ");
			rs=dbcon.stm.executeQuery("SELECT "+
					"MAX(`USRID`)+1"+
					" FROM `uacmt`  ");
			if(rs.next()){
				return rs.getString(1);
			}
			return "";

		}
		catch(Exception ex){
			System.out.println("Error from USER next ID Command "+ex +"==dbcon=="+dbcon);
			return "";
		}
	}

	
/*CREATE USER METHODS END*/

/*UPDATE USER METHODS START*/	
	private Object updateUser(HashMap myInfo, ConnectionManager dbcon) {
		try{
			myInfo.put("details",  updateUserAccount(myInfo, dbcon));
			String details 	=  myInfo.get("details")+"";
			JSONObject detailsJSON 	= new JSONObject(details);
			if(detailsJSON.has("USRID")){
				myInfo.put("details",  updateUserMaster(myInfo, dbcon));
				deleteUserEntityMapping(myInfo, dbcon);
				myInfo.put("details",  createUserEntityMapping(myInfo, dbcon));
				if(detailsJSON.has("Characteristics")){
					deleteUserCharachteristics(myInfo, dbcon);
					myInfo.put("details",  createUserCharachteristics(myInfo, dbcon));
				}
				if(detailsJSON.has("Address")){
					deleteUserAddress(myInfo, dbcon);
					myInfo.put("details",  createUserAddress(myInfo, dbcon));
				}
			}
		}catch(Exception ex){
			return new JSONObject();
		}
		
		return myInfo.get("details");
		
	}
	private void deleteUserAddress(HashMap myInfo, ConnectionManager dbcon) {
		
		
		ResultSet rs=null;
		try{
			String details 	=  myInfo.get("details")+"";
			JSONObject detailsJSON 	= new JSONObject(details);
			
//			String query1 = "DELETE FROM `bookingdb`.`addmt`"
//					+ " where `ADRID` in ( select `ADRID` from " 
//					+ " `bookingdb`.`uadmp` where `USRID` = '"+detailsJSON.get("USRID")+"' )";				
			String query2 = "DELETE FROM `uadmp` "
					+ " where `USRID` = '"+detailsJSON.get("USRID")+"'";
//			System.out.println(query1);
//			int rowCount1=dbcon.stm.executeUpdate(query1);
			System.out.println(query2);
			int rowCount2=dbcon.stm.executeUpdate(query2);
				
			//return detailsJSON;

		}
		catch(Exception ex){
			System.out.println("Error from USER usermaster Command "+ex +"==dbcon=="+dbcon);
			//return null;
		}
	}
	private void deleteUserCharachteristics(HashMap myInfo, ConnectionManager dbcon) {
		ResultSet rs=null;
		try{
			String details 	=  myInfo.get("details")+"";
			JSONObject detailsJSON 	= new JSONObject(details);
			
			String query1 = "DELETE FROM `uchmt`"
					+ " where `USRID` = '"+detailsJSON.get("USRID")+"'";				
			System.out.println(query1);
			int rowCount1=dbcon.stm.executeUpdate(query1);
				
			//return detailsJSON;

		}
		catch(Exception ex){
			System.out.println("Error from USER usermaster Command "+ex +"==dbcon=="+dbcon);
			//return null;
		}
	
		
	}
	private void deleteUserEntityMapping(HashMap myInfo, ConnectionManager dbcon) {
		
		
		ResultSet rs=null;
		try{
			String details 	=  myInfo.get("details")+"";
			JSONObject detailsJSON 	= new JSONObject(details);
			
			String query1 = "DELETE FROM `uetmp`"
					+ " where `USRID` = '"+detailsJSON.get("USRID")+"'";				
			System.out.println(query1);
			int rowCount1=dbcon.stm.executeUpdate(query1);
				
			//return detailsJSON;

		}
		catch(Exception ex){
			System.out.println("Error from USER usermaster Command "+ex +"==dbcon=="+dbcon);
			//return null;
		}
	}
	private Object updateUserMaster(HashMap myInfo, ConnectionManager dbcon) {
		
		
		ResultSet rs=null;
		try{
			String details 	=  myInfo.get("details")+"";
			JSONObject detailsJSON 	= new JSONObject(details);
			
			if(dbcon == null){
				try{
					dbcon.Connect("MYSQL");
				}
				catch(Exception ex){
					System.out.println(""+ex);
				}
			}
			DateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
			Date date = new Date();
			detailsJSON.put("ACTIV", 1+"");
			detailsJSON.put("CRTDT", dateFormat.format(date)+"");
			detailsJSON.put("CRTBY", detailsJSON.get("USRID"));
			detailsJSON.put("CHNDT", dateFormat.format(date)+"");
			detailsJSON.put("CHNBY", detailsJSON.get("USRID"));
			if(!detailsJSON.has("UERPW")){
				detailsJSON.put("UERPW", detailsJSON.get("USRID").hashCode()+"");
			}
			String query = "UPDATE `usrmt`"
					+ " SET  "
					+ " `URCOD` = '"+detailsJSON.get("USRID")+ "', " //URCOD???WHY IS THIS NEEDED
					+ " `PRFIX` ='"+detailsJSON.get("PRFIX")+ "', "
					+ " `TITLE` = '"+detailsJSON.get("TITLE")+ "', "
					+ " `FRNAM` = '"+detailsJSON.get("FRNAM")+ "' ,"
					+ " `LTNAM` = '"+detailsJSON.get("LTNAM")+ "', "
					+ " `URDOB` = '"+detailsJSON.get("URDOB")+ "', "
					+ " `GENDR` = '"+(detailsJSON.get("GENDR")+"" == "true"? 1:0 )+ "', "
					+ " `DSPNM` = '"+detailsJSON.get("DSPNM")+ "', "
					+ " `ACTIV` = '"+detailsJSON.get("ACTIV")+ "', "
					+ " `CRTDT` = '"+detailsJSON.get("CRTDT")+ "', "
					+ " `CRTBY` = '"+detailsJSON.get("CRTBY")+ "', "
					+ " `CHNDT` = '"+detailsJSON.get("CHNDT")+ "', "
					+ " `CHNBY` = '"+detailsJSON.get("CHNBY")+ "' "
					+ " where `USRID` = '"+detailsJSON.get("USRID")+ "'";
					
			System.out.println(query);
			int rowCount=dbcon.stm.executeUpdate(query);
			if(rowCount > 0){
				return detailsJSON;
			}else{
				//TODO: Consider Raising Error
				return new JSONObject(details);
			}
			
			

		}
		catch(Exception ex){
			System.out.println("Error from USER usermaster Command "+ex +"==dbcon=="+dbcon);
			return null;
		}
	}
	private JSONObject updateUserAccount(HashMap myInfo, ConnectionManager dbcon) {
		
		//TODO: Send email
		
		
		ResultSet rs=null;
		try{
			String details 	=  myInfo.get("details")+"";
			JSONObject detailsJSON 	= new JSONObject(details);
			
			if(dbcon == null){
				try{
					dbcon.Connect("MYSQL");
				}
				catch(Exception ex){
					System.out.println(""+ex);
				}
			}
			
			DateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
			Date date = new Date();
			detailsJSON.put("ACTIV", 1+"");
			detailsJSON.put("CRTDT", dateFormat.format(date)+"");
			detailsJSON.put("CRTBY", detailsJSON.get("USRID"));
			detailsJSON.put("CHNDT", dateFormat.format(date)+"");
			detailsJSON.put("CHNBY", detailsJSON.get("USRID"));
//			if(!detailsJSON.has("UERPW")){
//				detailsJSON.put("UERPW", detailsJSON.get("USRID").hashCode()+"");
//			}
			
			String query = "UPDATE `uacmt` set"
					+ "`USRNM` = '"+detailsJSON.get("USRNM")+ "', "
					+ "`ACTIV` = '"+detailsJSON.get("ACTIV")+ "', "
					+ "`CRTDT` = '"+detailsJSON.get("CRTDT")+ "', "
					+ "`CRTBY` = '"+detailsJSON.get("CRTBY")+ "',"
					+ "`CHNDT` = '"+detailsJSON.get("CHNDT")+ "', "
					+ "`CHNBY` = '"+detailsJSON.get("CHNBY")+ "' ";
			if(detailsJSON.has("UERPW")){
				query = query+  ",  `UERPW` = '"+detailsJSON.get("UERPW")+ "', ";
			}
					
					
			query = query+   " where `USRID` = '"+detailsJSON.get("USRID")+ "'";
			
			System.out.println(query);
			int rowCount=dbcon.stm.executeUpdate(query);
			if(rowCount > 0){
				return detailsJSON;
			}else{
				//TODO: Consider Raising Error
				return new JSONObject(details);
			}
			
			

		}
		catch(Exception ex){
			System.out.println("Error from USER Command "+ex +"==dbcon=="+dbcon);
			return null;
		}
	}
		
/*UPDATE USER METHODS END*/	
	
/*SELECT USER METHODS START*/	
	@SuppressWarnings("unchecked")
	private Object loginUser(HashMap myInfo, ConnectionManager dbcon) {
		try{
			myInfo.put("details",  selectUserAccount(myInfo, dbcon));
			String details 	=  myInfo.get("details")+"";
			JSONObject detailsJSON 	= new JSONObject(details);
			if(detailsJSON.has("USRID")){
				myInfo.put("details",  selectUserCharachteristics(myInfo, dbcon));
				myInfo.put("details",  selectUserAddress(myInfo, dbcon));
				
			}
		}catch(Exception ex){
			return new JSONObject();
		}
		
		return myInfo.get("details");
		
	}
	private Object selectUserAddress(HashMap myInfo, ConnectionManager dbcon) {
		
		
		ResultSet rs=null;
		try{
			String details 	=  myInfo.get("details")+"";
			JSONObject detailsJSON 	= new JSONObject(details);
			
			String query1 = "SELECT `uadmp`.`MPNID`, `uadmp`.`USRID`,  `uadmp`.`ADRID`, "
					+ " `uadmp`.`PRIMR`, `addmt`.`STREET`, `addmt`.`LNDMK`, `addmt`.`LOCLT`,"
					+ " `addmt`.`CTYID`, `addmt`.`CNTRY`, `addmt`.`PINCD`, `addmt`.`LONGT`, "
					+ " `addmt`.`LATIT`, `uadmp`.`ACTIV`, `uadmp`.`CHNDT`, `uadmp`.`CRTDT`, "
					+ " `uadmp`.`CRTBY`, `uadmp`.`CHNBY` "
					+ " FROM `uadmp` left outer join `addmt` on "
					+ "`uadmp`.`ADRID` = `addmt`.`ADRID` "
					+ "where `USRID` = '"+detailsJSON.get("USRID")+"'";				
			System.out.println(query1);
			rs =dbcon.stm.executeQuery(query1);
			JSONArray addArray = Convertor.convertToJSON(rs);
			detailsJSON.put("Address", addArray);
			return detailsJSON;

		}
		catch(Exception ex){
			System.out.println("Error from USER usermaster Command "+ex +"==dbcon=="+dbcon);
			return null;
		}
	}
	private Object selectUserCharachteristics(HashMap myInfo, ConnectionManager dbcon) {
		
		
		ResultSet rs=null;
		try{
			String details 	=  myInfo.get("details")+"";
			JSONObject detailsJSON 	= new JSONObject(details);
			
			String query1 = "SELECT `uchmt`.`USRID`, `chrmt`.`CHRID`, `uchmt`.`CHRID`, "
					+ "`uchmt`.`VALUE`,  "
					+ "`chrmt`.`DESCR`, `chrmt`.`REGXT`, `chrmt`.`MDTEXT`,  "
					+ "`chrmt`.`LNTXT`, `chrmt`.`SRTXT`  "
					+ " FROM `uchmt`    "    
					+ " left outer join      " 
					+ " `chrmt`  "       
					+ " on 	   "
					+ "  `uchmt`.`CHRID` = `chrmt`.`CHRID` "
					+ "where `uchmt`.`USRID` = '"+detailsJSON.get("USRID")+"'";				
			System.out.println(query1);
			rs =dbcon.stm.executeQuery(query1);
			JSONArray addArray = Convertor.convertToJSON(rs);
			detailsJSON.put("Characteristics", addArray);
			return detailsJSON;

		}
		catch(Exception ex){
			System.out.println("Error from USER usermaster Command "+ex +"==dbcon=="+dbcon);
			return null;
		}
	}
	private JSONObject selectUserAccount(HashMap myInfo, ConnectionManager dbcon) {
		//TODO: Send email
		ResultSet rs=null;
		try{
			String details 	=  myInfo.get("details")+"";
			JSONObject detailsJSON 	= new JSONObject(details);
			
			if(dbcon == null){
				try{
					dbcon.Connect("MYSQL");
				}
				catch(Exception ex){
					System.out.println(""+ex);
				}
			}
			
			String query = "SELECT `uacmt`.`USRID`,"
					+ " `uacmt`.`USRNM`,"
					+ " `uacmt`.`UERPW`, `usrmt`.`URCOD`, `usrmt`.`PRFIX`, `usrmt`.`TITLE`, "
					+ " `usrmt`.`FRNAM`, `usrmt`.`LTNAM`, `usrmt`.`URDOB`, `usrmt`.`GENDR`, "
					+ " `usrmt`.`DSPNM`, `uacmt`.`ACTIV`, `uacmt`.`CRTDT`, `uacmt`.`CRTBY`,"
					+ " `uacmt`.`CHNDT`, `uacmt`.`CHNBY` "
					+ " FROM `uacmt` left outer join "
					+ " `usrmt` on `uacmt`.`USRID` = `usrmt`.`USRID`";
			
			if(detailsJSON.has("USRID")){
				query = query  
						+ " where `uacmt`.`USRID` = "
						+ "'"+detailsJSON.get("USRID")+ "' "
						+ " and `uacmt`.`UERPW` = "
						+ "'"+detailsJSON.get("UERPW")+ "' ";
			}else if(detailsJSON.has("USRNM")){
				query = query  
						+ " where `uacmt`.`USRNM` = "
						+ "'"+detailsJSON.get("USRNM")+ "' "
						+ " and `uacmt`.`UERPW` = "
						+ "'"+detailsJSON.get("UERPW")+ "' ";
			}else{
				return null;
			}
				
					
			System.out.println(query);
			rs=dbcon.stm.executeQuery(query);
			JSONArray userArray = Convertor.convertToJSON(rs);
			return userArray.getJSONObject(0).put("UTYID","2");
		}
		catch(Exception ex){
			System.out.println("Error from USER Command "+ex +"==dbcon=="+dbcon);
			return null;
		}
	}
	
		
/*SELECT USER METHODS END*/	


}
