angular.module('evtviewer.selector')
.directive('selector', function() {
    return {
        restrict: 'E',
        scope: {
        	title: '@title'
        },
        templateUrl: 'src/Selectors/Selector.dir.tmpl.html',
        controller: 'SelectorCtrl'
    };
});