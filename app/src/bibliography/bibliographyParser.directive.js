angular.module('evtviewer.dataHandler')

.directive('evtBiblRef', function(parsedData) {
    return {
        restrict: 'E',
        templateUrl: 'src/bibliography/bibliography.directive.tmpl.html',
        controller:  'BibliographyCtrl',
		controllerAs:'vm'
}});

