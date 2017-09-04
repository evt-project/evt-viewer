/**
 * @ngdoc directive
 * @module evtviewer.dialog
 * @name evtviewer.dialog.directive:evtDialog
 * @description 
 * # evtDialog
 * <p>Container that opens up above everything and has a shadow below, hiding the lower contents.</p>
 * <p>The content shown can be added as transcluded content.</p> 
 * <p>The general layout and colors will depend on dialog type. </p>
 * <p>Available types are:<ul>
 * <li> **error**: Red color, smaller dimensions;</li>
 * <li> **bookmark**: smaller dimensions.</li>
 * </ul></p>
 * <p>The {@link evtviewer.dialog.controller:DialogCtrl controller} for this directive is dynamically defined 
 * inside the {@link evtviewer.dialog.evtDialog evtDialog} provider file.</p>
 * @scope
 * @param {string=} id id of dialog
 * @param {string=} type type of dialog ('error', 'bookmark')
 * @param {string=} title title of dialog
 * @param {boolean=} opened status of dialog
 *
 * @restrict E
**/
angular.module('evtviewer.dialog')

.directive('evtDialog', function(evtDialog,evtInterface) {

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
        templateUrl: 'src/dialog/dialog.dir.tmpl.html',
        link: function(scope, element, attrs) {
            // Add attributes in vm
            scope.vm = {
                id      : scope.id,
                type    : scope.type,
                title   : scope.title,
                opened  : scope.opened
            };
			//if (scope.vm.title === 'Project Info' && evtInterface.getDialog().allowProgrammaticOpenings){
				//evtInterface.showDialog(true);
				//}
            // Initialize box
            var currentDialog = evtDialog.build(scope);
            
            // Garbage collection
            scope.$on('$destroy', function() {
                if (currentDialog){
                    currentDialog.destroy();
                }     
            });
        }
    };
});