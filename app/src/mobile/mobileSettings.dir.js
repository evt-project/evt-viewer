angular.module('evtviewer.mobile')

.directive('settingsMobile', function() {
    return {
        restrict: 'E',
        scope: {
            id: '@'
        },
        templateUrl: 'src/mobile/mobileSettings.dir.tmpl.html',
        controller: 'MobileSettingsCtrl'
    };
});