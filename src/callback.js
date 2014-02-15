if (typeof CivicInfoBC==='undefined') CivicInfoBC={};


CivicInfoBC.AddCallback=function (obj, event, func) {

	if (typeof obj[event]!=='function') {
	
		obj[event]=func;
		
	} else {
	
		var old=obj[event];
		
		obj[event]=function () {
		
			old.apply(arguments);
			
			return func.apply(arguments);
		
		}
	
	}

};
