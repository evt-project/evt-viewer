angular.module('evtviewer.namedEntity')

.constant('NAMEDENTITYDEFAULTS', {
    allowedTabs: ['moreInfo', 'occurrences', 'map']
})

.config(['evtNamedEntityProvider', 'configProvider', 'NAMEDENTITYDEFAULTS', function(evtNamedEntityProvider, configProvider, NAMEDENTITYDEFAULTS) {
    var defaults = configProvider.makeDefaults('namedEntity', NAMEDENTITYDEFAULTS);
    evtNamedEntityProvider.setDefaults(defaults);
}]);