angular.module('evtviewer.reference')

.constant('REFDEFAULTS', {

})

.config(['evtRefProvider', 'configProvider', 'REFDEFAULTS', function(evtRefProvider, configProvider, REFDEFAULTS) {
    var defaults = configProvider.makeDefaults('ref', REFDEFAULTS);
    evtRefProvider.setDefaults(defaults);
}]);