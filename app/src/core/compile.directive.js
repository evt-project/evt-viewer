/**
 * @ngdoc directive
 * @module evtviewer.core
 * @name evtviewer.core.directive:compile
 * @description 
 * # compile
 * TODO: Add description!
 *
 * @restrict A
**/
angular.module('evtviewer.core')

.config(function($compileProvider) {
    $compileProvider.directive('compile', function($compile) {
        return function(scope, element, attrs) {
            scope.$watch(
                function(scope) {
                    // watch the 'compile' expression for changes
                    return scope.$eval(attrs.compile);
                },
                function(value) {
                    element.html(value);
                    $compile(element.contents())(scope);
                });
        };
    });
});