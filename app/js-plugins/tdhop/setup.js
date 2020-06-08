
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
   console.log(action);
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
      //--FULLSCREEN--
      else if (action== 'full' || action== 'full_on') fullscreenSwitch();
      //--FULLSCREEN--
      else if (action == 'move_up' || 'move_dawn' || 'move_right' || 'move_left') step(action);
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
   //switch(id) {
      //TO DO: handle hotspots click
      //case 'Wing'   : alert("Wing Hotspot Clicked"); break;
      //case 'Sphere' : alert("Basis Hotspot Clicked"); break;
   //}
   //mi permette di prendere ed usare la posizione del json, una volta cliccato l'hotspot.
	for (var ii = 0; ii < annotations.length; ii++){
		var view = annotations[ii].view;
		if (annotations[ii].name == id){
			presenter.animateToTrackballPosition(convertToLocal(view));
		};
	}
}
function onPickedInstance(id) {
   switch(id) {
      //TO DO: handle hotspots click
   }
}
var modelControllerCanvas = document.getElementById("repeatSelect");
function setModelVisibility(id){
   if(id == 'Mesh_1_mesh'){
      presenter.setInstanceVisibility(HOP_ALL, false, false);
      presenter.setInstanceVisibility('Mesh_1_mesh', true, true);
	}
	else {
      presenter.setInstanceVisibility(HOP_ALL, false, false);
      presenter.setInstanceVisibility('Mesh_2_mesh', true, true);
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

// start hotspots functions convertTOGlobal/Local SPOTMAKER, per trasformare le coordinate da locali a globali.
// Da usare per muovere il modello quando si clicca sul hotspot
function convertToGlobal(state) {
	var newstate=[];
	// angles
	newstate[0] = state[0];
	newstate[1] = state[1];
	// pan
	newstate[2] = (state[2] / presenter.sceneRadiusInv) + presenter.sceneCenter[0];
	newstate[3] = (state[3] / presenter.sceneRadiusInv) + presenter.sceneCenter[1];
	newstate[4] = (state[4] / presenter.sceneRadiusInv) + presenter.sceneCenter[2];
	//distance
	newstate[5] = state[5] / presenter.sceneRadiusInv;
	return newstate;
}
function convertToLocal(state) {
	var newstate=[];
	// angles
	newstate[0] = state[0];
	newstate[1] = state[1];
	// pan

	newstate[2] = (state[2] - presenter.sceneCenter[0]) * presenter.sceneRadiusInv;
	newstate[3] = (state[3] - presenter.sceneCenter[1]) * presenter.sceneRadiusInv;
	newstate[4] = (state[4] - presenter.sceneCenter[2]) * presenter.sceneRadiusInv;
	//distance
	//(state[5] * presenter.sceneRadiusInv)-(0.9* presenter.sceneRadiusInv);
	if ((state[5] * presenter.sceneRadiusInv - 0.9) == 1.10 ) {
		newstate[5] = state[5] * presenter.sceneRadiusInv - 0.9;
	}else {
		newstate[5] = (state[5] - (0.9 / presenter.sceneRadiusInv)) * presenter.sceneRadiusInv; // serve a riadattare lo zoom della croce con le impostazioni da me messe qui (rispetto a quelle di SPOTMAKER)
		if (newstate[5] < 0) {
			newstate[5] *= -1; //serve ad esvitare valori negativi, così quando zommo molto sembra andare
		}
	}
	//newstate[5] = state[5] * presenter.sceneRadiusInv;/*start;/*state[5] * presenter.sceneRadiusInv-0.9;*/ // 1.10 questo valore nel mio caso deve essere 1.10; poiché io ho impostato questa come start. cioé la distanza a cui sta il modello
	return newstate;								//	la moltiplicazione viene 2. io sotraggo questo 0.9, in modo da far diventare il tutto 1.10; così il modello è leggrmente più lontano, ma rimane ad una distanza adeguata
}

// Page Resize Function
function onPageResize() {
	resizeCanvas($('#3dhop').parent().width(),$('#3dhop').parent().height());
	presenter.ui.postDrawEvent();
}

/* COMPASS */
function onTrackballUpdate(trackState){
	updateCompass(sglDegToRad(trackState[0]), sglDegToRad(trackState[1]));
}
function updateCompass(angle, tilt) {
	$('#compassCanvas').attr('width', 100);
	$('#compassCanvas').attr('height',100);
 	var canv = document.getElementById("compassCanvas");
	var ctx = canv.getContext("2d");
	var hh = canv.height;
	var ww = canv.width;

	ctx.clearRect(0, 0, canv.width, canv.height);
    // Save the current drawing state
    ctx.save();

    // Now move across and down half the
    ctx.translate(ww/2.0, hh/2.0);

    // Rotate around this point
    ctx.rotate(angle);

	ctx.beginPath();
    ctx.arc(0, 0, 45, 0, 2 * Math.PI, false);
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#443377';
    ctx.stroke();

	ctx.font = "28px Verdana";
    ctx.strokeStyle = '#ff4444';
	ctx.strokeText("N",-10,-25);
    ctx.strokeStyle = '#ffffff';
	ctx.strokeText("S",-10,45);
	ctx.strokeText("E",27,10);
	ctx.strokeText("W",-47,10);

    // Restore the previous drawing state
    ctx.restore();
}

var presenter = null;

var setup3dhop = function(url1 , url2, url_hs, type) {
      // start manager of hotspotdata
      var cont = {};
      var annotations = [
         {
            "name": 100,
            "type": "point",
            "position": [
               181.08,
               4026.27,
               -118.52
            ],
            "radius": "100",
            "view": [
               0,
               0,
               293.310302734375,
               1979.6796875,
               -262.52020263671875,
               8614.720045911034
            ]
         },
         {
            "name": 101,
            "type": "point",
            "position": [
               351.3,
               3381.01,
               -93.12
            ],
            "radius": "100",
            "view": [
               42.97183463481176,
               2.406422739549458,
               293.310302734375,
               1979.6796875,
               -262.52020263671875,
               8614.720045911034
            ]
         },
         {
            "name": 102,
            "type": "point",
            "position": [
               411.21,
               2797.47,
               -131.72
            ],
            "radius": "150",
            "view": [
               72.88023154064075,
               5.500394833255906,
               293.310302734375,
               1979.6796875,
               -262.52020263671875,
               6977.923237187937
            ]
         },
         {
            "name": 103,
            "type": "point",
            "position": [
               442.61,
               2037.13,
               -364.52
            ],
            "radius": "500",
            "view": [
               99.46547323471097,
               6.4171273054652245,
               293.310302734375,
               1979.6796875,
               -262.52020263671875,
               1773.6944629310901
            ]
         },
         {
            "name": 104,
            "type": "point",
            "position": [
               507.25,
               854.58,
               -452.85
            ],
            "radius": "50",
            "view": [
               141.9789416334178,
               17.761691649055525,
               293.310302734375,
               1979.6796875,
               -262.52020263671875,
               15723.374677588283
            ]
         },
         {
            "name": 105,
            "type": "point",
            "position": [
               168.29,
               48.94,
               -575.27
            ],
            "radius": "150",
            "view": [
               179.56497299399933,
               54.66017365548057,
               293.310302734375,
               1979.6796875,
               -262.52020263671875,
               6091.557506321472
            ]
         }
      ];
      for (var ii = 0; ii < annotations.length; ii++){
         var pos = annotations[ii].position;
         var radius = annotations[ii].radius;
         var newSpot = {
            mesh      : type,
            color     : [ 0.0, 0.25, 1.0 ],
            transform : {
               matrix:
                  SglMat4.mul(SglMat4.translation(pos),
                  SglMat4.scaling([radius, radius, radius]))
               },
         };
         cont[annotations[ii].name] = newSpot;
      }

      // end manager of hotspotdata
   presenter = new Presenter("draw-canvas");
   presenter.setScene({
      meshes: {
         "Mesh_1_mesh" : {
            url: url1,
         },
         "Mesh_2_mesh" : {
             url: url2,
         },
         "Hotspot" : {
            url: url_hs
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
      spots : {
         "Hotspot" :  {
            mesh            : "Hotspot",
            color           : [ 0.0, 0.25, 1.0 ],
            transform : {
               translation :  [
                  442.61,
                  2037.13,
                  -364.52],
               scale : [50.0, 50.0, 50.0],
               },
         }
      },
      trackball: {
         type : TurntablePanTrackball,
         trackOptions : {
            startDistance : 2.0,
            startPhi: -60.0,
				startTheta: 25.0,
				startPanY: 0.12,
				minMaxDist: [0.2, 3.0],
				minMaxPhi: [-180, 180],
				minMaxTheta: [-80.0, 90.0],
				minMaxPanX: [-0.25, 0.25],
				minMaxPanY: [-1.0, 1.0],
				minMaxPanZ: [-0.25, 0.25],
         }
      },
      space: {
         centerMode: "scene",
         radiusMode: "scene",
         cameraFOV        : 40.0,
         cameraNearFar    : [0.01, 5.0],
         cameraType       : "perspective",
         sceneLighting    : true
      },
      config : {
			pickedpointColor    : [1.0, 0.0, 1.0],
			measurementColor    : [0.5, 1.0, 0.5],
			showClippingPlanes  : true,
			showClippingBorder  : true,
			clippingBorderSize  : 3.0,
			clippingBorderColor : [0.0, 1.0, 1.0]
		},
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
   $('#Mesh_1_mesh').change(function(){
      presenter.setInstanceVisibility(HOP_ALL, false, false);
      presenter.setInstanceVisibility('Mesh_1_mesh', true, true);
      alert('prova');
   });
   $('#Mesh_2_mesh').change(function(){
      presenter.setInstanceVisibility(HOP_ALL, false, false);
      presenter.setInstanceVisibility('Mesh_2_mesh', true, true);
      alert('prova');
   });

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

