'use strict';

/** 
 * @ngdoc overview
 * @name evtviewer.imageViewer
 * @description 
 * # evtviewer.imageViewer
 * Module referring to viewer, intended as a single content of image
 */

 angular.module('evtviewer.imageViewer', ['evtviewer.openseadragon','evtviewer.imageViewerService']);

(function () {
   var imageModule = angular.module('evtviewer.imageViewer', ['evtviewer.openseadragon','evtviewer.imageViewerService']);

     imageModule.controller('imageViewerCtrl', ['$scope','imageViewerModel', function ($scope,imageViewerModel) {
         $scope.options = imageViewerModel.getOptions(); 
      }]);
})();
