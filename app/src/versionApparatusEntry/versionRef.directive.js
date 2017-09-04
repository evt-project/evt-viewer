/**
 * @ngdoc directive
 * @module evtviewer.versionApparatusEntry
 * @name evtviewer.versionApparatusEntry.directive:evtVersionRef
 * @description 
 * # evtVersionRef
 * <p>Custom directive that will handle the connection between the double recensio entry 
 * and the text in the "Multiple recensions" View</p>
 * <p>The {@link evtviewer.versionApparatusEntry.controller:versionRefCtrl controller} for this directive is dynamically defined 
 * inside the {@link evtviewer.versionApparatusEntry.evtVersionRef evtVersionRef} provider file.</p>
 * <p>The initial scope is expanded in {@link evtviewer.versionApparatusEntry.evtVersionRef evtVersionRef} provider.</p>
 *
 * @scope
 * @param {string=} type type of version reference ('', 'version')
 * @param {string=} target id of the element to open or external link
 * @param {string=} elId id of the current element
 *
 * @restrict E
 *
 * @requires evtviewer.versionApparatusEntry.evtVersionRef
 *
 * @author CM
**/
angular.module('evtviewer.versionApparatusEntry')

.directive('evtVersionRef', function(evtVersionRef){
    return {
        restrict: 'E',
        scope: {
            type : '@',
            target : '@',
            elId : '@' 
        },
        transclude: true,
        templateUrl : 'src/versionApparatusEntry/versionRef.directive.tmpl.html',
        link: function(scope, element, attrs) {
            scope.vm = {};
            var currentRef = evtVersionRef.build(scope);
            scope.$on('$destroy', function() {
                if (currentRef) {
                    evtVersionRef.destroy(currentRef.uid);
                }
            });
        }
    };
});