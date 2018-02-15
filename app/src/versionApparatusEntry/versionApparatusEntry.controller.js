/**
 * @ngdoc object
 * @module evtviewer.versionApparatusEntry
 * @name evtviewer.versionApparatusEntry.controller:versionApparatusEntryCtrl
 * @description 
 * # versionApparatusEntryCtrl
 * This is the controller for the {@link evtviewer.versionApparatusEntry.directive:evtVersionApparatusEntry evtVersionApparatusEntry} directive. 
 *
 * 
 * @requires evtviewer.core.config
 * @requires evtviewer.box.evtBox
 * @requires evtviewer.apparatuses.evtApparatuses
 * @requires evtviewer.versionApparatusEntry.evtVersionApparatusEntry
 * @requires $scope
 *
 * @author CM
**/
angular.module('evtviewer.versionApparatusEntry')

.controller('versionApparatusEntryCtrl', function(config, evtBox, evtApparatuses, evtVersionApparatusEntry, $scope) {
    var vm = this;
    
    /**
     * @ngdoc method
     * @name evtviewer.versionApparatusEntry.controller:versionApparatusEntryCtrl#toggleSubContent
     * @methodOf evtviewer.versionApparatusEntry.controller:versionApparatusEntryCtrl
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
     * @name evtviewer.versionApparatusEntry.controller:versionApparatusEntryCtrl#isPinAvailable
     * @methodOf evtviewer.versionApparatusEntry.controller:versionApparatusEntryCtrl
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
     * @name evtviewer.versionApparatusEntry.controller:versionApparatusEntryCtrl#alignReadings
     * @methodOf evtviewer.versionApparatusEntry.controller:versionApparatusEntryCtrl
     *
     * @description
     * <p>Scroll textual content of opened boxes (or apparatuses) to the readings connected to scope double recensio apparatus entry.</p>
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
     * @name evtviewer.versionApparatusEntry.controller:versionApparatusEntryCtrl#destroy
     * @methodOf evtviewer.versionApparatusEntry.controller:versionApparatusEntryCtrl
     *
     * @description
     * <p>Remove instance from saved instances in {@link evtviewer.versionApparatusEntry.evtCriticalApparatusEntry evtCriticalApparatusEntry} provider.</p>
     */
    this.destroy = function() {
        var tempId = this.uid;
        // TODO: remove from list and collection
        // this.$destroy();
        evtVersionApparatusEntry.destroy(tempId);
    };
});