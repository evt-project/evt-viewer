angular.module('evtviewer.namedEntity')

.constant('NAMEDENTITYDEFAULTS', {
    allowedTabs: ['moreInfo', 'occurrences', 'map']
})

.config(function(evtNamedEntityProvider, configProvider, NAMEDENTITYDEFAULTS) {
    var defaults = configProvider.makeDefaults('namedEntity', NAMEDENTITYDEFAULTS);
    evtNamedEntityProvider.setDefaults(defaults);
});