angular.module('evtviewer.mobile')

.controller('MobileSettingsCtrl', function($scope, mobile) {

    $scope.view = mobile.getState();

    $scope.leftTextOptions = false;
    $scope.rightTextOptions = false;
    $scope.imageOptions = false;

    $scope.leftTextSettings = function() {
        $scope.leftTextOptions = !$scope.leftTextOptions;
    };

    $scope.rightTextSettings = function() {
        $scope.rightTextOptions = !$scope.rightTextOptions;
    };

    $scope.showImageSettings = function() {
        $scope.imageOptions = !$scope.imageOptions;
    };

});