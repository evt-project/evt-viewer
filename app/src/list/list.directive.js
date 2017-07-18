/**
 * @ngdoc directive
 * @module evtviewer.list
 * @name evtviewer.list.directive:evtList
 * @description 
 * # evtList
 * TODO: Add description!
 *
 * @scope
 * @param {string=} listId id of list
 * @param {string=} listType type of list ('person', 'place', 'org', 'generic')
 *
 * @restrict E
**/
angular.module('evtviewer.list')

.directive('evtList', function(evtList, parsedData) {
    return {
        restrict: 'E',
        scope: {
            listId : '@',
            listType: '@'
        },
        transclude: true,
        templateUrl: 'src/list/list.dir.tmpl.html',
        link: function(scope, element, attrs){
            // Initialize list
            scope.vm = {
                listId: scope.listId,
                listType: scope.listType
            };
            var currentList = evtList.build(scope.listId, scope);
            
            // Garbage collection
            scope.$on('$destroy', function() {
                if (currentList){
                    currentList.destroy();
                }     
            });
        }
    };
});