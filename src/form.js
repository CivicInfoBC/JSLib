if (typeof CivicInfoBC==='undefined') CivicInfoBC={};


CivicInfoBC.Form=function (element) {

	//	The form itself
	this.element=element;
	
	//	Attach to onsubmit event
	var self=this;
	CivicInfoBC.AddCallback(
		element,
		'onsubmit',
		function () {	return self.Validate();	}
	);

};


//	Retrieves an attribute safely
//
//	Some implementations return an empty string when
//	getAttribute is called on a non-existent attribute,
//	others return null.  This function abstracts that
//	away, always returning null if an attribute doesn't
//	exist
CivicInfoBC.Form.prototype.get_attribute=function (element, name) {

	return element.hasAttribute(name) ? element.getAttribute(name) : null;

}


//	Processes a condition
CivicInfoBC.Form.prototype.evaluate_condition=function (element, name) {

	var str=this.get_attribute(element,name);
	if (str===null) return null;

	var conds=str.split(' ');
	var retr=null;
	for (var i=0;i<conds.length;++i) {
	
		var cond=conds[i].trim();
		
		if (cond==='') continue;
		
		if (typeof this[cond]!=='function') continue;
		
		var r=this[cond](element);
		
		if (r) return true;
		else retr=false;
	
	}
	
	return retr;

};


CivicInfoBC.Form.prototype.is_conditionally_mandatory_impl=function (element) {

	return this.evaluate_condition(element,'data-mandatory-if');

}


//	Determines if an element is conditionally mandatory
CivicInfoBC.Form.prototype.is_conditionally_mandatory=function (element) {

	var retr=this.is_conditionally_mandatory_impl(element);
	return (retr===null) ? false : retr;

};


//	Determines if an element is mandatory
CivicInfoBC.Form.prototype.is_mandatory=function (element) {

	return element.hasAttribute('data-mandatory');

};


//	Implementation of executing a custom callback
CivicInfoBC.Form.prototype.execute_custom_impl=function (element, name) {

	var callback=this.get_attribute(element,name);
	if (
		(callback===null) ||
		(typeof this[callback]!=='function')
	) return null;
	
	return this[callback](element);

};


//	Converts null values to true
CivicInfoBC.Form.prototype.true_if_null=function (val) {

	return (val===null) ? true : val;

};


//	Executes a custom callback if specified
CivicInfoBC.Form.prototype.execute_custom=function (element) {

	return this.true_if_null(this.execute_custom_impl(element,'data-callback'));

};


//	Implementation of checking a regex
CivicInfoBC.Form.prototype.check_regex_impl=function (element, name) {

	var pattern=this.get_attribute(element,name);
	if (pattern===null) return null;
	
	var flags='';
	if (element.hasAttribute(name+'-case-insensitive')) flags+='i';
	if (element.hasAttribute(name+'-multiline')) flags+='m';
	
	var regex=new RegExp(pattern,flags);
	return regex.test(element.value);

};


//	Checks a regex if specified
CivicInfoBC.Form.prototype.check_regex=function (element) {

	return this.true_if_null(this.check_regex_impl(element,'data-regex'));

};


//	Processes a text field
CivicInfoBC.Form.prototype.process_text=function (element) {

	//	Is this field mandatory?
	//
	//	If so, make sure it has contents
	if (
		(
			this.is_mandatory(element) ||
			this.is_conditionally_mandatory(element)
		) &&
		(element.value.trim()==='')
	) return false;
	
	//	Execute custom validation callback if
	//	appropriate
	if (!this.execute_custom(element)) return false;
	
	//	If this element has a regex handler,
	//	invoke that
	if (!this.check_regex(element)) return false;
	
	//	Nothing failed, so this element is good
	return true;

};


//	Determines if a radio button is a valid selection
CivicInfoBC.Form.prototype.is_radio_valid=function (element) {

	//	Unconditionally invalid
	if (element.hasAttribute('data-invalid')) return false;

	//	Conditionally valid
	if (
		(this.evaluate_condition(element,'data-valid-if')===false) ||
		(this.evaluate_condition(element,'data-invalid-if')===true)
	) return false;
	
	return true;

};


CivicInfoBC.Form.prototype.process_radio=function (element) {

	if (this.is_conditionally_mandatory_impl(element)===false) return true;
	
	if (!this.is_radio_valid(element)) return false;
	
	return element.checked;

};


//	Processes a set of radio buttons or a single radio
//	button
CivicInfoBC.Form.prototype.process_radios=function (elements) {

	if (typeof elements.length==='undefined') return this.process_radio(elements);

	for (var i=0;i<elements.length;++i) if (this.process_radio(elements[i])) return true;
	
	return false;

};


//	Processes a drop-down
CivicInfoBC.Form.prototype.process_select=function (element) {

	var value=element.options[element.selectedIndex].value;
	
	if (
		(
			this.is_mandatory(element) ||
			this.is_conditionally_mandatory(element)
		) &&
		(value==='')
	) return false;
	
	return this.execute_custom(element);

};


//	Processes a single element
CivicInfoBC.Form.prototype.process_element=function (element, radios) {

	var tag=element.tagName.toUpperCase();

	if (tag==='INPUT') {
	
		var type=this.get_attribute(element,'type');
		//	Short-circuit out of this input doesn't
		//	happen to have a type
		if (type===null) return true;
		type=type.toUpperCase();
		
		if (
			(type==='TEXT') ||
			(type==='EMAIL') ||
			(type==='PASSWORD')
		) return this.process_text(element);
		
		if (type==='RADIO') {
		
			//	Do preprocessing for radio buttons
		
			var name=this.get_attribute(element,'name');
			//	If this radio button doesn't have a name, it's
			//	not part of a group.  This is probably an error
			//	on the part of the form designer, but do the only
			//	sensible thing -- validate only if it's checked
			if (name===null) return element.checked;
			//	Check to see if we've already checked a radio
			//	button with this name (and thus the whole group
			//	of radio buttons)
			if (typeof radios[name]==='undefined') {
			
				//	We haven't checked this radio button's group
				//	before
			
				//	Make sure we don't check it again
				radios[name]=null;
				
				//	Check
				return this.process_radios(this.Get(name));
				
			}
		
		}
	
	} else if (tag==='TEXTAREA') {
	
		return this.process_text(element);
	
	} else if (tag==='SELECT') {
	
		return this.process_select(element);
	
	}
	
	//	If we don't know how to validate this
	//	tag, return neutral
	return null;

};


//	Loops over a collection of elements and processes
//	them
CivicInfoBC.Form.prototype.process_elements=function (elements) {

	//	Radio buttons act logically as one element if
	//	they all have the same name, we use the keys
	//	of this object to track the names of the radio
	//	buttons that have already been processed, and
	//	do not process them again
	var radios={};
	//	Value that will be returned, set to false
	//	anytime an element cannot be validated
	var retr=true;
	//	Loop over each element and process them
	for (var i=0;i<elements.length;++i) {
	
		//	Check
		var result=this.process_element(elements[i],radios);
		
		//	If the return result is neutral, continue without
		//	doing anything further
		if (result===null) continue;
	
		//	Get this element by name
		//
		//	This has the effect of getting every radio
		//	button in a group
		var name=this.get_attribute(elements[i],'name');
		var element=(name===null) ? elements[i] : this.Get(name);
		
		if (result) {
		
			//	SUCCESS
			
			//	Call the supplied callback (if any)
			if (typeof this.OnSuccess==='function') this.OnSuccess(element);
		
		} else {
		
			//	FAILURE
			
			retr=false;
			
			//	Call the supplied callback (if any)
			if (typeof this.OnFail==='function') this.OnFail(element);
		
		}
		
	}
	
	return retr;

};


//	Aggregates many boolean values
CivicInfoBC.Form.prototype.aggregate=function () {

	for (var i=0;i<arguments.length;++i) if (!arguments[i]) return false;
	
	return true;

};


//	Fetches all elements which are children of this
//	form with a certain tag name
CivicInfoBC.Form.prototype.get=function (name) {

	return this.element.getElementsByTagName(name.toUpperCase());

};


CivicInfoBC.Form.prototype.Validate=function () {

	var retr=this.aggregate(
		this.process_elements(this.get('input')),
		this.process_elements(this.get('select')),
		this.process_elements(this.get('textarea'))
	);
	
	if (retr) {
	
		if (typeof this.OnSubmit==='function') return this.OnSubmit();
	
	} else if (typeof this.OnFailedAttempt==='function') this.OnFailedAttempt();
	
	return retr;

};


CivicInfoBC.Form.prototype.Get=function (name) {

	if (typeof name==='undefined') return this.element;
	
	if (typeof this.element.elements[name]==='undefined') return null;
	
	return this.element.elements[name];

};
