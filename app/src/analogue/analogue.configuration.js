angular.module('evtviewer.analogue')

.constant('ANALOGUEDEFAULTS', {

})

.config(['evtAnalogueProvider', 'configProvider', 'ANALOGUEDEFAULTS', function(evtAnalogueProvider, configProvider, ANALOGUEDEFAULTS) {
    var defaults = configProvider.makeDefaults('analogue', ANALOGUEDEFAULTS);
    evtAnalogueProvider.setDefaults(defaults);
}]);