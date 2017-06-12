angular.module('evtviewer.core')

.filter('capitalize', function() {
	return function(input, all) {
		var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
		return (!!input) ? input.replace(reg, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
	}
})

.filter('camelToSpaces', function() {
	return function(input, all) {
		return (!!input) ? input.replace(/\W+/g, ' ').replace(/([a-z\d])([A-Z])/g, '$1 $2') : '';
	}
});