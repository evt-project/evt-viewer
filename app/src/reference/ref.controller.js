angular.module('evtviewer.reference')

.controller('RefCtrl', function($log, evtRef, parsedData, evtDialog, evtHighlight, evtInterface, $timeout, evtCommunication) {
	var vm = this;

	var _console = $log.getInstance('reference');

	vm.handleRefClick = function(oEvent) {
		if (vm.type === 'biblRef') {
			/*/
			Cliccando, guardiamo il valore di type e se non è un riferimento interno allora:
				passiamo a evtHighlight l'id dell'entrata da evidenziare (ci penserà il template della bibliografia al resto)
				apriamo il dialog con tipo globalInfo
				scegliamo di visualizzare come pannello iniziale quello della bibliografia
			/*/

			//Andiamo a vedere se il campo target fa riferimento a un elemento bibliografico estratto in precedenza 
			//Se abbiamo trovato il riferimento tra quelli estratti allora apriamo il pannello bibliografia e evidenziamo
			var target = vm.target.replace('#', '');
			if (parsedData.getBibliographicRefById(target)) {
				evtInterface.updateSecondaryContentOpened(' ');
				evtDialog.openByType('globalInfo');
				evtInterface.setHomePanel(evtInterface.getTabContainerPanel().bibliography.name);
				evtHighlight.setHighlighted(target);
				//dopo 2s viene rimosso l'attributo highlight
				$timeout(function() {
					evtHighlight.setHighlighted('');
				}, 2000);
			}
			//Se il riferimento non esiste, c'è un errore allora
			else {
				evtCommunication.err('Could not find bibliography referement', '405');
			}
		} else { // Generic link
			var url = vm.target.indexOf("http") < 0 ? "http://" + vm.target : vm.target;
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