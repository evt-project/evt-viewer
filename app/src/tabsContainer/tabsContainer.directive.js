/**
 * @ngdoc directive
 * @module evtviewer.tabsContainer
 * @name evtviewer.tabsContainer.directive:evtTabsContainer
 * @description
 * # evtTabsContainer
 * <p>Container that shows a particular content organized in a structure similar
 * to an unordered list of tabs that have hashes corresponding to tab ids.
 * When the user clicks on each tab, only the container with the corresponding tab id will become visible.</p>
 * <p>Tabs can appear either on top of content ('*horizontal*' layout) or on the left-hand side of content ('*vertical*' layout).</p>
 * <p>The tabs and the content of each one are defined according to a particular type; content is retrieved from
 * {@link evtviewer.dataHandler.parsedData}.</p>
 * <p>Available types are:<ul>
 * <li> **projectInfo**: will retrieve and show the header information about project and edition,
 * properly divided into 'File Description', 'Encoding Description', 'Text Profile', 'Outside Metadata',
 * 'Revision History' and 'Bibliography'.</li>
 * <li> **entitiesList**: will retrieve and show all the available lists of named entities parsed.</li>
 * </ul></p>
 * <p>It uses the {@link evtviewer.tabsContainer.controller:TabsContainerCtrl TabsContainerCtrl} controller,
 * which is expanded dinamically inside the
 * {@link evtviewer.tabsContainer.evtTabsContainer evtTabsContainer} provider file.</p>
 *
 * @scope
 * @param {string=} type type of tab container ('projectInfo', 'entitiesList')
 * @param {string=} orientation orientation of tabs ('vertical', 'horizontal') [default: 'vertical']
 *
 * @restrict E
 *
 * @author CDP
**/
angular.module('evtviewer.tabsContainer')

.directive('evtTabsContainer', function(evtTabsContainer, evtInterface) {

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
            evtInterface.setTabContainerPanel(currentTabContainer.tabs);

            scope.$watch(function() {
                return evtInterface.getHomePanel();
            }, function(oldVal, newVal) {
                if (newVal !== '') {
                  evtTabsContainer.setSubContentOpenedByType('projectInfo', newVal);
                }
            });

            // Garbage collection
            scope.$on('$destroy', function() {
                if (currentTabContainer){
                    if (currentTabContainer.type === 'projectInfo') {
                        evtInterface.setHomePanel('');
                    }
                    currentTabContainer.destroy();
                }
            });
        }
    };
});
