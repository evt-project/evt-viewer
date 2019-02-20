/**
 * @ngdoc directive
 * @module evtviewer.buttonSwitch
 * @name evtviewer.buttonSwitch.directive:buttonSwitch
 * @description 
 * # buttonSwitch
 * <p>Container that simulates a button. This is used to uniformize the layout of buttons
 * to all different operating system and browser. </p>
 * <p>Buttons can have icon and/or text and will trigger a callback function whem users click on it.</p>
 * <p>Since each instance of buttonSwitch must be controlled in different 
 * ways depending on type, the {@link evtviewer.buttonSwitch.controller:ButtonSwitchCtrl controller} for this directive is dynamically defined 
 * inside the {@link evtviewer.buttonSwitch.evtButtonSwitch evtButtonSwitch} provider file.</p>
 *
 * @scope
 * @param {string=} title title of button
 * @param {string=} label label of button
 * @param {string=} icon icon of button
 * @param {string=} type type of button that will determin the callback. Handled values: '*addWit*', '*alignReadings*', 
 * '*bookmark*', '*changeViewMode*', '*colorLegend*', '*closeDialog*', '*closePinned*', '*download-xml*',
 * '*fontSizeDecrease*', '*fontSizeTools*', '*front*', '*heatmap*', '*itl*', '*mainMenu*', '*openGlobalDialogInfo*', 
 * '*openGlobalDialogWitnesses*', '*openGlobalDialogLists*', '*pin*', '*removeWit*', '*searchInEdition*', '*searchInWit*', 
 * '*share*', '*toggleInfoWit*', '*toggleFilterApp*', '*togglePinned*', '*witList*', '*toggleInfoSrc*', '*addVer*', 
 * '*removeVer*', '*cropText*', '*nextPage*'.
 * @param {string=} value value associated to button
 * @param {string=} iconPos position of icon ('left', 'right'). Default 'right'
 *
 * @restrict E
**/
angular.module('evtviewer.buttonSwitch')

.directive('buttonSwitch', function($rootScope, evtButtonSwitch, evtInterface) {
    return {
        restrict: 'E',
        scope: {
            title : '@',
            label : '@',
            icon  : '@',
            type  : '@',
            value : '@',
            iconPos : '@',
            disabled: '@',
            onBtnClicked: '&'
        },
        templateUrl: 'src/buttonSwitch/buttonSwitch.dir.tmpl.html',
        link: function(scope, element) {
            // Add attributes in vm
            scope.vm = {};
            var currentButton = evtButtonSwitch.build(scope, scope.vm);
            scope.$watch(function() {
                return scope.disabled;
            }, function(newItem, oldItem) {
                if (newItem !== oldItem) {
                    scope.vm.disabled = newItem
                }
            });

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
            
            var parentBoxId;
            if (scope.type === 'search') {
              parentBoxId = scope.$parent.id;
              $rootScope.$broadcast('searchBtn', {parentId:parentBoxId, btn: currentButton});
           }
           if (scope.type === 'searchVirtualKeyboard') {
              parentBoxId = scope.$parent.id;
              $rootScope.$broadcast('keyboardBtn', {parentId:parentBoxId, btn: currentButton});
           }
            if (scope.type === 'prevPage' || scope.type === 'firstPage') {
                scope.$watch(function() {
                    return evtInterface.isCurrentPageFirst();
                }, function(newItem, oldItem) {
                    if (newItem !== oldItem) {
                        scope.vm.disabled = newItem;
                    }
                }, true);
            }
            if (scope.type === 'nextPage' || scope.type === 'lastPage') {
                scope.$watch(function() {
                    return evtInterface.isCurrentPageLast();
                }, function(newItem, oldItem) {
                    if (newItem !== oldItem) {
                        scope.vm.disabled = newItem;
                    }
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
