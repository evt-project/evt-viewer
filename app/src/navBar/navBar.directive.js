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

.directive('evtNavbar', function(evtNavbar, parsedData, evtInterface) {
    return {
        restrict: 'E',
        scope: {
            appId       : '@',
            readingId   : '@',
            currentPage : '@',
            firstPage   : '@',
            lastPage    : '@'
        },
        transclude: true,
        templateUrl: 'src/navBar/navBar.directive.tmpl.html',
        controllerAs: 'vm',
        controller: 'NavbarCtrl',
        link: function(scope, element, attrs){
            // Initialize reading
            scope.currentViewMode = evtInterface.getState('currentViewMode');
            scope.inlineApparatus = evtInterface.isCriticalApparatusInline();
            //var currentReading = evtReading.build(scope.appId, scope);
            //if (scope.inlineApparatus && evtInterface.getState('currentAppEntry') === scope.appId) {
               // currentReading.openApparatus();
           // }
            // Garbage collection
          //  scope.$on('$destroy', function() {
              //  if (currentReading){
              //      currentReading.destroy();
               // }     
            //};
        }
    };
});