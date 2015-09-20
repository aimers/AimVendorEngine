package com.aimers.command;

import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.Timer;
import java.util.TimerTask;

import com.aimers.dbaccess.ConnectionManager;


public class NotificationBatch extends TimerTask {
    private final static long ONCE_PER_DAY = 1000*60*60*24;

    //private final static int ONE_DAY = 1;
    private ConnectionManager dbcon=new ConnectionManager();
    private final static int NINE_AM = 18;
    private final static int ZERO_MINUTES = 14;
    public NotificationBatch(){
    	try{
			dbcon.Connect("MYSQL");
		}
		catch(Exception ex){
			System.out.println(""+ex);
		}
    }

    @Override
    public void run() {
         long currennTime = System.currentTimeMillis();
//        long stopTime = currennTime + 2000;//provide the 2hrs time it should execute 1000*60*60*2
//          while(stopTime != System.currentTimeMillis()){
            NotificationCommand notyCommand = new NotificationCommand();
            HashMap<String, String> myInfo = new HashMap();
            myInfo.put("AimAction", "notifyAllAppointments");
            notyCommand.execute(myInfo, dbcon);
            System.out.println("Start Job"+currennTime);
            //System.out.println("End Job"+System.currentTimeMillis());
//          }
    }
    private static Date getTomorrowMorning9AM(){

        Date date2am = new java.util.Date(); 
           date2am.setHours(NINE_AM); 
           date2am.setMinutes(ZERO_MINUTES); 

           return date2am;
      }
    //call this method from your servlet init method
    public static void startTask(){
    	NotificationBatch task = new NotificationBatch();
        Timer timer = new Timer();  
        timer.schedule(task,getTomorrowMorning9AM(), 1000*60*60*1);//ONCE_PER_DAY);// 1000*60*60*24
    }
    public static void main(String args[]){
        startTask();

    }

}