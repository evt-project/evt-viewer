angular.module('evtviewer.box')

.directive('box', function() {
    return {
        restrict: 'E',
        scope: {
            boxtitle: '@'
        },
        templateUrl: 'src/box/box.dir.tmpl.html',
        controller: 'BoxCtrl'
    };
});