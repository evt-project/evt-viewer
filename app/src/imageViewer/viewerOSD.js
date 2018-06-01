"use strict";
(function () {
   var module = angular.module("evtviewer.openseadragon", ['evtviewer.openseadragonService', "evtviewer.interface"]);
   console.log("caricato modulo openseadragon");

   module.directive("osd", ['$timeout', 'imageViewerHandler', "evtInterface", function ($timeout, imageViewerHandler, evtInterface) {
      return {
         restrict: "E",
         scope: {
            options: "=",
            name: "=",
            tilesource: "=",
            prefixUrl: "=",
         },
         controller: ["$scope", function ($scope) {
            $scope.osd = null;
         }],
         template: "<div id='osd_img' class='box-image box-body Edition noBottomMenu'></div>",
         link: function (scope, element, attrs) {

            console.log("funzione link della direttiva seadragon");

            $timeout(function () {

               //console.log("in timeout osd", imageViewerHandler.testFun());
               var viewer = OpenSeadragon(scope.$parent.options);

               scope.osd = viewer;
               scope.$parent[attrs.name] = viewer;

               imageViewerHandler.setViewer(viewer);
               imageViewerHandler.setScope(scope);

               scope.osd.addOnceHandler("open", imageViewerHandler.open,null,1);
               scope.osd.addHandler("home", imageViewerHandler.home);

               scope.osd.addHandler('navigator-scroll', imageViewerHandler.navigatorScroll);

               scope.osd.addHandler('pan', imageViewerHandler.pan);

                scope.$watch(function() {
                    return evtInterface.getState('currentPage');
                }, function(newItem, oldItem) {
                  if (oldItem !== newItem) {
                    console.log("aggiorno contenuto viewer per pagina del testo");
                    imageViewerHandler.updateViewerBounds(newItem);
                  }
                }, true);
            

            }, 50);



            //When element is destroyed, destroy the viewer
            element.on('$destroy', function () {
               //if @nam eis set, remove it from parent scope, and remove event handlers
               if (attrs.name) {
                  //Remove from parent scope
                  scope.$parent[attrs.name] = null;
               }

               //Destroy mouse handler
               //scope.mouse.destroy();
               //optionsWatcher();
               //Remove event handlers
               scope.osd.removeHandler("open", imageViewerHandler.open);
               scope.osd.removeHandler("home", imageViewerHandler.home);
               scope.osd.removeHandler("navigator-scroll", imageViewerHandler.navigatorScroll);
               scope.osd.removeHandler("pan", imageViewerHandler.pan);



               //Destroy the viewer
               scope.osd.destroy();
            });



            /* to extend the behavior of the viewer 
                    if (attrs.tilesource) {
                      opts.tileSources = [attrs.tilesource];
                    }
                    if (attrs.prefixUrl) {
                      opts.prefixUrl = attrs.prefixUrl;
                    }

                    function _bootstrap() {
                      if (scope.osd) {
                        scope.osd.destroy();
                        scope.osd = null;
                      }
                      //Create options object
                      var opts = angular.extend({}, scope.options, {
                        id: "openseadragon-" + Math.random(),
                        element: element[0],
                      });
                      //Create the viewer
                      scope.osd = OpenSeadragon(opts);
                      //Create a wrapper
                      var wrapper = {
                        mouse: {
                          position: null,
                          imageCoord: null,
                          viewportCoord: null,
                        },
                        zoom: 0,
                        viewport: {}
                      }

                      for(var key in scope.osd) {
                        wrapper[key] = scope.osd[key];
                      }

                      if (attrs.name) {
                        //Make the OSD available to parent scope
                        scope.$parent[attrs.name] = wrapper;
                        //Define event handlers
                        zoomHandler = function (e) {
                          $timeout(function() {
                            scope.$apply(function () {
                              wrapper.zoom = e.zoom;
                            });
                          },0);
                        }
                        updateViewportHandler = function (e) {
                          scope.$apply(function () {
                            wrapper.viewportInfo = {
                              bounds: scope.osd.viewport.getBounds(false),
                              center: scope.osd.viewport.getCenter(false),
                              rotation: scope.osd.viewport.getRotation(),
                              zoom: scope.osd.viewport.getZoom(false),
                            };
                          });
                        }

                        //Assign event handlers
                        scope.osd.addHandler("zoom", zoomHandler);
                        scope.osd.addHandler("update-viewport", updateViewportHandler);

                        //Add a mouse handler
                        scope.mouse = new OpenSeadragon.MouseTracker({
                          element: scope.osd.canvas,
                          enterHandler: function (e) {
                            if (scope.osd.viewport) {
                              var coord = OpenSeadragon.getElementPosition(scope.osd.canvas);
                              var pos = e.position.plus(coord);
                              var mouse = {
                                position: pos,
                                imageCoord: scope.osd.viewport.windowToImageCoordinates(pos),
                                viewportCoord: scope.osd.viewport.windowToViewportCoordinates(pos),
                              }
                              scope.$apply(function () {
                                wrapper.mouse = mouse;
                              });
                            }
                          },
                          moveHandler: function (e) {
                            if (scope.osd.viewport) {
                              var coord = OpenSeadragon.getElementPosition(scope.osd.canvas);
                              var pos = e.position.plus(coord);
                              var mouse = {
                                position: pos,
                                imageCoord: scope.osd.viewport.windowToImageCoordinates(pos),
                                viewportCoord: scope.osd.viewport.windowToViewportCoordinates(pos),
                              }
                              scope.$apply(function () {
                                wrapper.mouse = mouse;
                              });
                            }
                          },
                          exitHandler: function (e) {
                            scope.$apply(function () {
                              wrapper.mouse.position = null;
                              wrapper.mouse.imageCoord = null;
                              wrapper.mouse.viewportCoord = null;
                            });
                          },
                        });
                        scope.mouse.setTracking(true);
                      }

                    }
                    _bootstrap();
                    var optionsWatcher = scope.$watch('options', _bootstrap);

                    //if @name is set, put the wrapper in the scope and handle the events
                    var zoomHandler = null;
                    var updateViewportHandler = null;

            */

         },
      };
   }]);
})();
