/**
 * @ngdoc object
 * @module evtviewer.apparatuses
 * @name evtviewer.apparatuses.controller:apparatusesCtrl
 * @description 
 * # apparatusesCtrl
 * This is the controller for the {@link evtviewer.apparatuses.directive:evtApparatuses evtApparatuses} directive. 
 *
 * @requires $timeout
 * @requires $scope
 * @requires evtviewer.apparatuses.evtApparatuses
 *
 * @author CM
 **/
angular.module('evtviewer.apparatuses')

.controller('apparatusesCtrl', function($timeout, evtApparatuses, $scope) {
	var vm = this;

	/**
     * @ngdoc method
     * @name evtviewer.apparatuses.controller:apparatusesCtrl#setCurrentApparatus
     * @methodOf evtviewer.apparatuses.controller:apparatusesCtrl
     *
     * @description
     * Set current visible apparatus.
     * @param {string} appId Identifier of apparatus to be set as current one
     */
	this.setCurrentApparatus = function(appId) {
		if (appId !== vm.currentApparatus && vm.apparatuses[appId]) {
			vm.loading = true;
			vm.currentApparatus = appId;
			vm.apparatuses[appId].visibleList = vm.apparatuses[appId].list.slice(0, 10);
			$timeout(function() {
				vm.loading = false;
			});
		}
	};
	/**
     * @ngdoc method
     * @name evtviewer.apparatuses.controller:apparatusesCtrl#getCurrentApparatus
     * @methodOf evtviewer.apparatuses.controller:apparatusesCtrl
     *
     * @description
     * Retrieve the current apparatus.
     * @returns {string} Identifier of current apparatus
     */
	this.getCurrentApparatus = function() {
		return vm.currentApparatus;
	};
	/**
     * @ngdoc method
     * @name evtviewer.apparatuses.controller:apparatusesCtrl#toggleAppStructure
     * @methodOf evtviewer.apparatuses.controller:apparatusesCtrl
     *
     * @description
     * Change layout structure of apparatuses box.
	 * @param {string} appStructure Label of structure to be set (handled values are 'tabs' and 'subBoxes')
     */
	this.toggleAppStructure = function(appStructure) {
		if (vm.appStructure !== appStructure) {
			vm.appStructure = appStructure;
		}
	};
	/**
     * @ngdoc method
     * @name evtviewer.apparatuses.controller:apparatusesCtrl#toggleOpenApparatus
     * @methodOf evtviewer.apparatuses.controller:apparatusesCtrl
     *
     * @description
     * Change the opened apparatus.
     * @param {string} apparatus Identifier of apparatus to be set as the opened one
     */
	this.toggleOpenApparatus = function(apparatus) {
		if (vm.openApparatus !== apparatus) {
			vm.openApparatus = apparatus;
		}
	};
	/**
     * @ngdoc method
     * @name evtviewer.apparatuses.controller:apparatusesCtrl#getVisibleList
     * @methodOf evtviewer.apparatuses.controller:apparatusesCtrl
     *
     * @description
     * Retrieve the list of currently visible entries of a particular apparatus.
     * @param {string} app Identifier of apparatus to handle
     * @return {array} List of visibile entries for given apparatus
     */
	this.getVisibleList = function(app) {
		return vm.apparatuses[app] ? vm.apparatuses[app].visibleList : [];
	};
	/**
     * @ngdoc method
     * @name evtviewer.apparatuses.controller:apparatusesCtrl#getAppList
     * @methodOf evtviewer.apparatuses.controller:apparatusesCtrl
     *
     * @description
     * Retrieve the complete list of entries in a particular apparatus.
     * @param {string} app Identifier of apparatus to handle
     * @return {array} Complete list of entries for given apparatus
     */
	this.getAppList = function(app) {
		return vm.apparatuses[app] ? vm.apparatuses[app].list : [];
	};
	/**
     * @ngdoc method
     * @name evtviewer.apparatuses.controller:apparatusesCtrl#loadMoreElements
     * @methodOf evtviewer.apparatuses.controller:apparatusesCtrl
     *
     * @description
     * Show more entries for current apparatus. This function is used with the plugin
 	 * {@link https://sroze.github.io/ngInfiniteScroll/documentation.html infinite-scroll}.
     */
	this.loadMoreElements = function() {
		var appId = vm.currentApparatus,
            last = vm.apparatuses[appId].visibleList.length,
            i = 0; 
        while (i < 5 && i < vm.apparatuses[appId].list.length) {
            var newElement = vm.apparatuses[appId].list[last+i];
            if (newElement && vm.apparatuses[appId].visibleList.indexOf(newElement) <= 0) {
                vm.apparatuses[appId].visibleList.push(newElement);                    
            }
            i++;
        }
    };
	/**
     * @ngdoc method
     * @name evtviewer.apparatuses.controller:apparatusesCtrl#destroy
     * @methodOf evtviewer.apparatuses.controller:apparatusesCtrl
     *
     * @description
     * <p>Remove instance from saved instances in {@link evtviewer.apparatuses.evtApparatuses evtApparatuses} provider.</p>
     */
	this.destroy = function() {
		evtApparatuses.destroy(this.uid);
	};
});