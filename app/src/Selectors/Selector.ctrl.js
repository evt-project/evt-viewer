angular.module('evtviewer.selector')

.controller('SelectorCtrl', function($document, $window, $rootScope, $scope, Selector) {
    //var currentSelector = angular.element.find('.evtviewer-selector');
    Selector.log('Controller Running for ' + $scope.id);

    Selector.addReference($scope);

    $scope.selector = Selector.getReference($scope.id);
    
    $scope.toggleExpand = function() {
        Selector.log('Controller - Toggle expand for ' + $scope.id);
        Selector.toggleExpand($scope.id);
    };

    $scope.selectOption = function(option) {
        Selector.selectOption($scope.id, option);
    };

    Selector.log($scope.id);
});