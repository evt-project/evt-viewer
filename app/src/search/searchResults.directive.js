angular.module('evtviewer.search')

.directive('evtSearchResults', ['$timeout', 'evtSearchResult', 'evtSearchBox', 'evtInterface', function($timeout, evtSearchResult, evtSearchBox, evtInterface) {
   return {
      restrict: 'E',
      templateUrl : 'src/search/searchResults.directive.tmpl.html',
      replace     : true,
      controllerAs: 'vm',
      controller: 'SearchResultsCtrl',
      link: function(scope) {
         evtSearchResult.build(scope, scope.vm);
         
         scope.$watch(function() {
            return evtInterface.getState('currentEdition');
         }, function() {
            scope.vm.currentEdition = evtInterface.getState('currentEdition');
            if(scope.$parent.vm.searchInput !== '' && scope.$parent.vm.searchInput !== undefined) {
               scope.$parent.vm.doSearchCallback();
               
               $timeout(function() {
                  evtSearchBox.setStatus(scope.vm.parentBoxId, 'searchResultBox', false);
                  evtSearchBox.hideBtn(scope.vm.parentBoxId, 'searchResultsHide');
                  evtSearchBox.showBtn(scope.vm.parentBoxId, 'searchResultsShow');
               });
            }
         }, true);
      }
   };
}]);
