angular.module('evtviewer.select')

.constant('SELECTORDEFAULTS', {

    /**
     * @module evtviewerSelector
     * @ngdoc property
     * @name expanded
     * @description
     * `property`
     *
     * Some info
     *
     * Default:
     * <pre>
     * expanded: false
     * </pre>
     */
    expanded: false,

    /**
     * @module evtviewerSelector
     * @ngdoc property
     * @name elementWidth
     * @description
     * `property`
     *
     * Some info
     *
     * Default:
     * <pre>
     * elementWidth: 150
     * </pre>
     */
    elementWidth: 150,

    /**
     * @module evtviewerSelector
     * @ngdoc property
     * @name containerMaxHeight
     * @description
     * `property`
     *
     * Some info
     *
     * Default:
     * <pre>
     * containerMaxHeight: 170
     * </pre>
     */
    containerMaxHeight: 170
})

.config(function(evtSelectProvider, configProvider, SELECTORDEFAULTS) {
    var defaults = configProvider.makeDefaults('select', SELECTORDEFAULTS);
    evtSelectProvider.setDefaults(defaults);
});