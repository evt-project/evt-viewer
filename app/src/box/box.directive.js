angular.module('evtviewer.box')

.directive('box', function(evtBox) {
    return {
        restrict: 'E',
        scope: {
            id: '@',
            type: '@'
        },
        templateUrl: 'src/box/box.dir.tmpl.html',
        link: function(scope) {

            // Add attributes in vm
            scope.vm = {
                id: scope.id,
                type: scope.type
            };

            // Initialize select
            var currentBox = evtBox.build(scope.vm);

            // Garbage collection
            scope.$on('$destroy', function() {
                if (currentBox){
                    currentBox.destroy();
                }     
            });
        }
    };
});