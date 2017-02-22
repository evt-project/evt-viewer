angular.module('evtviewer.dataHandler')

.directive('evtBiblRef', function(evtBibliographyParser) {
    return {
        restrict: 'E',
        scope: {
            type        : '@'
        },
        templateUrl: 'src/dataHandler/bibliography.directive.tmpl.html',
        controller: 'src/dataHandler/bibliography.controller',
		controllerAs: 'vm',
		link: function(scope, element, attrs,controller){
			vm.setID(attrs['id']);
		}
    };
});

