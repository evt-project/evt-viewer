angular.module('evtviewer.mobile')

.controller('MobileSettingsCtrl', function($scope, mobile) {

    $scope.view = mobile.getState();

    $scope.textOptions = false;
    $scope.imageOptions = false;

    $scope.showTextSettings = function() {
        $scope.textOptions = !$scope.textOptions;
    };

    $scope.showImageSettings = function() {
        $scope.imageOptions = !$scope.imageOptions;
    };

});