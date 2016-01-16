angular.module('evtviewer.buttonSwitch')

.directive('buttonSwitch', function() {
    return {
        restrict: 'E',
        scope: {
            title    : '@',
            label    : '@',
            icon     : '@',
            type     : '@'
        },
        templateUrl: 'src/ButtonSwitch/ButtonSwitch.dir.tmpl.html',
        controller: 'ButtonSwitchCtrl'
    };
});