angular.module('evtviewer.analogue')

.directive('evtAnalogue', function(evtAnalogue) {
    return {
        restrict: 'E',
        scope: {
            analogueId: '@',
            scopeWit: '@',
            type: '@'
        },
        transclude: true,
        templateUrl: 'src/analogue/analogue.directive.tmpl.html',
        controllerAs: 'vm',
        controller: 'AnalogueCtrl',
        link: function(scope, element, attrs) {
            //Initialize analogue
            var currentAnalogue = evtAnalogue.build(scope);
            
            //Garbage collection
            scope.$on('$destroy', function() {
                if (currentAnalogue) {
                    currentAnalogue.destroy();
                }
            });

        }
    }
});