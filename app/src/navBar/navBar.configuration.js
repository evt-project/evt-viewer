angular.module('evtviewer.navBar')

.constant('NAVBARDEFAULTS', {
    
})

.config(function(evtNavbarProvider, configProvider, NAVBARDEFAULTS) {
    var defaults = configProvider.makeDefaults('navBar', NAVBARDEFAULTS);
    evtNavbarProvider.setDefaults(defaults);
});