angular.module('evtviewer.mobile')

.directive('settingsMobile', function() {
    return {
        restrict: 'E',
        scope: {
            id: '@'
        },
        templateUrl: 'src/Mobile/MobileSettings.dir.tmpl.html',
        // controller: 'MobileSettingsCtrl'
    };
});