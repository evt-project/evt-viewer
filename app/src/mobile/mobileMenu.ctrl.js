angular.module('evtviewer.mobile')

.controller('MobileMenuCtrl', function($scope, mobile) {

    $scope.menu = [{
        template: 'dvb',
        description: 'The Digital Vercelli Book',
    }, {
        template: 'thumbnails',
        icon: 'fa fa-th',
    }, {
        template: 'search',
        icon: 'fa fa-search',
    }, ];

    $scope.view = [{
        template: 'image',
        icon1: 'fa fa-picture-o',
    }, {
        template: 'text',
        icon1: 'fa fa-align-left',
    }, {
        template: 'imageimage',
        icon1: 'fa fa-file-image-o',
        icon2: 'fa fa-file-image-o',
    }, {
        template: 'imagetext',
        icon1: 'fa fa-file-image-o',
        icon2: 'fa fa-file-text-o',
    }, {
        template: 'texttext',
        icon1: 'fa fa-file-text-o',
        icon2: 'fa fa-file-text-o',
    }, ];


    $scope.showTemplate = function(currentTemplate){
        console.log('template corrente ' + currentTemplate);
        mobile.switchView(currentTemplate);
    };

    
   $scope.set = false;
    $scope.setToggle = function() {
        $scope.set = !$scope.set;
    };


    $scope.showSubItems = false;
    $scope.viewToggle = function() {
        $scope.showSubItems = !$scope.showSubItems;
    };

});