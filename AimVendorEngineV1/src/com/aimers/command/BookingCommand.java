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
import org.json.JSONObject;

import com.aimers.dbaccess.ConnectionManager;
import com.aimers.utils.Convertor;

public class BookingCommand extends aimCommand {

	@SuppressWarnings("null")
	@Override
	public Object execute(HashMap myInfo, ConnectionManager dbcon) {
		// TODO Auto-generated method stub
		//STEP 1: get subaction info from myInfo // TODO
		String aimAction = (String) myInfo.get("AimAction");
		//STEP 2: goto respective methods base on subaction // TODO
		if(aimAction.equals("book")){
			return book(myInfo, dbcon);
		}if(aimAction.equals("cancelBooking")){
			return cancelBooking(myInfo, dbcon);
		}if(aimAction.equals("acceptBooking")){
			return acceptBooking(myInfo, dbcon);
		}
		
		return new JSONObject();

	}
	private Object acceptBooking(HashMap myInfo, ConnectionManager dbcon) {
		try{
			String details 	=  myInfo.get("details")+"";
			JSONObject detailsJSON 	= new JSONObject(details);
			String rulid = detailsJSON.getString("RULID");
			aimCommand rule= null;
			if(rulid.equals("1")){
				rule = new Rule1Command();
			}else if(rulid.equals("2")){
				rule = new Rule2Command();
			}else if(rulid.equals("3")){
				rule = new Rule3Command();
			}
			
			if(rule != null){
				return (JSONObject) rule.execute(myInfo, dbcon);
			}else{
				return null;
			}
				
		}
		catch(Exception ex){
			System.out.println("Error from Booking Command "+ex +"==dbcon=="+dbcon);
			return null;
		}
	}


private Object cancelBooking(HashMap myInfo, ConnectionManager dbcon) {
	try{
		String details 	=  myInfo.get("details")+"";
		JSONObject detailsJSON 	= new JSONObject(details);
		String rulid = detailsJSON.getString("RULID");
		aimCommand rule= null;
		if(rulid.equals("1")){
			rule = new Rule1Command();
		}else if(rulid.equals("2")){
			rule = new Rule2Command();
		}else if(rulid.equals("3")){
			rule = new Rule3Command();
		}
		
		if(rule != null){
			return (JSONObject) rule.execute(myInfo, dbcon);
		}else{
			return null;
		}
			
	}
	catch(Exception ex){
		System.out.println("Error from Booking Command "+ex +"==dbcon=="+dbcon);
		return null;
	}
}

	/*CREATE USER METHODS START*/	
	private Object book(HashMap myInfo, ConnectionManager dbcon) {
		try{
			myInfo.put("details",  createBooking(myInfo, dbcon));
		}catch(Exception ex){
			return new JSONObject();
		}
		
		return myInfo.get("details");
		
	}
	
	private JSONObject createBooking(HashMap myInfo, ConnectionManager dbcon) {
		try{
			String details 	=  myInfo.get("details")+"";
			JSONObject detailsJSON 	= new JSONObject(details);
			String rulid = detailsJSON.getString("RULID");
			aimCommand rule= null;
			if(rulid.equals("1")){
				rule = new Rule1Command();
			}else if(rulid.equals("2")){
				rule = new Rule2Command();
			}else if(rulid.equals("3")){
				rule = new Rule3Command();
			}
			
			if(rule != null){
				return (JSONObject) rule.execute(myInfo, dbcon);
			}else{
				return null;
			}
				
		}
		catch(Exception ex){
			System.out.println("Error from Booking Command "+ex +"==dbcon=="+dbcon);
			return null;
		}
	}
	


}
