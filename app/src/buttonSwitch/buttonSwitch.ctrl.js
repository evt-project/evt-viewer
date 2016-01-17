angular.module('evtviewer.buttonSwitch')

.controller('ButtonSwitchCtrl', function($document, $window, $rootScope, $scope, evtInterface, parsedData) {
    $scope.active   = false;
    $scope.disabled = false;
    
    $scope.setIcon = function() {
        var icon = '';
        switch(angular.lowercase($scope.icon)) {
            case 'thumb':
            case 'thumbs':
            case 'thumbnail':
            case 'thumbnails':
                icon = 'fa-th';
                break;
            case 'filter':
            case 'filters':
                icon = 'fa-filter';
                break;
            case 'remove':
                icon = 'fa-times';
                break;
            case 'add':
                icon = 'fa-plus';
                break;
        }
        return icon;
    };
    
    $scope.doCallback = function() {
        if (!$scope.disabled) {
            $scope.active = !$scope.active;
            switch($scope.type) {
                case 'changeViewMode':
                    console.log('changeViewMode', $scope.value);
                    if ($scope.value !== undefined) {
                        evtInterface.updateCurrentViewMode($scope.value);
                    }
                    break; 
                case 'removeWit':
                    var wit = $scope.$parent.vm.witness;
                    evtInterface.removeWitness(wit);
                    break;
                case 'addWit':
                    var witnesses   = parsedData.getWitnessesList(), 
                        currentWits = evtInterface.getCurrentWitnesses(),
                        newWit,
                        i = 0;
                    while (newWit === undefined && i < witnesses.length) {
                        if ( currentWits.indexOf(witnesses[i]) < 0) {
                            newWit = witnesses[i];
                        }
                        i++;
                    }

                    if (newWit !== undefined) {
                        evtInterface.addWitness(newWit);
                    }
                    $scope.active = false;
                    break;
                default:
                    break;
            }
        }
    };

    if ($scope.type === 'addWit') {
        $scope.$watch(function() {
            return evtInterface.getCurrentWitnesses();
        }, function(newItem, oldItem) {
            if (newItem.length === parsedData.getWitnessesList().length) {
                $scope.disabled = true;
                $scope.title = 'No more witnesses available';
            } else {
                $scope.disabled = false;
                $scope.title = 'Add witness';
            }
        }, true); 
    }

    // TODO:  RIFARE!
    if ($scope.type === 'changeViewMode') {
        $scope.$watch(function() {
            return evtInterface.getCurrentViewMode();
        }, function(newItem, oldItem) {
            if (newItem === $scope.value) {
                $scope.active = true;
            } else {
                $scope.active = false;
            }
        }, true); 
    }
});