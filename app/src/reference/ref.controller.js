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
	vm.handleRefClick = function(oEvent) {
		if (vm.type === 'biblRef' || vm.type === 'biblio' || vm.target.substr(0, 1) === '#') {

			// Cliccando, guardiamo il valore di type e se non è un riferimento interno allora:
			// passiamo a evtHighlight l'id dell'entrata da evidenziare
			// (ci penserà il template della bibliografia al resto)
			// apriamo il dialog con tipo globalInfo
			// scegliamo di visualizzare come pannello iniziale quello della bibliografia

			//Andiamo a vedere se il campo target fa riferimento a un elemento bibliografico estratto in precedenza
			//Se abbiamo trovato il riferimento tra quelli estratti allora apriamo il pannello bibliografia e evidenziamo
			var target = vm.target.replace('#', ''),
				bibliographicRef = parsedData.getBibliographicRefById(target);
			if (bibliographicRef) {
				evtInterface.updateState('secondaryContent', 'globalInfo');
				evtDialog.openByType('globalInfo');
				evtInterface.setHomePanel('bibliography');
				evtHighlight.setHighlighted(target);
				//dopo 2s viene rimosso l'attributo highlight
				$timeout(function() {
					evtHighlight.setHighlighted('');
				}, 2000);
			}
			//Se il riferimento non esiste, c'è un errore allora
			else {
				evtCommunication.err('MESSAGES.REFERENCE_NOT_FOUND', '', '405', true);
			}
		} else { // Generic link
			if (vm.target && vm.target !== '') {
				var url = vm.target.indexOf('http') < 0 ? 'http://' + vm.target : vm.target;
				window.open(url, '_blank');
			}
		}
	};

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
