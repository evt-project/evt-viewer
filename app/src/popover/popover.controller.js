/**
 * @ngdoc object
 * @module evtviewer.popover
 * @name evtviewer.popover.controller:PopoverCtrl
 * @description 
 * # PopoverCtrl
 * This is the controller for the {@link evtviewer.popover.directive:evtPopover evtPopover} directive. 
  * @requires $log
  * @requires $scope
  * @requires evtviewer.popover.evtPopover
 **/
angular.module('evtviewer.popover')

.controller('PopoverCtrl', function($log, $scope, evtPopover) {
    var vm = this;
    vm.parentRef = '.box-body';
    
    var _console = $log.getInstance('popover');

    // 
    // Control function
    // 
    /**
     * @ngdoc method
     * @name evtviewer.popover.controller:PopoverCtrl#expand
     * @methodOf evtviewer.popover.controller:PopoverCtrl
     *
     * @description
     * Expand the popover.
     */
    this.expand = function() {
        vm.expanded = true;
    };
    /**
     * @ngdoc method
     * @name evtviewer.popover.controller:PopoverCtrl#collapse
     * @methodOf evtviewer.popover.controller:PopoverCtrl
     *
     * @description
     * Collapse the popover.
     */
    this.collapse = function() {
        vm.expanded = false;
    };
    /**
     * @ngdoc method
     * @name evtviewer.popover.controller:PopoverCtrl#mouseOver
     * @methodOf evtviewer.popover.controller:PopoverCtrl
     *
     * @description
     * Set *over* property to true.
     */
    this.mouseOver = function() {
        vm.over = true;
    };
    /**
     * @ngdoc method
     * @name evtviewer.popover.controller:PopoverCtrl#mouseOut
     * @methodOf evtviewer.popover.controller:PopoverCtrl
     *
     * @description
     * Set *over* property to false.
     */
    this.mouseOut = function() {
        vm.over = false;
    };
    /**
     * @ngdoc method
     * @name evtviewer.popover.controller:PopoverCtrl#tooltipMouseOver
     * @methodOf evtviewer.popover.controller:PopoverCtrl
     *
     * @description
     * Set *tooltipOver* property to true (this property is used to maintain the popover shown
     * when the mouse move on it, and so it is off the trigger element).
     */
    this.tooltipMouseOver = function() {
        vm.tooltipOver = true;
    };
    /**
     * @ngdoc method
     * @name evtviewer.popover.controller:PopoverCtrl#tooltipMouseOut
     * @methodOf evtviewer.popover.controller:PopoverCtrl
     *
     * @description
     * Set *tooltipOver* property to false (this property is used to maintain the popover shown
     * when the mouse move on it, and so it is off the trigger element).
     */
    this.tooltipMouseOut = function() {
        vm.tooltipOver = false;
    };
    /**
     * @ngdoc method
     * @name evtviewer.popover.controller:PopoverCtrl#toggleExpand
     * @methodOf evtviewer.popover.controller:PopoverCtrl
     *
     * @description
     * Open/close popover. Close all other instances of popover.
     */
    this.toggleExpand = function(closeSiblings) {
        if (!closeSiblings) {
            evtPopover.closeAll(vm.uid);
        }
        vm.expanded = !vm.expanded;
        // _console.log('vm - toggleExpand for ' + vm.uid);
    };
    /**
     * @ngdoc method
     * @name evtviewer.popover.controller:PopoverCtrl#toggleOver
     * @methodOf evtviewer.popover.controller:PopoverCtrl
     *
     * @description
     * Set *over* property to true/false. Set to false *over* property of all other instances of popover.
     */
    this.toggleOver = function(closeSiblings) {
        if (!closeSiblings) {
            evtPopover.mouseOutAll(vm.uid);
        }
        vm.over = !vm.over;
    };
    /**
     * @ngdoc method
     * @name evtviewer.popover.controller:PopoverCtrl#toggleTooltipOver
     * @methodOf evtviewer.popover.controller:PopoverCtrl
     *
     * @description
     * Set *tooltipOver* property to true/false.
     */
    this.toggleTooltipOver = function() {
        vm.tooltipOver = !vm.tooltipOver;
    };
    /**
     * @ngdoc method
     * @name evtviewer.popover.controller:PopoverCtrl#destroy
     * @methodOf evtviewer.popover.controller:PopoverCtrl
     *
     * @description
     * <p>Remove instance from saved instances in {@link evtviewer.popover.evtPopover evtPopover} provider.</p>
     */
    this.destroy = function() {
        var tempId = vm.uid;
        // TODO: remove from list and collection
        // this.$destroy();
        evtPopover.destroy(tempId);
        // _console.log('vm - destroy ' + tempId);
    };
    // The following methods are defined in the "link" of directive.
    // They are also defined here in order to avoid compiling errors
    this.toggleMouseHover = function() { };
    this.toggleTooltipHover = function() { };
    this.triggerClick = function() { };
    this.resizeTooltip = function() { };
    // _console.log('PopoverCtrl running');
});