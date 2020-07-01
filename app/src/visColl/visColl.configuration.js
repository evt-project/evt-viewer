angular.module('evtviewer.visColl')

.constant('VISCOLLDEFAULTS', {
    
})

.config(function(evtViscollProvider, configProvider, VISCOLLDEFAULTS) {
    var defaults = configProvider.makeDefaults('visColl', VISCOLLDEFAULTS);
    evtViscollProvider.setDefaults(defaults);
});