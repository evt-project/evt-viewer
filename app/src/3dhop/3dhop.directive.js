angular.module('evtviewer.3dhop')

.directive('3dhop', function(evtAnalogue, evtInterface, $ocLazyLoad, $timeout) {
	return {
		restrict: 'A',
		scope: {
			canvas: '@',
		},
		transclude: true,
		controllerAs: 'vm',
		//controller: "TreDHOPCtrl",
		templateUrl: 'src/3dhop/3dhop.directive.tmpl.html',

		link: function (scope, element, attrs) {

			var pluginFolder = 'js-plugins/3dhop/';
			var jsFiles = ['corto.js', 'helpers.js', 'meco.js', 'meshcoder_worker.js', 'spidergl.js', 'jquery.js', 'presenter.js', 'nexus.js', 'ply.js', 'trackball_turntable.js',
				'trackball_turntable_pan.js', 'trackball_pantilt.js', 'trackball_rail.js', 'trackball_sphere.js', 'init.js']

			var loadFiles = function(fileIndex) {
				$ocLazyLoad.load(pluginFolder + jsFiles[fileIndex]).then(function() {
					if (jsFiles[fileIndex + 1]) {
						loadFiles(fileIndex + 1);
					} else {
						initializeViewer();
					}
				})
         }

         var presenter = null;
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

         function readTextFile(file, callback) {
            var rawFile = new XMLHttpRequest();
            rawFile.overrideMimeType("application/json");
            rawFile.open("GET", file, true);
            rawFile.onreadystatechange = function() {
                if (rawFile.readyState === 4 && rawFile.status == "200") {
                    callback(rawFile.responseText);
                }
            }
            rawFile.send(null);
        }

         var setup3dhop = function() {

            readTextFile("config/config3d.json", function(text){

            var data = JSON.parse(text);

            var myname=data.meshes.name;
            var myurl=data.meshes.url;
            var mymodel=data.modelInstances.mesh;
            console.log("Caricamento JSON");
            console.log(myurl);
				presenter = new Presenter(scope.canvas);

            presenter.setScene({
					meshes: {
						"Mesh" : {
						   url: myurl
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
					}
            });
         });

            readTextFile("config/hotspots.json", function(text){
            // hotspotdata
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
            // fine hotspotdata
         });
         }

			var initializeViewer = function() {
				init3dhop();
				setup3dhop();
			};

         loadFiles(0);

			scope.actionOnViewer = function(action) {
				console.log('Action');
				try {
					if (action == 'home') presenter.resetTrackball();
					//--ZOOM--
					else if (action == 'zoomin') presenter.zoomIn();
					else if (action == 'zoomout') presenter.zoomOut();
					//--ZOOM--
               //--LIGHT--
               else if(action=='lighting' || action=='lighting_off') { presenter.enableSceneLighting(!presenter.isSceneLightingEnabled()); lightingSwitch(); }
	            else if(action=='light' || action=='light_on') { presenter.enableLightTrackball(!presenter.isLightTrackballEnabled()); lightSwitch(); }
	            //--LIGHT--
					//--COLOR--
					else if (action == 'color' || action == 'color_on') { presenter.toggleInstanceSolidColor(HOP_ALL, true); colorSwitch(); }
               //--COLOR--
               else if(action=='perspective' || action=='orthographic') { presenter.toggleCameraType(); cameraSwitch(); }
		         else if(action=='hotspot'|| action=='hotspot_on') { presenter.toggleSpotVisibility(HOP_ALL, true); presenter.enableOnHover(!presenter.isOnHoverEnabled()); hotspotSwitch(); }
					//--MEASURE--
					else if (action == 'measure' || action == 'measure_on') { presenter.enableMeasurementTool(!presenter.isMeasurementToolEnabled()); measureSwitch(); }
					//--MEASURE--
					//--POINT PICKING--
					else if (action == 'pick' || action == 'pick_on') {
						presenter.enablePickpointMode(!presenter.isPickpointModeEnabled());
						pickpointSwitch();
					}
					//--POINT PICKING--
					//--SECTIONS--
					else if (action == 'sections' || action == 'sections_on') {
						sectiontoolReset();
						sectiontoolSwitch();
					}
               //--SECTIONS--
               //--FULLSCREEN--
					else if (action == 'full' || action == 'full_on') fullscreenSwitch();
					//--FULLSCREEN--
               else if(action=='move_up' || 'move_dawn' || 'move_right' || 'move_left') step(action);
				} catch (e) {
					console.log(e)
				}
         }
         function lightSwitchL(status) {

            if(status == 'light'){
               $('#light').css("visibility", "hidden");
                $('#light_off').css("visibility", "visible");
                $('#lighting_off').css("visibility", "hidden");	//manage lighting combined interface
                $('#lighting').css("visibility", "visible");	//manage lighting combined interface

               $('#lightcontroller').css('left', ($('#light').position().left + $('#light').width() + $('#toolbar').position().left + 25));
               $('#lightcontroller').css('top', ($('#light').position().top + $('#toolbar').position().top - 25));

               presenter.enableSceneLighting('lighting_off');
               lightingSwitch('lighting_off');
            }
            else{
                $('#light_off').css("visibility", "hidden");
                $('#light').css("visibility", "visible");

                $('#lightcontroller').css('left', ($('#lightcontroller').position().left - 250));
            }
         }
         function click_lightcontroller(event) {
            var XX=0, YY=0;
            var midpoint = [63,63];
            var radius = 60;

            var lightControllerCanvas = document.getElementById("lightcontroller_canvas");
            var coords = lightControllerCanvas.relMouseCoords(event);

            XX = coords.x - midpoint[0];
            YY = coords.y - midpoint[1];

            // check inside circle
            if((XX*XX + YY*YY) < ((radius-5)*(radius-5))) {
               var lx = (XX / radius)/2.0;
               var ly = (YY / radius)/2.0;

               presenter.rotateLight(lx,-1.0*ly); 		// inverted ly
               update_lightcontroller(lx,ly);

               (event.touches) ? lightControllerCanvas.addEventListener("touchmove", drag_lightcontroller, false) : lightControllerCanvas.addEventListener("mousemove", drag_lightcontroller, false);
            }
         }

         function drag_lightcontroller(event) {
            var XX=0, YY=0;
            var midpoint = [63,63];
            var radius = 60;

            var lightControllerCanvas = document.getElementById("lightcontroller_canvas");
            var coords = lightControllerCanvas.relMouseCoords(event);

            XX = coords.x - midpoint[0];
            YY = coords.y - midpoint[1];

            // check inside circle
            if((XX*XX + YY*YY) < ((radius-5)*(radius-5))) {
               var lx = (XX / radius)/2.0;
               var ly = (YY / radius)/2.0;

               presenter.rotateLight(lx,-1.0*ly); 		// inverted ly
               update_lightcontroller(lx,ly);
            }
         }

         function update_lightcontroller(xx,yy) {

            var midpoint = [63,63];
            var radius = 60;

            var lightControllerCanvas = document.getElementById("lightcontroller_canvas");
            var context = lightControllerCanvas.getContext("2d");
            context.clearRect(0, 0, lightControllerCanvas.width, lightControllerCanvas.height);

            context.beginPath();
            context.arc(midpoint[0], midpoint[1], radius, 0, 2 * Math.PI, false);
            var grd=context.createRadialGradient(midpoint[0]+(xx*radius*2),midpoint[1]+(yy*radius*2),5,midpoint[0], midpoint[1],radius);
            grd.addColorStop(0,"yellow");
            grd.addColorStop(1,"black");
            context.fillStyle = grd;
            context.fill();
            context.lineWidth = 3;
            context.strokeStyle = 'black';
            context.stroke();

            context.beginPath();
            context.rect(midpoint[0]+(xx*radius*2)-3,midpoint[1]+(yy*radius*2)-3,5,5);
            context.lineWidth = 2;
            context.strokeStyle = 'yellow';
            context.stroke();
            //presenter.ui.postDrawEvent();
         }
         var lightControllerCanvas = document.getElementById("lightcontroller_canvas");
	      lightControllerCanvas.addEventListener("touchstart", click_lightcontroller, false);
	      lightControllerCanvas.addEventListener("mousedown", click_lightcontroller, false);

	      var canvas = document.getElementById("draw-canvas");
	      canvas.addEventListener("mouseup", function () {
		   lightControllerCanvas.removeEventListener("mousemove", drag_lightcontroller, false);
		   lightControllerCanvas.removeEventListener("touchmove", drag_lightcontroller, false);
	      }, false);
	      document.addEventListener("mouseup", function () {
         lightControllerCanvas.removeEventListener("mousemove", drag_lightcontroller, false);
         lightControllerCanvas.removeEventListener("touchmove", drag_lightcontroller, false);
      }, false);
      update_lightcontroller(-0.17,-0.17);
      }
   };
});
