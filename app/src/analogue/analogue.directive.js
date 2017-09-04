/**
 * @ngdoc directive
 * @module evtviewer.analogue
 * @name evtviewer.analogue.directive:evtAnalogue
 * @description 
 * # evtAnalogue
 * <p>Element that identify an analogue connected to a specific analogues apparatus entry. </p>
 * <p>It is visually distinguished from the rest of the text.</p>
 * <p>When the user clicks on it, the connected analogues apparatus entry with all the information retrieved 
 * from the analogues encoded text (and stored in {@link evtviewer.dataHandler.parsedData parsedData}) will be shown.</p>
 *
 * <p>It uses the {@link evtviewer.analogue.controller:AnalogueCtrl AnalogueCtrl} controller.</p>
 * <p>The initial scope is expanded in {@link evtviewer.analogue.evtAnalogue evtAnalogue} provider.</p>
 *
 * @scope
 * @param {string=} analogueId id of analogue to be shown
 * @param {string=} scopeWit id of scope witness
 *
 * @restrict E
**/
angular.module('evtviewer.analogue')

.directive('evtAnalogue', function(evtAnalogue, evtInterface) {
	return {
		restrict: 'E',
		scope: {
			analogueId: '@',
			scopeWit: '@'
		},
		transclude: true,
		templateUrl: 'src/analogue/analogue.directive.tmpl.html',
		controllerAs: 'vm',
		controller: 'AnalogueCtrl',
		link: function(scope, element, attrs) {
			//Initialize analogue
			scope.inlineApparatus = evtInterface.isAnaloguesInline();

			var currentAnalogue = evtAnalogue.build(scope);

			//Garbage collection
			scope.$on('$destroy', function() {
				if (currentAnalogue) {
					currentAnalogue.destroy();
				}
			});

		}
	};
});