//	Function so we have a scope
(function () {

	var add=function (what, add) {
	
		for (var i=2;i<arguments.length;++i)
		if (!(
			(arguments[i]===null) ||
			arguments[i].prototype[what]
		)) arguments[i].prototype[what]=add;
	
	};
	
	var html=(typeof HTMLElement==='undefined') ? null : HTMLElement;
	var e=(typeof Element==='undefined') ? null : Element;
	var node=(typeof Node==='undefined') ? null : Node;
	
	add(
		'hasClass',
		function (name) {
		
			var regex=new RegExp('(?:^|\\s)'+RegExp.escape(name)+'(?:\\s|$)');
			
			return regex.test(this.className);
		
		},
		e,
		node
	);
	
	add(
		'addClass',
		function (name) {
		
			if (!this.hasClass(name)) this.className+=' '+name;
		
		},
		e,
		node
	);
	
	add(
		'removeClass',
		function (name) {
		
			var regex=new RegExp(
				'(?:^|\\s)'+RegExp.escape(name)+'(?=\\s|$)',
				'g'
			);
			
			this.className=this.className.replace(regex,'');
		
		},
		e,
		node
	);
	
	add(
		'getElementsByClassName',
		function (name) {
	
			var elements=this.getElementsByTagName('*');
			var retr=new Array();
			
			for (var i=0;i<elements.length;++i) if (elements[i].hasClass(name)) retr.push(elements[i]);
			
			return retr;
		
		},
		html,
		e,
		node
	);

})();
