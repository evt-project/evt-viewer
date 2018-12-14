angular.module('evtviewer.sourcesApparatusEntry')

.constant('SOURCESAPPENTRY', {
    firstSubContentOpened : '',
    allowedTabs: ['text', 'biblRef', 'xmlSource']
})

.config(function(evtSourcesApparatusEntryProvider, configProvider, SOURCESAPPENTRY) {
    var defaults = configProvider.makeDefaults('sourcesApparatusEntry', SOURCESAPPENTRY);
    evtSourcesApparatusEntryProvider.setDefaults(defaults);
});