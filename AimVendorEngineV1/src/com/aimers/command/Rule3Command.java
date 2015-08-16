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

public class Rule3Command extends aimCommand {

	@SuppressWarnings("null")
	@Override
	public Object execute(HashMap myInfo, ConnectionManager dbcon) {
		// TODO Auto-generated method stub
		//STEP 1: get subaction info from myInfo // TODO
		String aimAction = (String) myInfo.get("AimAction");
		//STEP 2: goto respective methods base on subaction // TODO
		if(aimAction.equals("book")){
			return bookTimeSlot(myInfo, dbcon);
		}
		
		return new JSONObject();

	}

/*CREATE USER METHODS START*/	
	private Object bookTimeSlot(HashMap myInfo, ConnectionManager dbcon) {
		try{
			myInfo.put("details",  checkUserAuth(myInfo, dbcon));
			String details 	=  myInfo.get("details")+"";
			JSONObject detailsJSON 	= new JSONObject(details);
			if(detailsJSON.has("USRID")){
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
			detailsJSON.put("STATS", "1");
			detailsJSON.put("CRTBY", detailsJSON.get("CUSID"));
			detailsJSON.put("CHNDT", dateFormat.format(date)+"");
			detailsJSON.put("CHNBY", detailsJSON.get("CUSID"));
			
			
			String query = "INSERT INTO `bookingdb`.`vtrmt`"
					+ "(`VTRMI`, `VSUID`, `VUTID`, `CUSID`, `CUTID`,"
					+ " `ETYID`, `ETCID`, `ENTID`, `RULID`, `BDTIM`, `BTIMZ`, `BOSTM`, `BOETM`, "
					+ " `RTYPE`, `STATS`, `ACTIV`, `CRTDT`, `CRTBY`, `CHNDT`, `CHNBY`)"
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
					" FROM `bookingdb`.`vtrmt`  ");
			rs=dbcon.stm.executeQuery("SELECT "+
					"MAX(`VTRMI`)+1"+
					" FROM `bookingdb`.`vtrmt`  ");
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
	


}
