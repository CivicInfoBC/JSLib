if (typeof CivicInfoBC==='undefined') CivicInfoBC={};


CivicInfoBC.HTTPRequest=function (url) {

	this.url=(typeof url==='undefined') ? '' : url;
	this.method='GET';
	this.body='';
	this.headers={};
	this.request=this.get_request();

};


CivicInfoBC.HTTPRequest.prototype.get_request=function () {

	var request;
	
	if (window.XMLHttpRequest) {
	
		request=new XMLHttpRequest();
	
	} else if (window.ActiveXObject) {
	
		try {
		
			request=new ActiveXObject('Msxml2.XMLHTTP');
		
		} catch (e) {
		
			try {
			
				request=new ActiveXObject('Microsoft.XMLHTTP');
			
			} catch (e) {	}
		
		}
	
	}
	
	if (!request) throw new Error('Could not create an AJAX request object');

	return request;

};


CivicInfoBC.HTTPRequest.prototype.open=function (async) {

	this.request.open(
		this.method,
		this.url,
		async
	);

};


CivicInfoBC.HTTPRequest.prototype.set_headers=function () {

	for (var key in this.headers)
	if (typeof this.headers[key]!=='function')
	this.request.setRequestHeader(
		key,
		this.headers[key]
	);

};


CivicInfoBC.HTTPRequest.prototype.send=function () {

	this.request.send(this.body);

};


CivicInfoBC.HTTPRequest.prototype.get_response=function () {

	var retr={};
	
	retr.body=this.request.responseText;
	if (retr.body===null) throw new Error('HTTP request failed');
	
	retr.status=this.request.status;
	
	return retr;

};


CivicInfoBC.HTTPRequest.prototype.async_execute=function () {

	var promise=new CivicInfoBC.Promise();
	var self=this;
	this.request.onreadystatechange=function () {
	
		if (self.request.readyState===4) promise.Execute(function () {
		
			return self.get_response();
		
		});
	
	};
	
	this.open(true);
	this.set_headers();
	this.send();
	
	return promise;

};


CivicInfoBC.HTTPRequest.prototype.sync_execute=function () {

	this.open(false);
	this.set_headers();
	this.send();
	
	return this.get_response();

};


CivicInfoBC.HTTPRequest.prototype.Execute=function (async) {

	return (
		(typeof async==='undefined') ||
		async
	) ? this.async_execute() : this.sync_execute();

};
