/**
 * @ngdoc object
 * @module evtviewer.popover
 * @name evtviewer.popover.controller:PopoverCtrl
 * @description 
 * # PopoverCtrl
 * TODO: Add description and list of dependencies!
 * The controller for the {@link evtviewer.popover.directive:evtPopover evtPopover} directive. 
**/
angular.module('evtviewer.popover')

.controller('PopoverCtrl', function($log, $scope, evtPopover) {
    var vm = this;
    vm.parentRef = '.box-body';
    
    var _console = $log.getInstance('popover');

    // 
    // Control function
    // 

    this.expand = function() {
        vm.expanded = true;
    };

    this.collapse = function() {
        vm.expanded = false;
    };

    this.mouseOver = function() {
        vm.over = true;
    };
    
    this.mouseOut = function() {
        vm.over = false;
    };

    this.tooltipMouseOver = function() {
        vm.tooltipOver = true;
    };
    
    this.tooltipMouseOut = function() {
        vm.tooltipOver = false;
    };

    this.toggleExpand = function(closeSiblings) {
        if (!closeSiblings) {
            evtPopover.closeAll(vm.uid);
        }
        vm.expanded = !vm.expanded;
        // _console.log('vm - toggleExpand for ' + vm.uid);
    };

    this.toggleOver = function(closeSiblings) {
        if (!closeSiblings) {
            evtPopover.mouseOutAll(vm.uid);
        }
        vm.over = !vm.over;
    };

    this.toggleTooltipOver = function() {
        vm.tooltipOver = !vm.tooltipOver;
    };

    this.destroy = function() {
        var tempId = vm.uid;
        // TODO: remove from list and collection
        // this.$destroy();
        evtPopover.destroy(tempId);
        // _console.log('vm - destroy ' + tempId);
    };

    this.toggleMouseHover = function() { };
    this.toggleTooltipHover = function() { };
    this.triggerClick = function() { };
    this.resizeTooltip = function() { };
    // _console.log('PopoverCtrl running');
});