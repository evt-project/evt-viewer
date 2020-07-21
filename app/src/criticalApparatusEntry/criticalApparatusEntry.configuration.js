angular.module('evtviewer.criticalApparatusEntry')

.constant('APPENTRYDEFAULTS', {
    firstSubContentOpened : ''
})

.config(['evtCriticalApparatusEntryProvider', 'configProvider', 'APPENTRYDEFAULTS', function(evtCriticalApparatusEntryProvider, configProvider, APPENTRYDEFAULTS) {
    var defaults = configProvider.makeDefaults('criticalApparatusEntry', APPENTRYDEFAULTS);
    evtCriticalApparatusEntryProvider.setDefaults(defaults);
}]);