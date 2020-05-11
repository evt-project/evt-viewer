/**
 * @ngdoc directive
 * @module evtviewer.rune
 * @name evtviewer.rune.directive:evtRune
 * @description
 * # evtRune
 * <p>Container that opens up above everything and has a shadow below, hiding the lower contents.</p>
 * <p>The content shown can be added as transcluded content.</p>
 * <p>The general layout and colors will depend on rune type. </p>
 * <p>Available types are:<ul>
 * <li> **error**: Red color, smaller dimensions;</li>
 * <li> **bookmark**: smaller dimensions.</li>
 * </ul></p>
 * <p>The {@link evtviewer.rune.controller:RuneCtrl controller} for this directive is dynamically defined
 * inside the {@link evtviewer.rune.evtRune evtRune} provider file.</p>
 * @scope
 * @param {string=} id id of rune
 * @param {string=} type type of rune ('error', 'bookmark')
 * @param {string=} title title of rune
 * @param {boolean=} opened status of rune
 *
 * @restrict E
**/
angular.module('evtviewer.rune')

.directive('evtRune', function(evtRune,evtInterface) {

    return {
        restrict: 'E',
        scope: {
            id      : '@',
            type    : '@',
            title   : '@',
            opened  : '@'
        },
        replace: true,
        transclude : true,
        templateUrl: 'src/rune/rune.dir.tmpl.html',
        link: function(scope, element, attrs) {
            // Add attributes in vm
            scope.vm = {
                id      : scope.id,
                type    : scope.type,
                title   : scope.title,
                opened  : scope.opened
            };
			//if (scope.vm.title === 'Project Info' && evtInterface.getRune().allowProgrammaticOpenings){
				//evtInterface.showRune(true);
				//}
            // Initialize box
            var currentRune = evtRune.build(scope);

            // Garbage collection
            scope.$on('$destroy', function() {
                if (currentRune){
                    currentRune.destroy();
                }
            });
        }
    };
});
