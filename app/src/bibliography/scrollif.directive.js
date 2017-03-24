angular.module('evtviewer.bibliography')

.directive('evtScrollIf', function() {
    return function(scope, element, attrs) {
        scope.$watch(attrs.scrollIf, function(value) {
            if (value) {
                element[0].scrollIntoView({block: "end", behavior: "smooth"});
            }
        });
    }
});