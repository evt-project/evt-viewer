angular.module('evtviewer.dataHandler')

.directive('evtBiblRef', function(parsedData) {
	
	
  
    return {
        restrict: 'E',
		scope: {
		  biblId: '@'
		},
        templateUrl: 'src/bibliography/bibliography.directive.tmpl.html',
        controller:  'BibliographyCtrl',
		controllerAs:'biblCtrl',
		link:{
			pre:function(scope,element,attr){
				scope.$on('styleChangedEmit', function(event, args) {
					scope.$broadcast('styleChangedBroadcast', args);
				});
			}
		}
	}
});

