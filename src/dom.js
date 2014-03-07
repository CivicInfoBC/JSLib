if (typeof CivicInfoBC==='undefined') CivicInfoBC={};


CivicInfoBC.DOM={};


CivicInfoBC.DOM.HasClass=function (e, name) {

	var regex=new RegExp(
		'(?:^|\\s)'+
		RegExp.escape(name)+
		'(?:\\s|$)'
	);
	
	return regex.test(e.className);

};


CivicInfoBC.DOM.AddClass=function (e, name) {

	if (!CivicInfoBC.DOM.HasClass(e,name)) e.className+=' '+name;

};


CivicInfoBC.DOM.RemoveClass=function (e, name) {

	var regex=new RegExp(
		'(?:^|\\s)'+RegExp.escape(name)+'(?=\\s|$)',
		'g'
	);
	
	e.className=e.className.replace(regex,'');

};


CivicInfoBC.DOM.GetElementsByClassName=function (e, name) {

	if (typeof e.getElementsByClassName==='function') return e.getElementsByClassName(name);
	
	var elements=e.getElementsByTagName('*');
	var retr=new Array();
	
	for (var i=0;i<elements.length;++i) if (
		CivicInfoBC.DOM.HasClass(
			elements[i],
			name
		)
	) retr.push(elements[i]);
	
	return retr;

};


CivicInfoBC.DOM.GetRadioValue=function (e) {

	if (typeof e.length==='undefined') return e.checked ? e.value : null;
	
	for (var i=0;i<e.length;++i) if (e[i].checked) return e[i].value;
	
	return null;

};
