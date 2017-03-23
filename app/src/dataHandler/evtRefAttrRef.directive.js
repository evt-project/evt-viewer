angular.module('evtviewer.dataHandler')

   .directive('evtRefAttr', function(parsedData,evtHighlight,evtInterface,evtDialog) {
      return {
         restrict: 'A',
         link:  function(scope, element, attr) {
            element.on('click',function(){console.log(2);
				if(attr['type']!=='doc'){
					evtInterface.updateSecondaryContentOpened(' ');
					evtDialog.openByType('globalInfo');
					evtInterface.setHomePanel(evtInterface.getTabContainerPanel().bibliography.name);
					evtHighlight.highlght = attr['target'];
					/*/
					Cliccando, guardiamo il valore di type e se non è un riferimento interno allora:
						passiamo a evtHighlight l'id dell'entrata da evidenziare (ci penserà il template della bibliografia al resto)
						apriamo il dialog con tipo globalInfo
						scegliamo di visualizzare come pannello iniziale quello della bibliografia
					/*/
				}
			});
         }
      }
   });
