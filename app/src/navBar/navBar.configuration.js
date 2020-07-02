angular.module('evtviewer.navBar')

.constant('NAVBARDEFAULTS', {
    
})

.config(['evtNavbarProvider', 'configProvider', 'NAVBARDEFAULTS', function(evtNavbarProvider, configProvider, NAVBARDEFAULTS) {
    var defaults = configProvider.makeDefaults('navBar', NAVBARDEFAULTS);
    evtNavbarProvider.setDefaults(defaults);
}]);