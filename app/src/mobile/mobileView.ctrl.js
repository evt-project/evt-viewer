angular.module('evtviewer.mobile')

.controller('MobileViewCtrl', function($scope, Mobile) {

    $scope.view = Mobile.getState();

    // Template: DVB.html
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




   
    // Partial: single_data.html, diplomatic.html, interpretative.html (all templates except ImageImage mode)
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



    // Partial: double_images.html (in ImageImage mode)
    $scope.doubleData = [{
        src: './data/input_data/images/double/VB_fol_104v-VB_fol_105r.jpg',
        title: 'The Dream of the Rood',
        page: '- 104v - 105r -',
    }, {
        src: './data/input_data/images/double/VB_fol_105v-VB_fol_106r.jpg',
        title: 'The Dream of the Rood',
        page: '- 105v - 106r -',
    }, ];


    // Partial controls

    // initial image index
    $scope.Index = 0;

    // if a current image is the same as requested image
    $scope.isActive = function (index) {
        return $scope.Index === index;
    };

    

    // Partial: singlePrevNext.html (in Image mode, Text mode and ImageText mode)
    $scope.singlePrev = function () {
        if ($scope.Index > 0) {
            $scope.Index = (--$scope.Index);
        } else {
            $scope.Index = ($scope.singleData.length - 1);
        }
    };

    $scope.singleNext = function () {
        if ($scope.Index < $scope.singleData.length - 1) {
            $scope.Index = (++$scope.Index);
        } else {
            $scope.Index = 0;
        }
    };

    // Partial doublePrevNext.html (in ImageImage mode and TextText mode)
    $scope.doublePrev = function () {
        if ($scope.Index > 0) {
            $scope.Index = (--$scope.Index);
        } else {
            $scope.Index = ($scope.doubleData.length - 1);
        }
    };

    $scope.doubleNext = function () {
        if ($scope.Index < $scope.doubleData.length - 1) {
            $scope.Index = (++$scope.Index);
        } else {
            $scope.Index = 0;
        }
    };

    
    
   

});