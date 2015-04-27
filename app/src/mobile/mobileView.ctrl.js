angular.module('evtviewer.mobile')

.controller('MobileViewCtrl', function($scope, mobile, parsedData) {

    $scope.view = mobile.getState();

    /**
     * Refer to this by {@link MobileViewCtrl."thumbnails"}.
     * @namespace
     */     

    $scope.thumbnails = parsedData.getThumb();

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

    /** Partial controls */
    
    $scope.index = 0;

    /**
     * Represents the current item.
     * @constructor
     */
    $scope.isActive = function (index) {
        return $scope.index === index; // if a current item is the same as requested item
    };

    /**
     * Show the prev item.
     * @constructor
     */
    $scope.prevItem = function () {
        if ($scope.index > 0) {
            $scope.index = (--$scope.index);
        } else {
            $scope.index = ($scope.mockImage.length - 1);
        }
    };

    /**
     * Show the next item.
     * @constructor
     */
    $scope.nextItem = function () {
        if ($scope.index < $scope.mockImage.length - 1) {
            $scope.index = (++$scope.index);
        } else {
            $scope.index = 0;
        }
    };

    /**
     * Show the prev book item.
     * @constructor
     */
    $scope.prevImageImage = function () {
        if ($scope.index > 0) {
            $scope.index = (--$scope.index);
        } else {
            $scope.index = ($scope.mockBook.length - 1);
        }
    };

    /**
     * Show the next book item.
     * @constructor
     */
    $scope.nextImageImage = function () {
        if ($scope.index < $scope.mockBook.length - 1) {
            $scope.index = (++$scope.index);
        } else {
            $scope.index = 0;
        }
    };

});