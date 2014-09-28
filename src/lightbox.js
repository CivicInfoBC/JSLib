if (typeof CivicInfoBC==='undefined') CivicInfoBC={};


CivicInfoBC.LightBox=function () {

	var self=this;

	this.background=document.createElement('div');
	this.background.className='lightbox_background';
	
	this.inner=document.createElement('div');
	this.inner.className='lightbox';
	
	this.wrapper=document.createElement('div');
	this.wrapper.className='lightbox_wrapper';
	this.wrapper.appendChild(this.inner);
	CivicInfoBC.AddCallback(
		this.wrapper,
		'onclick',
		function (event) {	if ((event ? event.target : window.event.srcElement)===this) self.Hide();	}
	);
	
	this.hidden=true;
	
	var f=function () {	self.resize();	};
	CivicInfoBC.AddCallback(window,'onresize',f);
	CivicInfoBC.AddCallback(window,'onload',f);
	f();
	var esc=function (event) {	if (event.keyCode===27) self.Hide();	};
	if (window.addEventListener) window.addEventListener('keydown',esc,true);
	else if (document.attachEvent) document.attachEvent('onkeydown',esc);
	else document.addEventListener('keydown',esc,true);

};


CivicInfoBC.LightBox.prototype.resize=function () {

	this.background.style.height=this.wrapper.style.height=(window.innerHeight || document.documentElement.clientHeight)+'px';

};


CivicInfoBC.LightBox.prototype.Get=function () {

	return this.inner;

};


CivicInfoBC.LightBox.prototype.Show=function () {

	if (!this.hidden) return false;
	
	document.body.appendChild(this.background);
	document.body.appendChild(this.wrapper);
	
	this.hidden=false;
	
	return true;

};


CivicInfoBC.LightBox.prototype.Hide=function () {

	if (this.hidden) return false;
	
	document.body.removeChild(this.background);
	document.body.removeChild(this.wrapper);
	this.hidden=true;
	
	return true;

};


CivicInfoBC.LightBox.prototype.Hidden=function () {

	return this.hidden;

};
