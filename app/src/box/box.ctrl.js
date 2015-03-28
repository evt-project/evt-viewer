angular.module('evtviewer.box')

.controller('BoxCtrl', function($document, $window, $rootScope, $scope, $log, Box) {
    var _console = $log.getInstance('box');
    
    Box.addReference($scope);

    $scope.box = Box.getReference($scope.boxtitle);
        
    _console.log($scope.boxtitle);
});