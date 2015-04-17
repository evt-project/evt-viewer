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
     * Refer to this by {@link MobileViewCtrl."singleData"}.
     * @namespace
     */   
    $scope.singleData = [{
        src: 'http://i57.tinypic.com/k3b1mq.jpg',
        title: 'The Dream of the Rood',
        page:'- 104v -',
    }, {
        src: 'http://i61.tinypic.com/w1v6ag.jpg',
        title: 'The Dream of the Rood',
        page:'- 105r -',
    }, {
        src: 'http://i58.tinypic.com/k4wc41.jpg',
        title: 'The Dream of the Rood',
        page:'- 105v -',
    }, {
        src: 'http://i57.tinypic.com/1zna0k1.jpg',
        title: 'The Dream of the Rood',
        page:'- 106r -',
    }, ];


    /**
     * Refer to this by {@link MobileViewCtrl."doubleData"}.
     * @namespace
     */ 
    $scope.doubleData = [{
        src: 'http://i59.tinypic.com/ajur7b.jpg',
        title: 'The Dream of the Rood',
        page: '- 104v - 105r -',
    }, {
        src: 'http://i62.tinypic.com/6ft8g2.jpg',
        title: 'The Dream of the Rood',
        page: '- 105v - 106r -',
    }, ];


    /**
     * Refer to this by {@link MobileViewCtrl."mockText"}.
     * @namespace
     */ 
    $scope.mockText = parsedData.getText();

    $scope.mockText2 = parsedData.getText2();

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
     * Show the prev single item.
     * @constructor
     */
    $scope.singlePrev = function () {
        if ($scope.index > 0) {
            $scope.index = (--$scope.index);
        } else {
            $scope.index = ($scope.singleData.length - 1);
        }
    };

    /**
     * Show the next single item.
     * @constructor
     */
    $scope.singleNext = function () {
        if ($scope.index < $scope.singleData.length - 1) {
            $scope.index = (++$scope.index);
        } else {
            $scope.index = 0;
        }
    };

    /**
     * Show the prev double item.
     * @constructor
     */
    $scope.doublePrev = function () {
        if ($scope.index > 0) {
            $scope.index = (--$scope.index);
        } else {
            $scope.index = ($scope.doubleData.length - 1);
        }
    };

    /**
     * Show the next double item.
     * @constructor
     */
    $scope.doubleNext = function () {
        if ($scope.index < $scope.doubleData.length - 1) {
            $scope.index = (++$scope.index);
        } else {
            $scope.index = 0;
        }
    };



});