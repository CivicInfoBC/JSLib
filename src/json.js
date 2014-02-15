if (typeof CivicInfoBC==='undefined') CivicInfoBC={};


CivicInfoBC.JSON={};


CivicInfoBC.JSON.Decode=function (json) {

	return eval('('+json+')');

};
