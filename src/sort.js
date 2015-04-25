if (typeof CivicInfoBC==='undefined') CivicInfoBC={};


CivicInfoBC.StableSort=function (arr, func) {

	if (arr.length<2) return arr;
	
	if (typeof func==='undefined') func=function (a, b) {
		
		if (a>b) return 1;
		if (a<b) return -1;
		return 0;
		
	};
	
	var i=Math.floor(arr.length/2);
	var first=CivicInfoBC.StableSort(arr.slice(0,i),func);
	var second=CivicInfoBC.StableSort(arr.slice(i),func);
	
	var n=0;
	var m=0;
	var retr=[];
	while (!((n===first.length) || (m===second.length))) {
		
		var fe=first[n];
		var se=second[m];
		var s=func(fe,se);
		if (s>0) {
			
			retr.push(se);
			++m;
			
			continue;
			
		}
		
		retr.push(fe);
		++n;
		
	}
	
	while (n!==first.length) retr.push(first[n++]);
	while (m!==second.length) retr.push(second[m++]);
	
	return retr;
	
};