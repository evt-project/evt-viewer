angular.module('evtviewer.core')

.filter('capitalize', function() {
	return function(input, all) {
		var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
		return (!!input && input.replace) ? input.replace(reg, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
	};
})
/**
 * @ngdoc filter
 * @module evtviewer.core
 * @name evtviewer.core.filter:camelToSpaces
 * @description 
 * # camelToSpaces
 * Transform camel string (ex: 'myStringInCamel') into more readable string that uses spaces (ex: 'my string in camel').
**/
.filter('camelToSpaces', function() {
	return function(input, all) {
		return (!!input && input.replace) ? input.replace(/\s+/g, ' ').replace(/([a-z\d])([A-Z])/g, '$1 $2') : '';
	};
})
/**
 * @ngdoc filter
 * @module evtviewer.core
 * @name evtviewer.core.filter:underscoresToSpaces
 * @description 
 * # underscoresToSpaces
 * Transform undescores in string (ex: 'my_string_with_underscores') into spaces producing a more readable string (ex: 'my string with underscores').
**/
.filter('underscoresToSpaces', function() {
	return function(input, all) {
		return (!!input && input.replace) ? input.replace(/\_+/g, ' ') : '';
	};
})
/**
 * @ngdoc filter
 * @module evtviewer.core
 * @name evtviewer.core.filter:uppercase
 * @description 
 * # uppercase
 * Transform to uppercase a string (ex: 'lower case string' => 'LOWER CASE STRING').
**/
.filter('uppercase', function() {
	return function(input, all) {
		return (!!input && input.toUpperCase) ? input.toUpperCase() : '';
	};
})
/**
 * @ngdoc filter
 * @module evtviewer.core
 * @name evtviewer.core.filter:stringtohtml
 * @description 
 * # stringtohtml
 * Transform to html a string (ex: 'lower case string' => lower case string).
**/
.filter('stringtohtml', function() {
	return function(input, all) {
		return (!!input && input.replace) ? input.replace(/="[^"]+"/g,function($0){return $0.replace(/&lt;/g,'<').replace(/&gt;/g,'>');}) : '';
	};
});
