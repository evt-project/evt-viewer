/**
 * @ngdoc directive
 * @module evtviewer.buttonSwitch
 * @name evtviewer.buttonSwitch.directive:buttonSwitch
 * @description 
 * # buttonSwitch
 * TODO: Add description!
 *
 * @scope
 * @param {string=} title title of button
 * @param {string=} label label of button
 * @param {string=} icon icon of button
 * @param {string=} type type of button that will determin the callback
 * @param {string=} value value of button
 * @param {string=} iconPos position of icon ('left', 'right'). Default 'right'
 *
 * @restrict E
**/
angular.module('evtviewer.buttonSwitch')

.directive('buttonSwitch', function(evtButtonSwitch, evtInterface) {
    return {
        restrict: 'E',
        scope: {
            title : '@',
            label : '@',
            icon  : '@',
            type  : '@',
            value : '@',
            iconPos : '@'
        },
        templateUrl: 'src/buttonSwitch/buttonSwitch.dir.tmpl.html',
        link: function(scope, element) {
            // Add attributes in vm
            scope.vm = {};

            var currentButton = evtButtonSwitch.build(scope, scope.vm);
            if (scope.type === 'addWit') {
                 if (evtInterface.getProperty('availableWitnesses').length === 0) {
                    scope.vm.disabled = true;
                    scope.vm.title = 'BUTTONS.NO_WITNESSES_AVAILABLE';
                } 
                scope.$watch(function() {
                    return evtInterface.getProperty('availableWitnesses');
                }, function(newItem, oldItem) {
                    if (newItem !== oldItem) {
                        if (newItem.length === 0) {
                            scope.vm.disabled = true;
                            scope.vm.title = 'BUTTONS.NO_WITNESSES_AVAILABLE';
                        } else {
                            scope.vm.disabled = false;
                            scope.vm.title = 'BUTTONS.ADD_WITNESS';
                        }
                    }
                }, true);
            }

            if (scope.type === 'addVer') {
                if (evtInterface.getProperty('availableVersions').length === 0) {
                    scope.vm.disabled = true;
                    scope.vm.title = 'BUTTONS.NO_VERSION_AVAILABLE';
                }

                scope.$watch(function() {
                    return evtInterface.getProperty('availableVersions');
                }, function(newItem, oldItem) {
                    if (newItem !== oldItem) {
                        if (newItem.length === 0) {
                            scope.vm.disabled = true;
                            scope.vm.title = 'BUTTONS.NO_VERSION_AVAILABLE';
                        } else {
                            scope.vm.disabled = false;
                            scope.vm.title = 'BUTTONS.ADD_VERSION';
                        }
                    }
                }, true);
            }

            // TODO:  RIFARE!
            if (scope.type === 'changeViewMode') {
                scope.$watch(function() {
                    return evtInterface.getState('currentViewMode');
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