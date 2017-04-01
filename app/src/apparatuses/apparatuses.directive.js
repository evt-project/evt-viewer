angular.module('evtviewer.apparatuses')

.directive('apparatuses', function(evtApparatuses) {
    return {
        restrict: 'E',
        scope: {},
        transclude: true,
        templateUrl: 'src/apparatuses/apparatuses.dir.tmpl.html',
        controllerAs: 'vm',
        controller: 'apparatusesCtrl',
        link: function(scope, element, attrs) {
            var currentApparatuses = evtApparatuses.build(scope);
            scope.$on('$destroy', function() {
                if (currentApparatuses) {
                    currentApparatuses.destroy();
                }
            });
        }
    }
});