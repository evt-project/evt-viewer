angular.module('evtviewer.reference')

.directive('ref', function(evtRef) {
    return { //rivedere dipendenze
        restrict: 'C',
        scope: {
            target: '@',
            type: '@'
        },
        replace: true,
        transclude: true,
        controllerAs: 'vm',
        controller: 'RefCtrl',
        template: '<span class="evtRef" ng-click="vm.handleRefClick($event)" ng-transclude></span>',
        link: function(scope) {
            // Initialize reading
            var currentRef = evtRef.build(scope);

            // Garbage collection
            scope.$on('$destroy', function() {
                if (currentRef && currentRef.destroy) {
                    currentRef.destroy();
                }
            });
        }
    };
});