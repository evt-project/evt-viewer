angular.module('evtviewer.analogue')

.constant('ANALOGUEDEFAULTS', {

})

.config(function(evtAnalogueProvider, configProvider, ANALOGUEDEFAULTS) {
    var defaults = configProvider.makeDefaults('analogue', ANALOGUEDEFAULTS);
    evtAnalogueProvider.setDefaults(defaults);
});