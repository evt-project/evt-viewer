angular.module('evtviewer.bibliography')

.directive('evtBibliography', function() {
	return {
		restrict: 'E',
		templateUrl: 'src/bibliography/bibliography.directive.tmpl.html',
		controller: 'BibliographyCtrl',
		controllerAs: 'vm'
	};
});