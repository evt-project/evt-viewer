/**
 * @ngdoc service
 * @module evtviewer.bibliography
 * @name evtviewer.bibliography.evtScrollIf
 * @description 
 * # evtScrollIf
 * TODO: Add description and comments for every method
**/
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