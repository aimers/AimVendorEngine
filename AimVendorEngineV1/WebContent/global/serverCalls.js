exa.reuse.serverCall = {
		
	call: function(url, async, callback){
			var xmlhttp;
			xmlhttp=new XMLHttpRequest();
			xmlhttp.open("GET",url,async);
			if(async){
				xmlhttp.onreadystatechange=function(){
					if(xmlhttp.readyState==4 && xmlhttp.status==200)
					{
						//TODO VALIDATE RESPONSE
						callback(eval('(' + xmlhttp.responseText + ')'));	
					}
			};
				xmlhttp.send();
			}
			else{
				
				xmlhttp.open("GET",url,async);
				xmlhttp.send();
				return JSON.parse(xmlhttp.responseText); 
			}
			
	}
		
};