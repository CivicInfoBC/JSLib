if (!Object.prototype.addCallback) Object.prototype.addCallback=function (event, func) {

	if (typeof this[event]!=='function') {
	
		this[event]=func;
		
	} else {
	
		var old=this[event];
		
		this[event]=function () {
		
			old.apply(arguments);
			
			return func.apply(arguments);
		
		}
	
	}

};
