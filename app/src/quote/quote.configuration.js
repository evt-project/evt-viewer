angular.module('evtviewer.quote')

.constant('QUOTEDEFAULTS', {
    
    /**
     * @module evtviewer.quote
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

.config(['evtQuoteProvider', 'configProvider', 'QUOTEDEFAULTS', function(evtQuoteProvider, configProvider, QUOTEDEFAULTS) {
    var defaults = configProvider.makeDefaults('quote', QUOTEDEFAULTS);
    evtQuoteProvider.setDefaults(defaults);
}]);