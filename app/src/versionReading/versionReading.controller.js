/**
 * @ngdoc object
 * @module evtviewer.versionReading
 * @name evtviewer.versionReading.controller:versionReadingCtrl
 * @description 
 * # versionReadingCtrl
 * This is the controller for the {@link evtviewer.versionReading.directive:evtVersionReading evtVersionReading} directive. 
 *
 * @requires $scope
 * @requires evtviewer.dataHandler.parsedData
 * @requires evtviewer.core.config
 * @requires evtviewer.popover.evtPopover
 * @requires evtviewer.versionReading.evtVersionReading
 * @requires evtviewer.interface.evtInterface
 * @requires evtviewer.box.evtBox
 *
 * @author CM
**/
angular.module('evtviewer.versionReading')

.controller('versionReadingCtrl', function($scope, parsedData, config, evtPopover, evtVersionReading, evtInterface, evtBox) {
    var vm = this;
    /**
     * @ngdoc method
     * @name evtviewer.versionReading.controller:versionReadingCtrl#mouseOver
     * @methodOf evtviewer.versionReading.controller:versionReadingCtrl
     *
     * @description
     * Set *over* property to true (this property is used to simulate the over event on
     * different double recension reading instances connected to the same double recensio apparatus when the uses passes over one of them).
     */
    this.mouseOver = function() {
        vm.over = true;
    };
    /**
     * @ngdoc method
     * @name evtviewer.versionReading.controller:versionReadingCtrl#mouseOut
     * @methodOf evtviewer.versionReading.controller:versionReadingCtrl
     *
     * @description
     * Set *over* property to false (this property is used to simulate the over event on
     * different double recensio reading instances connected to the same double recensio apparatus when the uses passes over one of them).
     */
    this.mouseOut = function() {
        vm.over = false;
    };
    /**
     * @ngdoc method
     * @name evtviewer.versionReading.controller:versionReadingCtrl#highlightOn
     * @methodOf evtviewer.versionReading.controller:versionReadingCtrl
     *
     * @description
     * Set *highlightedText* property to true (this property is used to simulate the over event on text of
     * different double recension reading instances connected to the same double recensio apparatus when the uses passes over one of them).
     */
    this.highlightOn = function() {
        vm.highlightedText = true;
    };
    /**
     * @ngdoc method
     * @name evtviewer.versionReading.controller:versionReadingCtrl#highlightOff
     * @methodOf evtviewer.versionReading.controller:versionReadingCtrl
     *
     * @description
     * Set *highlightedText* property to false (this property is used to simulate the over event on text of
     * different double recensio reading instances connected to the same double recensio apparatus when the uses passes over one of them).
     */
    this.highlightOff = function() {
        vm.highlightedText = false;
    };
    /**
     * @ngdoc method
     * @name evtviewer.versionReading.controller:versionReadingCtrl#setSelected
     * @methodOf evtviewer.versionReading.controller:versionReadingCtrl
     *
     * @description
     * Set *selected* property to true (this property is used to simulate the selection on
     * different double recensio reading instances connected to the same double recensio apparatus when the user clicks on one of them).
     */
    this.setSelected = function() {
        vm.selected = true;
    };
    /**
     * @ngdoc method
     * @name evtviewer.versionReading.controller:versionReadingCtrl#unselect
     * @methodOf evtviewer.versionReading.controller:versionReadingCtrl
     *
     * @description
     * Set *selected* property to false (this property is used to simulate the selection on
     * different double recensio reading instances connected to the same double recensio apparatus when the user clicks on one of them).
     */
    this.unselect = function() {
        vm.selected = false;
    };
    /**
     * @ngdoc method
     * @name evtviewer.versionReading.controller:versionReadingCtrl#closeApparatus
     * @methodOf evtviewer.versionReading.controller:versionReadingCtrl
     *
     * @description
     * Close the connected double recensio apparatus.
     */
    this.closeApparatus = function() {
        vm.apparatus.opened = false;
    };
    /**
     * @ngdoc method
     * @name evtviewer.versionReading.controller:versionReadingCtrl#isSelect
     * @methodOf evtviewer.versionReading.controller:versionReadingCtrl
     *
     * @description
     * Check if the double recensio reading can be considered "*selected*" 
     * (for nested double recensio readings, this will depend also on parent state).
     * @returns {boolean} whether the double recensio reading can be considered "*selected*" or not
     */
    this.isSelect = function() {
        return vm.selected;        
    };
    /**
     * @ngdoc method
     * @name evtviewer.versionReading.controller:versionReadingCtrl#toggleOverAppEntries
     * @methodOf evtviewer.versionReading.controller:versionReadingCtrl
     *
     * @description
     * Simulate the "over" event on all the double recensio readings connected to the same double recensio apparatus entry.
     * @param {event} $event mouseover/mouseout event
     */
    this.toggleOverAppEntries = function($event) {
        $event.stopPropagation();
        if ( vm.over === false ) {
                evtVersionReading.mouseOverByAppId(vm.appId);
            } else {
                evtVersionReading.mouseOutAll();
            }
    };
    /**
     * @ngdoc method
     * @name evtviewer.versionReading.controller:versionReadingCtrl#toggleSelectAppEntries
     * @methodOf evtviewer.versionReading.controller:versionReadingCtrl
     *
     * @description
     * <p>Simulate the "selection" event on all the double recensio readings connected to the same double recensio apparatus entry.</p>
     * <p>Update the state of {@link evtviewer.interface.evtInterface evtInterface} by setting/unsetting the
     * current double recensio apparatus entry.</p> 
     * <p>If the double recensio apparatus is not in inline mode, open the double recensio apparatus tab 
     * in the current {@link evtviewer.apparatuses.directive:evtApparatuses evtApparatuses}.</p>    
     * @param {event} $event click event
     */
    this.toggleSelectAppEntries = function($event) {
        if (vm.selected === false) {
            if (!vm.apparatus.opened){
                evtVersionReading.selectById(vm.appId);
                evtInterface.updateCurrentVersionEntry(vm.appId);
            }
        } else {
            if (vm.apparatus.opened){
                evtVersionReading.unselectAll();
                evtInterface.updateCurrentVersionEntry('');
            }
        }
        evtInterface.updateUrl();
    };
    /**
     * @ngdoc method
     * @name evtviewer.versionReading.controller:versionReadingCtrl#toggleApparatus
     * @methodOf evtviewer.versionReading.controller:versionReadingCtrl
     *
     * @description
     * Open/close the double recensio apparatus connected to the current reading 
     * (do the same for readings connected to the same double recensio apparatus).  
     * @param {event} $event click event
     */
    this.toggleApparatus = function($event) {
        evtPopover.closeAll();
        if ( vm.over ) {
            evtVersionReading.closeAllApparatus(vm.uid);
            vm.apparatus.opened = !vm.apparatus.opened;
            if (vm.apparatus.opened) {
                $scope.$parent.vm.scrollToVersionApparatus(vm.appId);
            }
        }
    };
    /**
     * @ngdoc method
     * @name evtviewer.versionReading.controller:versionReadingCtrl#callbackClick
     * @methodOf evtviewer.versionReading.controller:versionReadingCtrl
     *
     * @description
     * Callback fired when user clicks on a double recensio reading. It will:<ul>
     * <li>Stop event propagation</li>
     * <li>Toggle the "select" state on double recensio readings connected to the same double recensio apparatus entry 
     * ({@link evtviewer.versionReading.controller:versionReadingCtrl#toggleSelectAppEntries toggleSelectAppEntries()})</li>
     * <li>If the apparatus is in inline mode and is not yet opened, toggle the state of the 
     * connected double recensio apparatus entry ({@link evtviewer.versionReading.controller:versionReadingCtrl#toggleApparatus toggleApparatus()})</li>
     * </ul>
     * @param {event} $event click event
     */
    this.callbackClick = function($event) {
        $event.stopPropagation();
        if (vm.over) {
            vm.toggleSelectAppEntries($event);
            if (!vm.isSelect() || !vm.apparatus.opened){
                vm.toggleApparatus($event);
            }
        }
    };
    /**
     * @ngdoc method
     * @name evtviewer.versionReading.controller:versionReadingCtrl#isScopeRecensioAvailable
     * @methodOf evtviewer.versionReading.controller:versionReadingCtrl
     *
     * @description
     * <p>Check whether the scope recensio is available or not.</p>
     * @returns {boolean} Whether the scope recensio is available or not
     */
    this.isScopeRecensioAvailable = function() {
        var boxVersion = $scope.$parent.vm.version || '',
            availableVer = parsedData.getVersionEntries()[vm.appId].content,
            defaultVer = config.versions[0],
            isAvailable = true;
        if (boxVersion !== '' && boxVersion !== defaultVer) {
            if (availableVer[boxVersion] === undefined) {
                isAvailable = false;
            }
        } else if (boxVersion === '' && $scope.$parent.vm.type === 'witness') {
            var scopeWit = $scope.$parent.vm.witness,
                witMap = parsedData.getVersionEntries()._indexes.versionWitMap,
                ver = '';
            for (var i in witMap) {
                if (witMap[i].indexOf(scopeWit) >= 0) {
                    ver = i;
                }
            }
            if (ver === '' || availableVer[ver] === undefined) {
                isAvailable = false;
            }
        } else {
            if (availableVer[defaultVer] === undefined) {
                isAvailable = false;
            }
        }
        return isAvailable;
    };
    /**
     * @ngdoc method
     * @name evtviewer.versionReading.controller:versionReadingCtrl#destroy
     * @methodOf evtviewer.versionReading.controller:versionReadingCtrl
     *
     * @description
     *  <p>Remove instance from saved instances in {@link evtviewer.versionReading.evtVersionReading evtVersionReading} provider.</p>
     */
    this.destroy = function() {
        var tempId = this.uid;
        // TODO: remove from list and collection
        // this.$destroy();
        evtVersionReading.destroy(tempId);
        // _console.log('vm - destroy ' + tempId);
    };
});