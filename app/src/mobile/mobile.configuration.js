angular.module('evtviewer.mobile')

.constant('MOBILEDEFAULTS', {
    debug: false
})

.config(function(mobileProvider, configProvider, MOBILEDEFAULTS) {
    var defaults = configProvider.makeDefaults('mobile', MOBILEDEFAULTS);
    mobileProvider.setDefaults(defaults);
});