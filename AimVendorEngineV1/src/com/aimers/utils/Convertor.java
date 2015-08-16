package com.aimers.utils;

import org.json.JSONArray;
import org.json.JSONObject;

import java.sql.ResultSet;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.List;

/**
 * Utility for converting ResultSets into some Output formats
 * @author marlonlom
 */
public class Convertor {
	/**
	 * Convert a result set into a JSON Array
	 * @param resultSet
	 * @return a JSONArray
	 * @throws Exception
	 */
	public static JSONArray convertToJSON(ResultSet resultSet)
			throws Exception {
		JSONArray jsonArray = new JSONArray();
		while (resultSet.next()) {
			int total_rows = resultSet.getMetaData().getColumnCount();
			JSONObject obj = new JSONObject();
			for (int i = 0; i < total_rows; i++) {
				obj.put(resultSet.getMetaData().getColumnLabel(i + 1)
						.toUpperCase(), resultSet.getObject(i + 1));
			}
			jsonArray.put(obj);
		}
		return jsonArray;
	}
	/**
	 * Convert a result set into a XML List
	 * @param resultSet
	 * @return a XML String with list elements
	 * @throws Exception if something happens
	 */
	public static String convertToXML(ResultSet resultSet)
			throws Exception {
		StringBuffer xmlArray = new StringBuffer("<results>");
		while (resultSet.next()) {
			int total_rows = resultSet.getMetaData().getColumnCount();
			xmlArray.append("<result ");
			for (int i = 0; i < total_rows; i++) {
				xmlArray.append(" " + resultSet.getMetaData().getColumnLabel(i + 1)
						.toLowerCase() + "='" + resultSet.getObject(i + 1) + "'"); }
			xmlArray.append(" />");
		}
		xmlArray.append("</results>");
		return xmlArray.toString();
	}
	@SuppressWarnings("deprecation")
	public static JSONArray convertRulestoTimeSlots(JSONArray ruleDetailsJSON, String stDate, String enDate) {
		/*
		  "utyid": 1,
	      "rulid": 1,
	      "etcid": 1,
	      "timzn": "IST",
	      "entid": 1,
	      "etyid": 1,
	      "oetsl": "07:30:00",
	      "days": "1,2,3,4,5",
	      "dstim": "07:00:00",
	      "detim": "19:00:00",
	      "ostsl": "07:00:00",
	      "usrid": 3,
	      "descr": "Weekdays 7am to 7pm",
	      "recur": true,
	      "vtrid": 1
		 */

		JSONArray timeSlots = new JSONArray();
		try {		
			//Step 1: Create timeframe JSON Array
			SimpleDateFormat dateformat = new SimpleDateFormat("dd-MM-yyyy");
			Date startDate = dateformat.parse(stDate);
			Date endDate = dateformat.parse(enDate);
			List<Date> Dates = getDaysBetweenDates(startDate, endDate);
			for(int tIndex=0;tIndex<Dates.size();tIndex++){
				JSONObject timeSlot = new JSONObject();
				Date cDate =  Dates.get(tIndex);
				timeSlot.put("Date",cDate);	
				int day = cDate.getDay();
				for(int rIndex=0; rIndex<ruleDetailsJSON.length();rIndex++){
					JSONObject rule = (JSONObject) ruleDetailsJSON.get(rIndex);
					if(rule.get("DAYS").toString().contains(day+"")){
						timeSlot.put("DayStartTime", rule.get("DSTIM"));
						timeSlot.put("DayEndTime", rule.get("DETIM"));
						JSONArray slots = new JSONArray();
						timeSlot.put("TimeSlots", slots);
						
						SimpleDateFormat timeformat = new SimpleDateFormat("HH:mm:ss");
						
						Date startTime = timeformat.parse(rule.get("DSTIM")+"");
						Date endTime = timeformat.parse(rule.get("DETIM")+"");
						long milDiff =  endTime.getTime() - startTime.getTime();
						
						Date startSlotTime = timeformat.parse(rule.get("OSTSL")+"");
						Date endSlotTime = timeformat.parse(rule.get("OETSL")+"");
						long milDiffSlot =  endSlotTime.getTime() - startSlotTime.getTime();
						
						int totSlots = (int) (milDiff/milDiffSlot);
						for(int sIndex=0; sIndex<totSlots;sIndex++){
							JSONObject slot = new JSONObject();
							
							slot.put("START", timeformat.format(startTime));
							
							long newTime = startTime.getTime() + milDiffSlot;
							startTime.setTime(newTime);
							
							slot.put("END", timeformat.format(startTime));
							
							slots.put(slot);
						}
						
						
						
					}
				}
				timeSlots.put(timeSlot);
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return timeSlots;
	}
	public static List<Date> getDaysBetweenDates(Date startdate, Date enddate)
	{
	    List<Date> dates = new ArrayList<Date>();
	    Calendar calendar = new GregorianCalendar();
	    calendar.setTime(startdate);

	    while (calendar.getTime().before(enddate))
	    {
	        Date result = calendar.getTime();
	        dates.add(result);
	        calendar.add(Calendar.DATE, 1);
	    }
	    return dates;
	}
}
