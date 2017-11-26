/**
 * @ngdoc object
 * @module evtviewer.sourcesApparatusEntry
 * @name evtviewer.sourcesApparatusEntry.controller:sourcesApparatusEntryCtrl
 * @description 
 * # sourcesApparatusEntryCtrl
 * This is the controller for the {@link evtviewer.sourcesApparatusEntry.directive:evtSourcesApparatusEntry evtSourcesApparatusEntry} directive. 
 *
 * @requires $scope
 * @requires evtviewer.sourcesApparatusEntry.evtSourcesApparatusEntry
 * @requires evtviewer.quote.evtQuote
 * @requires evtviewer.box.evtBox
 * @requires evtviewer.apparatuses.evtApparatuses
 * @requires evtviewer.interface.evtInterface
 * @requires evtviewer.dataHandler.parsedData
 *
 * @author CM
**/
angular.module('evtviewer.sourcesApparatusEntry')

.controller('sourcesApparatusEntryCtrl', function($scope, evtSourcesApparatusEntry, evtQuote, evtBox, evtApparatuses, evtInterface, parsedData) {
    $scope.content = {};
    var vm = this;
    
    // //////////////////// //
    // toggleSource(source) //
    // ///////////////////////// //
    // Set the new active source //
    // ///////////////////////// //
    /**
     * @ngdoc method
     * @name evtviewer.sourcesApparatusEntry.controller:sourcesApparatusEntryCtrl#toggleSource
     * @methodOf evtviewer.sourcesApparatusEntry.controller:sourcesApparatusEntryCtrl
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
            _indexes : []
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
     * @name evtviewer.sourcesApparatusEntry.controller:sourcesApparatusEntryCtrl#toggleOverSource
     * @methodOf evtviewer.sourcesApparatusEntry.controller:sourcesApparatusEntryCtrl
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
     * @name evtviewer.sourcesApparatusEntry.controller:sourcesApparatusEntryCtrl#getActiveSourceAbbr
     * @methodOf evtviewer.sourcesApparatusEntry.controller:sourcesApparatusEntryCtrl
     *
     * @description
     * Retrieve the abbreviated output for a particular source.
     * 
     * @param {string} activeSourceId Identifier of source to handle 
     * @returns {string} Abbreviated output for a particular source
     */
    this.getActiveSourceAbbr = function(activeSourceId) {
        for (var i = 0; i < vm.sources.length; i++) {
            if (vm.sources[i].id === activeSourceId ) {
                return vm.sources[i].abbr;
            }
        }
    };
    /**
     * @ngdoc method
     * @name evtviewer.sourcesApparatusEntry.controller:sourcesApparatusEntryCtrl#mouseOver
     * @methodOf evtviewer.sourcesApparatusEntry.controller:sourcesApparatusEntryCtrl
     *
     * @description
     * Set *over* property to true (this property is used to simulate the over event on
     * different reading instances connected to the scope sources apparatus when the uses passes over current element).
     */
    this.mouseOver = function() {
        vm.over = true;
    };
    /**
     * @ngdoc method
     * @name evtviewer.sourcesApparatusEntry.controller:sourcesApparatusEntryCtrl#mouseOut
     * @methodOf evtviewer.sourcesApparatusEntry.controller:sourcesApparatusEntryCtrl
     *
     * @description
     * Set *over* property to false (this property is used to simulate the mouse out event on
     * different reading instances connected to the scope sources apparatus).
     */
    this.mouseOut = function() {
        vm.over = false;
    };
    /**
     * @ngdoc method
     * @name evtviewer.sourcesApparatusEntry.controller:sourcesApparatusEntryCtrl#mouseOut
     * @methodOf evtviewer.sourcesApparatusEntry.controller:sourcesApparatusEntryCtrl
     *
     * @description
     * Set *selected* property to true (this property is used to simulate the selection on
     * different reading instances connected to the scope sources apparatus when the user clicks on current element).
     */
    this.setSelected = function() {
        vm.selected = true;
    };
    /**
     * @ngdoc method
     * @name evtviewer.sourcesApparatusEntry.controller:sourcesApparatusEntryCtrl#unselect
     * @methodOf evtviewer.sourcesApparatusEntry.controller:sourcesApparatusEntryCtrl
     *
     * @description
     * Set *selected* property to false (this property is used to simulate the selection on
     * different reading instances connected to the scope sources apparatus when the user clicks on current element).
     */
    this.unselect = function() {
        vm.selected = false;
        vm.closeSubContent();
    };
    /**
     * @ngdoc method
     * @name evtviewer.sourcesApparatusEntry.controller:sourcesApparatusEntryCtrl#isSelect
     * @methodOf evtviewer.sourcesApparatusEntry.controller:sourcesApparatusEntryCtrl
     *
     * @description
     * Check if the sources apparatus entry can be considered "*selected*".
     * @returns {boolean} whether the sources apparatus entry can be considered "*selected*" or not
     */
    this.isSelect = function() {
        if (evtInterface.getState('currentQuote')  === vm.quoteId) {
            return true;
        } else {
            return vm.selected;
        }
    };
    /**
     * @ngdoc method
     * @name evtviewer.sourcesApparatusEntry.controller:sourcesApparatusEntryCtrl#closeSubContent
     * @methodOf evtviewer.sourcesApparatusEntry.controller:sourcesApparatusEntryCtrl
     *
     * @description
     * Close currently opened sub content.
     */
    this.closeSubContent = function() {
        vm._subContentOpened = '';
    };
    /**
     * @ngdoc method
     * @name evtviewer.sourcesApparatusEntry.controller:sourcesApparatusEntryCtrl#toggleSubContent
     * @methodOf evtviewer.sourcesApparatusEntry.controller:sourcesApparatusEntryCtrl
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
     * @name evtviewer.sourcesApparatusEntry.controller:sourcesApparatusEntryCtrl#toggleOverSourcesEntries
     * @methodOf evtviewer.sourcesApparatusEntry.controller:sourcesApparatusEntryCtrl
     *
     * @description
     * <p>Simulate the "over" event on all the source connected to the scope source apparatus entry.</p>
     * <p>It will use some methods from {@link evtviewer.reading.evtReading evtReading} provider and from
     * {@link evtviewer.sourcesApparatusEntry.evtCriticalApparatusEntry evtCriticalApparatusEntry}.</p>
     * @param {event} $event mouseover/mouseout event
     */
    this.toggleOverSourcesEntries = function($event) {
        $event.stopPropagation();
        if (vm.over) {
            evtSourcesApparatusEntry.mouseOutAll();
            if (vm.currentViewMode === 'readingTxt') {
                evtQuote.mouseOutAll();
            }
        } else {
            evtSourcesApparatusEntry.mouseOverByQuoteId(vm.quoteId);
            if (vm.currentViewMode === 'readingTxt') {
                evtQuote.mouseOverByQuoteId(vm.quoteId);
            }
        }
    };
    /**
     * @ngdoc method
     * @name evtviewer.sourcesApparatusEntry.controller:sourcesApparatusEntryCtrl#callbackClick
     * @methodOf evtviewer.sourcesApparatusEntry.controller:sourcesApparatusEntryCtrl
     *
     * @description
     * Callback fired when user clicks on a source apparatus entry. It will:<ul>
     * <li>Stop event propagation</li>
     * <li>If current view is "Reading Text", it willbe selected/unselected and interface state will be updated 
     * with new state.</li>
     * </ul>
     * @param {event} $event click event
     */
    this.callbackClick = function($event) {
        $event.stopPropagation();
        if (vm.currentViewMode === 'readingTxt') {
            //evtSourcesApparatusEntry.unselectAll();
            //this.setSelected();
            evtSourcesApparatusEntry.selectById(vm.quoteId);
            evtQuote.selectById(vm.quoteId);
        }
    };
    /**
     * @ngdoc method
     * @name evtviewer.sourcesApparatusEntry.controller:sourcesApparatusEntryCtrl#alignQuotes
     * @methodOf evtviewer.sourcesApparatusEntry.controller:sourcesApparatusEntryCtrl
     *
     * @description
     * <p>Scroll textual content of opened boxes (or apparatuses) to the readings connected to scope source apparatus entry.</p>
     * <p>It will use methods from
     * {@link evtviewer.box.evtBox evtBox} provider and 
     * {@link evtviewer.apparatuses.evtApparatuses evtApparatuses} provider.</p>
     */
    this.alignQuotes = function() {
        evtBox.alignScrollToQuote(vm.quoteId);
        evtApparatuses.alignScrollToQuote(vm.quoteId);
        evtQuote.selectById(vm.quoteId);
    };
    /**
     * @ngdoc method
     * @name evtviewer.sourcesApparatusEntry.controller:sourcesApparatusEntryCtrl#isSourceTextAvailable
     * @methodOf evtviewer.sourcesApparatusEntry.controller:sourcesApparatusEntryCtrl
     *
     * @description
     */
    this.isSourceTextAvailable = function(sourceId) {
        var availableTexts = parsedData.getSources()._indexes.availableTexts,
            isAvailable = false;
        for (var i = 0; i < availableTexts.length; i++) {
            if (availableTexts[i].id === sourceId) {
                isAvailable = true;
            }
        }
        return isAvailable;
    };
    /**
     * @ngdoc method
     * @name evtviewer.sourcesApparatusEntry.controller:sourcesApparatusEntryCtrl#destroy
     * @methodOf evtviewer.sourcesApparatusEntry.controller:sourcesApparatusEntryCtrl
     *
     * @description
     * <p>Remove instance from saved instances in {@link evtviewer.sourcesApparatusEntry.evtCriticalApparatusEntry evtCriticalApparatusEntry} provider.</p>
     */
    this.destroy = function() {
        evtSourcesApparatusEntry.destroy(this.uid);
    };
});