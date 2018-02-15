angular.module('evtviewer.box')

.constant('BOXDEFAULTS', {
    /**
     * @module evtviewer.box
     * @ngdoc property
     * @name menuClosed
     * @description
     * `property`
     *
     * Some info
     *
     * Default:
     * <pre>
     * menuClosed: false
     * </pre>
     */
    menuClosed: false
})

.config(function(evtBoxProvider, configProvider, BOXDEFAULTS) {
    var defaults = configProvider.makeDefaults('box', BOXDEFAULTS);
    evtBoxProvider.setDefaults(defaults);
});