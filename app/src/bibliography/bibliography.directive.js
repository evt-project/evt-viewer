/**
 * @ngdoc directive
 * @module evtviewer.bibliography
 * @name evtviewer.bibliography.directive:evtBibliography
 * @description 
 * # evtBibliography
 * TODO: Add description!
 * It uses the {@link evtviewer.bibliography.controller:BibliographyCtrl BibliographyCtrl} controller.
 *
 * @scope
 * @param {string=} id id of bibliography to be shown
 *
 * @restrict E
**/
angular.module('evtviewer.bibliography')

.directive('evtBibliography', function(evtBibliography) { 
	return {
		restrict: 'E',
		templateUrl: 'src/bibliography/bibliography.directive.tmpl.html',
		scope: {
            id   : '@'
        },
		controllerAs: 'vm', 
        controller: 'BibliographyCtrl', 
        link: function(scope, element, attrs) { 
            // Initialize bibliography 
            var currentBibliography = evtBibliography.build(scope); 
             
            // Garbage collection 
            scope.$on('$destroy', function() { 
                if (currentBibliography){ 
                    currentBibliography.destroy(); 
                }      
            }); 
        } 
	};
});