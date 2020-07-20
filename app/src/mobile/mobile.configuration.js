/**
 * @name evtviewer.mobile
 */

angular.module('evtviewer.mobile')

/**
 * @name evtviewer.MOBILEDEFAULTS
 * @extends evtviewer.mobile
 */
 
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

.config(['mobileProvider', 'configProvider', 'MOBILEDEFAULTS', function(mobileProvider, configProvider, MOBILEDEFAULTS) {
    var defaults = configProvider.makeDefaults('mobile', MOBILEDEFAULTS);
    mobileProvider.setDefaults(defaults);
}]);