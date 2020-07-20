/**
 * @name evtviewer.mobile
 */

angular.module('evtviewer.mobile')

/**
 * @name evtviewer.MobileSearchCtrl
 * @extends evtviewer.mobile
 * @property {string} view
 * @property {string} mockSearchLetters
 * @property {string} mockSearchFilters
 * @property {string} mockText
 * @property {boolean} listReasults
 * @property {string} Search
 * @property {string} buttonsOption
 */

.controller('MobileSearchCtrl', ['$scope', 'mobile', 'parsedData', function($scope, mobile, parsedData) {    
    $scope.view = mobile.getState();

    $scope.mockSearchLetters = parsedData.getSearchLetters();

    $scope.mockSearchFilters = parsedData.getSearchFilters();

    $scope.mockText = parsedData.getText1();

    $scope.listResults = true;

    $scope.Search = ['Search...'];
    
    $scope.buttonsOption = [{
        description: '&#198;',
        tab:'tabLetters',
    }, {
        icon:'fa fa-cogs',
        tab:'tabFilters',
    }];

    
    /**
     * Remove the current text.
     * @constructor
     */

    $scope.removeText = function() {
        $scope.Search = null;
    };


    /**
     * Show or hide the chosen option.
     * @constructor
     * @param currentTab The current option.
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
     * @param activeTab The active option.
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
}]);