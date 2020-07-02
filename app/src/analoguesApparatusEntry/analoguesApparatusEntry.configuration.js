angular.module('evtviewer.analoguesApparatusEntry')

.constant('ANALOGUESAPPENTRY', {
    firstSubContentOpened : ''
})

.config(['evtAnaloguesApparatusEntryProvider', 'configProvider', 'ANALOGUESAPPENTRY', function(evtAnaloguesApparatusEntryProvider, configProvider, ANALOGUESAPPENTRY) {
    var defaults = configProvider.makeDefaults('analoguesApparatusEntry', ANALOGUESAPPENTRY);
    evtAnaloguesApparatusEntryProvider.setDefaults(defaults);
}]);