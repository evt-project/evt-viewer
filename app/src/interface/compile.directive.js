angular.module('evtviewer.interface')

.config(function($compileProvider) {
   	$compileProvider.directive('compile', function($compile) {
      	return function(scope, element, attrs) {
        	scope.$watch(
          	function(scope) {
            	// watch the 'compile' expression for changes
            	return scope.$eval(attrs.compile);
          	},
          	function(value) {
            	element.html(value);

	            $compile(element.contents())(scope);
          	});
      	};
    });
});