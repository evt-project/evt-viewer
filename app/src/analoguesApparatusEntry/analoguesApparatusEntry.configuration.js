angular.module('evtviewer.analoguesApparatusEntry')

.constant('ANALOGUESAPPENTRY', {
    firstSubContentOpened : '',
    allowedTabs: ['text', 'biblRef', 'xmlSource']
})

.config(function(evtAnaloguesApparatusEntryProvider, configProvider, ANALOGUESAPPENTRY) {
    var defaults = configProvider.makeDefaults('analoguesApparatusEntry', ANALOGUESAPPENTRY);
    evtAnaloguesApparatusEntryProvider.setDefaults(defaults);
});