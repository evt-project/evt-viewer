angular.module('evtviewer.sourcesApparatusEntry')

.constant('SOURCESAPPENTRY', {
    /**
     * @module evtviewerPopover
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
    //tooltipMaxHeight: 170,

    /**
     * @module evtviewerPopover
     * @ngdoc property
     * @name tooltipMaxWidth
     * @description
     * `property`
     *
     * Some info
     *
     * Default:
     * <pre>
     * tooltipMaxWidth: 200
     * </pre>
     */
    //tooltipMaxWidth: 200,
    
    /**
     * @module evtviewerReading
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