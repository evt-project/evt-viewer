var presenter = null;
var setup3dhop = function() {
            presenter = new Presenter("draw-canvas");
            presenter.setScene({
               meshes: {
                  "Mesh_1_mesh" : {
                     //url: config.tdhopViewerOptions.url,
                     url: "/data/models/singleres/cross.ply",
                  },
                  "Mesh_2_mesh" : {
                      url: "/data/models/multires/cross.nxz",
                  },
               },
               modelInstances: {
                  "Model_1": {
                     mesh: "Mesh_1_mesh",
                     tags : ["fig1", "original"],
                  },
                  "Model_2": {
                     mesh: "Mesh_2_mesh",
                     tags : ["fig2", "original"],
                 },
               },
               trackball: {
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
               }
            });

            //--MEASURE--
            presenter._onEndMeasurement = onEndMeasure;
            //--MEASURE--

            //--POINT PICKING--
            presenter._onEndPickingPoint = onEndPick;
            //--POINT PICKING--

            presenter.setInstanceVisibility('fig2', false, false);

            //--SECTIONS--
            sectiontoolInit();
}
function actionsToolbar(action) {
   //console.log('action');
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
      else if (action == 'pick' || action == 'pick_on') { presenter.enablePickpointMode(!presenter.isPickpointModeEnabled()); pickpointSwitch();}
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
      //else if(action=='move_up' || 'move_dawn' || 'move_right' || 'move_left') step(action);
      else if (action == 'model') {presenter.setInstanceVisibility(HOP_ALL, false, false); presenter.setInstanceVisibility('fig1', true, true);}
      else if (action == 'fig1') {presenter.setInstanceVisibility(HOP_ALL, false, false); presenter.setInstanceVisibility('fig1', true, true);}
      else if (action == 'fig2') {presenter.setInstanceVisibility(HOP_ALL, false, false); presenter.setInstanceVisibility('fig2', true, true);}
      } catch (e) {
      console.log(e)
   }
}
//--MEASURE--
function onEndMeasure(measure) {
   measure.toFixed(2) //sets the number of decimals when displaying the measure
   // depending on the model measure units, use "mm","m","km" or whatever you have
   //console.log(scope.measure-output);
   $('#measure-output').html(measure.toFixed(2) + " mm");
   //$scope.measure=(measure.toFixed(2) + " mm");
}
//--MEASURE--
//--PICKPOINT--
function onEndPick(point) {
   // .toFixed(2) sets the number of decimals when displaying the picked point
   var x = point[0].toFixed(2);
   var y = point[1].toFixed(2);
   var z = point[2].toFixed(2);
   $('#pickpoint-output').html("[ " + x + " , " + y + " , " + z + " ]");
}
