angular.module('evtviewer.reference')

.directive('ref', function(parsedData, evtHighlight, evtInterface, evtDialog, $timeout, evtCommunication) {
	return { //rivedere dipendenze
		restrict: 'C',
		scope: {
			target: '@',
			type: '@'
		},
		replace: true,
		transclude: true,
		controller: 'RefCtrl',
		template: '<span ng-click="handleRefClick($event)" ng-transclude></span>'
	};
});