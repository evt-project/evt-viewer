angular.module('evtviewer.analoguesApparatusEntry')

.constant('ANALOGUESAPPENTRY', {
    firstSubContentOpened : ''
})

.config(function(evtAnaloguesApparatusEntryProvider, configProvider, ANALOGUESAPPENTRY) {
    var defaults = configProvider.makeDefaults('analoguesApparatusEntry', ANALOGUESAPPENTRY);
    evtAnaloguesApparatusEntryProvider.setDefaults(defaults);
});