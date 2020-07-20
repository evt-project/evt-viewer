angular.module('evtviewer.visColl')

.constant('VISCOLLDEFAULTS', {
    
})

.config(['evtViscollProvider', 'configProvider', 'VISCOLLDEFAULTS', function(evtViscollProvider, configProvider, VISCOLLDEFAULTS) {
    var defaults = configProvider.makeDefaults('visColl', VISCOLLDEFAULTS);
    evtViscollProvider.setDefaults(defaults);
}]);