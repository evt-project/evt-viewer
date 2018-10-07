angular.module('evtviewer.search')

.directive('evtSearchResults', ['evtSearchResult', 'evtInterface', function(evtSearchResult, evtInterface) {
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
         }, function(newVal) {
            scope.vm.currentEdition = evtInterface.getState('currentEdition');
            if(scope.$parent.vm.searchInput !== '' && scope.$parent.vm.searchInput !== undefined) {
               scope.$parent.vm.doSearchCallback();
            }
         }, true);
      }
   };
}]);
