angular.module('evtviewer.selector')

// TODO: add default expanded, add default width, etc.
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
     * @ngdoc object
     * @name defaultWidth
     * @description
     * `object`
     *
     * Some info
     *
     * Default:
     * <pre>
     * defaultOptionSelected: {
     *   label: 'Select...',
     *   value: '--',
     *   title: 'Select...'
     * }
     * </pre>
     */
    defaultOptionSelected: {
        label: 'Select...',
        value: '--',
        title: 'Select...'
    },

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

.config(function(selectProvider, ConfigProvider, SELECTORDEFAULTS) {
    selectProvider.setOptions(ConfigProvider.makeDefaults('select', SELECTORDEFAULTS));
});