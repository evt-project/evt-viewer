/**
 * @ngdoc directive
 * @module evtviewer.navBar
 * @name evtviewer.navBar.directive:evtNavbar
 * @description 
 * # evtNavbar
 * <p>Element that create a navBar connected to a specific critical apparatus. </p>
 * <p>It can be used for go on with the pages, and see the popup of the chosen page.</p>
 * <p>When the user clicks on it, the connected page will be retrieved 
 * from the source encoded text (and stored in {@link evtviewer.dataHandler.parsedData parsedData}) and will be shown</p>
 * <p>It uses the {@link evtviewer.navBar.controller:NavbarCtrl NavbarCtrl} controller.</p>
 * <p>The initial scope is expanded in {@link evtviewer.navBar.evtNavbar evtNavbar} provider.</p>
 *
 * @scope
 * @param {string} appId id of chosen text.
 * @param {string} readingId id of the mode reading to be shown
 * @param {number=} currentPage id of the current page
 * @param {number=} firstPage id of the first page
 * @param {number=} lastPage id of the last page
 *
 * @restrict E
**/
angular.module('evtviewer.navBar')

.directive('evtNavbar', function($timeout, evtNavbar, parsedData, evtInterface) {
    return {
        restrict: 'E',
        scope: {
          // Insert here scope properties to be passed from HTML attributes
        },
        transclude: true,
        templateUrl: 'src/navBar/navBar.directive.tmpl.html',
        controllerAs: 'vm',
        controller: 'NavbarCtrl',
        link: function(scope, element, attrs){
            var currentNavbar = evtNavbar.build(scope);
            scope.$watch(function() {
                return parsedData.getPages();
            }, function(newCollection, oldCollection) {
                if (oldCollection !== newCollection) {
                    currentNavbar.updateOptionsValue('floor', 0);
                    currentNavbar.updateOptionsValue('ceil', newCollection ? newCollection.length - 1 : 0);
                    currentNavbar.updateOptionsValue('translate', function(value, sliderId, label) {
                        var pageId = newCollection[value];
                        return newCollection[pageId] ? newCollection[pageId].label : value;
                    });
                    $timeout(function() {
                        scope.$broadcast('rzSliderForceRender')
                    });
                }
            }, true);
			
			scope.$watch(function() {
                return currentNavbar.pageSlider.value;
            },function(newValue, oldValue) {
                if (oldValue !== newValue) {
                    currentNavbar.updatePage(newValue);
				}
			}, true);
			
			scope.$watch(function() {
				return evtInterface.getState('currentPage');
			}, function(newValue, oldValue) {
                if (oldValue !== newValue) {
					currentNavbar.updateSlider(newValue);
				}
			}, true);

            scope.$watch(function() {
				return currentNavbar.showNavigator();
			}, function(newValue, oldValue) {
				if (oldValue !== newValue) {
                    currentNavbar.updateOptionsValue('disabled', !newValue);                    
				}
            }, true);
            
            // Garbage collection
            scope.$on('$destroy', function() {
              if (currentNavbar) {
                currentNavbar.destroy();
              }
            });
        }
    };
});