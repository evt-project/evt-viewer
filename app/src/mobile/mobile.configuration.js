angular.module('evtviewer.mobile')

.constant('MOBILEDEFAULTS', {
    /**
     * @module evtviewerMobile
     * @ngdoc property
     * @name debug
     * @description
     * `property`
     *
     * Some info
     *
     * Default:
     * <pre>
     * debug: false
     * </pre>
     */
    debug: false
})

.config(function(mobileProvider, configProvider, MOBILEDEFAULTS) {
    var defaults = configProvider.makeDefaults('mobile', MOBILEDEFAULTS);
    mobileProvider.setDefaults(defaults);
});