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
         
        //  controller: ["$scope", function ($scope) {
        //     $scope.osd = null;
        //  }],

         controller: "imageViewerCtrl",

         template: "<div id='osd-img' class='box-image box-body Edition noBottomMenu'></div>",

         transclude: true,
         //templateUrl: 'src/imageViewer/imageViewer.directive.tmpl.html',

         link: function (scope, element, attrs) {

            console.log("funzione link della direttiva seadragon");
            console.log("test provider: ", osd.test('PROVIDER FUNGE?!'));
                      

            $timeout(function () {

               console.log("scope in timeout osd directive", scope);
               console.log("imageviewer in timeout osd build", osd.build(attrs.name));
               //var _options = scope.$parent.options; 
                var _options = osd.build(attrs.name); 
               
               console.log("options in timeout osd directive", _options);
               //var viewer = OpenSeadragon(scope.$parent.$parent.options);
               console.log('div OSD', document.getElementById('osd-img'));
               var viewer = null;
               try{
                viewer = new OpenSeadragon.Viewer(_options);
              }
               catch (err){

              console.log("viewer in timeout osd directive errore", err);

             }

             console.log("viewer in timeout osd directive OK", viewer);

               scope.osd = viewer;
               scope.$parent[attrs.name] = viewer;
               var coeff = osd.imgCoeff();
               console.log("coefficiente", coeff);
               if(coeff!=null && coeff!=undefined)
                imageViewerHandler.setImgCoeff(coeff);

               imageViewerHandler.setViewer(viewer);
               imageViewerHandler.setScope(scope);

               scope.osd.addHandler("home", imageViewerHandler.home);
               scope.osd.addOnceHandler("open", imageViewerHandler.openPage,evtInterface.getState('currentPage'));

               //scope.osd.addHandler('navigator-scroll', imageViewerHandler.navigatorScroll);

               //scope.osd.addHandler('pan', imageViewerHandler.pan);

                scope.$watch(function() {
                    return evtInterface.getState('currentPage');
                }, function(newItem, oldItem) {
                  if (oldItem !== newItem) {
                    console.log("aggiorno contenuto viewer per pagina del testo");
                    var doctype="page"
                    if(doctype==="scroll")
                      imageViewerHandler.updateViewerBounds(newItem);
                    else if(doctype==="page")
                      imageViewerHandler.updateViewerPage(newItem);
                    else
                      console.error('problema con la paginazione!!!');
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

