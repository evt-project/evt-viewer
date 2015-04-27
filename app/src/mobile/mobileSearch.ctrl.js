angular.module('evtviewer.mobile')

.controller('MobileSearchCtrl', function($scope, mobile, parsedData) {

    /**
     * Refer to this by {@link MobileSearchCtrl."view"}.
     * @namespace
     */ 
    $scope.view = mobile.getState();

    /**
     * Refer to this by {@link MobileSearchCtrl."search"}.
     * @namespace
     */
    $scope.Search = ['Search...'];

    /**
     * Refer to this by {@link MobileSearchCtrl."listResults"}.
     * @namespace
     */
    $scope.listResults = true;

    /**
     * Refer to this by {@link MobileSearchCtrl."buttonSOptions"}.
     * @namespace
     */
    $scope.buttonsOption = [{
        description: '&#198;',
        tab:'tabLetters',
    }, {
        icon:'fa fa-cogs',
        tab:'tabFilters',
    }];

    /**
     * Refer to this by {@link MobileSearchCtrl."mockSearchLetters"}.
     * @namespace
     */ 
    $scope.mockSearchLetters = parsedData.getSearchLetters();

    /**
     * Refer to this by {@link MobileSearchCtrl."mockSearchFilters"}.
     * @namespace
     */ 
    $scope.mockSearchFilters = parsedData.getSearchFilters();

    /**
     * Refer to this by {@link MobileViewCtrl."mockText"}.
     * @namespace
     */ 
    
    $scope.mockText = parsedData.getText1();


    /**
     * Remove the current text.
     * @constructor
     */
    $scope.removeText = function() {
        $scope.Search = null;
    };


    /**
     * Show the current tab.
     * @constructor
     */
    $scope.showTabOptions = function (currentTab) {
        if ($scope.currentOption === currentTab.tab){
            $scope.currentOption =! $scope.currentOption;
        } else {
            $scope.currentOption = currentTab.tab;
        }
    };
   
    /**
     * Active the class of current button
     * @constructor
     */
    $scope.isActiveTab = function(activeTab) {
        return activeTab === $scope.currentOption;
    };

    /**
     * Show or hide the list of results
     * @constructor
     */
    $scope.showResults = function() {
        $scope.listResults = !$scope.listResults;
    };
});