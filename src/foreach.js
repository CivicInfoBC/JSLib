if (typeof CivicInfoBC==='undefined') CivicInfoBC={};


CivicInfoBC.ForEach=function (items, func) {

	if (typeof items.length==='undefined') {
	
		var retr=func(items);
		
		if (typeof retr!=='undefined') return retr;
		
		return;
	
	}
	
	for (var i=0;i<items.length;++i) {
	
		var retr=func(items[i]);
		
		if (typeof retr!=='undefined') return retr;
		
	}

};
