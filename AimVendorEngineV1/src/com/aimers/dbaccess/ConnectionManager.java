package com.aimers.dbaccess;
//con=DriverManager.getConnection("jdbc:mysql://127.0.0.1:3306/bookingdb","root","sa");
	//con=DriverManager.getConnection("jdbc:mysql://127.0.0.1:3306/bookingdb","iaadmin","iamocha");
import java.sql.*;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.ResourceBundle;

public class ConnectionManager {
	static Connection conn     = null; 
	static int retries = 0; 
	public static Statement stm = null;
	public static Connection Connect(String connectionType) { 

		
		String url          = "jdbc:mysql://127.0.0.1:3306/"; 
		String db           = "bookingdb"; 
		String driver       = "com.mysql.jdbc.Driver"; 
		String user         = "root"; //"iaadmin";//
		String password     = "sa";  //"iamocha";//
		
		try{
			 ResourceBundle messageBundle = ResourceBundle.getBundle("appConfig");
			 url = messageBundle.getString("url");
			 db = messageBundle.getString("db");
			 driver = messageBundle.getString("driver");
			 user = messageBundle.getString("user");
			 password = messageBundle.getString("password");
		}catch(Exception ex){
			System.out.println("Error in resource bundle..connecting with default. Error : "+ex.getMessage());
		}
		
		try { 
			Class.forName(driver).newInstance(); 
			
		} catch (InstantiationException e) { 
			e.printStackTrace(); 
		} catch (IllegalAccessException e) { 
			e.printStackTrace(); 
		} catch (ClassNotFoundException e) { 
			e.printStackTrace(); 
		} 
		try {
			if(retries > 10){
				System.out.println("Connection 10 retries crossed");
				ConnectionManager.conn =  null;
			}
			if(retries > 20){
				System.out.println("Connection 20 retries crossed");
				return conn;
			}
			if (ConnectionManager.conn == null){
				conn = DriverManager.getConnection(url+db+"?autoReconnect=true", user, password);
			}
			stm = conn.createStatement();
			conn.createStatement().executeQuery("select count(*) from usmt");
		} catch (SQLException e) {
			retries = retries + 1;
			System.out.println("Mysql Connection Error: "+e); 
			return ConnectionManager.Connect("MYSQL");			
		} 
		return conn; 
	}
	public static void closeConnection(){
//		try {
////			conn.close();
//		} catch (SQLException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		}
		
	}
	public static void main(String args[]){
		Connection conn = ConnectionManager.Connect("MYSQL");
		try {
			System.out.println(conn.createStatement().executeQuery("select count(*) from vempt").getFetchSize()+"");
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	public boolean Close(String string) {
//		try {
////	conn.close();
//} catch (SQLException e) {
//	// TODO Auto-generated catch block
//	e.printStackTrace();
//}
		return true;
	}
}
