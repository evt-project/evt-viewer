/**
 * @name evtviewer.mobile
 */

angular.module('evtviewer.mobile')


/**
 * @name evtviewer.MobileViewCtrl
 * @extends evtviewer.mobile
 * @property {boolean} leftTextOptions
 * @property {boolean} rightTextOptions
 * @property {boolean} imageOptions
 * @property {boolean} navThumb
 * @property {string} view
 * @property {string} mockText
 * @property {string} mockImage
 * @property {string} mockBook
 * @property {string} thumbnails
 * @property {string} thumbBook
 * @property {number} currentIndex
 */

.controller('MobileViewCtrl', function($scope, mobile, parsedData) {

    $scope.leftTextOptions = false;

    $scope.rightTextOptions = false;

    $scope.imageOptions = false;

    $scope.navThumb = false;

    $scope.view = mobile.getState();

    $scope.mockText = parsedData.getText1();
 
    $scope.mockImage = parsedData.getImage1();

    $scope.mockBook = parsedData.getBook1();
    
    $scope.thumbnails = parsedData.getThumb();
    
    $scope.thumbBook = parsedData.getThumbBook();

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

});