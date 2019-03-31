(function () {
   console.log('caricato modulo openseadragonService');
   angular.module('evtviewer.openseadragonService', ['evtviewer.interface'])

      .service('imageViewerHandler', function (evtInterface, imageScrollMap, overlayHandler) {
         const ImageNormalizationCoefficient = 1265; // per il rotulo 3500;
         const YminPan = 0.5;
         var divHotSpotToggle = false;

         var viewerHandler = this;

         viewerHandler.viewer = undefined;
         viewerHandler.scope = undefined;

         viewerHandler.setViewer = function (viewer) {
            viewerHandler.viewer = viewer;
         };
         viewerHandler.setScope = function (scope) {
            viewerHandler.scope = scope;
         };

        
         viewerHandler.open = function () {
            console.log('openHandler');
            var viewBounds = viewer.viewport.getBounds();
            var oldBounds = viewerHandler.viewer.viewport.getBounds();
            console.log('openHandler', oldBounds);
            var h = oldBounds.height / oldBounds.width;
            var newBounds = new OpenSeadragon.Rect(0, 0, 0, h);
            console.log(newBounds);
            viewerHandler.viewer.viewport.fitBounds(newBounds, false);
            //viewer.navigator.element.parentElement.parentElement.style.overflow = "visible";
            //viewer.navigator.element.parentElement.style.overflow = "visible";
            //viewer.navigator.element.style.overflow = "visible";
            //viewer.navigator.element.firstChild.style.overflow = "visible";
            //viewer.navigator.element.firstChild.children[0]  = "hidden"; 
            //viewer.navigator.element.firstChild.children[1]  = "hidden"; 
            //viewer.navigator.element.firstChild.firstChild.style.overflow = "hidden";
            console.log('element navigator', viewerHandler.viewer.navigator.element);
            //console.log("evtInterface", evtInterface);
            //console.log("scope", scope);
            //console.log("element", element);
            //console.log("scope.$parent", scope.$parent);
            //console.log("scope.$parent.$parent", scope.$parent.$parent.vm);


         };

         viewerHandler.openPage = function (page) {
            console.log('openHandler with page', page);
            var p = page.userData-1;
            viewerHandler.viewer.goToPage(p);
         };

         viewerHandler.home = function () {
            console.log('pigiato home');
            var oldBounds = viewerHandler.viewer.viewport.getBounds();
            var h = oldBounds.height / oldBounds.width;
            var newBounds = new OpenSeadragon.Rect(0, 0.1, 1, h);
            viewerHandler.viewer.viewport.fitBounds(newBounds, true);
         };

         /* Trying to fix Home bug*/

         viewerHandler.navigatorScroll = function (event) {
            console.log("navigator-scroll", evtInterface);
            console.log("navigator-scroll", event);
            if (event.scroll > 0) {
               console.log("scroll-in");
               //console.log("scope.$parent.$parent", scope.$parent.$parent.vm);
               //scope.$parent.$parent.vm.updateState('position',event.eventSource.viewport.getBounds());
               //    viewerHandler.scope.$apply(function () {
               //       evtInterface.updateState("", imageScrollMap.map(event.eventSource.viewport.getBounds()));
               //       console.log("in handler:", evtInterface.getState('currentPage'));
               //       //scope.$parent.$parent.vm.updateContent();
               //    });

            } else {
               console.log("scroll-out");
               //    viewerHandler.scope.$apply(function () {
               //       evtInterface.updateState("currentPage", imageScrollMap.map(event.eventSource.viewport.getBounds()));
               //       console.log("in handler:", evtInterface.getState('currentPage'));
               //       //scope.$parent.$parent.vm.updateContent();
               //    });
            }


         };

         viewerHandler.pan = function (event) {
            try {
               console.log('pan', event);
               if (event.immediately === undefined) {
               var newY = event.center.y;
               var oldY = event.eventSource.viewport._oldCenterY;
               console.log('ok event pan', newY);
               console.log('ok viewer pan', oldY);
               // evento scroll verso il basso
               if (viewerHandler.viewer.viewport.getZoom() === 1) {
                  var newPage, currPage;
                  console.log('aggiorna testo');
                  var oldBounds = viewerHandler.viewer.viewport.getBounds();
                  if (newY > oldY) {
                     console.log('mostro riga sotto');
                     console.log('bounds:', oldBounds);
                     //angular.element(document).find('.box-text')[1].innerHTML = "<span> PRENDERE IL TESTO IN" + oldBounds + "</span>";
                     newPage = imageScrollMap.mapDown(event.eventSource.viewport.getBounds());
                     currPage = evtInterface.getState('currentPage');
                     if (newPage !== currPage) {
                        viewerHandler.scope.$apply(function () {
                           evtInterface.updateState('currentPage', newPage);
                           console.log('in pan handler:', evtInterface.getState('currentPage'));
                           //scope.$parent.$parent.vm.updateContent();
                        });
                     }
                     //evento scroll verso l'alto    
                  } else if (newY < oldY) {
                     console.log('mostro riga sopra');
                     console.log('bounds:', oldBounds);
                     //angular.element(document).find('.box-text')[1].innerHTML = "<span> PRENDERE IL TESTO IN" + oldBounds + "</span>";
                     newPage = imageScrollMap.mapUP(event.eventSource.viewport.getBounds());
                     currPage = evtInterface.getState('currentPage');
                     if (newPage !== currPage) {
                        viewerHandler.scope.$apply(function () {
                           evtInterface.updateState("currentPage", newPage !== '' ? newPage : currPage);
                           console.log("in pan handler:", evtInterface.getState('currentPage'));
                           //scope.$parent.$parent.vm.updateContent();
                        });
                     }
                  }
                  //aggiungere scroll con coordinate asse x - FS
               }

               //event.stopBubbling = true;
            }} catch (err) {
               //console.log('error in pan', err);

            }

         };

         viewerHandler.updateViewerBounds = function (page) {
            console.log('updateViewerBounds: ', viewerHandler.viewer, page);
            var oldBounds = viewerHandler.viewer.viewport.getBounds();
            console.log('updateViewerBounds: ', oldBounds);
            if (!imageScrollMap.isInBounds(oldBounds.y, page)) {
               console.log('updateViewerBounds', page);
               imageScrollMap.updateBounds(viewerHandler.viewer, page);
            }

         };


         viewerHandler.updateViewerPage = function (page) {
            console.log('updateViewerPages: ', viewerHandler.viewer, page);
            viewerHandler.viewer.goToPage(page);
           

         };

         viewerHandler.highlightOverlay = function (zone) {
            console.log('in highlight Overlay: ', zone);
            if (!zone) {
               throw 'problem in zone data extraction';
            }

            try {
               viewerHandler.viewer.removeOverlay('line-overlay');
            } catch (error) {
               console.error('no line overlay', error);
            }
            var rectObj = convertZoneToOSD(zone);
            var elt = document.createElement("div");
            elt.id = "line-overlay";
            elt.className = "highlight";
            viewerHandler.viewer.addOverlay({
               element: elt,
               location: rectObj
            });

         };

         viewerHandler.highlightSelectedOverlay = function (zone, zoneName) {
            console.log('in highlight Overlay: ', zone);
            if (!zone) {
               throw "problem in zone data extraction";
            }

            try {
               viewerHandler.viewer.removeOverlay("line-overlay");
            } catch (error) {
               console.error('no line overlay', error);
            }
            var rectObj = convertZoneToOSD(zone);
            var elt = document.createElement("div");
            elt.id = "line-overlay_selected";
            elt.className = "selectedHighlight";
            viewerHandler.viewer.addOverlay({
               element: elt,
               location: rectObj
            });

         };

         viewerHandler.turnOffOverlay = function () {
            try {
               viewerHandler.viewer.removeOverlay("line-overlay");
            } catch (error) {
               console.error('no line overlay', error);
            }
         };

         viewerHandler.turnOffOverlaySelected = function () {
            try {
               viewerHandler.viewer.removeOverlay("line-overlay_selected");
            } catch (error) {
               console.error('no line overlay', error);
            }
         };

         function convertZoneToOSD(zone) {
            // TODO, This is just a test
            var tmp = {};
            tmp.x = _(zone.ulx);
            tmp.y = _(zone.uly);
            tmp.width = _(zone.lrx - zone.ulx);
            tmp.hight = _(zone.lry - zone.uly);
            console.log("in convert zone to OSD", tmp);
            return new OpenSeadragon.Rect(tmp.x / ImageNormalizationCoefficient, tmp.y / ImageNormalizationCoefficient, tmp.width / ImageNormalizationCoefficient, tmp.hight / ImageNormalizationCoefficient);
         }

         function _(value) {
            return value;
         }

         viewerHandler.moveToZone = function (zone) {
            console.log('moveTo: ', zone);
            console.log('viewport center: ', viewerHandler.viewer.viewport.getCenter());
            var oldCenter = viewerHandler.viewer.viewport.getCenter();
            var currentBounds = viewerHandler.viewer.viewport.getBounds(true);
            console.log('current bounds', currentBounds);
            var normalizedZoney = zone.uly/ImageNormalizationCoefficient;
            console.log('old center y', oldCenter.y);
            console.log('zone y normalized', normalizedZoney);
            console.log('differential y', oldCenter.y - normalizedZoney);
            var newY = (zone.uly / ImageNormalizationCoefficient < oldCenter.y) ? oldCenter.y : zone.uly / ImageNormalizationCoefficient;
            //var newY = ( (normalizedZoney < currentBounds.y + currentBounds.height) && normalizedZoney > currentBounds.y)  ? oldCenter.y :  (normalizedZoney < currentBounds.y) ? (currentBounds.y) :(currentBounds.y + currentBounds.height);
            console.log('new center y',newY);
            var newCenter = new OpenSeadragon.Point(oldCenter.x, newY);
            console.log('new center', newCenter);
            viewerHandler.viewer.viewport.panTo(newCenter);
            console.log('center after pan', viewerHandler.viewer.viewport.getCenter());
         };

         viewerHandler.showHotSpot = function (zones) {
            //showHotSpots -> for(){showHotSpot}
            //var toggle = false;
            console.log('in showHotSpot di ViewerHandler', zones);

            var rectObjs = [];
            for (var i = 0; i < zones.length; i++) {
               console.log('zona iesima', zones[i]);

               var r = new OpenSeadragon.Rect(
                  zones[i].ulx / ImageNormalizationCoefficient,
                  zones[i].uly / ImageNormalizationCoefficient,
                  (zones[i].lrx - zones[i].ulx) / ImageNormalizationCoefficient,
                  (zones[i].lry - zones[i].uly) / ImageNormalizationCoefficient);

               rectObjs.push(r);
            }
            console.log('point hotspot: ', rectObjs);

            var hrefElts = [];
            for (var j = 0; j < zones.length; j++) {
               var content = zones[j].content;
               var id = zones[j].id;
               var zone = zones[j];
               console.log('content', zone);

               var hrefElt = document.createElement('div');
               hrefElt.id = 'hotspot-overlay_selected-' + id;
               //hrefElt.href = '#';
               hrefElt.className = 'hotspot';
               hrefElt.dataset.id = id;
               hrefElt.dataset.content = content;
               hrefElt.onmouseover = function () {
                  viewerHandler.viewer.zoomPerClick = 1;
                  
               };
               hrefElt.onmouseout = function(){
                  viewerHandler.viewer.zoomPerClick = 1.5;
               };
               hrefElt.onclick = function(){
                  showDivHotSpot(this);
               };
               
               //function(){console.log('hot spot');};
               // hrefElt.onmouseleave = function () {
               //    toggle = hiddenDivHotSpot(toggle, this);
               // };

               hrefElts.push(hrefElt);
            }
            console.log('hotspots: ', hrefElts);

            viewerHandler.viewer.zoomPerClick = 1;
            for (var k = 0; k < zones.length; k++) {
               viewerHandler.viewer.addOverlay({
                  element: hrefElts[k],
                  location: rectObjs[k],
                  
                 
                  //placement: OpenSeadragon.Placement.CENTER,
                  //checkResize: false
               });
            }
         };

         var showDivHotSpot = function (elem) {
            if (!divHotSpotToggle) {
               console.log("elem id", elem.id);
               var _$elem = $(elem);
               var x = _$elem.position().left;
               var y = _$elem.position().top;
               var w = _$elem.width();
               var h = _$elem.height();
               var point1 = new OpenSeadragon.Point(x, y);
               var point2 = new OpenSeadragon.Point(x + w, y + h);
               var topLeft = viewerHandler.viewer.viewport.pointFromPixel(point1);
               var bottomRight = viewerHandler.viewer.viewport.pointFromPixel(point2);
               var DivTopLeft = 0;
               if (topLeft.x <= 0.4) {
                   DivTopLeft = topLeft.x + (bottomRight.x - topLeft.x) + 0.050;
               } else {
                     DivTopLeft = topLeft.x - ((bottomRight.x - topLeft.x) + 0.1);

               }
               var rect = new OpenSeadragon.Rect(
                  DivTopLeft,
                  topLeft.y,
                  0.3,
                  0.35);
               //bottomRight.x - topLeft.x
               //bottomRight.y - topLeft.y


               var divElt = document.createElement('div');
               divElt.id = 'div-hotspot-overlay_selected-' + elem.dataset.id;
               divElt.className = 'hotspot-dida';        
               
// Modifiche effettuate per Mappa San Matteo
               var divTitleElt = document.createElement('div');
               
               divTitleElt.id = 'div-title-hotspot-overlay_selected-' + elem.dataset.id;
               divTitleElt.className = 'hotspot-dida-title';
               divTitleElt.innerHTML = ''
               var divCloser = document.createElement('div');
               divCloser.className='PopupCloser';
               divCloser.dataset.id = elem.dataset.id;
               
               divCloser.onclick = function(){
                  viewerHandler.viewer.zoomPerClick = 1.5;      
                  hiddenDivHotSpot(this);
            };

               var closeIcon = document.createElement('i');
               closeIcon.className = 'fa fa-times';

               closeIcon.onmouseover = function(){
                  viewerHandler.viewer.zoomPerClick = 1;
                  console.log('closeIcon.onmouseover zoom per click: ', viewerHandler.viewer.zoomPerClick)
               };
               closeIcon.onmouseout = function(){
                  viewerHandler.viewer.zoomPerClick = 1.5;
                  console.log('closeIcon.onmouseout zoom per click: ', viewerHandler.viewer.zoomPerClick)
               };

               

               divCloser.appendChild(closeIcon);
               divTitleElt.appendChild(divCloser);

               var divBodyElt = document.createElement('div');
               divBodyElt.id = 'div-body-hotspot-overlay_selected-' + elem.dataset.id;
               divBodyElt.className = 'hotspot-dida-body';
               
               divBodyElt.innerHTML = elem.dataset.content;


               divElt.appendChild(divTitleElt);
               divElt.appendChild(divBodyElt);

               
               console.log('content', divElt);

               var OSDOverlay = {
                  element: divElt,
                  location: rect,
                  // aggiunto da FS - no rotazione dell'hotspot
                  rotationMode: OpenSeadragon.OverlayRotationMode.NO_ROTATION,
               };


               console.log();
               divHotSpotToggle = !divHotSpotToggle;
               viewerHandler.viewer.addOverlay(OSDOverlay);
               $(OSDOverlay.element).draggable();
               
               
            }
            return divHotSpotToggle; // non dovrebbe servire più
         };

         var hiddenDivHotSpot = function (elem) {
            console.log('hiddenDivHotSpot: ' + divHotSpotToggle);
            try {
               var id = elem.dataset.id;
               viewerHandler.viewer.removeOverlay('div-hotspot-overlay_selected-' + id);
            } catch (error) {
               console.error('no hotspot overlay', error);
            }

            divHotSpotToggle = false;
            return divHotSpotToggle;


         };

         viewerHandler.hiddenHotSpot = function (zones) {
            console.log('in hiddenHotSpot di ViewerHandler');
            try {
               for (var i = 0; i < zones.length; i++) {
                  viewerHandler.viewer.removeOverlay('hotspot-overlay_selected-' + zones[i].id);
               }
               //viewerHandler.viewer.zoomPerClick = 2;
            } catch (error) {
               console.error('no hotspot overlay', error);
            }
         };

         viewerHandler.lineZone = function(zone){
            console.log('in viewerHandler to handle zone line:', zone);
            overlayHandler.test('funge');
            var rectObj = convertZoneToOSD(zone);
            var elt = document.createElement("div");
            elt.id = "line-div-overlay_"+zone.id;
            elt.dataset['lb'] = zone.id.replace('line','lb');
            elt.className = "line-overlay";

            elt.onmouseover = function(){
              console.log('illuminare riga corrispondente a '+ this.dataset['lb']);
               var ITLactive = evtInterface.getToolState('ITL') === 'active';
               var currentViewMode = evtInterface.getState('currentViewMode');
               
               if (ITLactive && currentViewMode === 'imgTxt'){

                  overlayHandler.test('funge on mouseover');
                  this.className += ' selectedHighlight';
                  
                  var elemsInLine = document.querySelectorAll('[data-line=\'' + this.dataset['lb'] + '\']');
                  
                  if(elemsInLine.length == 0){
                     var dataLine = this.dataset['lb'].replace('reg','orig');
                     console.log('In alternativa riga corrispondente a '+ dataLine);
                     elemsInLine = document.querySelectorAll('[data-line=\'' + dataLine + '\']');
                  }
                  
                  console.log('selettori di riga:', elemsInLine);
                  for(var i=0; i < elemsInLine.length; i++){
                     elemsInLine[i].className += ' lineHover';
                  }

               } 
              
               //alert('overlay da img');
            };

            elt.onmouseout = function(){
               console.log('de spegnere riga corrispondente a '+ this.dataset['lb']);

               var ITLactive = evtInterface.getToolState('ITL') === 'active';
               var currentViewMode = evtInterface.getState('currentViewMode');
               
               if (ITLactive && currentViewMode === 'imgTxt') {

                  overlayHandler.test('funge on mouseout');
                  this.className = this.className.replace(' selectedHighlight', '') || '';
                  var elemsInLine = document.querySelectorAll('[data-line=\'' + this.dataset['lb'] + '\']');
                  if(elemsInLine.length == 0){
                     var dataLine = this.dataset['lb'].replace('reg','orig');
                     console.log('In alternativa riga corrispondente a '+ dataLine);
                     elemsInLine = document.querySelectorAll('[data-line=\'' + dataLine + '\']');
                  }
                  console.log('selettori di riga:', elemsInLine);
                  for(var i=0; i < elemsInLine.length; i++){
                   elemsInLine[i].className = elemsInLine[i].className.replace(' lineHover', '') || '';
                  }
               //alert('overlay da img');

               }
            };

            elt.onclick = function(){
               overlayHandler.test('funge on click');
            };

            viewerHandler.viewer.addOverlay({
               element: elt,
               location: rectObj
            });

            return elt;
         };




         viewerHandler.testFun = function () {
            console.log('testFunction: ', viewerHandler);
            return 'test ok';
         };
      });

})();
