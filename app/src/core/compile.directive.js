/**
 * @ngdoc directive
 * @module evtviewer.core
 * @name evtviewer.core.directive:compile
 * @description 
 * # compile
 * Dinamically compile the HTML (containing custom directives) 
 * inside the element where the directive is used.
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