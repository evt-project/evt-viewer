angular.module('evtviewer.sourcesApparatusEntry')

.constant('SOURCESAPPENTRY', {
    
    /**
     * @module evtviewerSourcesApparatusEntry
     * @ngdoc property
     * @name openTriggerEvent
     * @description
     * `property`
     *
     * Some info
     *
     * Default:
     * <pre>
     * openTriggerEvent: 'click'
     * </pre>
     */
    openTriggerEvent: 'click'
})

.config(function(evtSourcesApparatusEntryProvider, configProvider, SOURCESAPPENTRY) {
    var defaults = configProvider.makeDefaults('sourcesApparatusEntry', SOURCESAPPENTRY);
    evtSourcesApparatusEntryProvider.setDefaults(defaults);
});