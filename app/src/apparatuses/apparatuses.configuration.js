angular.module('evtviewer.apparatuses')

.constant('APPARATUSESDEFAULTS', {
    currentApparatus : 'Critical Apparatus',
    apparatusesOrder : ['Sources', 'Critical Apparatus', 'Analogues'],
    appStructure : 'tabs'
})

.config(['evtApparatusesProvider', 'configProvider', 'APPARATUSESDEFAULTS', function(evtApparatusesProvider, configProvider, APPARATUSESDEFAULTS) {
    var defaults = configProvider.makeDefaults('apparatuses', APPARATUSESDEFAULTS);
    evtApparatusesProvider.setDefaults(defaults);
}]);