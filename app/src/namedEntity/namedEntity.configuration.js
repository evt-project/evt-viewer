angular.module('evtviewer.namedEntity')

.constant('NAMEDENTITYDEFAULTS', {
    
})

.config(function(evtNamedEntityProvider, configProvider, NAMEDENTITYDEFAULTS) {
    var defaults = configProvider.makeDefaults('namedEntity', NAMEDENTITYDEFAULTS);
    evtNamedEntityProvider.setDefaults(defaults);
});