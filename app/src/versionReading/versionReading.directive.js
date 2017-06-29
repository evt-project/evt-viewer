angular.module('evtviewer.versionReading')

.directive('evtVersionReading', function(evtVersionReading, evtInterface) {
    return {
        restrict: 'E',
        scope: {
            type         : '@',
            appId        : '@',
            readingId    : '@',
            scopeWit     : '@',
            scopeVersion : '@',
        },
        transclude: true,
        templateUrl: 'src/versionReading/versionReading.directive.tmpl.html',
        controllerAs: 'vm',
        controller: 'versionReadingCtrl',
        link: function(scope, element, attrs) {
            scope.currentViewMode = evtInterface.getCurrentViewMode();
            var currentVersionReading = evtVersionReading.build(scope);

            scope.$on('destroy', function() {
                if (currentVersionReading) {
                    currentVersionReading.destroy();
                }
            });
        }
    };
});