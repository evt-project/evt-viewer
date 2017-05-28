angular.module('evtviewer.bibliography')

.directive('evtBiblElem', function() {
    return {
        restrict: 'E',
        scope: {
            biblId : '@'
        },
        transclude: true,
        templateUrl: 'src/bibliography/biblElem.directive.tmpl.html',
        controllerAs: 'vm',
        controller: 'BiblElemCtrl'
    };
});