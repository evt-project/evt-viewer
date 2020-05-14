/**
 * @ngdoc directive
 * @module evtviewer.rune
 * @name evtviewer.rune.directive:evtRune
 * author FS */
angular.module('evtviewer.rune')

.directive('evtRune', function(evtRune,evtInterface) {

    return {
        restrict: 'E',
        scope: {
            id      : '@',
            type    : '@',
            title   : '@',
            opened  : '@'
        },
        replace: true,
        transclude : true,
        templateUrl: 'src/rune/rune.dir.tmpl.html',
        link: function(scope, element, attrs) {

            var currentRune = evtRune.build(scope);

            // Garbage collection
            scope.$on('$destroy', function() {
                if (currentRune){
                    currentRune.destroy();
                }
            });
        }
    };
});
