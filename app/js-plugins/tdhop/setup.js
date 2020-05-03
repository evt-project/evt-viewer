var presenter = null;// start menager of arrows movement
function step(action){
	var my_pos = [];
	my_pos = presenter.getTrackballPosition();

	switch(action) {
		case 'move_up'   :
			my_pos[3]-=0.1;
			presenter.animateToTrackballPosition(my_pos);
			break;
		case 'move_dawn' :
			my_pos[3]+=0.1;
			presenter.animateToTrackballPosition(my_pos);
			break;
		// Math.sin(); Math.cos();
		case 'move_right' :
			if(my_pos[0] == 0){
				my_pos[2]-=0.1;
				presenter.animateToTrackballPosition(my_pos);
			}
			else{
			/*	my_pos[2]-=0.1 * Math.cos(my_pos[0]);
				my_pos[4]-=0.1 * Math.sin(my_pos[0]);
				presenter.animateToTrackballPosition(my_pos);
			*/

				var gr = Math.PI * my_pos[0] / 180 ; // da gradi a radianti
				my_pos[2]-= 0.1 *  Math.cos(gr);
				my_pos[4]+= 0.1 * Math.sin(gr);

				presenter.animateToTrackballPosition(my_pos);
			}
			break;
		case 'move_left' :
			if(my_pos[0] == 0){
				my_pos[2]+=0.1;
				presenter.animateToTrackballPosition(my_pos);
			}
			else{
				// prendo la mia misura, che dovrebbe essere in gradi e la trasformo in radianti.
				// calcolo seno e coseno di rotH e li moltiplico per quanto volgio muovermi, poi assegno i valori
				/*var gr = Math.PI * my_pos[0] / 180 ; // da gradi a radianti
				var v2 = Math.cos(gr) *0.1 ;
				var v4 = Math.sin(gr) *0.1 ;
				var rg2 = 180 * v2 / Math.PI ; // da radianti a gradi
				var rg4 = 180 * v4 / Math.PI ; // da radianti a gradi

				my_pos[2]+= rg2;
				my_pos[4]+= rg4;
				*/
				//my_pos[2]+= 0.1 * Math.cos(my_pos[0]);
				//my_pos[4]+= 0.1 * Math.sin(my_pos[0]);

				//Maaaahhh al momento questa sembra la versione migliore, funziona, non benissimo
				// agli estremi  <-- --> comincia es. ad avicinarsi
				// se fazzio zoom e mi muovo o muov il modello dopo che mi sono spostatoa destra e a sinistra, fa cose che un utente non si aspetta faccia

				var gr = Math.PI * my_pos[0] / 180 ; // da gradi a radianti
				my_pos[2]+= 0.1 *  Math.cos(gr);
				my_pos[4]-= 0.1 * Math.sin(gr);

				presenter.animateToTrackballPosition(my_pos);
			}
			break;
	}
}
// end menager of arrows movement
$('#move_right').css("opacity", "0.2");
$('#move_left').css("opacity", "0.2");
$('#move_up').css("opacity", "0.2");
$('#move_dawn').css("opacity", "0.2");

var setup3dhop = function(url1 , url2) {
            presenter = new Presenter("draw-canvas");
            presenter.setScene({
               meshes: {
                  "Mesh_1_mesh" : {
                     url: url1,
                  },
                  "Mesh_2_mesh" : {
                      url: url2,
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
      else if(action=='hotspot'|| action=='hotspot_on') { presenter.toggleSpotVisibility(HOP_ALL, true); presenter.enableOnHover(!presenter.isOnHoverEnabled()); hotspotSwitch(); }
      //--LIGHT--
      else if(action=='light' || action=='light_on') { presenter.enableLightTrackball(!presenter.isLightTrackballEnabled()); lightSwitch(); }
      else if(action=='lighting' || action=='lighting_off') {
			if (action=='lighting'){
				lightSwitch('light_off');
			}
			presenter.enableSceneLighting(!presenter.isSceneLightingEnabled()); lightingSwitch();
      }
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
      else if (action == 'fig1') {
         presenter.setInstanceVisibility(HOP_ALL, false, false);
         presenter.setInstanceVisibility('fig1', true, true);
      }
      else if (action == 'fig2') {
         presenter.setInstanceVisibility(HOP_ALL, false, false);
         presenter.setInstanceVisibility('fig2', true, true);
      }
      else if (action == 'move_up' || 'move_dawn' || 'move_right' || 'move_left') step(action);
      } catch (e) {
      console.log(e)
   }
}
var arrows = true;
function setToolbar(tool){
   if (tool == 'arrows') arrows = true;
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
function onPickedSpot(id) {
   switch(id) {
      //TO DO: handle hotspots click
   }
 }

 function onPickedInstance(id) {
   switch(id) {
      //TO DO: handle hotspots click
   }
 }

