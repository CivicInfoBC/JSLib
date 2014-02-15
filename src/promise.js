if (typeof CivicInfoBC==='undefined') CivicInfoBC={};


CivicInfoBC.Promise=function () {

	this.completed=false;
	this.then=null;
	this.result=null;
	this.error=null;

};


CivicInfoBC.Promise.prototype.Then=function (func) {

	var promise=new CivicInfoBC.Promise();
	var inner=function (p) {
	
		promise.Execute(function () {	return func(p);	});
	
	};
	
	if (this.completed) inner(this);
	else CivicInfoBC.AddCallback(
		this,
		'then',
		inner
	);
	
	return promise;

};


CivicInfoBC.Promise.prototype.Get=function () {

	if (!this.completed) throw new Error('Promise not yet fulfilled');
	
	if (this.error!==null) throw this.error;
	
	return this.result;

};


CivicInfoBC.Promise.prototype.Fulfilled=function (obj) {

	return this.completed;

};


CivicInfoBC.Promise.prototype.Complete=function (obj) {

	this.completed=true;
	this.result=obj;
	if (this.then!==null) {
	
		this.then(this);
		this.then=null;
		
	}

};


CivicInfoBC.Promise.prototype.Fail=function (e) {

	this.completed=true;
	this.error=e;
	if (this.then!==null) {
	
		this.then(this);
		this.then=null;
		
	}

};


CivicInfoBC.Promise.prototype.Execute=function (func) {

	try {
	
		var retr=func();
		
		this.Complete((typeof retr==='undefined') ? null : retr);
		
		return retr;
	
	} catch (e) {
	
		this.Fail(e);
	
	}

};
