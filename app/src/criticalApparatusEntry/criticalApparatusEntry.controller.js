/**
 * @ngdoc object
 * @module evtviewer.criticalApparatusEntry
 * @name evtviewer.criticalApparatusEntry.controller:CriticalApparatusEntryCtrl
 * @description
 * # CriticalApparatusEntryCtrl
 * This is the controller for the {@link evtviewer.criticalApparatusEntry.directive:evtCriticalApparatusEntry evtCriticalApparatusEntry} directive.
 * @requires $log
 * @requires $scope
 * @requires evtviewer.core.config
 * @requires evtviewer.core.Utils
 * @requires evtviewer.interface.evtInterface
 * @requires evtviewer.criticalApparatusEntry.evtCriticalApparatusEntry
 * @requires evtviewer.reading,evtReading
 * @requires evtviewer.box.evtBox
 * @requires evtviewer.apparatuses.evtApparatuses
 * @requires evtviewer.UItools.evtPinnedElements
**/
angular.module('evtviewer.criticalApparatusEntry')

.controller('CriticalApparatusEntryCtrl', function($log, $scope, config, Utils, evtCriticalApparatusEntry, evtInterface, evtReading, evtBox, evtApparatuses, evtPinnedElements) {
    $scope.content = {};
    var vm = this;
    /**
     * @ngdoc method
     * @name evtviewer.criticalApparatusEntry.controller:CriticalApparatusEntryCtrl#toggleSubContent
     * @methodOf evtviewer.criticalApparatusEntry.controller:CriticalApparatusEntryCtrl
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
     * @name evtviewer.criticalApparatusEntry.controller:CriticalApparatusEntryCtrl#toggleOverAppEntries
     * @methodOf evtviewer.criticalApparatusEntry.controller:CriticalApparatusEntryCtrl
     *
     * @description
     * <p>Simulate the "over" event on all the critical readings connected to the scope critical apparatus entry.</p>
     * <p>It will use some methods from {@link evtviewer.reading.evtReading evtReading} provider and from
     * {@link evtviewer.criticalApparatusEntry.evtCriticalApparatusEntry evtCriticalApparatusEntry}.</p>
     * @param {event} $event mouseover/mouseout event
     */
    this.toggleOverAppEntries = function($event) {
        $event.stopPropagation();
        if (vm.readingId === undefined){
            if (vm.over === false) {
                evtCriticalApparatusEntry.mouseOverByAppId(vm.appId);
                evtReading.mouseOverByAppId(vm.appId);
            } else {
                evtCriticalApparatusEntry.mouseOutAll();
                evtReading.mouseOutAll();
            }
        }
    };
    /**
     * @ngdoc method
     * @name evtviewer.criticalApparatusEntry.controller:CriticalApparatusEntryCtrl#isPinAvailable
     * @methodOf evtviewer.criticalApparatusEntry.controller:CriticalApparatusEntryCtrl
     *
     * @description
     * Check if PIN tool is available.
     * @returns {boolean} whether PIN tool is available or not
     */
    this.isPinAvailable = function(){
        return config.toolPinAppEntries;
    };
    /**
     * @ngdoc method
     * @name evtviewer.criticalApparatusEntry.controller:CriticalApparatusEntryCtrl#isPinned
     * @methodOf evtviewer.criticalApparatusEntry.controller:CriticalApparatusEntryCtrl
     *
     * @description
     * Check whether scope critical apparatus entry is pinned or not.
     * @returns {boolean} whether scope critical apparatus entry is pinned or not
     */
    this.isPinned = function(){
        return evtPinnedElements.isPinned(vm.appId);
    };
    /**
     * @ngdoc method
     * @name evtviewer.criticalApparatusEntry.controller:CriticalApparatusEntryCtrl#getPinnedState
     * @methodOf evtviewer.criticalApparatusEntry.controller:CriticalApparatusEntryCtrl
     *
     * @description
     * Get string representing state of PIN.
     * @returns {string} "*pin-on*" if critical apparatus entry is pinned, "*pin-off*" otherwise
     */
    this.getPinnedState = function() {
        return vm.isPinned() ? 'pin-on' : 'pin-off';
    };
    /**
     * @ngdoc method
     * @name evtviewer.criticalApparatusEntry.controller:CriticalApparatusEntryCtrl#togglePin
     * @methodOf evtviewer.criticalApparatusEntry.controller:CriticalApparatusEntryCtrl
     *
     * @description
     * <p>Pin/Unpin scope critical apparatus entry.</p>
     * <p>It will use methods from
     * {@link evtviewer.UItools.evtPinnedElements evtPinnedElements} service.</p>
     */
    this.togglePin = function(){
        if (vm.isPinned()) {
            evtPinnedElements.removeElement({id: vm.appId, type: 'criticalApparatusEntry'});
        } else {
            evtPinnedElements.addElement({id: vm.appId, type: 'criticalApparatusEntry'});
            var pinnedElements = evtPinnedElements.getPinned();
            if (pinnedElements && pinnedElements.length === 1) {
              evtInterface.updateState('isPinnedAppBoardOpened', true);
            }
        }
    };
    /**
     * @ngdoc method
     * @name evtviewer.criticalApparatusEntry.controller:CriticalApparatusEntryCtrl#alignReadings
     * @methodOf evtviewer.criticalApparatusEntry.controller:CriticalApparatusEntryCtrl
     *
     * @description
     * <p>Scroll textual content of opened boxes (or apparatuses) to the readings connected to scope critical apparatus entry.</p>
     * <p>It will use methods from
     * {@link evtviewer.box.evtBox evtBox} provider and
     * {@link evtviewer.apparatuses.evtApparatuses evtApparatuses} provider.</p>
     */
    this.alignReadings = function(){
        evtBox.alignScrollToApp(vm.appId);
        evtApparatuses.alignScrollToApp(vm.appId);
    };
    /**
     * @ngdoc method
     * @name evtviewer.criticalApparatusEntry.controller:CriticalApparatusEntryCtrl#destroy
     * @methodOf evtviewer.criticalApparatusEntry.controller:CriticalApparatusEntryCtrl
     *
     * @description
     * <p>Remove instance from saved instances in {@link evtviewer.criticalApparatusEntry.evtCriticalApparatusEntry evtCriticalApparatusEntry} provider.</p>
     */
    this.destroy = function() {
        var tempId = this.uid;
        // TODO: remove from list and collection
        // this.$destroy();
        evtCriticalApparatusEntry.destroy(tempId);
    };
    /**
     * @ngdoc method
     * @name evtviewer.criticalApparatusEntry.controller:CriticalApparatusEntryCtrl#mouseOver
     * @methodOf evtviewer.criticalApparatusEntry.controller:CriticalApparatusEntryCtrl
     *
     * @description
     * Set *over* property to true (this property is used to simulate the over event on
     * different reading instances connected to the scope critical apparatus when the uses passes over current element).
     */
    this.mouseOver = function() {
        vm.over = true;
    };
    /**
     * @ngdoc method
     * @name evtviewer.criticalApparatusEntry.controller:CriticalApparatusEntryCtrl#mouseOut
     * @methodOf evtviewer.criticalApparatusEntry.controller:CriticalApparatusEntryCtrl
     *
     * @description
     * Set *over* property to false (this property is used to simulate the over event on
     * different reading instances connected to the scope critical apparatus when the uses passes over current element).
     */
    this.mouseOut = function() {
        vm.over = false;
    };
    /**
     * @ngdoc method
     * @name evtviewer.criticalApparatusEntry.controller:CriticalApparatusEntryCtrl#mouseOut
     * @methodOf evtviewer.criticalApparatusEntry.controller:CriticalApparatusEntryCtrl
     *
     * @description
     * Set *selected* property to true (this property is used to simulate the selection on
     * different reading instances connected to the scope critical apparatus when the user clicks on current element).
     */
    this.setSelected = function() {
        vm.selected = true;
    };
    /**
     * @ngdoc method
     * @name evtviewer.criticalApparatusEntry.controller:CriticalApparatusEntryCtrl#unselect
     * @methodOf evtviewer.criticalApparatusEntry.controller:CriticalApparatusEntryCtrl
     *
     * @description
     * Set *selected* property to false (this property is used to simulate the selection on
     * different reading instances connected to the scope critical apparatus when the user clicks on current element).
     */
    this.unselect = function() {
        vm.selected = false;
        vm.closeSubContent();
    };
    /**
     * @ngdoc method
     * @name evtviewer.criticalApparatusEntry.controller:CriticalApparatusEntryCtrl#unselect
     * @methodOf evtviewer.criticalApparatusEntry.controller:CriticalApparatusEntryCtrl
     *
     * @description
     * Check if the critical apparatus entry can be considered "*selected*".
     * @returns {boolean} whether the critical apparatus entry can be considered "*selected*" or not
     */
    this.isSelected = function() {
        return vm.selected;
    };
    /**
     * @ngdoc method
     * @name evtviewer.criticalApparatusEntry.controller:CriticalApparatusEntryCtrl#isInline
     * @methodOf evtviewer.criticalApparatusEntry.controller:CriticalApparatusEntryCtrl
     *
     * @description
     * Check whether the critical should appear inline or in a separate, dedicated box
     * @returns {boolean} <code>true</code> if critical apparatus should appear inline, <code>false</code> if it should appear in a separate box
     */
    this.isInline = function() {
        return evtInterface.isCriticalApparatusInline();
    };
    /**
     * @ngdoc method
     * @name evtviewer.criticalApparatusEntry.controller:CriticalApparatusEntryCtrl#closeSubContent
     * @methodOf evtviewer.criticalApparatusEntry.controller:CriticalApparatusEntryCtrl
     *
     * @description
     * Close currently opened sub content.
     */
    this.closeSubContent = function() {
        vm._subContentOpened = '';
    };
    /**
     * @ngdoc method
     * @name evtviewer.criticalApparatusEntry.controller:CriticalApparatusEntryCtrl#callbackClick
     * @methodOf evtviewer.criticalApparatusEntry.controller:CriticalApparatusEntryCtrl
     *
     * @description
     * Callback fired when user clicks on a critical apparatus entry. It will:<ul>
     * <li>Stop event propagation</li>
     * <li>If current view is "Reading Text", it willbe selected/unselected and interface state will be updated
     * with new state.</li>
     * </ul>
     * @param {event} $event click event
     */
    this.callbackClick = function($event) {
        $event.stopPropagation();
        var target = $event.target;

        if (vm.currentViewMode === 'readingTxt') {
            if (vm.isSelected()) {
                if (target && target.className.indexOf('critical-apparatus-entry_other-content_headers') < 0 &&
                    !Utils.DOMutils.isNestedInClassElem(target, 'critical-apparatus-entry_other-content_headers')) {
                    evtCriticalApparatusEntry.unselectAll();
                    evtReading.unselectAll();
                    evtInterface.updateState('currentAppEntry', '');
                }
            } else {
                evtReading.selectById(vm.appId);
                evtInterface.updateState('currentAppEntry', vm.appId);
                evtCriticalApparatusEntry.selectById(vm.appId);
                if (!vm.isInline()) {
                    evtBox.alignScrollToApp(vm.appId);
                }
            }
            evtInterface.updateUrl();
        }
    };
    /**
     * @ngdoc method
     * @name evtviewer.criticalApparatusEntry.controller:CriticalApparatusEntryCtrl#showInlineCriticalApparatus
     * @methodOf evtviewer.criticalApparatusEntry.controller:CriticalApparatusEntryCtrl
     *
     * @description
     * Check whether critical apparatus entry has to be shown inline or not.
     * @returns {boolean} whether critical apparatus entry has to be shown inline or not
     */
    this.showInlineCriticalApparatus = function() {
        return config.showInlineCriticalApparatus;
    };
});
