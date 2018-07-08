angular.module('evtviewer.search')

.directive('evtSearchResults', ['evtInterface', function(evtInterface) {
   return {
      restrict: 'E',
      templateUrl : 'src/search/searchResults.directive.tmpl.html',
      replace     : true,
      controllerAs: 'vm',
      controller: 'SearchResultsCtrl',
      link: function(scope) {
   
         scope.$watch(function() {
            return evtInterface.getState('currentEdition');
         }, function(newVal) {
            scope.vm.currentEdition = evtInterface.getState('currentEdition');
            if(scope.$parent.searchInput !== '' && scope.$parent.searchInput !== undefined) {
               scope.$parent.vm.doSearchCallback();
            }
         }, true);
      }
   };
}]);
