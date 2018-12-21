/**
 * @ngdoc object
 * @module evtviewer.reference
 * @name evtviewer.reference.controller:RefCtrl
 * @description
 * # RefCtrl
 * This is controller for the {@link evtviewer.reference.directive:ref ref} directive.
 *
 * @requires $log
 * @requires $timeout
 * @requires evtviewer.reference.evtRef
 * @requires evtviewer.dataHandler.parsedData
 * @requires evtviewer.dialog.evtDialog
 * @requires evtviewer.bibliography.evtHighlight
 * @requires evtviewer.interface.evtInterface
 * @requires evtviewer.communication.evtCommunication
 * @requires evtviewer.tabsContainer.evtTabsContainer

**/
angular.module('evtviewer.reference')

.controller('RefCtrl', function($log, evtRef, parsedData, evtDialog, evtHighlight, evtInterface, $timeout, evtCommunication, evtTabsContainer) {
	var vm = this;

	var _console = $log.getInstance('reference');
	/**
     * @ngdoc method
     * @name evtviewer.reference.controller:RefCtrl#handleRefClick
     * @methodOf evtviewer.reference.controller:RefCtrl
     *
     * @description
     * Check the value of **type**; <ul>
     * <li>if it is a bibliographic reference and the referring entry appear in parsed data,
     * it will open the bibliography
     * panel whitin the global info dialog. Since the id of referring bibliography entry is given
     * to the service {@link evtviewer.bibliography.evtHighlight} the panel will scroll to the element and
     * highlight it for few seconds;</li>
     * <li>if it is a bibliographic reference, but the entry does not appear in extracted data,
     * an error message will be shown;</li>
     * <li> if it is an external target, it will opena a new window at given URL</li></ul>
     *
     * @param {event} oEvent click event to handle
     *
     * @author MR
     * @author CDP
     */
	vm.handleRefClick = function(event) {
		event.stopPropagation();
		if (vm.hasPopup) {
			if (!vm.showPopup) {
				evtRef.closeAllPopups();
			}
			vm.showPopup = !vm.showPopup;
			return;
		}
		if (vm.target.substr(0, 1) === '#') {
			switch (vm.type) {
				case 'biblRef':
				case 'biblio':
				case 'bibl': {
					vm.handleBiblRef();
				} break;
				case 'witlink': {
					handleWitRef();
				} break;
				default: {
					evtCommunication.err('MESSAGES.REFERENCE_NOT_FOUND', '', '405', true);
				}
			}
		} else { // Generic link
			if (vm.target && vm.target !== '') {
				var url = vm.target.indexOf('http') < 0 ? 'http://' + vm.target : vm.target;
				window.open(url, '_blank');
			}
		}
	};

	vm.handleBiblRef = function() {
		var target = vm.target.replace('#', ''),
		bibliographicRef = parsedData.getBibliographicRefById(target);
		if (bibliographicRef) {
			evtInterface.updateState('secondaryContent', 'toc');
			evtDialog.openByType('toc');
			evtInterface.updateProperty('tabsContainerOpenedContent', 'bibliography');
			evtHighlight.setHighlighted(target);
			$timeout(function() {
				evtHighlight.setHighlighted('');
			}, 2500);
		}
	}

	var handleWitRef = function() {
		var target = vm.target.replace('#', '').split(' ')[0];
		var divId = target.indexOf('_') !== target.lastIndexOf('_') ? target.substr(0, target.lastIndexOf('_')) : target;
		var newWit = parsedData.getWitnessesList().find(function(witId) {
			if (parsedData.getDiv(divId)) {
				return parsedData.getWitness(witId).corresp === parsedData.getDiv(divId).doc;
			}
		});
		if (newWit) {
			evtInterface.updateDiv(parsedData.getDiv(divId).doc, divId);
			var witnesses = evtInterface.getState('currentWits'),
					scopeWitnessIndex = witnesses.indexOf(newWit);
			if (witnesses.indexOf(newWit) >= 0) {
				evtInterface.removeWitness(newWit);
			}
			if (scopeWitnessIndex !== undefined) {
				evtInterface.addWitnessAtIndex(newWit, scopeWitnessIndex + 1);
			}
			if (evtInterface.getCurrentView !== 'collation') {
				evtInterface.updateState('currentViewMode', 'collation');
			}
			evtInterface.updateUrl();
		}
	}

	/**
	 * @ngdoc method
	 * @name evtviewer.reference.controller:RefCtrl#destroy
	 * @methodOf evtviewer.reference.controller:RefCtrl
	 *
	 * @description
	 * <p>Remove instance from saved instances in {@link evtviewer.reference.evtRef evtRef} provider.</p>
	 */
	vm.destroy = function() {
        var tempId = vm.uid;
        // this.$destroy();
        evtRef.destroy(tempId);
        // _console.log('vm - destroy ' + tempId);
    };
});
