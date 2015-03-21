angular.module('evtviewer.box')

.controller('BoxCtrl', function($document, $window, $rootScope, $scope, Box) {
    
    Box.addReference($scope);

    $scope.box = Box.getReference($scope.boxtitle);
        
    Box.log($scope.boxtitle);
});