angular.module('evtviewer.criticalApparatusEntry')

.constant('APPENTRYDEFAULTS', {
    firstSubContentOpened : 'criticalNote'
})

.config(function(evtCriticalApparatusEntryProvider, configProvider, APPENTRYDEFAULTS) {
    var defaults = configProvider.makeDefaults('criticalApparatusEntry', APPENTRYDEFAULTS);
    evtCriticalApparatusEntryProvider.setDefaults(defaults);
});