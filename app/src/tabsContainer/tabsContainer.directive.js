/**
 * @ngdoc directive
 * @module evtviewer.tabsContainer
 * @name evtviewer.tabsContainer.directive:evtTabsContainer
 * @description 
 * # evtTabsContainer
 * TODO: Add description!
 * It uses the {@link evtviewer.tabsContainer.controller:TabsContainerCtrl TabsContainerCtrl} controller. 
 *
 * @scope
 * @param {string=} type type of tab container ('projectInfo', 'entitiesList')
 * @param {string=} orientation orientation of tabs ('vertical', 'horizontal') [default: 'vertical']
 *
 * @restrict E
 *
 * @author Chiara Martignano
**/
angular.module('evtviewer.tabsContainer')

.directive('evtTabsContainer', function(evtTabsContainer) {

    return {
        restrict: 'E',
        scope: {
            type        : '@',
            orientation : '@'
        },
        templateUrl: 'src/tabsContainer/tabsContainer.dir.tmpl.html',
        link: function(scope, element, attrs) { 
            // Add attributes in vm 
            scope.vm = { 
                id      : scope.id, 
                type    : scope.type, 
                orientation   : scope.orientation, 
            }; 
      		// Initialize tabs container 
            var currentTabContainer = evtTabsContainer.build(scope); 
             
            // Garbage collection 
            scope.$on('$destroy', function() { 
                if (currentTabContainer){ 
                    currentTabContainer.destroy(); 
                }      
            }); 
        } 
    };
});