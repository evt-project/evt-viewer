angular.module('evtviewer.mobile')

.controller('MobileViewCtrl', function($scope, mobile) {

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
    $scope.thumbnails = [{
        id: '104v',
        url: 'http://i62.tinypic.com/f20hts.jpg',
    }, {
        id: '105r',
        url: 'http://i57.tinypic.com/312i5c9.jpg',
    }, {
        id: '105v',
        url: 'http://i58.tinypic.com/6jkie1.jpg',
    }, {
        id: '106r',
        url: 'http://i58.tinypic.com/29zvtyt.jpg',
    }, {
        id: '133v',
        url: 'http://i62.tinypic.com/f20hts.jpg',
    }, {
        id: '134r',
        url: 'http://i57.tinypic.com/312i5c9.jpg',
    }, {
        id: '134v',
        url: 'http://i58.tinypic.com/6jkie1.jpg',
    }, {
        id: '135r',
        url: 'http://i58.tinypic.com/29zvtyt.jpg',
    }, {
        id: '135v',
        url: 'http://i62.tinypic.com/f20hts.jpg',
    }, {
        id: '136r',
        url: 'http://i57.tinypic.com/312i5c9.jpg',
    }, {
        id: '136v',
        url: 'http://i58.tinypic.com/6jkie1.jpg',
    }, {
        id: '137r',
        url: 'http://i58.tinypic.com/29zvtyt.jpg',
    }, ];

    /**
     * Refer to this by {@link MobileViewCtrl."singleData"}.
     * @namespace
     */   
    $scope.singleData = [{
        src: 'http://i57.tinypic.com/k3b1mq.jpg',
        urlDip: './data/output_data/diplomatic/page_VB_fol_104v_diplomatic.html',
        urlInt: './data/output_data/interpretative/page_VB_fol_104v_interpretative.html',
        title: 'The Dream of the Rood',
        page:'- 104v -',
    }, {
        src: 'http://i61.tinypic.com/w1v6ag.jpg',
        urlDip: './data/output_data/diplomatic/page_VB_fol_105r_diplomatic.html',
        urlInt: './data/output_data/interpretative/page_VB_fol_105v_interpretative.html',
        title: 'The Dream of the Rood',
        page:'- 105r -',
    }, {
        src: 'http://i58.tinypic.com/k4wc41.jpg',
        urlDip: './data/output_data/diplomatic/page_VB_fol_105v_diplomatic.html',
        urlInt: './data/output_data/interpretative/page_VB_fol_105v_interpretative.html',
        title: 'The Dream of the Rood',
        page:'- 105v -',
    }, {
        src: 'http://i57.tinypic.com/1zna0k1.jpg',
        urlDip: './data/output_data/diplomatic/page_VB_fol_106r_diplomatic.html',
        urlInt: './data/output_data/interpretative/page_VB_fol_106r_interpretative.html',
        title: 'The Dream of the Rood',
        page:'- 106r -',
    }, ];


    /**
     * Refer to this by {@link MobileViewCtrl."doubleData"}.
     * @namespace
     */ 
    $scope.doubleData = [{
        src: './data/input_data/images/double/VB_fol_104v-VB_fol_105r.jpg',
        title: 'The Dream of the Rood',
        page: '- 104v - 105r -',
    }, {
        src: './data/input_data/images/double/VB_fol_105v-VB_fol_106r.jpg',
        title: 'The Dream of the Rood',
        page: '- 105v - 106r -',
    }, ];


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