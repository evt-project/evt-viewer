angular.module('evtviewer.selector')

.controller('SelectorCtrl', function($document, $window, $rootScope, $scope, Selector) {
    //var currentSelector = angular.element.find('.evtviewer-selector');
    Selector.log('Controller Running for ' + $scope.title);

    Selector.addReference($scope);

    $scope.selector = Selector.getReference($scope.title);
    
    $scope.toggleExpand = function() {
        Selector.log('Controller - Toggle expand for ' + $scope.title);
        Selector.toggleExpand($scope.title);
    };

    $scope.selectOption = function(option) {
        Selector.selectOption($scope.title, option);
    };

    /*$scope.isSelectorFocused = function(){
    	var selectorOpened = selector.getFocusedName();
    	if(selectorOpened === ''){
    		return false;
    	} else {
    		return $scope.title === selectorOpened;	
    	}
    };*/

    Selector.log($scope.title);
});