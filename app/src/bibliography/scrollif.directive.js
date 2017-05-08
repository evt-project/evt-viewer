angular.module('evtviewer.bibliography')

.directive('evtScrollIf', function($timeout) {
    return function(scope, element, attrs) {
        attrs.$observe('evtScrollIf', function(value) {
            if (value === 'true') {
                //lasciamo passare 100ms aspettando che la grafica si aggiorni
                $timeout(function() {
                    element[0].scrollIntoView();
                }, 100);
            }
        });
    };
});