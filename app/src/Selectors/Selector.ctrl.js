angular.module('evtviewer.selector')
.controller('SelectorCtrl', function($document, $window, $rootScope, $scope, selector) {
    //var currentSelector = angular.element.find('.evtviewer-selector');
    selector.log('Controller Running for '+$scope.title);

    $scope.optionSelected = {
    	label: 'Select...',
    	value: 'selecting'
    };

    $scope.containerWidth = 0;
    $scope.optionContainerOpened = false;
	$scope.optionList = [];

	/* OPTION LIST */
	var populateSelector = function(){
		var pre = $scope.title;
		$scope.addOption(pre+'-Prova', pre+'-prova', pre+'-Titolo Prova');
	};

	$scope.addOption = function(option){
		$scope.optionList.push(option);
	};

	$scope.addOption = function(optLabel, optValue, optTitle){
		var option = {
			label: optLabel,
			value: optValue,
			title: optTitle
		};
		$scope.optionList.push(option);
	};

	$scope.selectOption = function(option){
    	selector.log('Selecting option with value= '+option.value);
    	$scope.toggleOptionContainer();
    	$scope.optionSelected = option;
    };

    /* OPTION CONTAINER */

    $scope.toggleOptionContainer = function(){
    	selector.log('Toggle Option Container of '+$scope.title);
    	$scope.optionContainerOpened = !$scope.optionContainerOpened;
    	selector.setFocused($scope.title);
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
        return selector.getFocusedName();
    }, function(selectorOpened) {
        if(selectorOpened === ''){
            $scope.optionContainerOpened = false;
        } else {
            $scope.optionContainerOpened = ($scope.title === selectorOpened); 
        }
    });

    populateSelector();

    selector.log($scope.title);
    selector.log($scope.optionContainerOpened);
});