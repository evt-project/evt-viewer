angular.module('evtviewer.depaReading')

.constant('DEPAREADINGDEFAULTS', {
    /**
     * @module evtviewer.reading
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
    tooltipMaxHeight: 170,

    /**
     * @module evtviewer.reading
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
    tooltipMaxWidth: 200,
    
    /**
     * @module evtviewer.reading
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

.config(function(evtDepaReadingProvider, configProvider, DEPAREADINGDEFAULTS) {
    var defaults = configProvider.makeDefaults('depaReading', DEPAREADINGDEFAULTS);
    evtDepaReadingProvider.setDefaults(defaults);
});