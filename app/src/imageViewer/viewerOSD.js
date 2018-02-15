"use strict";
(function () {
  var module = angular.module("evtviewer.openseadragon", []);
  console.log("caricato modulo openseadragon");
  
  module.directive("osd", ['$timeout', function ($timeout) {
    return {
      restrict: "E",
      scope: {
        options: "=",
        name: "=",
        tilesource: "=",
        prefixUrl: "="
      },
      controller: ["$scope", function ($scope) {
        $scope.osd = null;
      }],
      template: "<div id='osd_img' class='box-image box-body Edition noBottomMenu'></div>",
      link: function (scope, element, attrs) {

        console.log("funzione link della direttiva seadragon");
       
            $timeout(function(){
                console.log("in timeout osd",scope.$parent.options);
                var viewer = OpenSeadragon(scope.$parent.options);

                viewer.addHandler("open", function () {
                    console.log(viewer);
                    var oldBounds = viewer.viewport.getBounds();
                    console.log(oldBounds);
                    var h = oldBounds.height / oldBounds.width;
                    var newBounds = new OpenSeadragon.Rect(0, 0.1, 1, h);
                    console.log(newBounds);
                    viewer.viewport.fitBounds(newBounds, true);
                    //viewer.navigator.element.parentElement.parentElement.style.overflow = "visible";
                    //viewer.navigator.element.parentElement.style.overflow = "visible";
                    //viewer.navigator.element.style.overflow = "visible";
                    //viewer.navigator.element.firstChild.style.overflow = "visible";
                    //viewer.navigator.element.firstChild.children[0]  = "hidden"; 
                    //viewer.navigator.element.firstChild.children[1]  = "hidden"; 
                    //viewer.navigator.element.firstChild.firstChild.style.overflow = "hidden";
                    console.log("element navigator", viewer.navigator.element);
                    console.log("evtInterface", evtInterface);
                    console.log("scope", scope);
                    console.log("element", element);
                    console.log("scope.vm", scope.vm);
                });

                viewer.addHandler("home",function(){console.log("pigiato home")});

                viewer.addHandler('navigator-scroll', function (event) {
                    console.log("navigator-scroll", event);
                    if (event.scroll > 0) {
                        console.log("scroll-in");
                    } else {
                        console.log("scroll-out");
                    }
                });
        
                viewer.addHandler('pan', function (event) {
                    console.log("pan", event);
                    console.log(angular.element(document).find('.box-text'));
                    if(event.immediately === undefined){
                        var newY = event.center.y;
                        var oldY = event.eventSource.viewport._oldCenterY;
                        console.log("ok event pan", newY);
                        console.log("ok viewer pan", oldY);

        
                    // evento scroll verso il basso
                    if (viewer.viewport.getZoom() === 1) {
                        console.log("aggiorna testo");
                        var oldBounds = viewer.viewport.getBounds();
                        if (newY > oldY) {
                            console.log("mostro riga sotto");
                           
                            console.log("bounds:",oldBounds);
                            angular.element(document).find('.box-text')[1].innerHTML = "<span> PRENDERE IL TESTO IN"+oldBounds+"</span>";
                            
        
                            //evento scroll verso l'alto    
                        } else if (newY < oldY) {
                            console.log("mostro riga sopra");
                            
                            console.log("bounds:",oldBounds);
                            angular.element(document).find('.box-text')[1].innerHTML = "<span> PRENDERE IL TESTO IN"+oldBounds+"</span>";
                         
                        }
                    }
        
                    //event.stopBubbling = true;
                    }
                });
            
            
            },100);

        


        


/*
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


        //When element is destroyed, destroy the viewer
        element.on('$destroy', function () {
          //if @nam eis set, remove it from parent scope, and remove event handlers
          if (attrs.name) {
            //Remove from parent scope
            scope.$parent[attrs.name] = null;

            //Destroy mouse handler
            scope.mouse.destroy();
            optionsWatcher();
            //Remove event handlers
            scope.osd.removeHandler("zoom", zoomHandler);
            scope.osd.removeHandler("update-viewport", updateViewportHandler);
          }

          //Destroy the viewer
          scope.osd.destroy();
        });
    */},
    };
  }]);
})();
