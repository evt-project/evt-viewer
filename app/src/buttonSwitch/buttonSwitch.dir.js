angular.module('evtviewer.buttonSwitch')

.directive('buttonSwitch', function() {
    return {
        restrict: 'E',
        scope: {
            title : '@',
            label : '@',
            icon  : '@',
            type  : '@',
            value : '@'
        },
        templateUrl: 'src/buttonSwitch/buttonSwitch.dir.tmpl.html',
        controller: 'ButtonSwitchCtrl'
    };
    
});