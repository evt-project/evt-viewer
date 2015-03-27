angular.module('evtviewer.selector')

// TODO: add default expanded, add default width, etc.
.constant('SELECTORDEFAULTS', {

    /**
     * @module evtviewerSelector
     * @ngdoc property
     * @name defaultExpanded
     * @description
     * `property`
     *
     * Some info
     *
     * Default:
     * <pre>
     * defaultExpanded: false
     * </pre>
     */
    defaultExpanded: false,

    /**
     * @module evtviewerSelector
     * @ngdoc property
     * @name defaultWidth
     * @description
     * `property`
     *
     * Some info
     *
     * Default:
     * <pre>
     * defaultWidth: 150
     * </pre>
     */
    defaultWidth: 150,

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
    selectProvider.defaults = ConfigProvider.makeDefaults('select', SELECTORDEFAULTS);
});