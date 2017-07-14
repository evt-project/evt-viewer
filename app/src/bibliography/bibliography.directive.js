/**
 * @ngdoc directive
 * @module evtviewer.bibliography
 * @name evtBibliography
 * @description ...
 * @usage
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