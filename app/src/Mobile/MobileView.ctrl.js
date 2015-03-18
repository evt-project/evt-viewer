angular.module('evtviewer.mobile')

.controller('MobileViewCtrl', function($scope, Mobile) {

    $scope.view = Mobile.getState();
   
});