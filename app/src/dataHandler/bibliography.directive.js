angular.module('evtviewer.dataHandler')

.directive('evtBiblRef', function(evtBibliographyParser) {
    return {
        restrict: 'E',
        templateUrl: 'src/dataHandler/bibliography.directive.tmpl.html',
        controller: 'src/dataHandler/bibliography.controller',
		controllerAs: 'vm'
});

