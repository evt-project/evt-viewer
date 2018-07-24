angular.module('evtviewer.search')
   .directive('evtSearchBox',['evtSearchBox', 'evtInterface', function (evtSearchBox, evtInterface) {
      return {
         restrict: 'E',
         templateUrl: 'src/search/searchBox.directive.tmpl.html',
         replace: true,
         controllerAs: 'vm',
         controller: 'SearchBoxCtrl',
         link: function (scope) {
            evtSearchBox.build(scope, scope.vm);
   
            scope.$watch(function() {
               return evtInterface.getState('currentEdition');
            }, function(newItem, oldItem) {
               if (oldItem !== newItem) {
                  evtSearchBox.build(scope, scope.vm);
               }
            }, true);
         }
      };
   }]);
