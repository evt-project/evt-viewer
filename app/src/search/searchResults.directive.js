angular.module('evtviewer.search')

.directive('evtSearchResults', ['evtSearchResultsProvider', 'evtInterface', function(evtSearchResultsProvider, evtInterface) {
   return {
      restrict: 'E',
      templateUrl : 'src/search/searchResults.directive.tmpl.html',
      replace     : true,
      controllerAs: 'vm',
      controller: 'SearchResultsCtrl',
      link: function(scope) {
         evtSearchResultsProvider.build(scope, scope.vm);
   
         scope.$watch(function() {
            return evtInterface.getState('currentEdition');
         }, function(newVal) {
            scope.vm.currentEdition = evtInterface.getState('currentEdition');
            if(scope.$parent.searchInput !== '') {
               scope.$parent.vm.doSearchCallback();
            }
         }, true);
      }
   };
}]);
