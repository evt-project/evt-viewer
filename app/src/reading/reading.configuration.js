angular.module('evtviewer.reading')

.constant('READINGDEFAULTS', {
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

.config(function(evtReadingProvider, configProvider, READINGDEFAULTS) {
    var defaults = configProvider.makeDefaults('popover', READINGDEFAULTS);
    evtReadingProvider.setDefaults(defaults);
});