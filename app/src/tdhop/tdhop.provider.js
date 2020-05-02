angular.module('evtviewer.tdhop')
   .provider('evtTredhop', function(){
      var vm = this;
      this.$get = function(parsedData, config, $ocLazyLoad, $log, evtInterface) {
         var evtTdhop = {};
         var url1 = null;
         var url2 = null;
         var console = $log.getInstance('evtTredhop');

         evtTdhop.build = function(scope) {
            url1 = config.tdhopViewerOptions.Model_1.path;
            url2 = config.tdhopViewerOptions.Model_2.path;
            console.log("valore url "+config.tdhopViewerOptions.Model_1.path);
            var options = config.tdhopViewerOptions;
            console.log("valore url "+options);
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
                  console.log("Setup 3dhop viewer");
                  console.log("Initialize 3dhop viewer");
               }
            })
         };

         var initializeViewer = function() {
            init3dhop();
            setup3dhop(url1, url2);
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

         return evtTdhop;
      };
   });
