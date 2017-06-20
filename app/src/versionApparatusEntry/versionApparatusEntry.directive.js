angular.module('evtviewer.versionApparatusEntry')

.directive('evtVersionApparatusEntry', function(evtVersionApparatusEntry, evtInterface) {
    return {
        restrict: 'E',
        scope: {
            appId     : '@',
            readingId : '@',
            scopeWit  : '@',
            scopeVer  : '@',
        },
        transclude: true,
        templateUrl: 'src/versionApparatusEntry/versionApparatusEntry.directive.tmpl.html',
        controllerAs: 'vm',
        controller: 'versionApparatusEntryCtrl',
        link: function(scope, element, attrs) {
            scope.scopeViewMode = evtInterface.getCurrentViewMode();

            var currentVersionAppEntry = evtVersionApparatusEntry.build(scope);

            scope.$on('destroy', function() {
                if (currentVersionAppEntry) {
                    currentVersionAppEntry.destroy();
                }
            })
        }
    }
})