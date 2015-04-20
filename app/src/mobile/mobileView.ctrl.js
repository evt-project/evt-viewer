angular.module('evtviewer.mobile')

.controller('MobileViewCtrl', function($scope, mobile, parsedData) {

    $scope.view = mobile.getState();

    /**
     * Refer to this by {@link MobileViewCtrl."dvb"}.
     * @namespace
     */
    
    $scope.dvb = [{
        url: 'http://vbd.humnet.unipi.it/',
        title: 'Digital Vercelli Book project',
        description: 'Digital Vercelli Book project',
    }, {
        url: 'http://sourceforge.net/projects/evt-project/',
        title: 'Edition Visualization Technology on SourceForge',
        description: 'Edition Visualization Technology',
    }, {
        url: 'https://visualizationtechnology.wordpress.com/',
        title: 'EVT Blog',
        description: 'EVT Blog',
    }, {
        url: 'mailto: editionvisualizationtechnology@gmail.com',
        title: 'Contact',
        description: 'Contact',
    }, ];


    /**
     * Refer to this by {@link MobileViewCtrl."thumbnails"}.
     * @namespace
     */     

    $scope.thumbnails = parsedData.getThumb();


    /**
     * Refer to this by {@link MobileViewCtrl."search"}.
     * @namespace
     */

    $scope.Search = ['Search...'];

    $scope.removeText = function() {
        $scope.Search = null;
    };

    $scope.buttonsOption = [{
        description: '&#198;',
        tab:'tabLetters',
    }, {
        icon:'fa fa-cogs',
        tab:'tabFilters',
    }];
    
    $scope.showTabOptions = function (currentTab) {
        if ($scope.currentOption === currentTab.tab){
            $scope.currentOption =! $scope.currentOption;
        } else {
            $scope.currentOption = currentTab.tab;
        }
    };
   
    $scope.isActiveTab = function(activeTab) {
        return activeTab === $scope.currentOption;
    };

    $scope.listResults = true;
    $scope.showResults = function() {
        $scope.listResults = !$scope.listResults;
    };

   /**
     * Refer to this by {@link MobileViewCtrl."mockSearchLetters"}.
     * @namespace
     */ 
    $scope.mockSearchLetters = parsedData.getSearchLetters();

    /**
     * Refer to this by {@link MobileViewCtrl."mockSearchFilters"}.
     * @namespace
     */ 
    $scope.mockSearchFilters = parsedData.getSearchFilters();

    /**
     * Refer to this by {@link MobileViewCtrl."mockText"}.
     * @namespace
     */ 
    
    $scope.mockText = parsedData.getText();

    /**
     * Refer to this by {@link MobileViewCtrl."mockImage"}.
     * @namespace
     */ 
    
    $scope.mockImage = parsedData.getImage();

    /**
     * Refer to this by {@link MobileViewCtrl."mockBook"}.
     * @namespace
     */ 
    
    $scope.mockBook = parsedData.getBook();

    /** Partial controls */
    
    $scope.index = 0;

    /**
     * Represents the current item.
     * @constructor
     */
    $scope.isActive = function (index) {
        return $scope.index === index; // if a current item is the same as requested item
    };

    /**
     * Show the prev item.
     * @constructor
     */
    $scope.prevItem = function () {
        if ($scope.index > 0) {
            $scope.index = (--$scope.index);
        } else {
            $scope.index = ($scope.mockImage.length - 1);
        }
    };

    /**
     * Show the next item.
     * @constructor
     */
    $scope.nextItem = function () {
        if ($scope.index < $scope.mockImage.length - 1) {
            $scope.index = (++$scope.index);
        } else {
            $scope.index = 0;
        }
    };

    /**
     * Show the prev book item.
     * @constructor
     */
    $scope.prevBook = function () {
        if ($scope.index > 0) {
            $scope.index = (--$scope.index);
        } else {
            $scope.index = ($scope.mockBook.length - 1);
        }
    };

    /**
     * Show the next book item.
     * @constructor
     */
    $scope.nextBook = function () {
        if ($scope.index < $scope.mockBook.length - 1) {
            $scope.index = (++$scope.index);
        } else {
            $scope.index = 0;
        }
    };



});