angular.module('evtviewer.bibliography')

	.directive('evtScrollIf', function($timeout) {
		return function(scope, element, attrs) {	
			attrs.$observe('evtScrollIf', function(value) {
				if (value === 'true') {
					console.log('evtScrollIf: il valore corrente dell\'attributo evtScrollIf è: '+value);
					//lasciamo passare 100ms aspettando che la grafica si aggiorni
					$timeout(function(){
						console.log('evtScrollIf: inizio a scrollare all\'elemento scelto');
						element[0].scrollIntoView();
					},100);
				}
			});
		}
	});