/**
 * @ngdoc directive
 * @module evtviewer.analogue
 * @name evtviewer.analogue.directive:evtAnalogue
 * @description 
 * # evtAnalogue
 * TODO: Add description!
 * It uses the {@link evtviewer.analogue.controller:AnalogueCtrl AnalogueCtrl} controller.
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