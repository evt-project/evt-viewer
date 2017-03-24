angular.module('evtviewer.analoguesApparatusEntry')

.constant('ANALOGUESAPPENTRY', {
    /**
     * @module evtviewerAnaloguesApparatusEntry
     * @ngdoc property
     * @name tooltipMaxHeight
     * @description
     * `property`
     *
     * Some info
     *
     * Default:
     * <pre>
     * tooltipMaxHeight: 170
     * </pre>
     */

    //openTriggerEvent: 'click'
})

.config(function(evtAnaloguesApparatusEntryProvider, configProvider, ANALOGUESAPPENTRY) {
    var defaults = configProvider.makeDefaults('analoguesApparatusEntry', ANALOGUESAPPENTRY);
    evtAnaloguesApparatusEntryProvider.setDefaults(defaults);
});