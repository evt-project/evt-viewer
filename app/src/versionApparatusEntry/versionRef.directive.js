/**
 * @ngdoc directive
 * @module evtviewer.versionApparatusEntry
 * @name evtviewer.versionApparatusEntry.directive:evtVersionRef
 * @description 
 * # evtVersionRef
 * TODO: Add description!
 *
 * @scope
 * @param {string=} type type of version reference ('', 'version')
 * @param {string=} target id of the element to open or external link
 * @param {string=} elId id of the current element
 *
 * @restrict E
 *
 * @author Chiara Martignano
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