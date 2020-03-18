s
var module = angular.module('evtviewer.tdhop', ["evtviewer.tdhop", "evtviewer.interface"]);

module.directive('tredhop', ['tredhop', function(evtInterface, $ocLazyLoad, $timeout, tredhop) {
	return {
		restrict: 'AE',
		scope: {
         canvas: '@',
         measurebox:'@',
         options: "=",
         name: "=",
         presenter:"@",
      },

      controller: "TreDHOPCtrl",

      templateUrl: 'src/tdhop/tdhop.directive.tmpl.html',

      transclude: true,
      //template: "<div id='tdhop' class='box-tdhop box-body Edition noBottomMenu'>",

		link: function(scope, element, attrs) {
			/*var pluginFolder = 'js-plugins/tdhop/';
         var jsFiles = [
         'helpers.js',
         'trackball_sphere.js',
         'trackball_turntable.js',
         'trackball_turntable_pan.js',
         'trackball_pantilt.js',
         'trackball_rail.js',
         'spidergl.js',
         'ply.js',
         'presenter.js',
         'nexus.js',
         'jquery.js',
         'meco.js',
         'meshcoder_worker.js',
         //'init.js',
         'corto.js',
         ]

			var loadFiles = function(fileIndex) {
				$ocLazyLoad.load(pluginFolder + jsFiles[fileIndex]).then(function() {
					if (jsFiles[fileIndex + 1]) {
                  loadFiles(fileIndex + 1);
                  console.log("caricato "+ jsFiles[fileIndex]);
					} else {
						initializeViewer();
					}
				})
         }*/
         //var _options = tredhop.build(attrs.name);
         //var presenter = tredhop.scope;
         var start=0;
         var name="";
         var myurl="";
         var mdI="";
         var stMinD=0;
         var stMaxD=0;
         var stMinT=0;
         var stMaxT=0;
         var _PanX = 0.0;
         var ANNOTATIONDATA ={};
         var tipo_hs="Sphere";
         var url_hs="models/singleres/sphere.ply";
         var HOTSPOTSDATA ={};

         /*function readTextFile(file, callback) {
            var rawFile = new XMLHttpRequest();
            rawFile.overrideMimeType("application/json");
            rawFile.open("GET", file, true);
            rawFile.onreadystatechange = function() {
                if (rawFile.readyState === 4 && rawFile.status == "200") {
                    callback(rawFile.responseText);
                }
            }
            rawFile.send(null);
        }*/

         var setup3dhop = function() {

            //readTextFile("../../config/config.json", function(text){
               presenter = new Presenter("draw-canvas");
               //var data = JSON.parse(text);
               //var TDHOPTIONS=data;
               //var myname=TDHOPTIONS.tdhopViewerOptions.name;
               //var myurl=TDHOPTIONS.tdhopViewerOptions.url;
               //console.log("Caricamento JSON");
               //console.log(myurl);
               presenter.setScene({

                  meshes: {
                     "Mesh" : {
                        url: _options.url,
                     },
                     //"Cage": {
                     //	url: "data/3Dmodels/singleres/"
                     //}
                  },
                  modelInstances: {
                     "Model1": {
                       mesh: "Mesh"
                     },
                     //"Model2": {
                     //	mesh: ""
                     //}
                  },
                  /*trackball: {
                     type : TurntablePanTrackball,
                     trackOptions : {
                        startDistance: 1.3,
                        startPhi: 40.0,
                        startTheta: 20.0,
                        minMaxDist: [0.8, 2.5],
                        minMaxPhi: [-180, 180],
                        minMaxTheta: [-30.0, 70.0]
                     }
                  },
                  space: {
                     centerMode: "scene",
                     radiusMode: "scene",
                     cameraFOV        : 60.0,
			            cameraNearFar    : [0.01, 10.0],
			            cameraType       : "perspective",
			            sceneLighting    : true
                  }*/
               });

               //--MEASURE--
               presenter._onEndMeasurement = onEndMeasure;
               //--MEASURE--

               //--POINT PICKING--
               presenter._onEndPickingPoint = onEndPick;
               //--POINT PICKING--

               //--SECTIONS--
               sectiontoolInit();
               //--SECTIONS--*/
            //});

            /*readTextFile("config/hotspots.json", function(text){
               var data = JSON.parse(text);
               var HOTSPOTSDATA=data;
               console.log("Caricamento HOTSPOTS");
               console.log(HOTSPOTSDATA);
               var cont={};
               for (var ii = 0; ii < HOTSPOTSDATA.annotations.length; ii++){
               var pos = HOTSPOTSDATA.annotations[ii].position
               var radius = HOTSPOTSDATA.annotations[ii].radius;
               var newSpot = {
                  mesh      : tipo_hs,
                  color     : [ 0.0, 0.25, 1.0 ],
                  transform : {
                     matrix:
                     SglMat4.mul(SglMat4.translation(pos),
                     SglMat4.scaling([radius, radius, radius]))
                  },
               };
               cont[HOTSPOTSDATA.annotations[ii].name] = newSpot;
               }
            });*/
         }
      }
   };
}]);
