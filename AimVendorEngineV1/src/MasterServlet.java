//package com.aimers.servlet;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.*;

import javax.servlet.*;
import javax.servlet.http.*;

import org.json.JSONObject;

import com.aimers.dbaccess.*;
import com.aimers.command.*;


public class MasterServlet
    extends HttpServlet {

		ConnectionManager dbcon=new ConnectionManager();
		String current="";
	public void init(){
		System.out.println("Inside INIT method");

		try{
			dbcon.Connect("MYSQL");
		}
		catch(Exception ex){
			System.out.println(""+ex);
		}
	}
	public void doGet(HttpServletRequest request, HttpServletResponse response)
	throws ServletException, IOException {
		System.out.println("Aim--from get>>"+request.getParameter("AimAction"));
		if(request.getParameter("AimAction") != null )
			doPost(request,response);
	}
	public void doPost(HttpServletRequest request, HttpServletResponse response)
	throws ServletException, IOException {
		PrintWriter out = response.getWriter();
		response.setContentType("text/plain");
		try{
			/*
			UserName.Command=fetchUser
			UserName.ServAttribute=ServRs
			UserName.Next=HomePage.jsp
			*/
			System.out.println("Aim--from post>>"+request.getParameter("AimAction"));
			HashMap myInfo= new HashMap();
			myInfo.put("AimAction", request.getParameter("AimAction"));
			Enumeration cacheValues=request.getParameterNames();
			String cache=null;
			while( cacheValues.hasMoreElements() ){
				cache=(String)cacheValues.nextElement();
				System.out.println("myInfo cache "+cache+" value "+ request.getParameter(cache));
				myInfo.put(cache,request.getParameter(cache));

			}
			String aimAction=null;
			try
			{
				aimAction=(String)request.getParameter("AimAction");
			}
			catch(Exception ex){
				System.out.println("No Action Defined");
			}

			if( aimAction != null ){

				System.out.println("Aim-->>"+request.getParameter("AimAction"));
				ResourceBundle AimNav=ResourceBundle.getBundle("./AimNav");

				String command=AimNav.getString(aimAction+".Command");

				String servAttribute=AimNav.getString(aimAction+".ServAttribute");
				String next=AimNav.getString(aimAction+".Next");

				//last changed
				//request.setAttribute("current",next);
				current=next;
				System.out.println("Next page>>>"+next);
				System.out.println("Command to be called>>"+command);
				PrintWriter dataResponse = response.getWriter();
				
				if(command != null && !command.equalsIgnoreCase("nullCommand")){
					System.out.println("Inside if to call command");
					Class cs=Class.forName("com.aimers.command."+command);
					aimCommand acmd=(aimCommand)cs.newInstance();
						if( servAttribute != null && servAttribute.trim().length() != 0 ){
							JSONObject jResp = new JSONObject();
							//jResp.put();
							jResp.put(servAttribute,acmd.execute(myInfo,dbcon));
							dataResponse.print(jResp);
							//request.setAttribute(servAttribute,acmd.execute(myInfo,dbcon));
						}
						else{
							acmd.execute(myInfo,dbcon);
						}
				}

				//response.sendRedirect("HomePage.jsp")
				System.out.println("Before Request Dispatcher>>>"+"./AimMedics/jsp/"+next);
				//request.setAttribute("name","Jemin");
				//RequestDispatcher view= request.getRequestDispatcher(next);
				//view.include(request,response);
				//String url="http://localhost:8080/examples/AimMedics/jsp/"+next;
				//System.out.println("To next sendredirect:"+next);
				//response.sendRedirect(url);
				
				//response.setContentType("application/json");
				// Get the printwriter object from response to write the required json object to the output stream      
				
				// Assuming your json object is **jsonObject**, perform the following, it will return your json object  
				
				dataResponse.flush();
				
				System.out.println("After Request Dispatcher");

			}
		/*else{
		//	String current="./AimMedics/jsp/"+(String)request.getAttribute("current");
			System.out.println("To current sendredirect:"+current);
			String url="http://localhost:8080/examples/AimMedics/jsp/"+current;
			System.out.println("To current sendredirect:"+url);
			//response.sendRedirect(url);
		}*/

		}
		catch(Exception ex){
			System.out.println(""+ex);
		}

	}
	public void destroy(){
		System.out.println("Inside Destroy");
		boolean status=dbcon.Close("MYSQL");

	}

}
