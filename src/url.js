if (typeof CivicInfoBC==='undefined') CivicInfoBC={};


CivicInfoBC.URL={};


CivicInfoBC.URL.MakeQueryString=function (args) {

	var retr='';
	var first=true;
	for (var key in args) {
	
		if (first) {
		
			retr+='?';
			
			first=false;
		
		} else {
		
			retr+='&';
		
		}
		
		retr+=encodeURIComponent(key)+'='+encodeURIComponent(args[key]);
	
	}
	
	return retr;

};


CivicInfoBC.URL.GetQueryString=function (qs) {

	var split=qs.substr(1).split('&');
	var obj={};
	
	for (var i=0;i<split.length;++i) {
	
		var inner=split[i].split('=');
		
		obj[decodeURIComponent(inner[0])]=decodeURIComponent(inner[1]) || '';
	
	}
	
	return obj;

};
