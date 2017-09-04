/**
 * @ngdoc controller
 * @module evtviewer.analogue
 * @name evtviewer.analogue.controller:AnalogueCtrl
 * @description 
 * # AnalogueCtrl
 * This is the controller for the {@link evtviewer.analogue.directive:evtAnalogue evtAnalogue} directive. 
 *
 * @requires $log
 * @requires $scope
 * @requires evtviewer.analogue.evtAnalogue
 * @requires evtviewer.popover.evtPopover
 * @requires evtviewer.interface.evtInterface
 * @requires evtviewer.dataHandler.evtApparatuses
 * @requires evtviewer.box.evtBox
 * @requires evtviewer.analoguesApparatusEntry.evtAnaloguesApparatusEntry
 **/
angular.module('evtviewer.analogue')

.controller('AnalogueCtrl', function($log, $scope, evtAnalogue, evtPopover, evtInterface, evtApparatuses, evtBox, evtAnaloguesApparatusEntry) {
	var vm = this;

	var _console = $log.getInstance('analogue');
	/**
     * @ngdoc method
     * @name evtviewer.analogue.controller:AnalogueCtrl#mouseOver
     * @methodOf evtviewer.analogue.controller:AnalogueCtrl
     *
     * @description
     * Set *over* property to true (this property is used to simulate the over event on
     * different analogue instances connected to the same analogues apparatus when the uses passes over one of them).
     */
	this.mouseOver = function() {
		vm.over = true;
	};
	/**
     * @ngdoc method
     * @name evtviewer.analogue.controller:AnalogueCtrl#mouseOut
     * @methodOf evtviewer.analogue.controller:AnalogueCtrl
     *
     * @description
     * Set *over* property to false (this property is used to simulate the over event on
     * different analogue instances connected to the same analogues apparatus when the uses passes over one of them).
     */
	this.mouseOut = function() {
		vm.over = false;
	};
	/**
     * @ngdoc method
     * @name evtviewer.analogue.controller:AnalogueCtrl#setSelected
     * @methodOf evtviewer.analogue.controller:AnalogueCtrl
     *
     * @description
     * Set *selected* property to true (this property is used to simulate the selection on
     * different analogue instances connected to the same analogues apparatus when the user clicks on one of them).
     */
	this.setSelected = function() {
		vm.selected = true;
	};
	/**
     * @ngdoc method
     * @name evtviewer.analogue.controller:AnalogueCtrl#unselect
     * @methodOf evtviewer.analogue.controller:AnalogueCtrl
     *
     * @description
     * Set *selected* property to false (this property is used to simulate the selection on
     * different analogue instances connected to the same analogues apparatus when the user clicks on one of them).
     */
	this.unselect = function() {
		vm.selected = false;
	};
	/**
     * @ngdoc method
     * @name evtviewer.analogue.controller:AnalogueCtrl#isSelect
     * @methodOf evtviewer.analogue.controller:AnalogueCtrl
     *
     * @description
     * Check if the analogue can be considered "*selected*" (for nested analogues, this will depend also on parent state).
     * @returns {boolean} whether the analogue can be considered "*selected*" or not
     */
	this.isSelect = function() {
		return vm.selected;
	};
	/**
     * @ngdoc method
     * @name evtviewer.analogue.controller:AnalogueCtrl#isApparatusOpened
     * @methodOf evtviewer.analogue.controller:AnalogueCtrl
     *
     * @description
     * Check if the connected analogues apparatus is opened.
     * @returns {boolean} whether the connected analogues apparatus is opened or not
     */
	this.isApparatusOpened = function() {
		return (vm.apparatus.opened && !$scope.$parent.vm.state.topBoxOpened);
	};
	/**
     * @ngdoc method
     * @name evtviewer.analogue.controller:AnalogueCtrl#closeApparatus
     * @methodOf evtviewer.analogue.controller:AnalogueCtrl
     *
     * @description
     * Close the connected analogues apparatus.
     */
	this.closeApparatus = function() {
		vm.apparatus.opened = false;
	};
	/**
     * @ngdoc method
     * @name evtviewer.analogue.controller:AnalogueCtrl#openApparatus
     * @methodOf evtviewer.analogue.controller:AnalogueCtrl
     *
     * @description
     * Open the connected analogues apparatus.
     */
	this.openApparatus = function() {
		vm.apparatus.opened = true;
	};
	/**
     * @ngdoc method
     * @name evtviewer.analogue.controller:AnalogueCtrl#toggleOverAnalogues
     * @methodOf evtviewer.analogue.controller:AnalogueCtrl
     *
     * @description
     * Simulate the "over" event on all the critical analogues connected to the same analogues apparatus entry.
     * @param {event} $event mouseover/mouseout event
     */
	this.toggleOverAnalogues = function($event) {
		$event.stopPropagation();
		if (vm.over === false) {
			evtAnalogue.mouseOverByAnalogueId(vm.analogueId);
			evtAnaloguesApparatusEntry.mouseOverByAnalogueId(vm.analogueId);
		} else {
			evtAnalogue.mouseOutAll();
			evtAnaloguesApparatusEntry.mouseOutAll();
		}
	};
	/**
     * @ngdoc method
     * @name evtviewer.analogue.controller:AnalogueCtrl#toggleSelectAnalogues
     * @methodOf evtviewer.analogue.controller:AnalogueCtrl
     *
     * @description
     * <p>Simulate the "selection" event on all the critical analogues connected to the same analogues apparatus entry.</p>
     * <p>Update the state of {@link evtviewer.interface.evtInterface evtInterface} by setting/unsetting the
     * current apparatus entry.</p> 
     * <p>If the analogues apparatus is not in inline mode, open the analogues apparatus tab 
     * in the current {@link evtviewer.apparatuses.directive:evtApparatuses evtApparatuses}.</p>    
     * @param {event} $event click event
     */
	this.toggleSelectAnalogues = function($event) {
		//TODO: aggiungere controllo per gli altri elementi critici
		if (vm.selected === false) {
			if (!vm.apparatus.opened) {
				evtAnalogue.selectById(vm.analogueId);
			}
		} else {
			if (vm.apparatus.opened) {
				evtAnalogue.unselectAll();
				evtAnalogue.closeAllApparatus();
			}
		}
		evtInterface.updateUrl();
	};
	/**
     * @ngdoc method
     * @name evtviewer.analogue.controller:AnalogueCtrl#toggleApparatus
     * @methodOf evtviewer.analogue.controller:AnalogueCtrl
     *
     * @description
     * Open/close the analogues apparatus connected to the current analogue 
     * (do the same for analogues connected to the same analogues apparatus).  
     * @param {event} $event click event
     */
	this.toggleApparatus = function($event) {
		evtPopover.closeAll();
		if (vm.over) {
			if (!vm.apparatus.inline) {
				if (evtApparatuses.getCurrentApparatus() !== 'analogues') {
					evtApparatuses.setCurrentApparatus('analogues');
				}
				evtAnaloguesApparatusEntry.selectById(vm.analogueId);
				evtApparatuses.alignScrollToAnalogue(vm.analogueId);
			} else if (!vm.apparatus._loaded) {
				vm.apparatus._loaded = true;
			}
			evtAnalogue.closeAllApparatus(vm.uid);
			vm.apparatus.opened = !vm.apparatus.opened;
		}
	};
	/**
     * @ngdoc method
     * @name evtviewer.analogue.controller:AnalogueCtrl#callbackClick
     * @methodOf evtviewer.analogue.controller:AnalogueCtrl
     *
     * @description
     * Callback fired when user clicks on an analogue. It will:<ul>
     * <li>Stop event propagation</li>
     * <li>Toggle the "select" state on analogues connected to the same analogues apparatus entry 
     * ({@link evtviewer.analogue.controller:AnalogueCtrl#toggleSelectAnalogues toggleSelectAnalogues()})</li>
     * <li>If the apparatus is in inline mode and is not yet opened, toggle the state of the 
     * connected analogues apparatus entry ({@link evtviewer.analogue.controller:AnalogueCtrl#toggleApparatus toggleApparatus()})</li>
     * </ul>
     * @param {event} $event click event
     */
	this.callbackClick = function($event) {
		$event.stopPropagation();
		if (vm.over) {
			vm.toggleSelectAnalogues($event);
			if (vm.isSelect() && !vm.apparatus.opened) {
				vm.toggleApparatus($event);
			} else {
				evtAnaloguesApparatusEntry.unselectAll();
			}
		}
	};
	/**
     * @ngdoc method
     * @name evtviewer.analogue.controller:AnalogueCtrl#destroy
     * @methodOf evtviewer.analogue.controller:AnalogueCtrl
     *
     * @description
     *  <p>Remove instance from saved instances in {@link evtviewer.analogue.evtAnalogue evtAnalogue} provider.</p>
     */
	this.destroy = function() {
		evtAnalogue.destroy(this.uid);
	};
});