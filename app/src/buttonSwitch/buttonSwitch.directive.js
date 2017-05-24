angular.module('evtviewer.buttonSwitch')

.directive('buttonSwitch', function(evtButtonSwitch, evtInterface) {
    return {
        restrict: 'E',
        scope: {
            title : '@',
            label : '@',
            icon  : '@',
            type  : '@',
            value : '@'
        },
        templateUrl: 'src/buttonSwitch/buttonSwitch.dir.tmpl.html',
        link: function(scope, element) {
            // Add attributes in vm
            scope.vm = {};

            var currentButton = evtButtonSwitch.build(scope, scope.vm);
            
            if (scope.type === 'addWit') {
                if (evtInterface.getAvailableWitnesses().length === 0) {
                    scope.vm.disabled = true;
                    scope.vm.title = 'No more witnesses available';
                }

                scope.$watch(function() {
                    return evtInterface.getAvailableWitnesses();
                }, function(newItem, oldItem) {
                    if (newItem !== oldItem) {
                        if (newItem.length === 0) {
                            scope.vm.disabled = true;
                            scope.vm.title = 'No more witnesses available';
                        } else {
                            scope.vm.disabled = false;
                            scope.vm.title = 'Add witness';
                        }
                    }
                }, true);
            }

            // TODO:  RIFARE!
            if (scope.type === 'changeViewMode') {
                scope.$watch(function() {
                    return evtInterface.getCurrentViewMode();
                }, function(newItem, oldItem) {
                    // if (newItem !== oldItem) {
                        if (newItem === scope.vm.value) {
                            scope.vm.active = true;
                        } else {
                            scope.vm.active = false;
                        }
                    // }
                }, true); 
            }

            // Garbage collection
            scope.$on('$destroy', function() {
                if (currentButton){
                    currentButton.destroy();
                }     
            });
        }
    };
    
});