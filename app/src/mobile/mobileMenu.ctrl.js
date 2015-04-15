angular.module('evtviewer.mobile')

.controller('MobileMenuCtrl', function($scope, mobile) {

    
    var activeSection = false,
        currentMode = mobile.getCurrentView(),
        currentSection;

    $scope.currentButton = 'image';

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


    $scope.showView = function(currentTemplate) {
        currentMode = currentTemplate;
        mobile.switchView(currentTemplate);
        // TODO: use $log for _console
        console.log('Switch mode ' + currentTemplate);
    };

    $scope.showSection = function(currentTemplate) {
        if (activeSection && (currentTemplate === currentSection)) {
            mobile.switchView(currentMode);
            activeSection = false;
        } else {
            mobile.switchView(currentTemplate);
            currentSection = currentTemplate;
            activeSection = true;
        }
        console.log('Switch section ' + currentTemplate);
    };
   
    $scope.buttonSection = function (currentTemplate) {
        if ($scope.currentButton == currentTemplate.template){
            $scope.currentButton =! $scope.currentButton;
        } else {
            $scope.currentButton = currentTemplate.template;
        }
        console.log('Current button ' + $scope.currentButton);
    }

    $scope.buttonView = function (currentTemplate) {
        $scope.currentButton = currentTemplate.template;
    }
    
    $scope.isActiveButton = function(buttonTemplate) {
        return buttonTemplate == $scope.currentButton;
    }
    
    $scope.set = false;
    $scope.setToggle = function() {
        $scope.set = !$scope.set;
    };


    $scope.showItems = false;
    $scope.toggleView = function() {
        $scope.showItems = !$scope.showItems;
    };

});