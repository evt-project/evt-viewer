"use strict";

   var module = angular.module("evtviewer.openseadragon", ["evtviewer.imageViewer",'evtviewer.openseadragonService', "evtviewer.interface"]);
  

   module.directive("osd", ['$timeout', 'imageViewerHandler', "evtInterface","osd", function ($timeout, imageViewerHandler, evtInterface, osd) {
      return {
         
        restrict: "E",
         
         scope: {
            options: "=",
            name: "=",
            tilesource: "=",
            prefixUrl: "=",
         },
         
       
         controller: "imageViewerCtrl",

         template: "<div id='osd-img' class='box-image box-body Edition noBottomMenu'></div>",

         transclude: true,
        
         link: function (scope, element, attrs) {

            $timeout(function () {
              var _options = osd.build(attrs.name); 
              var viewer = null;
              try{
                viewer = new OpenSeadragon.Viewer(_options);
              }
               catch (err){

              console.error("viewer in timeout osd directive errore", err);

             }
               scope.osd = viewer;
               scope.$parent[attrs.name] = viewer;
               var coeff = osd.imgCoeff();

               if(coeff!=null && coeff!=undefined){
                imageViewerHandler.setImgCoeff(coeff);
               }

               imageViewerHandler.setViewer(viewer);
               imageViewerHandler.setScope(scope);

               scope.osd.addHandler("home", imageViewerHandler.home);
               scope.osd.addOnceHandler("open", imageViewerHandler.openPage,evtInterface.getState('currentPage'));

               scope.$watch(function() {
                    return evtInterface.getState('currentPage');
                }, function(newItem, oldItem) {
                  if (oldItem !== newItem) {
                    var doctype="page"
                    if(doctype==="scroll")
                      imageViewerHandler.updateViewerBounds(newItem);
                    else if(doctype==="page")
                      imageViewerHandler.updateViewerPage(newItem);
                    else
                      console.error('Page service problem');
                  }
                }, false);
            }, 10);



            //When element is destroyed, destroy the viewer
            element.on('$destroy', function () {
               //if @nam eis set, remove it from parent scope, and remove event handlers
               if (attrs.name) {
                  //Remove from parent scope
                  scope.$parent[attrs.name] = null;
               }

               //Remove event handlers
               scope.osd.removeHandler("open", imageViewerHandler.open);
               scope.osd.removeHandler("home", imageViewerHandler.home);
               scope.osd.removeHandler("navigator-scroll", imageViewerHandler.navigatorScroll);
               scope.osd.removeHandler("pan", imageViewerHandler.pan);
               //Destroy the viewer
               scope.osd.destroy();
            });
         }
      };
   }]);

