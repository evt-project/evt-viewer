angular.module('evtviewer.buttonSwitch')

.controller('ButtonSwitchCtrl', function($document, $window, $rootScope, $scope) {
    $scope.active = false;
    $scope.setIcon = function() {
        var icon = '';
        switch(angular.lowercase($scope.title)) {
            case 'thumb':
            case 'thumbs':
            case 'thumbnail':
            case 'thumbnails':
                icon = 'fa-th';
                break;
            case 'filters':
                icon = 'fa-filter';
                break;
        }
        return icon;
    };
    
    $scope.doCallback = function() {
        $scope.active = !$scope.active;
        // Selector.closeAll('');
    };
});