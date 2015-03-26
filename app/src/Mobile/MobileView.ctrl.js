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


    $scope.thumb = [{
        id: '104v',
        url: 'https://www.dropbox.com/s/mp3ouhbjp2oi7lh/VB_fol_104v_small.jpg?dl=0',
    }, {
        id: '105r',
        url: 'https://www.dropbox.com/s/oqemkgl33kko1xf/VB_fol_105r_small.jpg?dl=0',
    }, {
        id: '105v',
        url: 'https://www.dropbox.com/s/oqemkgl33kko1xf/VB_fol_105v_small.jpg?dl=0',
    }, {
        id: '106r',
        url: 'https://www.dropbox.com/s/oqemkgl33kko1xf/VB_fol_106r_small.jpg?dl=0',
    }, {
        id: '104v',
        url: 'https://www.dropbox.com/s/mp3ouhbjp2oi7lh/VB_fol_104v_small.jpg?dl=0',
    }, {
        id: '105r',
        url: 'https://www.dropbox.com/s/oqemkgl33kko1xf/VB_fol_105r_small.jpg?dl=0',
    }, {
        id: '105v',
        url: 'https://www.dropbox.com/s/oqemkgl33kko1xf/VB_fol_105v_small.jpg?dl=0',
    }, {
        id: '106r',
        url: 'https://www.dropbox.com/s/oqemkgl33kko1xf/VB_fol_106r_small.jpg?dl=0',
    }, {
        id: '104v',
        url: 'https://www.dropbox.com/s/mp3ouhbjp2oi7lh/VB_fol_104v_small.jpg?dl=0',
    }, {
        id: '105r',
        url: 'https://www.dropbox.com/s/oqemkgl33kko1xf/VB_fol_105r_small.jpg?dl=0',
    }, {
        id: '105v',
        url: 'https://www.dropbox.com/s/oqemkgl33kko1xf/VB_fol_105v_small.jpg?dl=0',
    }, {
        id: '106r',
        url: 'https://www.dropbox.com/s/oqemkgl33kko1xf/VB_fol_106r_small.jpg?dl=0',
    }, ];

   
    // Partial: single_data.html, diplomatic.html, interpretative.html (all templates except ImageImage mode)
    $scope.single_data = [{
        src: './data/input_data/images/single/VB_fol_104v.jpg',
        d_url: './data/output_data/diplomatic/page_VB_fol_104v_diplomatic.html',
        i_url: './data/output_data/interpretative/page_VB_fol_104v_interpretative.html',
        title: 'The Dream of the Rood',
        page:'- 104v -',
    }, {
        src: './data/input_data/images/single/VB_fol_105r.jpg',
        d_url: './data/output_data/diplomatic/page_VB_fol_105r_diplomatic.html',
        i_url: './data/output_data/interpretative/page_VB_fol_105v_interpretative.html',
        title: 'The Dream of the Rood',
        page:'- 105r -',
    }, {
        src: './data/input_data/images/single/VB_fol_105v.jpg',
        d_url: './data/output_data/diplomatic/page_VB_fol_105v_diplomatic.html',
        i_url: './data/output_data/interpretative/page_VB_fol_105v_interpretative.html',
        title: 'The Dream of the Rood',
        page:'- 105v -',
    }, {
        src: './data/input_data/images/single/VB_fol_106r.jpg',
        d_url: './data/output_data/diplomatic/page_VB_fol_106r_diplomatic.html',
        i_url: './data/output_data/interpretative/page_VB_fol_106r_interpretative.html',
        title: 'The Dream of the Rood',
        page:'- 106r -',
    }, ];



    // Partial: double_images.html (in ImageImage mode)
    $scope.double_data = [{
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
    $scope._Index = 0;

    // if a current image is the same as requested image
    $scope.isActive = function (index) {
        return $scope._Index === index;
    };

    

    // Partial: singlePrevNext.html (in Image mode, Text mode and ImageText mode)
    $scope.singlePrev = function () {
        if ($scope._Index > 0) {
            $scope._Index = (--$scope._Index);
        } else {
            $scope._Index = ($scope.single_data.length - 1);
        }
    };

    $scope.singleNext = function () {
        if ($scope._Index < $scope.single_data.length - 1) {
            $scope._Index = (++$scope._Index);
        } else {
            $scope._Index = 0;
        }
    };

    // Partial doublePrevNext.html (in ImageImage mode and TextText mode)
    $scope.doublePrev = function () {
        if ($scope._Index > 0) {
            $scope._Index = (--$scope._Index);
        } else {
            $scope._Index = ($scope.double_data.length - 1);
        }
    };

    $scope.doubleNext = function () {
        if ($scope._Index < $scope.double_data.length - 1) {
            $scope._Index = (++$scope._Index);
        } else {
            $scope._Index = 0;
        }
    };

       
});