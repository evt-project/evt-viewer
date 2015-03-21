angular.module('evtviewer.mobile')

.controller('MobileMenuCtrl', function($scope, Mobile) {

    $scope.menu = [{
        id: 'DVB',
        template: 'dvb',
        description: 'The Digital Vercelli Book',
    }, {
        id: 'thumb',
        template: 'thumbnails',
        icon: 'fa fa-th',
    }, {
        id: 'search',
        template: 'search',
        icon: 'fa fa-search',
    }, ];

    $scope.view = [{
        id: 'view_image',
        icon1: 'fa fa-picture-o',
        template: 'image',
    }, {
        id: 'view_text',
        icon1: 'fa fa-align-left',
        template: 'text',
    }, {
        id: 'view_image_image',
        icon1: 'fa fa-file-image-o',
        icon2: 'fa fa-file-image-o',
        template: 'imageimage',
    }, {
        id: 'view_image_text',
        icon1: 'fa fa-file-image-o',
        icon2: 'fa fa-file-text-o',
        template: 'imagetext',
    }, {
        id: 'view_text_text',
        icon1: 'fa fa-file-text-o',
        icon2: 'fa fa-file-text-o',
        template: 'texttext',
    }, ];


    
    // $scope.DVB = function() {
    //     if (Mobile.getCurrentView() ==='texttext'){
    //         Mobile.switchView('DVB');
    //     } else {
    //         Mobile.switchView('texttext');
    //     }
    // };

  

    $scope.showTemplate = function(currentTemplate){
        console.log('template corrente ' + currentTemplate);
        Mobile.switchView(currentTemplate);
    };

    
   


    $scope.view_subItems = false;
    $scope.viewToggle = function() {
        $scope.view_subItems = !$scope.view_subItems;
    };

});