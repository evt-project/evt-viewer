/**
 * @name evtviewer.mobile
 */

angular.module('evtviewer.mobile')

/**
 * @name evtviewer.MobileMenuCtrl
 * @extends evtviewer.mobile
 * @property {boolean} activeSection
 * @property {string} currentMode
 * @property {string} currentSection
 * @property {string} currentButton
 * @property {boolean} showItems
 * @property {string} menu
 * @property {string} view
 */

.controller('MobileMenuCtrl', ['$scope', 'mobile', function($scope, mobile) {

    var activeSection = false;

    var currentMode = mobile.getCurrentView();

    var currentSection;

    $scope.currentButton = 'image';

    $scope.showItems = false;

    $scope.menu = [{
        template: 'info',
        description: 'The Digital Vercelli Book',
    }, {
        template: 'search',
        icon: 'fa fa-search',
    }];

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


    /**
     * Show the view template.
     * @constructor
     * @param currentTemplate The actual template.
     */

    $scope.showView = function(currentTemplate) {
        currentMode = currentTemplate;
        mobile.switchView(currentTemplate);
        // TODO: use $log for _console
        console.log('Switch mode ' + currentTemplate);
    };


    /**
     * Show or hide the section template.
     * @constructor
     * @param currentTemplate The actual template.
     */

    $scope.showSection = function(currentTemplate) {
        if (activeSection && (currentTemplate === currentSection)) {
            mobile.switchView(currentMode);
            activeSection = false;
        } else {
            mobile.switchView(currentTemplate);
            currentSection = currentTemplate;
            activeSection = true;
        }

        // TODO: use $log for _console
        console.log('Switch section ' + currentTemplate);
    };
   

    /**
     * Active the button of the current section.
     * @constructor
     * @param currentTemplate The actual template.
     */

    $scope.buttonSection = function (currentTemplate) {
        if ($scope.currentButton === currentTemplate.template){
            $scope.currentButton =! $scope.currentButton;
        } else {
            $scope.currentButton = currentTemplate.template;
        }
    };


    /**
     * Active the button of the current view.
     * @constructor
     * @param currentTemplate The actual template.
     */

    $scope.buttonView = function (currentTemplate) {
        $scope.currentButton = currentTemplate.template;
    };
    

    /**
     * Active the class of the current button.
     * @constructor
     * @param buttonTemplate The active button.
     */

    $scope.isActiveButton = function(buttonTemplate) {
        return buttonTemplate === $scope.currentButton;
    };
    

    /**
     * Show or hide the view dropdown menu.
     * @constructor
     */

    $scope.toggleView = function() {
        $scope.showItems = !$scope.showItems;
    };

}]);