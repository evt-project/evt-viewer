"use strict";

/** 
 * @ngdoc overview
 * @name evtviewer.imageViewer
 * @description 
 * # evtviewer.imageViewer
 * Module referring to viewer, intended as a single content of image
 */

/*(function(){
    angular.module('evtviewer.imageViewer', []);
    console.log("caricato modulo per immagine!");
})();
*/

(function () {
   var imageModule = angular.module('evtviewer.imageViewer', ["evtviewer.openseadragon","evtviewer.imageViewerService"]);

     imageModule.controller("imageViewerCtrl", ["$scope","imageViewerModel", function ($scope,imageViewerModel) {
         $scope.options = imageViewerModel.getOptions();
         //$scope.interface = evtInterface;
         //evtInterface.updateState('currentPage','pippo');
         
         //console.log("caricato controller evtviewer.imageViewer", $scope.interface);
      }]);
   console.log("caricato modulo per immagine!");
})();
