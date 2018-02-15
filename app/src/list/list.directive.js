/**
 * @ngdoc directive
 * @module evtviewer.list
 * @name evtviewer.list.directive:evtList
 * @description 
 * # evtList
 * <p>Container that shows a list of named entities,
 * (divided by indexing letter) which are not "loaded" or "initialized" all together, 
 * but in group of 5 elements when scrolling occurs 
 * (it uses infinite scrolling to perform the lazy loading of elements)
 * <p>The list of elements itself depend on the type of list; elements are retrieved from 
 * {@link evtviewer.dataHandler.parsedData}.</p> 
 * <p>Available types are:<ul>
 * <li> **person**: will retrieve and show a list of persons;</li>
 * <li> **place**: will retrieve and show a list of places;</li>
 * <li> **org**: will retrieve and show a list of organizations;</li>
 * <li> **generic**: will retrieve and show a list of generic named entities.</li>
 * </ul></p>
 * <p>The {@link evtviewer.list.controller:ListCtrl controller} for this directive is dynamically defined 
 * inside the {@link evtviewer.list.evtList evtList} provider file.</p>
 *
 * @scope
 * @param {string=} listId id of list
 * @param {string=} listType type of list ('person', 'place', 'org', 'generic')
 *
 * @restrict E
 *
 * @requires evtviewer.dataHandler.parsedData
 * @requires evtviewer.list.evtList
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