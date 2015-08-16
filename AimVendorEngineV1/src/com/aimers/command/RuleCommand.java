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

public class RuleCommand extends aimCommand {

	@SuppressWarnings("null")
	@Override
	public Object execute(HashMap myInfo, ConnectionManager dbcon) {
		// TODO Auto-generated method stub
		//STEP 1: get subaction info from myInfo // TODO
		String aimAction = (String) myInfo.get("AimAction");
		//STEP 2: goto respective methods base on subaction // TODO
		if(aimAction.equals("createRule")){
			return createRule(myInfo, dbcon);
		}else if(aimAction.equals("getVendorRuleDef")){
			return getRuleDefinition(myInfo, dbcon);
		}else if(aimAction.equals("updateRule")){
			return updateRule(myInfo, dbcon);
		}
		
		return new JSONObject();

	}

	private Object updateRule(HashMap myInfo, ConnectionManager dbcon) {
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
			System.out.println("Error from Rule Command "+ex +"==dbcon=="+dbcon);
			return null;
		}
	}

	private Object getRuleDefinition(HashMap myInfo, ConnectionManager dbcon) {
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
			System.out.println("Error from Rule Command "+ex +"==dbcon=="+dbcon);
			return null;
		}
	}

	/*CREATE USER METHODS START*/	
	private Object createRule(HashMap myInfo, ConnectionManager dbcon) {
		try{
			myInfo.put("details",  createRules(myInfo, dbcon));
		}catch(Exception ex){
			return new JSONObject();
		}
		
		return myInfo.get("details");
		
	}
	
	private JSONObject createRules(HashMap myInfo, ConnectionManager dbcon) {
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
			System.out.println("Error from Rule Command "+ex +"==dbcon=="+dbcon);
			return null;
		}
	}
	


}
