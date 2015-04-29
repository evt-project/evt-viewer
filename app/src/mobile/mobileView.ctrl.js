angular.module('evtviewer.mobile')

.controller('MobileViewCtrl', function($scope, mobile, parsedData) {

    /** @define {boolean} */
    $scope.leftTextOptions = false;
    $scope.rightTextOptions = false;
    $scope.imageOptions = false;
    $scope.navThumb = false;

    /**
     * Refer to this by {@link MobileViewCtrl."view"}.
     * @namespace
     */  
    $scope.view = mobile.getState();

    
    /**
     * Refer to this by {@link MobileViewCtrl."mockText"}.
     * @namespace
     */ 
    $scope.mockText = parsedData.getText1();

    /**
     * Refer to this by {@link MobileViewCtrl."mockImage"}.
     * @namespace
     */ 
    $scope.mockImage = parsedData.getImage1();

    /**
     * Refer to this by {@link MobileViewCtrl."mockBook"}.
     * @namespace
     */ 
    $scope.mockBook = parsedData.getBook1();

    /**
     * Refer to this by {@link MobileViewCtrl."thumbnails"}.
     * @namespace
     */     
    $scope.thumbnails = parsedData.getThumb();


    /** Partial controls */
    
    /** @const {number} */
    $scope.currentIndex = 0;

    /**
     * Represents the current item.
     * @constructor
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
     * Show the prev book item.
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
     * Show the next book item.
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
     * Show/Hide text settings left
     * @constructor
     */
    $scope.leftTextSettings = function() {
        $scope.leftTextOptions = !$scope.leftTextOptions;
    };

    /**
     * Show/Hide text settings right
     * @constructor
     */
    $scope.rightTextSettings = function() {
        $scope.rightTextOptions = !$scope.rightTextOptions;
    };

    /**
     * Show/Hide image settings
     * @constructor
     */
    $scope.showImageSettings = function() {
        $scope.imageOptions = !$scope.imageOptions;
    };


    /** Thumbnails controls */

    /**
     * Show/Hide thumbnails
     * @constructor
     */
    $scope.showThumb = function() {
        $scope.navThumb = !$scope.navThumb;
    };

    /**
     * Show the chosen item.
     * @constructor
     */
    $scope.showImage = function (index) {
      $scope.currentIndex = index;
    };

});