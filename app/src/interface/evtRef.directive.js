angular.module('evtviewer.dataHandler')


.directive('ref', function (parsedData, evtHighlight, evtInterface, evtDialog, $timeout, evtCommunication) {
	return {//rivedere dipendenze
		restrict: 'C',
		scope: {
					target : '@',
					type   : '@'
				},
		replace: true,
		transclude: true,
		link: function (scope, iElement, iAttrs) {
					// scope.href = scope.target;
					    scope.vm = {
							type    : scope.type,
							target  : scope.target
            };
				},
				templateUrl: 'src/interface/evtRef.dir.tmpl.html',
		compile: function(element, attrs) {
			//se c'è type dentro <ref>, allora questa necessita di span e non di ancore
			if(typeof attrs.type !== 'undefined' && attrs.type !== '') {
				element.append('<span ng-transclude></span>');
				element.on('click', function() {
					if (attrs.type !== 'doc') {
						/*/
						Cliccando, guardiamo il valore di type e se non è un riferimento interno allora:
							passiamo a evtHighlight l'id dell'entrata da evidenziare (ci penserà il template della bibliografia al resto)
							apriamo il dialog con tipo globalInfo
							scegliamo di visualizzare come pannello iniziale quello della bibliografia
							/*/
						//andiamo a vedere se il campo target fa riferimento a un elemento bibliografico estratto in precedenza	
						var found = false;
						var target = attrs.target.replace('#','');
						var bibliographicRefsCollection = parsedData.getBibliographicRefsCollection();
						for (var c=0, l= bibliographicRefsCollection.length; c<l; c++) {
							if (bibliographicRefsCollection[c].id === target) {
								found = true;
								break;
							}
						}
						//Se abbiamo trovato il riferimento tra quelli estratti allora apriamo il pannello bibliografia e evidenziamo
						if (found){
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
							evtCommunication.err('Could not find bibliography referement','405');
						}
					}	
				});
			}
			//per tutti gli altri casi comportamento di default
			else {
				element.append('<a href="'+attrs.target+'" ng-transclude></a>');
			}
		}		
	};
});