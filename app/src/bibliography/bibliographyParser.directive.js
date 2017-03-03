angular.module('evtviewer.dataHandler')

.directive('evtBiblRef', function(parsedData) {
	
	
  
    return {
        restrict: 'E',
		scope: {
		  biblId: '@'
		},
		link: function($scope, $element, $attrs) {
		  $scope.biblId = $attrs.biblid;
		},
        templateUrl: 'src/bibliography/bibliography.directive.tmpl.html',
        controller:  'BibliographyCtrl',
		controllerAs:'vm'
	}
});

