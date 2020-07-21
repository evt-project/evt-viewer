angular.module('evtviewer.tdhop')
   .provider('evtTredhop', function () {
      var vm = this;
      this.$get = ['config', '$ocLazyLoad', '$log', function (config, $ocLazyLoad, $log) {
         var evtTdhop = {};
         var console = $log.getInstance('evtTredhop');

         evtTdhop.build = function (scope) {
            var url1 = config.tdhopViewerOptions.Model_1 ? config.tdhopViewerOptions.Model_1.path : '';
            var url2 = config.tdhopViewerOptions.Model_2 ? config.tdhopViewerOptions.Model_2.path : '';
            var url_hs = config.tdhopViewerOptions.Hotspots ? config.tdhopViewerOptions.Hotspots.path : '';
            var type = config.tdhopViewerOptions.Hotspots ? config.tdhopViewerOptions.Hotspots.type : undefined;
            var annotations = config.tdhopViewerOptions.Hotspots ? JSON.stringify(config.tdhopViewerOptions.Hotspots.hotspotsdata) : [];
            console.log("Check hotspotsdata " + annotations);
            console.log("Check model path " + url1);
            var options = config.tdhopViewerOptions;
            options.id = "tdhop";
            var pluginFolder = 'js-plugins/tdhop/';
            var jsFiles = [
               'jquery.js',
               'spidergl.js',
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

            var loadFiles = function (fileIndex) {

               $ocLazyLoad.load(pluginFolder + jsFiles[fileIndex]).then(function () {
                  if (jsFiles[fileIndex + 1]) {
                     loadFiles(fileIndex + 1);
                  } else {
                     initializeViewer();
                     console.log("3dhop viewer setup and initialized");
                  }
               })
            };
            
            var initializeViewer = function () {
               init3dhop();
               setup3dhop(url1, url2, url_hs, annotations, type);
            };

            var homeSelectVisibility = config.tdhopViewerOptions.toolHome;


            loadFiles(0);
         };

         return evtTdhop;
      }];
   });
