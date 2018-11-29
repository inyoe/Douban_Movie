require.config({
	paths: {
		'jquery': 'lib/jquery-1.12.4.min'
	}
})


//Load Module
;(function(){
	var moduleName,
		oScript = document.getElementById('rjs');
	if (oScript && oScript.nodeName === 'SCRIPT') {
		moduleName = oScript.getAttribute('data-module');
		moduleName && require(['module/' + moduleName.replace(/\.js/, '')]);
	}
}())
