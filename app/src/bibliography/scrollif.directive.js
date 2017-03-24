angular.module('evtviewer.bibliography')

	.directive('evtScrollIf', function() {
		return function(scope, element, attrs) {

			scope.$watch(attrs.evtScrollIf, function(value) {
				if (value) {
					element[0].scrollIntoView();
				}
			});
		}
	});