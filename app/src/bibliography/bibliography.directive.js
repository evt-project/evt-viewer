angular.module('evtviewer.bibliography')

   .directive('evtBibliography', function(parsedData) {
      return {
         restrict: 'E',
         templateUrl: 'src/bibliography/bibliography.directive.tmpl.html',
         controller: 'BibliographyCtrl',
         controllerAs: 'bibliographyCtrl',
         link: {
            pre: function(scope, element, attr) {
            }
         }
      }
   });
