angular.module('evtviewer.analogue')

.constant('ANALOGUEDEFAULTS', {
    /**
     * @module evtviewerAnalogue
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
})

.config(function(evtAnalogueProvider, configProvider, ANALOGUEDEFAULTS) {
    var defaults = configProvider.makeDefaults('analogue', ANALOGUEDEFAULTS);
    evtAnalogueProvider.setDefaults(defaults);
});