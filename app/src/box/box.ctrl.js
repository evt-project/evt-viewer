angular.module('evtviewer.box')

.controller('BoxCtrl', function($document, $window, $rootScope, $scope, $log, box) {

    var _console = $log.getInstance('box');
    
    box.addReference($scope);

    $scope.box = box.getReference($scope.boxtitle);
        
    _console.log($scope.boxtitle);
});