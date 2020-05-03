
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

// start menager of arrows movement
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
      else if(action=='lighting' || action=='lighting_off') {
			if (action=='lighting'){
				lightSwitchL('light_off');
			}
			presenter.enableSceneLighting(!presenter.isSceneLightingEnabled()); lightingSwitch();
		}
		else if(action=='light') lightSwitchL('light');
		else if(action=='light_off') lightSwitchL('light_off');
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
      else if (action == 'Mesh_1_mesh') {
         presenter.setInstanceVisibility(HOP_ALL, false, false);
         presenter.setInstanceVisibility('Mesh_1_mesh', true, true);
      }
      else if (action == 'Mesh_2_mesh') {
         presenter.setInstanceVisibility(HOP_ALL, false, false);
         presenter.setInstanceVisibility('Mesh_2_mesh', true, true);
      }
      else if (action == 'move_up' || 'move_dawn' || 'move_right' || 'move_left') step(action);
      //--FULLSCREEN--
      else if (action == 'full' || action == 'full_on') fullscreenSwitch();
      //--FULLSCREEN--
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
// start lightController functions
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
function relMouseCoords(event){
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var canvasX = 0;
    var canvasY = 0;
    var pageX = 0;
    var pageY = 0;
    var currentElement = this;

    do {
        totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
        totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
    }
    while(currentElement = currentElement.offsetParent)

    (event.touches) ? (pageX = event.touches[0].pageX) : (pageX = event.pageX);
    (event.touches) ? (pageY = event.touches[0].pageY) : (pageY = event.pageY);

    canvasX = pageX - totalOffsetX;
    canvasY = pageY - totalOffsetY;

    return {x:canvasX, y:canvasY}
}
HTMLCanvasElement.prototype.relMouseCoords = relMouseCoords;
// end lightControler functions

var presenter = null;
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
            tags : ["Mesh_1_mesh", "original"],
            color: [-2.0, -2.0, -2.0]
         },
         "Model_2": {
            mesh: "Mesh_2_mesh",
            tags : ["Mesh_2_mesh", "original"],
            color: [-2.0, -2.0, -2.0]
        },
      },
      trackball: {
         type : TurntablePanTrackball,
         trackOptions : {
            startDistance : 1.0,
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

   presenter.setInstanceVisibility('Mesh_2_mesh', false, false);

   presenter.setSpotVisibility(HOP_ALL, false, true);

   //--SECTIONS--
   sectiontoolInit();
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
//*******************************************************************
update_lightcontroller(-0.17,-0.17);

   $('#move_right').css("opacity", "0.2");
   $('#move_left').css("opacity", "0.2");
   $('#move_up').css("opacity", "0.2");
   $('#move_dawn').css("opacity", "0.2");

