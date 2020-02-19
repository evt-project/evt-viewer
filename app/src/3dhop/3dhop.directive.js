angular.module('evtviewer.3dhop')

.directive('3dhop', function(evtAnalogue, evtInterface, $ocLazyLoad, $timeout) {
	return {
		restrict: 'A',
		scope: {
			canvas: '@'
		},
		templateUrl: 'src/3dhop/3dhop.directive.tmpl.html',
		link: function(scope, element, attrs) {
			var pluginFolder = 'js-plugins/3dhop/';
			var jsFiles = ['spidergl.js', 'jquery.js', 'presenter.js',
				'nexus.js', 'ply.js', 'trackball_turntable.js',
				'trackball_turntable_pan.js', 'trackball_pantilt.js', 'trackball_sphere.js', 'init.js'
			]

			var loadFiles = function(fileIndex) {
				$ocLazyLoad.load(pluginFolder + jsFiles[fileIndex]).then(function() {
					if (jsFiles[fileIndex + 1]) {
						loadFiles(fileIndex + 1);
					} else {
						initializeViewer();
					}
				})
			}

			var initializeViewer = function() {
				init3dhop();
				setup3dhop();
			};

			loadFiles(0);

			var presenter = null;
			var setup3dhop = function() {
				presenter = new Presenter(scope.canvas);
				presenter.setScene({
					meshes: {
						"Gargoyle": {
							url: "data/3Dmodels/multires/gargo.nxs"
						},
						"Cage": {
							url: "data/3Dmodels/singleres/cage.ply"
						}
					},
					modelInstances: {
						"Model1": {
							mesh: "Cage"
						},
						"Model2": {
							mesh: "Gargoyle"
						}
					}
				});
			}
			scope.actionOnViewer = function(action) {
				console.log('action');
				try {
					if (action == 'home') presenter.resetTrackball();
					//--FULLSCREEN--
					else if (action == 'full' || action == 'full_on') fullscreenSwitch();
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
