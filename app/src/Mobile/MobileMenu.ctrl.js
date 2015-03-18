angular.module('evtviewer.mobile')

.controller('MobileMenuCtrl', function($scope, Mobile) {

    $scope.menu = [{
        id: "DVB",
        link: "#dvb",
        description: "The Digital Vercelli Book",
    }, {
        id: "thumb",
        link: "#thumb",
        icon: "fa fa-th",
        subItems: [],
    }, {
        id: "search",
        link: "#search",
        icon: "fa fa-search",
    }, ];

    $scope.view = [{
        id: "view_image",
        link: "#image",
        icon1: "fa fa-picture-o",
        content: "Image",
    }, {
        id: "view_text",
        link: "#text",
        icon1: "fa fa-align-left",
        content: "Text",
    }, {
        id: "view_image_image",
        link: "#image_image",
        icon1: "fa fa-file-image-o",
        icon2: "fa fa-file-image-o",
        content: "Image+Image",
    }, {
        id: "view_image_text",
        link: "#image_text",
        icon1: "fa fa-file-image-o",
        icon2: "fa fa-file-text-o",
        content: "Image+Text",
    }, {
        id: "view_text_text",
        link: "#text_text",
        icon1: "fa fa-file-text-o",
        icon2: "fa fa-file-text-o",
        content: "Text+Text",
    }, ];


    $scope.set = false;
    $scope.setToggle = function() {
        // $scope.set = !$scope.set;
        if (Mobile.getCurrentView() === 'texttext'){
            Mobile.switchView('textimg');
        } else {
            Mobile.switchView('texttext');
        }
        
    };

    $scope.view_subItems = false;
    $scope.viewToggle = function() {
        $scope.view_subItems = !$scope.view_subItems;
    };

});