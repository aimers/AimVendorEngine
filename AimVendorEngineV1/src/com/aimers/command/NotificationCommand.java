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
import com.google.android.gcm.server.Message;
import com.google.android.gcm.server.Result;
import com.google.android.gcm.server.Sender;

public class NotificationCommand extends aimCommand {
	private static final String GOOGLE_SERVER_KEY = "AIzaSyAjVVqw5PExcLBt0q6XDPEfo463hix4rlg"; 
	static final String MESSAGE_KEY = "message";	

	@SuppressWarnings("null")
	@Override
	public Object execute(HashMap myInfo, ConnectionManager dbcon) {
		// TODO Auto-generated method stub
		//STEP 1: get subaction info from myInfo // TODO
		String aimAction = (String) myInfo.get("AimAction");
		//STEP 2: goto respective methods base on subaction // TODO
		if(aimAction.equals("notify")){
			return notify(myInfo, dbcon);
		}if(aimAction.equals("notifyAllAppointments")){
			return notifyAll(myInfo, dbcon);
		}
		return new JSONObject();

	}

	private JSONArray notify(HashMap myInfo, ConnectionManager dbcon) {
		ResultSet rs=null;
		try{
			String details 	=  myInfo.get("details")+"";
			JSONObject detailsJSON 	= new JSONObject(details);
			String message = detailsJSON.get("MESSAGE")+"";
			String query = "select * FROM `uchmt`"
					+ " where `USRID` = '"+detailsJSON.get("USRID")+"' and "
							+ " `CHRID` = '12' ";		//Registration ID
			System.out.println(query);
			rs=dbcon.stm.executeQuery(query);
			JSONArray userRegDetail = Convertor.convertToJSON(rs);
			
			for(int rIndex=0; rIndex<userRegDetail.length(); rIndex++){
				String regId = ( (JSONObject) userRegDetail.get(rIndex)).get("VALUE")+"";
				try{
					sendNotification(regId, message);
				}catch(Exception ex){
					
				}
				
			}
			
			return userRegDetail;

		}
		catch(Exception ex){
			System.out.println("Error from USER usermaster Command "+ex +"==dbcon=="+dbcon);
			//return null;
		}
		return null;

		
	}




private JSONArray notifyAll(HashMap myInfo, ConnectionManager dbcon) {
	ResultSet rs=null;
	try{
		String details 	=  myInfo.get("details")+"";
		JSONObject detailsJSON 	= new JSONObject(details);
		String message = "Booking Alert";
		String query = "select * FROM `uchmt`"
				+ " where  "
						+ " `CHRID` = '12' ";		//Registration ID
		System.out.println(query);
		rs=dbcon.stm.executeQuery(query);
		JSONArray userRegDetail = Convertor.convertToJSON(rs);
		
		for(int rIndex=0; rIndex<userRegDetail.length(); rIndex++){
			String regId = ( (JSONObject) userRegDetail.get(rIndex)).get("VALUE")+"";
			try{
				sendNotification(regId, message);
			}catch(Exception ex){
				
			}
			
		}
		
		return userRegDetail;

	}
	catch(Exception ex){
		System.out.println("Error from USER usermaster Command "+ex +"==dbcon=="+dbcon);
		//return null;
	}
	return null;

	
}

private boolean sendNotification(String regId, String message) {
	try {
		String userMessage = message;
		System.out.println("Message " + userMessage);
		Sender sender = new Sender(GOOGLE_SERVER_KEY);
		Message oMessage = new Message.Builder().timeToLive(30)
				.delayWhileIdle(true).addData(MESSAGE_KEY, userMessage).build();
		System.out.println("regId: " + regId);
		Result result = sender.send(oMessage, regId, 1);
		System.out.println(result.toString());
		return true;
	} catch (Exception ex) {
		ex.printStackTrace();
		return false;
	}
	
}



}
