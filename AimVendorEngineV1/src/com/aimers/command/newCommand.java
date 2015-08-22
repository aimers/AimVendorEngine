package com.aimers.command;

import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.aimers.dbaccess.ConnectionManager;
import com.aimers.utils.Convertor;

public class newCommand extends aimCommand {

	@SuppressWarnings("null")
	@Override
	public Object execute(HashMap myInfo, ConnectionManager dbcon) {
		// TODO Auto-generated method stub
		
		List names = new ArrayList();
//		
//		names.add("something");
//		names.add("new");
//		names.add("happened");
//		
//		//names.
//		
//		return names;
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
//		if(myInfo.get("ReqNo") != null && !myInfo.get("ReqNo").toString().equals("")){
//				System.out.println("select * from RHOD where ReqNo= \""+myInfo.get("ReqNo")+"\" order by ReqNo");
//				rs=dbcon.stm.executeQuery("select * from RHOD where ReqNo= \""+myInfo.get("ReqNo")+"\" order by ReqNo");
//			}else{
				System.out.println("SELECT `TEMP`.`MPID`, `TEMP`.`NAME`, `TEMP`.`NUMBER` FROM `core`.`TEMP`");
				rs=dbcon.stm.executeQuery("SELECT `TEMP`.`MPID`, `TEMP`.`NAME`, `TEMP`.`NUMBER` FROM `core`.`TEMP`");
				return Convertor.convertToJSON(rs);
//			}
			//return names;

		}
		catch(Exception ex){
			System.out.println("Error from RHOD "+ex +"==dbcon=="+dbcon);
			return null;
		}
		
	}

}
