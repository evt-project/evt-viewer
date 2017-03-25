angular.module('evtviewer.dataHandler')

   .directive('evtRefAttr', function(parsedData,evtHighlight,evtInterface,evtDialog,$timeout) {
      return {
         restrict: 'A',
         link:  function(scope, element, attr) {
			 element.removeAttr('href');
            element.on('click',function(){
				if(attr['type']!=='doc'){
					/*/
					Cliccando, guardiamo il valore di type e se non è un riferimento interno allora:
						passiamo a evtHighlight l'id dell'entrata da evidenziare (ci penserà il template della bibliografia al resto)
						apriamo il dialog con tipo globalInfo
						scegliamo di visualizzare come pannello iniziale quello della bibliografia
					/*/
					evtInterface.updateSecondaryContentOpened(' ');
					evtDialog.openByType('globalInfo');
					evtInterface.setHomePanel(evtInterface.getTabContainerPanel().bibliography.name);
					evtHighlight.highlight = attr['target'];
					//dopo 2s viene rimosso l'attributo highlight
					$timeout(function(){evtHighlight.highlight=' ';},2000);
				}
			});
         }
      }
   });
