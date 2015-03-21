angular.module('evtviewer.mobile')

.controller('MobileViewCtrl', function($scope, Mobile) {

    $scope.view = Mobile.getState();

    // Template: DVB.html
    $scope.dvb_links = [
        {url: "http://vbd.humnet.unipi.it/",
        title: "Digital Vercelli Book project",
        description: "Digital Vercelli Book project",
        }, 
        {url: "http://sourceforge.net/projects/evt-project/",
        title: "Edition Visualization Technology on SourceForge",
        description: "Edition Visualization Technology",
        }, 
        {url: "https://visualizationtechnology.wordpress.com/",
        title: "EVT Blog",
        description: "EVT Blog",
        },
        {url: "mailto: editionvisualizationtechnology@gmail.com",
        title: "Contact",
        description: "Contact",
        },
    ];


    $scope.single_images = [
        {src: './data/input_data/images/single/VB_fol_104v.jpg',
         description: 'Vercelli Book folio 104v'
        },
        {src: './data/input_data/images/single/VB_fol_105r.jpg',
         description: 'Vercelli Book folio 105r'
        },
        {src: './data/input_data/images/single/VB_fol_105v.jpg',
         description: 'Vercelli Book folio 105v'
        },
        {src: './data/input_data/images/single/VB_fol_106r.jpg',
         description: 'Vercelli Book folio 106r'
        },

    ];

    // initial image index
    $scope._Index = 0;

    // if a current image is the same as requested image
    $scope.isActive = function (index) {
        return $scope._Index === index;
    };

    // show prev image
    $scope.showPrev = function () {
        $scope._Index = ($scope._Index > 0) ? --$scope._Index : $scope.single_images.length - 1;
    };

    // show next image
    $scope.showNext = function () {
        $scope._Index = ($scope._Index < $scope.single_images.length - 1) ? ++$scope._Index : 0;
    };


   
});