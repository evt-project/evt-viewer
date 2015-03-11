angular.module('evtviewer.selector')

.directive('selector', function() {
    return {
        restrict: 'E',
        scope: {
            id: '@'
        },
        templateUrl: 'src/Selectors/Selector.dir.tmpl.html',
        controller: 'SelectorCtrl'
    };
});