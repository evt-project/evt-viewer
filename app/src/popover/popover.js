/**
 * @ngdoc overview
 * @name evtviewer.popover
 * @module evtviewer.popover
 * @description 
 * # evtviewer.popover
 * <p>Module referring to popovers, intended as custom elements representing small pop-up boxs 
 * that appear when the user clicks on an element (or passes over it with the mouse) and 
 * can contain different content.</p>
 * 
 * ## Services
 * - {@link evtviewer.popover.evtPopover evtPopover} where the scope of 
 * {@link evtviewer.popover.directive:evtPopover evtPopover} directive 
 * is expanded and stored untill the directive remains instantiated.
 *
 * ## Directives
 * - {@link evtviewer.popover.directive:evtPopover evtPopover}: custom directive designed upon HTML &lt;popover&gt;
 * The scope of the directive is expanded and stored inside the 
 * {@link evtviewer.popover.evtPopover evtPopover} provider.
 *
 * ## Controllers
 * - {@link  evtviewer.popover.controller:PopoverCtrl PopoverCtrl}: controller for the directive 
 * {@link evtviewer.popover.directive:evtPopover evtPopover}.
**/
angular.module('evtviewer.popover', []);