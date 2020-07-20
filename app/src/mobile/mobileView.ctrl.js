/**
 * @name evtviewer.mobile
 */

angular.module('evtviewer.mobile')


/**
 * @name evtviewer.MobileViewCtrl
 * @extends evtviewer.mobile
 * @extends evtviewer.parsedData
 * @property {string} view
 * @property {string} mockText
 * @property {string} mockImage
 * @property {string} mockBook
 * @property {string} editionDipl
 * @property {string} editionInt
 * @property {string} currentTextModeDipl
 * @property {string} currentTextModeInt
 * @property {string} currentButtonDipl
 * @property {string} currentButtonInt
 * @property {boolean} leftTextOptions
 * @property {boolean} rightTextOptions
 * @property {boolean} imageOptions
 * @property {boolean} navThumb
 * @property {string} thumbnails
 * @property {string} thumbBook
 * @property {number} currentIndex
 */

.controller('MobileViewCtrl', ['$scope', 'mobile', 'parsedData', function($scope, mobile, parsedData) {

    $scope.view = mobile.getState();

    $scope.mockText = parsedData.getText2();
 
    $scope.mockImage = parsedData.getImage2();

    $scope.mockBook = parsedData.getBook2();

    var currentTextModeDipl = mobile.getCurrentEditionDipl();

    var currentTextModeInt = mobile.getCurrentEditionInt();
    
    $scope.editionDipl = mobile.getStateEditionDipl();

    $scope.editionInt = mobile.getStateEditionInt();

    $scope.currentButtonDipl = 'diplomatic';

    $scope.currentButtonInt = 'interpretative';

    $scope.leftTextOptions = false;

    $scope.rightTextOptions = false;

    $scope.imageOptions = false;

    $scope.navThumb = false;
    
    $scope.thumbnails = parsedData.getThumb2();
    
    $scope.thumbBook = parsedData.getThumbBook2();

    $scope.currentIndex = 0;
    
    
    /**
     * Represents the active item.
     * @constructor
     * @param index The chosen index.
     */

    $scope.isActive = function (index) {
        return $scope.currentIndex === index;
    };


    /**
     * Show the prev item.
     * @constructor
     */

    $scope.prevItem = function () {
        if ($scope.currentIndex > 0) {
            $scope.currentIndex = (--$scope.currentIndex);
        } else {
            $scope.currentIndex = ($scope.mockImage.length - 1);
        }
    };


    /**
     * Show the next item.
     * @constructor
     */

    $scope.nextItem = function () {
        if ($scope.currentIndex < $scope.mockImage.length - 1) {
            $scope.currentIndex = (++$scope.currentIndex);
        } else {
            $scope.currentIndex = 0;
        }
    };


    /**
     * Show the prev item for book view.
     * @constructor
     */

    $scope.prevImageImage = function () {
        if ($scope.currentIndex > 0) {
            $scope.currentIndex = (--$scope.currentIndex);
        } else {
            $scope.currentIndex = ($scope.mockBook.length - 1);
        }
    };


    /**
     * Show the next item for book view.
     * @constructor
     */

    $scope.nextImageImage = function () {
        if ($scope.currentIndex < $scope.mockBook.length - 1) {
            $scope.currentIndex = (++$scope.currentIndex);
        } else {
            $scope.currentIndex = 0;
        }
    };

    
    /** Settings controls */

    /**
     * Represents the list of editions.
     * @constructor
     * @property {string} textEdition.
     */

    $scope.textEdition = [{
        template: 'diplomatic',
        description: 'Diplomatic',
    }, {
        template: 'interpretative',
        description: 'Interpretative',
    }];

    /**
     * Show the diplomatic edition template.
     * @constructor
     * @param currentEditionTemplate.
     */

    $scope.showEditionDipl = function(currentEditionTemplate) {
        currentTextModeDipl = currentEditionTemplate;
        mobile.switchEditionDipl(currentEditionTemplate);
        // TODO: use $log for _console
        console.log('Switch edition ' + currentEditionTemplate);
    };


    /**
     * Show the interpretative edition template.
     * @constructor
     * @param currentEditionTemplate.
     */

    $scope.showEditionInt = function(currentEditionTemplate) {
        currentTextModeInt = currentEditionTemplate;
        mobile.switchEditionInt(currentEditionTemplate);
        // TODO: use $log for _console
        console.log('Switch edition ' + currentEditionTemplate);
    };

    /**
     * Active the button of the current edition.
     * @constructor
     * @param currentEditionTemplate.
     */

    $scope.buttonEditionDipl = function (currentEditionTemplate) {
        $scope.currentButtonDipl = currentEditionTemplate.template;
    };
    
    /**
     * Active the button of the current edition.
     * @constructor
     * @param currentEditionTemplate.
     */

    $scope.buttonEditionInt = function (currentEditionTemplate) {
        $scope.currentButtonInt = currentEditionTemplate.template;
    };

    /**
     * Active the class of the current button.
     * @constructor
     * @param buttonTemplate.
     */

    $scope.isActiveButtonDipl = function(buttonTemplate) {
        return buttonTemplate === $scope.currentButtonDipl;
    };

    /**
     * Active the class of the current button.
     * @constructor
     * @param buttonTemplate.
     */

    $scope.isActiveButtonInt = function(buttonTemplate) {
        return buttonTemplate === $scope.currentButtonInt;
    };


    /**
     * Show or hide text settings left
     * @constructor
     */

    $scope.leftTextSettings = function() {
        $scope.leftTextOptions = !$scope.leftTextOptions;
    };


    /**
     * Show or hide text settings right
     * @constructor
     */

    $scope.rightTextSettings = function() {
        $scope.rightTextOptions = !$scope.rightTextOptions;
    };


    /**
     * Show or hide image settings
     * @constructor
     */

    $scope.showImageSettings = function() {
        $scope.imageOptions = !$scope.imageOptions;
    };



    /** Thumbnails controls */


    /**
     * Show or hide the thumbnails
     * @constructor
     */

    $scope.showThumb = function() {
        $scope.navThumb = !$scope.navThumb;
    };


    /**
     * Show the chosen item.
     * @constructor
     * @param index The chosen index.
     */

    $scope.showImage = function (index) {
      $scope.currentIndex = index;
    };

}]);