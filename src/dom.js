//	Function so we have a scope
(function () {

	var add=function (what, add) {
	
		for (var i=2;i<arguments.length;++i)
		if (
			(typeof arguments[i]!=='undefined') &&
			!arguments[i].prototype[what]
		) arguments[i].prototype[what]=add;
	
	};
	
	add(
		'hasClass',
		function (name) {
		
			var regex=new RegExp('(?:^|\\s)'+RegExp.escape(name)+'(?:\\s|$)');
			
			return regex.test(this.className);
		
		},
		Element,
		Node
	);
	
	add(
		'addClass',
		function (name) {
		
			if (!this.hasClass(name)) this.className+=' '+name;
		
		},
		Element,
		Node
	);
	
	add(
		'removeClass',
		function (name) {
		
			var regex=new RegExp(
				'(?:^|\\s)'+RegExp.escape(name)+'(?:\\s|$)',
				'g'
			);
			
			this.className=this.className.replace(regex,'');
		
		},
		Element,
		Node
	);
	
	add(
		'getElementsByClassName',
		function (name) {
	
			var elements=this.getElementsByTagName('*');
			var retr=new Array();
			
			for (var i=0;i<elements.length;++i) if (elements[i].hasClass(name)) retr.push(elements[i]);
			
			return retr;
		
		},
		HTMLDocument,
		Element,
		Node
	);

})();
