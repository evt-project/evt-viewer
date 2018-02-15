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

     imageModule.controller("evtviewer.imageViewerCtrl", ["$scope","imageViewerModel", function ($scope,imageViewerModel) {
         $scope.options = imageViewerModel.getOptions();
         $scope.test = "test";
         
         console.log("caricato controller evtviewer.imageViewer", $scope.options);
      }]);
   console.log("caricato modulo per immagine!");
})();
