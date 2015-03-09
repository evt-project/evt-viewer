angular.module('evtviewer.selector')

.controller('SelectorCtrl', function($document, $window, $rootScope, $scope, Selector) {
    //var currentSelector = angular.element.find('.evtviewer-selector');
    Selector.log('Controller Running for ' + $scope.title);

    Selector.addReference($scope);

    $scope.optionSelected = {
        label: 'Select...',
        value: 'selecting'
    };

    $scope.containerWidth = 0;
    $scope.optionContainerOpened = false;
    $scope.optionList = [];

    /* OPTION LIST */
    var populateSelector = function() {
        var pre = $scope.title;
        $scope.addOption(pre + '-Prova', pre + '-prova', pre + '-Titolo Prova');
    };

    $scope.addOption = function(option) {
        $scope.optionList.push(option);
    };

    $scope.addOption = function(optLabel, optValue, optTitle) {
        var option = {
            label: optLabel,
            value: optValue,
            title: optTitle
        };
        $scope.optionList.push(option);
    };

    $scope.selectOption = function(option) {
        Selector.log('Selecting option with value= ' + option.value);
        $scope.toggleOptionContainer();
        $scope.optionSelected = option;
    };

    /* OPTION CONTAINER */

    $scope.toggleOptionContainer = function() {
        Selector.log('Toggle Option Container of ' + $scope.title);
        $scope.optionContainerOpened = !$scope.optionContainerOpened;
        Selector.setFocused($scope.title);
    };

    /*$scope.isSelectorFocused = function(){
    	var selectorOpened = selector.getFocusedName();
    	if(selectorOpened === ''){
    		return false;
    	} else {
    		return $scope.title === selectorOpened;	
    	}
    };*/
    $scope.$watch(function() {
        return Selector.getFocusedName();
    }, function(selectorOpened) {
        if (selectorOpened === '') {
            $scope.optionContainerOpened = false;
        } else {
            $scope.optionContainerOpened = ($scope.title === selectorOpened);
        }
    });

    populateSelector();

    Selector.log($scope.title);
    Selector.log($scope.optionContainerOpened);
});