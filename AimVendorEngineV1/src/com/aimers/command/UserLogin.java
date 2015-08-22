package com.aimers.command;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.aimers.dbaccess.ConnectionManager;

public class UserLogin extends aimCommand {

	@Override
	public Object execute(HashMap myInfo, ConnectionManager dbcon) {
		// TODO Auto-generated method stub
		List<String> data = new ArrayList<String>();
		HashMap result = new HashMap();
		System.out.println("In command");
		data.add("Jemin");
		data.add("Aarya");
		result.put("Names", data);
		
		List<String> Id = new ArrayList<String>();
		Id.add("1");
		Id.add("2");
		result.put("ID", Id);
		
		return result;
	}

}
