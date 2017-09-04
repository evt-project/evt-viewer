/**
 * @ngdoc object
 * @module evtviewer.analoguesApparatusEntry
 * @name evtviewer.analoguesApparatusEntry.controller:analoguesApparatusEntryCtrl
 * @description 
 * # analoguesApparatusEntryCtrl
 * This is the controller for the {@link evtviewer.analoguesApparatusEntry.directive:evtAnaloguesApparatusEntry evtAnaloguesApparatusEntry} directive. 
 *
 * @requires evtviewer.analoguesApparatusEntry.evtAnaloguesApparatusEntry
 * @requires evtviewer.interface.evtInterface
 * @requires evtviewer.analogue.evtAnalogue
 * @requires evtviewer.box.evtBox
 * @requires evtviewer.apparatuses.evtApparatuses
 * @requires evtviewer.dataHandler.parsedData
 **/
angular.module('evtviewer.analoguesApparatusEntry')

.controller('analoguesApparatusEntryCtrl', function(evtAnaloguesApparatusEntry, evtInterface, evtAnalogue, evtBox, evtApparatuses, parsedData) {
	var vm = this;

	// //////////////////// //
	// toggleSource(source) //
	// ///////////////////////// //
	// Set the new active source //
	// ///////////////////////// //
	/**
     * @ngdoc method
     * @name evtviewer.analoguesApparatusEntry.controller:analoguesApparatusEntryCtrl#toggleSource
     * @methodOf evtviewer.analoguesApparatusEntry.controller:analoguesApparatusEntryCtrl
     *
     * @description
     * Update the information contained in the tabs below, depending on source clicked.
     * It resets the tabs for the old source and copy the new ones into the directive tabs.
     * @param {string} sourceId Identifier of source to handle
     */
	this.toggleSource = function(sourceId) {
		if (vm._activeSource !== sourceId) {
			vm._activeSource = sourceId;
			//Reset the tabs for that source
			vm.tabs = {
				_indexes: []
			};
			//Copy the source tabs into the directive tabs
			var currentTabs = vm.srcList[vm._activeSource].tabs;
			for (var i = 0; i < currentTabs._indexes.length; i++) {
				var value = currentTabs._indexes[i];
				vm.tabs._indexes.push(currentTabs._indexes[i]);
				vm.tabs[value] = currentTabs[value];
			}
		}
	};
	/**
     * @ngdoc method
     * @name evtviewer.analoguesApparatusEntry.controller:analoguesApparatusEntryCtrl#toggleOverSource
     * @methodOf evtviewer.analoguesApparatusEntry.controller:analoguesApparatusEntryCtrl
     *
     * @description
     * Toggle <code>__overSource</code> directive property depending on a particular source id.
     * @param {event} $event Click event 
     * @param {string} sourceId Identifier of source to handle 
     */
	this.toggleOverSource = function($event, sourceId) {
		//$event.stopPropagation();
		if (vm._overSource !== sourceId) {
			vm._overSource = sourceId;
		} else {
			vm._overSource = '';
		}
	};
	/**
     * @ngdoc method
     * @name evtviewer.analoguesApparatusEntry.controller:analoguesApparatusEntryCtrl#getActiveSourceAbbr
     * @methodOf evtviewer.analoguesApparatusEntry.controller:analoguesApparatusEntryCtrl
     *
     * @description
     * Retrieve the abbreviated output for a particular source.
     * 
     * @param {string} activeSourceId Identifier of source to handle 
     * @returns {string} Abbreviated output for a particular source
     */
	this.getActiveSourceAbbr = function(activeSourceId) {
		for (var i = 0; i < vm.sources.length; i++) {
			if (vm.sources[i].id === activeSourceId) {
				return vm.sources[i].abbr;
			}
		}
	};
	/**
     * @ngdoc method
     * @name evtviewer.analoguesApparatusEntry.controller:analoguesApparatusEntryCtrl#toggleSubContent
     * @methodOf evtviewer.analoguesApparatusEntry.controller:analoguesApparatusEntryCtrl
     *
     * @description
     * Open/Close a specific tab of additional contents. If <code>subContentName</code> is the same
     * tab set as current, the tab will be closed. Otherwise the current tab will be close and the tab
     * <code>subContentName</code> will be opened.
     * @param {string} subContentName name of tab to open/close
     */
	this.toggleSubContent = function(subContentName) {
		if (vm._subContentOpened !== subContentName) {
			vm._subContentOpened = subContentName;
		} else {
			vm._subContentOpened = '';
		}
	};
	/**
     * @ngdoc method
     * @name evtviewer.analoguesApparatusEntry.controller:analoguesApparatusEntryCtrl#mouseOver
     * @methodOf evtviewer.analoguesApparatusEntry.controller:analoguesApparatusEntryCtrl
     *
     * @description
     * Set *over* property to true (this property is used to simulate the over event on
     * different reading instances connected to the scope analogues apparatus when the uses passes over current element).
     */
	this.mouseOver = function() {
		vm.over = true;
	};
	/**
     * @ngdoc method
     * @name evtviewer.analoguesApparatusEntry.controller:analoguesApparatusEntryCtrl#mouseOut
     * @methodOf evtviewer.analoguesApparatusEntry.controller:analoguesApparatusEntryCtrl
     *
     * @description
     * Set *over* property to false (this property is used to simulate the over event on
     * different reading instances connected to the scope analogues apparatus when the uses passes over current element).
     */
	this.mouseOut = function() {
		vm.over = false;
	};
	/**
     * @ngdoc method
     * @name evtviewer.analoguesApparatusEntry.controller:analoguesApparatusEntryCtrl#mouseOut
     * @methodOf evtviewer.analoguesApparatusEntry.controller:analoguesApparatusEntryCtrl
     *
     * @description
     * Set *selected* property to true (this property is used to simulate the selection on
     * different reading instances connected to the scope analogues apparatus when the user clicks on current element).
     */
	this.setSelected = function() {
		vm.selected = true;
	};
	/**
     * @ngdoc method
     * @name evtviewer.analoguesApparatusEntry.controller:analoguesApparatusEntryCtrl#unselect
     * @methodOf evtviewer.analoguesApparatusEntry.controller:analoguesApparatusEntryCtrl
     *
     * @description
     * Set *selected* property to false (this property is used to simulate the selection on
     * different reading instances connected to the scope analogues apparatus when the user clicks on current element).
     */
	this.unselect = function() {
		vm.selected = false;
		vm.closeSubContent();
	};
	/**
     * @ngdoc method
     * @name evtviewer.analoguesApparatusEntry.controller:analoguesApparatusEntryCtrl#isSelect
     * @methodOf evtviewer.analoguesApparatusEntry.controller:analoguesApparatusEntryCtrl
     *
     * @description
     * Check if the analogues apparatus entry can be considered "*selected*".
     * @returns {boolean} whether the analogues apparatus entry can be considered "*selected*" or not
     */
	this.isSelect = function() {
		if (evtInterface.getState('currentAnalogue')  === vm.analogueId) {
			return true;
		} else {
			return vm.selected;
		}
	};
	/**
     * @ngdoc method
     * @name evtviewer.analoguesApparatusEntry.controller:analoguesApparatusEntryCtrl#closeSubContent
     * @methodOf evtviewer.analoguesApparatusEntry.controller:analoguesApparatusEntryCtrl
     *
     * @description
     * Close currently opened sub content.
     */
	this.closeSubContent = function() {
		vm._subContentOpened = '';
	};
	/**
     * @ngdoc method
     * @name evtviewer.analoguesApparatusEntry.controller:analoguesApparatusEntryCtrl#toggleOverAnaloguesEntries
     * @methodOf evtviewer.analoguesApparatusEntry.controller:analoguesApparatusEntryCtrl
     *
     * @description
     * <p>Simulate the "over" event on all the analogue connected to the scope analogue apparatus entry.</p>
     * <p>It will use some methods from {@link evtviewer.reading.evtReading evtReading} provider and from
     * {@link evtviewer.analoguesApparatusEntry.evtCriticalApparatusEntry evtCriticalApparatusEntry}.</p>
     * @param {event} $event mouseover/mouseout event
     */
	this.toggleOverAnaloguesEntries = function($event) {
		$event.stopPropagation();
		if (vm.over) {
			evtAnaloguesApparatusEntry.mouseOutAll();
			if (vm.currentViewMode === 'readingTxt') {
				evtAnalogue.mouseOutAll();
			}
		} else {
			evtAnaloguesApparatusEntry.mouseOverByAnalogueId(vm.analogueId);
			if (vm.currentViewMode === 'readingTxt') {
				evtAnalogue.mouseOverByAnalogueId(vm.analogueId);
			}
		}
	};
	/**
     * @ngdoc method
     * @name evtviewer.analoguesApparatusEntry.controller:analoguesApparatusEntryCtrl#callbackClick
     * @methodOf evtviewer.analoguesApparatusEntry.controller:analoguesApparatusEntryCtrl
     *
     * @description
     * Callback fired when user clicks on a analogue apparatus entry. It will:<ul>
     * <li>Stop event propagation</li>
     * <li>If current view is "Reading Text", it willbe selected/unselected and interface state will be updated 
     * with new state.</li>
     * </ul>
     * @param {event} $event click event
     */
	this.callbackClick = function($event) {
		$event.stopPropagation();
		//var targetClass = $event.target && $event.target.className ? $event.target.className : '';

		if (vm.currentViewMode === 'readingTxt') {
			
				//evtAnaloguesApparatusEntry.unselectAll();
				evtAnaloguesApparatusEntry.selectById(vm.analogueId);
				evtAnalogue.selectById(vm.analogueId);
		}
	};
	/**
     * @ngdoc method
     * @name evtviewer.analoguesApparatusEntry.controller:analoguesApparatusEntryCtrl#alignAnalogues
     * @methodOf evtviewer.analoguesApparatusEntry.controller:analoguesApparatusEntryCtrl
     *
     * @description
     * <p>Scroll textual content of opened boxes (or apparatuses) to the readings connected to scope analogue apparatus entry.</p>
     * <p>It will use methods from
     * {@link evtviewer.box.evtBox evtBox} provider and 
     * {@link evtviewer.apparatuses.evtApparatuses evtApparatuses} provider.</p>
     */
	this.alignAnalogues = function() {
		evtBox.alignScrollToAnalogue(vm.analogueId);
		evtApparatuses.alignScrollToAnalogue(vm.analogueId);
		evtAnalogue.selectById(vm.analogueId);
	};
	/**
     * @ngdoc method
     * @name evtviewer.analoguesApparatusEntry.controller:analoguesApparatusEntryCtrl#destroy
     * @methodOf evtviewer.analoguesApparatusEntry.controller:analoguesApparatusEntryCtrl
     *
     * @description
     * <p>Remove instance from saved instances in {@link evtviewer.analoguesApparatusEntry.evtCriticalApparatusEntry evtCriticalApparatusEntry} provider.</p>
     */
	this.destroy = function() {
		evtAnaloguesApparatusEntry.destroy(this.uid);
	};
});