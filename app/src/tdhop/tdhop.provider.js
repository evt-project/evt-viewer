angular.module('evtviewer.tdhop')
   .provider('tredhop', function(){
      this.$get = function(parsedData, config, $ocLazyLoad) {
         var tdhop = {};

         console.log("Provider");
         console.log(config.dataUrl);
         var pluginFolder = 'js-plugins/tdhop/';
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
            }
            loadFiles(0);

            tdhop.build = function(name) {
               var options = config.tdhopViewerOptions;

            options.id = "tdhop";
                 return options;
            }
            return tdhop;
      };
   });
