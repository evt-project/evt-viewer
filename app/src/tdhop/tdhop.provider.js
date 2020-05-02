angular.module('evtviewer.tdhop')
   .provider('evtTredhop', function(){
      var vm = this;
      this.$get = function(parsedData, config, $ocLazyLoad, $log, evtInterface) {
         var evtTdhop = {};
         var console = $log.getInstance('evtTredhop');

         evtTdhop.build = function(scope) {
            var options = config.tdhopViewerOptions;
            options.id = "tdhop";
            //return options;
         var pluginFolder = 'js-plugins/tdhop/';
         var jsFiles = [
            'setup.js',
            'spidergl.js',
            'jquery.js',
            'presenter.js',
            'nexus.js',
            'ply.js',
            'helpers.js',
            'trackball_sphere.js',
            'trackball_turntable.js',
            'trackball_turntable_pan.js',
            'trackball_pantilt.js',
            'trackball_rail.js',
            'nexus.js',
            'corto.js',
            'meco.js',
            'init.js',
            'meshcoder_worker.js',
            'setup.js',
         ];

         var loadFiles = function(fileIndex) {

            $ocLazyLoad.load(pluginFolder + jsFiles[fileIndex]).then(function() {
               if (jsFiles[fileIndex + 1]) {
                  loadFiles(fileIndex + 1);
                  console.log("Load "+ jsFiles[fileIndex]);
               } else {
                  initializeViewer();
                  console.log("Initialize 3dhop viewer");
               }
            })
         };

         var initializeViewer = function() {
            init3dhop();
            setup3dhop();
         };

         var homeSelectVisibility = config.tdhopViewerOptions.toolHome;


         function configToolbar() {
            console.log('Tool attivati:');
            if(config.toolHome === true){
               console.log("tool home attivato")
            }
         };

         loadFiles(0);

         };
      function actionsToolbar(action) {
         console.log('action');
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
         };
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
            $('#pickpoint-output').html("[ "+x+" , "+y+" , "+z+" ]");
         }
         return evtTdhop;
      };
   });
