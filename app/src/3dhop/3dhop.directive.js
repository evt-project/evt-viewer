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
						"Bewcastle" : { url: "data/3Dmodels/multires/bewcastle.nxs"}
					},
					modelInstances: {
						"Model1": { 
							mesh: "Bewcastle",
							color : [0.8, 0.7, 0.75] 
						}
					},
					trackball: {
						type : TurntablePanTrackball,
						trackOptions : {
							startPhi: 35.0,
							startTheta: 15.0,
							startDistance: 2.5,
							minMaxPhi: [-180, 180],
							minMaxTheta: [-30.0, 70.0],
							minMaxDist: [0.5, 3.0]
						}
					}
				});
				//--MEASURE--
				presenter._onEndMeasurement = onEndMeasure;
				//--MEASURE--
				
				//--POINT PICKING--
				presenter._onEndPickingPoint = onEndPick;
				//--POINT PICKING--
				
				//--SECTIONS--
				sectiontoolInit();
				//--SECTIONS--
			}

			scope.actionsToolbar = function(action) {
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
					//--LIGHTING--
					else if (action=='lighting' || action=='lighting_off') { presenter.enableSceneLighting(!presenter.isSceneLightingEnabled()); lightingSwitch(); }
					//--LIGHTING--
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
			//--MEASURE--
			function onEndMeasure(measure) {
				// measure.toFixed(2) sets the number of decimals when displaying the measure
				// depending on the model measure units, use "mm","m","km" or whatever you have
				$('#measure-output').html(measure.toFixed(2) + "mm"); 
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
			//--PICKPOINT--			
		}		
	};
});