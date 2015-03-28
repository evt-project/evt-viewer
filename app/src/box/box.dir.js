angular.module('evtviewer.box')

.directive('box', function() {
    return {
        restrict: 'E',
        scope: {
            boxtitle: '@'
        },
        templateUrl: 'src/Box/Box.dir.tmpl.html',
        controller: 'BoxCtrl'
    };
});