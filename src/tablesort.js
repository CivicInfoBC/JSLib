if (typeof CivicInfoBC==='undefined') CivicInfoBC={};


CivicInfoBC.TableSort=function (table) {
	
	this.table=table;
	
	var head=this.get_thead();
	var tds=head.getElementsByTagName('td');
	var self=this;
	var sorter=function (e) {
		
		while (self.tag_name(e)!=='td') e=e.parentElement;
		
		var col=0;
		for (e=e.previousSibling;e!==null;e=e.previousSibling) if (self.tag_name(e)==='td') ++col;
		
		self.Sort(col);
		
	};
	
	for (var i=0;i<tds.length;++i) {
		
		var as=tds[i].getElementsByTagName('a');
		for (var n=0;n<as.length;++n) {
			
			var a=as[n];
			if (a.getAttribute('href')==='#') CivicInfoBC.AddCallback(
				a,
				'onclick',
				function (a) {
					
					return function () {
						
						sorter(a);
						
						return false;
						
					}
					
				}(a)
			);
			
		}
		
	}
	
};


CivicInfoBC.TableSort.prototype.tag_name=function (e) {
	
	if (typeof e.tagName==='undefined') return null;
	
	return e.tagName.toLowerCase();
	
};


CivicInfoBC.TableSort.prototype.get_thead=function () {
	
	var es=this.table.getElementsByTagName('thead');
	if (es.length===0) throw new Error('No thead elements in table');
	
	for (var curr=es[0].firstChild;(curr!==null) && (this.tag_name(curr)!=='tr');curr=curr.nextSibling);
	
	if (curr===null) throw new Error('No tr elements in thead');
	
	return curr;
	
};


CivicInfoBC.TableSort.prototype.get_tbody=function () {
	
	var es=this.table.getElementsByTagName('tbody');
	if (es.length===0) throw new Error('No tbody elements in table');
	
	return es[0];
	
};


CivicInfoBC.TableSort.prototype.get_row=function () {
	
	var body=this.get_tbody();
	
	var retr=body.firstChild;
	while ((retr!==null) && (this.tag_name(retr)!=='tr')) retr=retr.nextSibling;
	
	if (retr!==null) body.removeChild(retr);
	
	return retr;
	
};


CivicInfoBC.TableSort.prototype.next_td=function (curr) {
	
	if (this.tag_name(curr)==='tr') {
		
		curr=curr.firstChild;
		if (this.tag_name(curr)==='td') return curr;
		
	}
	
	for (curr=curr.nextSibling;(curr!==null) && (this.tag_name(curr)!=='td');curr=curr.nextSibling);
	
	return curr;
	
};


CivicInfoBC.TableSort.prototype.get_cell=function (row, col) {
	
	var retr=this.next_td(row);
	for (var i=0;i<col;++i) retr=this.next_td(retr);
	
	return retr;
	
};


CivicInfoBC.TableSort.prototype.get_text=function (e) {
	
	if (e.nodeType===3) return e.data;
	
	var retr='';
	for (var curr=e.firstChild;curr!==null;curr=curr.nextSibling) retr+=this.get_text(curr);
	
	return retr.trim();
	
};


CivicInfoBC.TableSort.prototype.make_object=function (row, col) {
	
	return {
		'text':this.get_text(this.get_cell(row,col)),
		'row':row
	};
	
};


CivicInfoBC.TableSort.prototype.get_sorter=function (desc) {
	
	var regex=new RegExp('^\\d+$');
	var f=function (a, b) {
		
		if (regex.test(a.text) && regex.test(b.text)) return parseInt(a.text)-parseInt(b.text);
		
		if (typeof String.prototype.localeCompare==='function') return a.text.localeCompare(b.text);
		
		if (a.text<b.text) return -1;
		if (a.text>b.text) return 1;
		return 0;
		
	};
	
	if (desc) return function (a, b) {	return -1*f(a,b);	};
	
	return f;
	
};


CivicInfoBC.TableSort.prototype.clean=function (cell) {
	
	CivicInfoBC.DOM.RemoveClass(cell,'asc');
	CivicInfoBC.DOM.RemoveClass(cell,'desc');
	CivicInfoBC.DOM.RemoveClass(cell,'sorted');
	
};


CivicInfoBC.TableSort.prototype.get_sort_order=function (col) {
	
	var head=this.get_thead();
	//	Default to ascending
	var retr=false;
	var i=-1;
	for (var curr=head.firstChild;curr!==null;curr=curr.nextSibling) {
		
		if (this.tag_name(curr)!=='td') continue;
		
		++i;
		
		if (i===col) {
			
			//	Change sort type if the same column is
			//	clicked multiple times
			if (CivicInfoBC.DOM.HasClass(curr,'asc')) retr=true;
			
			this.clean(curr);
			CivicInfoBC.DOM.AddClass(curr,retr ? 'desc' : 'asc');
			CivicInfoBC.DOM.AddClass(curr,'sorted');
			
			continue;
			
		}
		
		this.clean(curr);
		
	}
	
	return retr;
	
};


CivicInfoBC.TableSort.prototype.Sort=function (column) {
	
	var rows=[];
	for (var curr=this.get_row();curr!==null;curr=this.get_row()) rows.push(this.make_object(curr,column));
	
	var desc=this.get_sort_order(column);
	rows=CivicInfoBC.StableSort(rows,this.get_sorter(desc));
	
	var body=this.get_tbody();
	for (var i=0;i<rows.length;++i) {
		
		var row=rows[i].row;
		var n=0;
		for (var curr=this.next_td(row);curr!==null;curr=this.next_td(curr)) {
			
			this.clean(curr);
			
			if ((n++)!==column) continue;
			
			CivicInfoBC.DOM.AddClass(curr,desc ? 'desc' : 'asc');
			CivicInfoBC.DOM.AddClass(curr,'sorted');
			
		}
		
		body.appendChild(row);
		
	}
	
};