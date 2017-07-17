/**
 * @ngdoc object
 * @module evtviewer.reference
 * @name evtviewer.reference.controller:RefCtrl
 * @description 
 * # RefCtrl
 * TODO: Add description and list of dependencies!
 * The controller for the {@link evtviewer.reference.directive:ref ref} directive. 
**/
angular.module('evtviewer.reference')

.controller('RefCtrl', function($log, evtRef, parsedData, evtDialog, evtHighlight, evtInterface, $timeout, evtCommunication) {
	var vm = this;

	var _console = $log.getInstance('reference');

	vm.handleRefClick = function(oEvent) {
		if (vm.type === 'biblRef' || vm.type === 'biblio' || vm.target.substr(0, 1) === '#') {
			
			// Cliccando, guardiamo il valore di type e se non è un riferimento interno allora:
			// passiamo a evtHighlight l'id dell'entrata da evidenziare (ci penserà il template della bibliografia al resto)
			// apriamo il dialog con tipo globalInfo
			// scegliamo di visualizzare come pannello iniziale quello della bibliografia
			
			//Andiamo a vedere se il campo target fa riferimento a un elemento bibliografico estratto in precedenza 
			//Se abbiamo trovato il riferimento tra quelli estratti allora apriamo il pannello bibliografia e evidenziamo
			var target = vm.target.replace('#', ''),
				bibliographicRef = parsedData.getBibliographicRefById(target),
				tabContainerPanel = evtInterface.getTabContainerPanel(),
				bibliographyPanel = tabContainerPanel ? tabContainerPanel.bibliography : undefined;
			if (bibliographicRef && bibliographyPanel) {
				evtInterface.updateSecondaryContentOpened(' ');
				evtDialog.openByType('globalInfo');
				evtInterface.setHomePanel(bibliographyPanel.name);
				evtHighlight.setHighlighted(target);
				//dopo 2s viene rimosso l'attributo highlight
				$timeout(function() {
					evtHighlight.setHighlighted('');
				}, 2000);
			}
			//Se il riferimento non esiste, c'è un errore allora
			else {
				evtCommunication.err('MESSAGES.REFERENCE_NOT_FOUND', '405');
			}
		} else { // Generic link
			var url = vm.target.indexOf('http') < 0 ? 'http://' + vm.target : vm.target;
			window.open(url, '_blank');
		}
	};

	vm.destroy = function() {
        var tempId = vm.uid;
        // this.$destroy();
        evtRef.destroy(tempId);
        // _console.log('vm - destroy ' + tempId);
    };
});