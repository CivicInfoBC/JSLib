if (!RegExp.escape) RegExp.escape=function (str) {

	return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,'\\$&');

};
