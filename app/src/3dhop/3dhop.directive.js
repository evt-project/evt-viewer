/**
 * @ngdoc directive
 * @module evtviewer.3dhop
 * @name evtviewer.3dhop.directive:evtTreDHOP
 * @description 
 * # evtTreDHOP
 * It uses the {@link evtviewer.3dhop.controller:TreDHOPCtrl TreDHOPCtrl} controller.
 * The initial scope is expanded in {@link evtviewer.3dhop.evtTreDHOP evtTreDHOP} provider.
 *
 * @scope
 *
 * @restrict A
**/
angular.module('evtviewer.3dhop', [])
.directive('3dhop', function(evtInterface, $ocLazyLoad, $timeout) {
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
				console.log('Finished loading js files')
				})				
			}

			
			/*	$ocLazyLoad.load(pluginFolder +'spidergl.js', 'jquery.js', 'presenter.js', 'nexus.js', 'ply.js', 'trackball_turntable.js', 'trackball_turntable_pan.js', 'trackball_pantilt.js', 'trackball_sphere.js', 'init.js').then(function() {
					console.log('loaded!!');
					initializeViewer();
					console.log('inizialized!!');
				}, function(e) {
					console.log('errr');
					console.error(e);
				})
			*/						

			var initializeViewer = function() {
				init3dhop();
				setup3dhop();				
			};
			
			loadFiles(0);

			var presenter = null;
			function setup3dhop () {
				presenter = new Presenter(scope.canvas);

				presenter.setScene({
					meshes: {
						"Gargoyle" : { url: "data/3Dmodels/multires/bewcastle.nxs"}
					},
					modelInstances: {
						"Model1": { mesh: "Gargoyle" }
					}
				});
			}

			scope.actionOnViewer = function(action) {
				console.log('action');
				try {
					if (action=='home') presenter.resetTrackball();
					//--FULLSCREEN--
					else if (action=='full' || action=='full_on') fullscreenSwitch();
					//--FULLSCREEN--

					//--ZOOM--
					else if (action == 'zoomin') presenter.zoomIn();
					else if (action == 'zoomout') presenter.zoomOut();
					//--ZOOM--

					//--LIGHT--
					else if (action == 'light' || action == 'light_on') {
						presenter.enableLightTrackball(!presenter.isLightTrackballEnabled());
						lightSwitch();
					}
					//--LIGHT--
					//--COLOR--
					else if (action == 'color' || action == 'color_on') {
						presenter.toggleInstanceSolidColor(HOP_ALL, true);
						colorSwitch();
					}
					//--COLOR--
					//--MEASURE--
					else if (action == 'measure' || action == 'measure_on') {
						presenter.enableMeasurementTool(!presenter.isMeasurementToolEnabled());
						measureSwitch();
					}
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
				} catch (e) {
					console.log(e)
				}
			}			
		}		
	};
});