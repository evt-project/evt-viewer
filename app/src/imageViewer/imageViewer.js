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
         //$scope.interface = evtInterface.getState('currentPage');
         //modificato da FS per update immagine con selezione pagina
         //evtInterface.updateState('currentPage', 'pippo');      
            //console.log("aggiorno contenuto viewer per pagina del testo");
            
         
      }]);
   console.log("caricato modulo per immagine!");
})();
