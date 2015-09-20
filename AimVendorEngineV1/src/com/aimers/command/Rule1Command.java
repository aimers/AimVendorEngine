package com.aimers.command;


import java.sql.ResultSet;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.aimers.dbaccess.ConnectionManager;
import com.aimers.utils.Convertor;
import com.aimers.utils.mail.SendMailUsingAuthentication;

public class Rule1Command extends aimCommand {

	@SuppressWarnings("null")
	@Override
	public Object execute(HashMap myInfo, ConnectionManager dbcon) {
		// TODO Auto-generated method stub
		//STEP 1: get subaction info from myInfo // TODO
		String aimAction = (String) myInfo.get("AimAction");
		//STEP 2: goto respective methods base on subaction // TODO
		if(aimAction.equals("book")){
			return bookTimeSlot(myInfo, dbcon);
		}else if(aimAction.equals("createRule")){
			return createAutoTimeRule(myInfo, dbcon);
		}else if(aimAction.equals("getVendorRuleDef")){
			return getVendorRuleDef(myInfo, dbcon);
		}else if(aimAction.equals("updateRule")){
			return updateRule(myInfo, dbcon);
		}else if(aimAction.equals("cancelBooking")){
			return cancelBooking(myInfo, dbcon);
		}else if(aimAction.equals("acceptBooking")){
			return acceptBooking(myInfo, dbcon);
		}else if(aimAction.equals("deleteRule")){
			return deleteRule(myInfo, dbcon);
		}
		
		return new JSONObject();

	}

	private Object deleteRule(HashMap myInfo, ConnectionManager dbcon) {
		
		
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
			
			String query = "delete from `vrumt`"
					+ " where "
					+ " `VRMID` = '"+detailsJSON.get("VRMID")+ "' and ENTID not in ( select ENTID from `vtrdt`  "
							+ " where `VTRID` = '"+detailsJSON.get("VTRID")+ "'  "
									+ ") ";
					
			System.out.println(query);
			int rowCount=dbcon.stm.executeUpdate(query);
			//if(rowCount > 0){
				query = "delete from `vtrdt`"
						+ " where "
						+ " `VTRID` = '"+detailsJSON.get("VTRID")+ "'  ";
						
				System.out.println(query);
				rowCount=dbcon.stm.executeUpdate(query);
				if(rowCount > 0){
					return detailsJSON;
				}else{
					//TODO: Consider Raising Error
					return new JSONObject(details);
				}
//			}else{
//				//TODO: Consider Raising Error
//				return new JSONObject(details);
//			}
			
			

		}
		catch(Exception ex){
			System.out.println("Error from Rule 1 delete Command "+ex +"==dbcon=="+dbcon);
			return null;
		}
	}

	private Object cancelBooking(HashMap myInfo, ConnectionManager dbcon) {
		try{
			myInfo.put("details",  checkUserAuth(myInfo, dbcon));
			String details 	=  myInfo.get("details")+"";
			JSONObject detailsJSON 	= new JSONObject(details);
			if(detailsJSON.has("VTRMI")){
				myInfo.put("details",  deactivateBooking(myInfo, dbcon));
			}else{
				return null;
			}
		}catch(Exception ex){
			return new JSONObject();
		}
		
		return myInfo.get("details");
		
	}

	private Object deactivateBooking(HashMap myInfo, ConnectionManager dbcon) {
		
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
			detailsJSON.put("ACTIV", 0+"");
			
			
			detailsJSON.put("CHNBY", detailsJSON.get("USRID"));
			
			String query = "UPDATE `vtrmt`"
					+ "set `ACTIV` = '0' , STATS = '0' , `CHNBY` = "
					+ "'"+detailsJSON.get("CHNBY")+ "' "
					+ " where `VTRMI` = "
					+ "'"+detailsJSON.get("VTRMI")+ "' ";
					
			System.out.println(query);
			int rowCount=dbcon.stm.executeUpdate(query);
			if(rowCount > 0){
				try{
					SendMailUsingAuthentication sendEmail = new SendMailUsingAuthentication();
					String message = "Welcome to Aimmedics, Your booking is canceled for"
							+ "Date: "+detailsJSON.get("BDTIM")+" slot"
							+ detailsJSON.get("BOSTM")+ ":"+detailsJSON.get("BOETM")+".";
					String[] recipients = new String[2];
					recipients[0] = detailsJSON.get("CUEML")+"";
					recipients[1] = detailsJSON.get("VSEML")+"";
					String from = "uxdevsupport@aimersinfosoft.com";
					String subject = "Booking Canceled";
					sendEmail.postMail(recipients, subject, message, from);
				}catch(Exception ex){
					System.out.println("Error sending email :"+ex.getMessage());
				}
				return detailsJSON;
			}else{
				//TODO: Consider Raising Error
				return new JSONObject(details);
			}
			
			

		}
		catch(Exception ex){
			System.out.println("Error from Deactivate Rule 1 Command "+ex +"==dbcon=="+dbcon);
			return null;
		}
	}

	
	private Object acceptBooking(HashMap myInfo, ConnectionManager dbcon) {
		try{
			myInfo.put("details",  checkUserAuth(myInfo, dbcon));
			String details 	=  myInfo.get("details")+"";
			JSONObject detailsJSON 	= new JSONObject(details);
			if(detailsJSON.has("VTRMI")){
				myInfo.put("details",  activateBooking(myInfo, dbcon));
			}else{
				return null;
			}
		}catch(Exception ex){
			return new JSONObject();
		}
		
		return myInfo.get("details");
		
	}

	private Object activateBooking(HashMap myInfo, ConnectionManager dbcon) {
		
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
			detailsJSON.put("ACTIV", 1+"");
			detailsJSON.put("STATS", 1+"");
			
			detailsJSON.put("CHNBY", detailsJSON.get("USRID"));
			
			String query = "UPDATE `vtrmt`"
					+ "set `ACTIV` = '1' , STATS = '1' , `CHNBY` = "
					+ "'"+detailsJSON.get("CHNBY")+ "' "
					+ " where `VTRMI` = "
					+ "'"+detailsJSON.get("VTRMI")+ "' ";
					
			System.out.println(query);
			int rowCount=dbcon.stm.executeUpdate(query);
			if(rowCount > 0){
				try{
					SendMailUsingAuthentication sendEmail = new SendMailUsingAuthentication();
					String message = "Welcome to Aimmedics, Your booking is accepted for"
							+ "Date: "+detailsJSON.get("BDTIM")+" slot"
							+ detailsJSON.get("BOSTM")+ ":"+detailsJSON.get("BOETM")+".";
					String[] recipients = new String[2];
					recipients[0] = detailsJSON.get("CUEML")+"";
					recipients[1] = detailsJSON.get("VSEML")+"";
					String from = "uxdevsupport@aimersinfosoft.com";
					String subject = "Booking Accepted";
					sendEmail.postMail(recipients, subject, message, from);
				}catch(Exception ex){
					System.out.println("Error sending email :"+ex.getMessage());
				}
				return detailsJSON;
			}else{
				//TODO: Consider Raising Error
				return new JSONObject(details);
			}
			
			

		}
		catch(Exception ex){
			System.out.println("Error from Deactivate Rule 1 Command "+ex +"==dbcon=="+dbcon);
			return null;
		}
	}

	private Object updateRule(HashMap myInfo, ConnectionManager dbcon) {
		
		
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
			String query = "UPDATE `vtrdt`"
					+ " SET  "
					+ " `ENTID` = '"+detailsJSON.get("ENTID")+ "', " 
					+ " `ETCID` ='"+detailsJSON.get("ETCID")+ "', "
					+ " `ETYID` = '"+detailsJSON.get("ETYID")+ "', "
					+ " `RULID` = '"+detailsJSON.get("RULID")+ "' ,"
					+ " `DSTIM` = '"+detailsJSON.get("DSTIM")+ "', "
					+ " `DETIM` = '"+detailsJSON.get("DETIM")+ "', "
					+ " `TIMZN` = '"+detailsJSON.get("TIMZN")+ "', "
					+ " `OSTSL` = '"+detailsJSON.get("OSTSL")+ "', "
					+ " `OETSL` = '"+detailsJSON.get("OETSL")+ "', "
					+ " `RECUR` = '"+detailsJSON.get("RECUR")+ "', "
					+ " `DAYS` = '"+detailsJSON.get("DAYS")+ "', "
					+ " `DESCR` = '"+detailsJSON.get("DESCR")+ "', "
					+ " `ACTIV` = '"+detailsJSON.get("ACTIV")+ "', "
					+ " `CRTDT` = '"+detailsJSON.get("CRTDT")+ "', "
					+ " `CRTBY` = '"+detailsJSON.get("CRTBY")+ "', "
					+ " `CHNDT` = '"+detailsJSON.get("CHNDT")+ "', "
					+ " `CHNBY` = '"+detailsJSON.get("CHNBY")+ "' "
					+ " where "
					+ " `USRID` = '"+detailsJSON.get("USRID")+ "' and"
					+ " `UTYID` = '"+detailsJSON.get("UTYID")+ "' and "
					+ " `VTRID` = '"+detailsJSON.get("VTRID")+ "'  ";
					
			System.out.println(query);
			int rowCount=dbcon.stm.executeUpdate(query);
			if(rowCount > 0){
				query = "UPDATE `vrumt`"
						+ " SET  "
						+ " `ENTID` = '"+detailsJSON.get("ENTID")+ "', " 
						+ " `ETCID` ='"+detailsJSON.get("ETCID")+ "', "
						+ " `ETYID` = '"+detailsJSON.get("ETYID")+ "', "
						+ " `RULID` = '"+detailsJSON.get("RULID")+ "' ,"
						+ " `ACTIV` = '"+detailsJSON.get("ACTIV")+ "', "
						+ " `CRTDT` = '"+detailsJSON.get("CRTDT")+ "', "
						+ " `CRTBY` = '"+detailsJSON.get("CRTBY")+ "', "
						+ " `CHNDT` = '"+detailsJSON.get("CHNDT")+ "', "
						+ " `CHNBY` = '"+detailsJSON.get("CHNBY")+ "' "
						+ " where "
						+ " `USRID` = '"+detailsJSON.get("USRID")+ "' and"
						+ " `UTYID` = '"+detailsJSON.get("UTYID")+ "' and "
						+ " `VRMID` = '"+detailsJSON.get("VRMID")+ "'  ";
						
				System.out.println(query);
				rowCount=dbcon.stm.executeUpdate(query);
				if(rowCount > 0){
					return detailsJSON;
				}else{
					//TODO: Consider Raising Error
					return new JSONObject(details);
				}
				
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

	private Object getVendorRuleDef(HashMap myInfo, ConnectionManager dbcon) {
		
		JSONObject ruleDetails = new JSONObject();
		try{
			String details 	=  myInfo.get("details")+"";
			JSONObject detailsJSON 	= new JSONObject(details);
			ResultSet rs=null;
			
			String query = "SELECT `vrumt`.`VRMID`, `vtrdt`.`VTRID`, `vtrdt`.`UTYID`, `vtrdt`.`USRID`, "
					+ " `vtrdt`.`ENTID`, `vtrdt`.`ETCID`, `vtrdt`.`ETYID`, "
					+ " `vtrdt`.`RULID`, `vtrdt`.`DSTIM`, `vtrdt`.`DETIM`, `vtrdt`.`TIMZN`, "
					+ " `vtrdt`.`OSTSL`, `vtrdt`.`OETSL`, `vtrdt`.`RECUR`, `vtrdt`.`DAYS`, "
					+ " `vtrdt`.`DESCR` "
					//+ " `vtrdt`.`ACTIV`, "
					//+ " `vtrdt`.`CRTDT`, `vtrdt`.`CRTBY`, `vtrdt`.`CHNDT`, `vtrdt`.`CHNBY` "
					+ " FROM `vtrdt` "
					+"left outer join `vrumt` on "
					+" `vtrdt`.`USRID` = `vrumt`.`USRID` and `vtrdt`.`ENTID` = `vrumt`.`ENTID`"
					+ " where `vtrdt`.UTYID = '"+detailsJSON.get("UTYID")+"' and "
							+ " `vtrdt`.USRID = '"+detailsJSON.get("USRID")+"' and "
							+ " `vtrdt`.RULID = '"+detailsJSON.get("RULID")+"' ";

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
			ruleDetails.put("ruleDefinitions",Convertor.convertToJSON(rs));

			return ruleDetails;
		}


		catch(Exception ex){
			System.out.println("Error from VENDOR Command "+ex +"==dbcon=="+dbcon);
			return ruleDetails;
		}
	}

	/*START OF NEW RULE ID*/
	private Object createAutoTimeRule(HashMap myInfo, ConnectionManager dbcon) {
		try{
			myInfo.put("details",  checkUserAuth(myInfo, dbcon));
			String details 	=  myInfo.get("details")+"";
			JSONObject detailsJSON 	= new JSONObject(details);
			if(detailsJSON.has("USRID")){
				myInfo.put("details",  createNewAutoTimeRule(myInfo, dbcon));
			}
		}catch(Exception ex){
			return new JSONObject();
		}
		
		return myInfo.get("details");
		
	}

	private Object createNewAutoTimeRule(HashMap myInfo, ConnectionManager dbcon) {
		
		//TODO: Send email
		
		
		ResultSet rs=null;
		try{
			String details 	=  myInfo.get("details")+"";
			JSONObject detailsJSON 	= new JSONObject(details);
			String rulid = detailsJSON.getString("RULID");
			
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
			String vtrid = getNewRuleEntryID(dbcon);
			detailsJSON.put("VTRID", vtrid);
			detailsJSON.put("ACTIV", 1+"");
			detailsJSON.put("STATS", "1");//AUTO APPROVAL :: Change to Enum
			detailsJSON.put("CRTDT", dateFormat.format(date)+"");
			detailsJSON.put("CHNBY", detailsJSON.get("USRID"));
			detailsJSON.put("CRTBY", detailsJSON.get("USRID"));
			detailsJSON.put("CHNDT", dateFormat.format(date)+"");
			
			
			String query = "INSERT INTO `vtrdt` "
					+ " (`VTRID`, `UTYID`, `USRID`, `ENTID`, `ETCID`, `ETYID`, "
					+ "  `RULID`, `DSTIM`, `DETIM`, `TIMZN`, `OSTSL`, `OETSL`, "
					+ "  `RECUR`, `DAYS`, `DESCR`, "
					+ "  `ACTIV`, `CRTDT`, `CRTBY`, `CHNDT`, `CHNBY`)"
					+ "VALUES "
					+ " ("
					+ "'"+detailsJSON.get("VTRID")+ "',"
					+ "'"+detailsJSON.get("UTYID")+ "',"
					+ "'"+detailsJSON.get("USRID")+ "',"
					
					+ "'"+detailsJSON.get("ENTID")+ "'," 
					+ "'"+detailsJSON.get("ETCID")+ "'," 
					+ "'"+detailsJSON.get("ETYID")+ "'," 
					
					+ "'"+detailsJSON.get("RULID")+ "',"
					
					+ "'"+detailsJSON.get("DSTIM")+ "',"
					+ "'"+detailsJSON.get("DETIM")+ "',"
					+ "'"+detailsJSON.get("TIMZN")+ "',"
					
					+ "'"+detailsJSON.get("OSTSL")+ "',"
					+ "'"+detailsJSON.get("OETSL")+ "',"
					
					+ "'"+detailsJSON.get("RECUR")+ "',"
					+ "'"+detailsJSON.get("DAYS")+ "',"
					
					+ "'"+detailsJSON.get("DESCR")+ "',"
					
					+ "'"+detailsJSON.get("ACTIV")+ "',"
					+ "'"+detailsJSON.get("CRTDT")+ "',"
					+ "'"+detailsJSON.get("CRTBY")+ "',"
					+ "'"+detailsJSON.get("CHNDT")+ "',"
					+ "'"+detailsJSON.get("CHNBY")+ "')";
					
			System.out.println(query);
			int rowCount=dbcon.stm.executeUpdate(query);
			if(rowCount > 0){
				query = "UPDATE `vrumt`"
						+ " SET  "
						+ " `CHNDT` = '"+detailsJSON.get("CHNDT")+ "', "
						+ " `CHNBY` = '"+detailsJSON.get("CHNBY")+ "' "
						+ " where "
						+ " `USRID` = '"+detailsJSON.get("USRID")+ "' and"
						+ " `UTYID` = '"+detailsJSON.get("UTYID")+ "' and "
						+ " `ENTID` = '"+detailsJSON.get("ENTID")+ "' and "
						+ " `ETCID` ='"+detailsJSON.get("ETCID")+ "' and"
						+ " `ETYID` = '"+detailsJSON.get("ETYID")+ "' ";
						
				System.out.println(query);
				rowCount=dbcon.stm.executeUpdate(query);
				if(rowCount<=0){
					query = "INSERT INTO `bookingdb`.`vrumt`( `RULID`,`CRTDT`, `CRTBY`, `ETYID`, "
							+ " `ETCID`, `ENTID`, `UTYID`, `USRID`, `ACTIV`, `CHNDT`, `CHNBY`) "
							+ "VALUES "
							+ " ("
							+ "'"+detailsJSON.get("RULID")+ "',"
							+ "'"+detailsJSON.get("CRTDT")+ "',"
							+ "'"+detailsJSON.get("CRTBY")+ "',"		
							
							+ "'"+detailsJSON.get("ETYID")+ "'," 
							+ "'"+detailsJSON.get("ETCID")+ "'," 
							+ "'"+detailsJSON.get("ENTID")+ "'," 
							
							
	
							+ "'"+detailsJSON.get("UTYID")+ "',"
							+ "'"+detailsJSON.get("USRID")+ "',"
							
							
							+ "'"+detailsJSON.get("ACTIV")+ "',"
							
							+ "'"+detailsJSON.get("CHNDT")+ "',"
							+ "'"+detailsJSON.get("CHNBY")+ "')";
							
					System.out.println(query);
					rowCount=dbcon.stm.executeUpdate(query);
				}
				if(rowCount > 0){
					return detailsJSON;
				}else{
					//TODO: Consider Raising Error
					return new JSONObject(details);
				}
			}else{
				//TODO: Consider Raising Error
				return new JSONObject(details);
			}
			
			

		}
		catch(Exception ex){
			System.out.println("Error from Rule 1 Command "+ex +"==dbcon=="+dbcon);
			return null;
		}
	}

	private String getNewRuleEntryID(ConnectionManager dbcon) {
		
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
					"MAX(`VTRID`)+1"+
					" FROM `vtrdt`  ");
			rs=dbcon.stm.executeQuery("SELECT "+
					"MAX(`VTRID`)+1"+
					" FROM `vtrdt`  ");
			if(rs.next()){
				return rs.getString(1);
			}
			return "";

		}
		catch(Exception ex){
			System.out.println("Error from rule 1 command next rule ID Command "+ex +"==dbcon=="+dbcon);
			return "";
		}
	}
	/*END OF NEW RULE ID*/

	/*START OF NEW RULE BOOK*/
	private Object bookTimeSlot(HashMap myInfo, ConnectionManager dbcon) {
		try{
			myInfo.put("details",  checkUserAuth(myInfo, dbcon));
			String details 	=  myInfo.get("details")+"";
			JSONObject detailsJSON 	= new JSONObject(details);
			if(detailsJSON.has("CUSID")){
				myInfo.put("details",  createBooking(myInfo, dbcon));
			}
		}catch(Exception ex){
			return new JSONObject();
		}
		
		return myInfo.get("details");
		
	}
	
	private Object checkUserAuth(HashMap myInfo, ConnectionManager dbcon) {
		//TODO: Check the user authorization
		
		try {
			String details 	=  myInfo.get("details")+"";
			JSONObject detailsJSON;
			detailsJSON = new JSONObject(details);
			return detailsJSON;
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return null;
		}
		
}

	private JSONObject createBooking(HashMap myInfo, ConnectionManager dbcon) {
		
		//TODO: Send email
		
		
		ResultSet rs=null;
		try{
			String details 	=  myInfo.get("details")+"";
			JSONObject detailsJSON 	= new JSONObject(details);
			String rulid = detailsJSON.getString("RULID");
			
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
			String vtrmi = getNewBookingID(dbcon);
			detailsJSON.put("VTRMI", vtrmi);
			detailsJSON.put("ACTIV", 1+"");
			detailsJSON.put("STATS", "1");//AUTO APPROVAL :: Change to Enum
			detailsJSON.put("CRTDT", dateFormat.format(date)+"");
			detailsJSON.put("CRTBY", detailsJSON.get("CUSID"));
			detailsJSON.put("CHNDT", dateFormat.format(date)+"");
			
			
			detailsJSON.put("CHNBY", detailsJSON.get("CUSID"));
			
			String query = "INSERT INTO `vtrmt`"
					+ "(`VTRMI`, `VSUID`, `VUTID`, `CUSID`, `CUTID`,"
					+ " `ETYID`, `ETCID`, `ENTID`, `RULID`, `BDTIM`, `BTIMZ`, `BOSTM`, `BOETM`, "
					+ " `RTYPE`, `STATS`, `ACTIV`, `CRTDT`, `CRTBY`, `CHNDT`, `CHNBY`, `BTYPE`, `BNOTE`)"
					+ " VALUES "
					+ " ("
					+ "'"+detailsJSON.get("VTRMI")+ "',"
					+ "'"+detailsJSON.get("VSUID")+ "',"
					+ "'"+detailsJSON.get("VUTID")+ "',"
					+ "'"+detailsJSON.get("CUSID")+ "',"
					+ "'"+detailsJSON.get("CUTID")+ "',"
					
					+ "'"+detailsJSON.get("ETYID")+ "'," 
					+ "'"+detailsJSON.get("ETCID")+ "'," 
					+ "'"+detailsJSON.get("ENTID")+ "'," 
					
					+ "'"+detailsJSON.get("RULID")+ "',"
					
					+ "'"+detailsJSON.get("BDTIM")+ "',"
					+ "'"+detailsJSON.get("BTIMZ")+ "',"
					
					+ "'"+detailsJSON.get("BOSTM")+ "',"
					+ "'"+detailsJSON.get("BOETM")+ "',"
					
					+ "'"+detailsJSON.get("RTYPE")+ "',"
					+ "'"+detailsJSON.get("STATS")+ "',"
					
					+ "'"+detailsJSON.get("ACTIV")+ "',"
					+ "'"+detailsJSON.get("CRTDT")+ "',"
					+ "'"+detailsJSON.get("CRTBY")+ "',"
					+ "'"+detailsJSON.get("CHNDT")+ "',"
					+ "'"+detailsJSON.get("CHNBY")+ "',"
					+ "'"+detailsJSON.get("BTYPE")+ "',"
					+ "'"+detailsJSON.get("BNOTE")+ "')";
					
			System.out.println(query);
			int rowCount=dbcon.stm.executeUpdate(query);
			if(rowCount > 0){
				try{
					SendMailUsingAuthentication sendEmail = new SendMailUsingAuthentication();
					String message = "Welcome to Aimmedics, Your booking is confirmed for"
							+ "Date: "+detailsJSON.get("BDTIM")+" slot"
							+ detailsJSON.get("BOSTM")+ ":"+detailsJSON.get("BOETM")+".";
					String[] recipients = new String[2];
					recipients[0] = detailsJSON.get("CUEML")+"";
					recipients[1] = detailsJSON.get("VSEML")+"";
					String from = "uxdevsupport@aimersinfosoft.com";
					String subject = "Booing Confirmed";
					sendEmail.postMail(recipients, subject, message, from);
				}catch(Exception ex){
					System.out.println("Error sending email :"+ex.getMessage());
				}
				return detailsJSON;
			}else{
				//TODO: Consider Raising Error
				return new JSONObject(details);
			}
			
			

		}
		catch(Exception ex){
			System.out.println("Error from Rule 1 Command "+ex +"==dbcon=="+dbcon);
			return null;
		}
	}

	private String getNewBookingID(ConnectionManager dbcon) {
		
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
					"MAX(`VTRMI`)+1"+
					" FROM `vtrmt`  ");
			rs=dbcon.stm.executeQuery("SELECT "+
					"MAX(`VTRMI`)+1"+
					" FROM `vtrmt`  ");
			if(rs.next()){
				return rs.getString(1);
			}
			return "";

		}
		catch(Exception ex){
			System.out.println("Error from rule 1 command next ID Command "+ex +"==dbcon=="+dbcon);
			return "";
		}
	}
	/*END OF NEW RULE BOOK*/


}
