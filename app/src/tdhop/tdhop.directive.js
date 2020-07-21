angular.module('evtviewer.tdhop')
   .directive('evtTredhop', ['evtTredhop', 'evtInterface', '$timeout', function (evtTredhop, evtInterface, $timeout) {
      return {
         restrict: 'AE',
         scope: {
            canvas: '@',
            measurebox: '@',
            options: '=',
            name: '=',
         },
         controllerAs: 'vm',
         controller: 'TreDHOPCtrl',
         template: require('./tdhop.directive.tmpl.html'),

         transclude: true,

         link: function (scope, element, attrs) {
            $timeout(function () {
               var currentTdhop = evtTredhop.build(scope);

               // Garbage collection
               scope.$on('$destroy', function () {
                  if (currentTdhop) {
                     tdhop.destroy(currentTdhop.currentId);
                  }
               });
            }, 10);
         }
      };
   }]);
