angular.module('evtviewer.popover')

.constant('POPOVERDEFAULTS', {

    /**
     * @module evtviewerPopover
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
     * @module evtviewerPopover
     * @ngdoc property
     * @name tooltipMaxHeight
     * @description
     * `property`
     *
     * Some info
     *
     * Default:
     * <pre>
     * tooltipMaxHeight: 170
     * </pre>
     */
    tooltipMaxHeight: 170,

    /**
     * @module evtviewerPopover
     * @ngdoc property
     * @name openOnHover
     * @description
     * `property`
     *
     * Some info
     *
     * Default:
     * <pre>
     * openOnHover: false
     * </pre>
     */
    openOnHover: false
})

.config(function(evtPopoverProvider, configProvider, POPOVERDEFAULTS) {
    var defaults = configProvider.makeDefaults('popover', POPOVERDEFAULTS);
    evtPopoverProvider.setDefaults(defaults);
});