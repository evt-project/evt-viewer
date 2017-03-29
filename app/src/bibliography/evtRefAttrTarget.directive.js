angular.module('evtviewer.dataHandler')

.directive('evtRefAttr', function(parsedData, evtHighlight, evtInterface, evtDialog, $timeout, evtCommunication) {
	return {
		restrict: 'A',
		link: function(scope, element, attr) {
			element.on('click', function() {
				if (attr.type !== 'doc') {
					/*/
					Cliccando, guardiamo il valore di type e se non è un riferimento interno allora:
						passiamo a evtHighlight l'id dell'entrata da evidenziare (ci penserà il template della bibliografia al resto)
						apriamo il dialog con tipo globalInfo
						scegliamo di visualizzare come pannello iniziale quello della bibliografia
					/*/
					var targetEl = $(attr.target);
					if(false && targetEl && targetEl > 0) {
						evtInterface.updateSecondaryContentOpened(' ');
						evtDialog.openByType('globalInfo');
						evtInterface.setHomePanel(evtInterface.getTabContainerPanel().bibliography.name);
						evtHighlight.setHighlighted(attr.target);
						//dopo 2s viene rimosso l'attributo highlight
						$timeout(function() {
							evtHighlight.setHighlighted('');
						}, 2000);
					}
					else {
						evtCommunication.err('Could not find bibliography referement','405');
						var newError = {
							code  : '',
							msg   : '',
							title : ''
						};						
						evtCommunication.updateError(newError);
					}
				}
			});
		}
	}
});