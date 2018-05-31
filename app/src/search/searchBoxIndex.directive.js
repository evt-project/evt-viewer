angular.module('evtviewer.search')
   .directive('evtSearchBoxIndex', function () {
      return {
         restrict: 'E',
         templateUrl: 'src/search/searchBoxIndex.directive.tmpl.html',
         replace: true,
         controllerAs: 'vm',
         controller: 'SearchBoxCtrl'
      };
   });
