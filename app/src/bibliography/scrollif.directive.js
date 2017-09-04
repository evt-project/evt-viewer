/**
 * @ngdoc service
 * @module evtviewer.bibliography
 * @name evtviewer.bibliography.directive:evtScrollIf
 * @description 
 * # evtScrollIf
 * Scrolls the element on which it's assigned into the visible area of the browser window.
 * 
 * @author MR
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