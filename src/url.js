if (typeof CivicInfoBC==='undefined') CivicInfoBC={};


CivicInfoBC.URL={};


CivicInfoBC.URL.MakeQueryString=function (args) {

	var retr='';
	var first=true;
	for (var key in args) {
	
		if (typeof args[key]==='function') continue;
	
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
