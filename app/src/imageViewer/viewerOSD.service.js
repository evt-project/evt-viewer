(function () {
   angular.module('evtviewer.openseadragonService', ['evtviewer.interface'])

      .service('imageViewerHandler', function (evtInterface, imageScrollMap, overlayHandler, parsedData) {
         var ImageNormalizationCoefficient = undefined;
         var divHotSpotToggle = false;

         var viewerHandler = this;

         viewerHandler.viewer = undefined;
         viewerHandler.scope = undefined;

         viewerHandler.setImgCoeff = function (coeff) {
            ImageNormalizationCoefficient = coeff;
         };

         viewerHandler.setViewer = function (viewer) {
            viewerHandler.viewer = viewer;
         };
         viewerHandler.setScope = function (scope) {
            viewerHandler.scope = scope;
         };

         viewerHandler.open = function () {
            var viewBounds = viewer.viewport.getBounds();
            var oldBounds = viewerHandler.viewer.viewport.getBounds();
            var h = oldBounds.height / oldBounds.width;
            var newBounds = new OpenSeadragon.Rect(0, 0, 0, h);
            viewerHandler.viewer.viewport.fitBounds(newBounds, false);
         };

         viewerHandler.openPage = function (page) {
            var pageValue = page.userData;
            var pidx = 0;
            while(parsedData.getPages()[pidx] !== pageValue){
               pidx = pidx+1;
               if(pidx > parsedData.getPages().length){
                console.error('error in open page');
                break;
               }
            }
            var p = pidx;
            viewerHandler.viewer.goToPage(p);
            currPage = evtInterface.getState('currentPage');
                     if (pageValue !== currPage) {
                        viewerHandler.scope.$apply(function () {
                           evtInterface.updateState("currentPage", pageValue !== '' ? pageValue : currPage);
                        });
                     }
         };

         viewerHandler.home = function () {
            var oldBounds = viewerHandler.viewer.viewport.getBounds();
            var h = oldBounds.height / oldBounds.width;
            var newBounds = new OpenSeadragon.Rect(0, 0.1, 1, h);
            viewerHandler.viewer.viewport.fitBounds(newBounds, true);
         };

         viewerHandler.navigatorScroll = function (event) {
            if (event.scroll > 0) {
               // scroll-up
            } else {
               // scroll-down
            }
         };

         viewerHandler.pan = function (event) {
            try {
              
               if (event.immediately === undefined) {
               var newY = event.center.y;
               var oldY = event.eventSource.viewport._oldCenterY;
             
               if (viewerHandler.viewer.viewport.getZoom() === 1) {
                  var newPage, currPage;
                  var oldBounds = viewerHandler.viewer.viewport.getBounds();
                  if (newY > oldY) {
                     newPage = imageScrollMap.mapDown(event.eventSource.viewport.getBounds());
                     currPage = evtInterface.getState('currentPage');
                     if (newPage !== currPage) {
                        viewerHandler.scope.$apply(function () {
                           evtInterface.updateState('currentPage', newPage);
                        });
                     }
                  } else if (newY < oldY) {
                     newPage = imageScrollMap.mapUP(event.eventSource.viewport.getBounds());
                     currPage = evtInterface.getState('currentPage');
                     if (newPage !== currPage) {
                        viewerHandler.scope.$apply(function () {
                           evtInterface.updateState("currentPage", newPage !== '' ? newPage : currPage);
                        });
                     }
                  }
               }
            }} catch (err) {
               console.error('error in pan', err);

            }

         };

         viewerHandler.updateViewerBounds = function (page) {
            var oldBounds = viewerHandler.viewer.viewport.getBounds();
            if (!imageScrollMap.isInBounds(oldBounds.y, page)) {
               imageScrollMap.updateBounds(viewerHandler.viewer, page);
            }

         };


         viewerHandler.updateViewerPage = function (page) {
            var pageValue = page;
            var pidx = 0;
            while(parsedData.getPages()[pidx] !== pageValue){
               pidx = pidx+1;
               if(pidx > parsedData.getPages().length){
                break;
               }
            }
            var p = pidx;
            viewerHandler.viewer.goToPage(p);
            currPage = evtInterface.getState('currentPage');
                     if (pageValue !== currPage) {
                        viewerHandler.scope.$apply(function () {
                           evtInterface.updateState("currentPage", pageValue !== '' ? pageValue : currPage);
                        });
                     }
         };

         viewerHandler.highlightOverlay = function (zone) {
            if (!zone) {
               throw 'problem in zone data extraction';
            }

            try {
               viewerHandler.viewer.removeOverlay('line-overlay');
            } catch (error) {
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
            var tmp = {};
            tmp.x = _(zone.ulx);
            tmp.y = _(zone.uly);
            tmp.width = _(zone.lrx - zone.ulx);
            tmp.hight = _(zone.lry - zone.uly);
            return new OpenSeadragon.Rect(tmp.x / ImageNormalizationCoefficient, tmp.y / ImageNormalizationCoefficient, tmp.width / ImageNormalizationCoefficient, tmp.hight / ImageNormalizationCoefficient);
         }

         function _(value) {
            return value;
         }

         viewerHandler.moveToZone = function (zone) {
            var oldCenter = viewerHandler.viewer.viewport.getCenter();
            var currentBounds = viewerHandler.viewer.viewport.getBounds(true);
            var normalizedZoney = zone.uly/ImageNormalizationCoefficient;
            var newY = ((zone.uly / ImageNormalizationCoefficient) < oldCenter.y) ? oldCenter.y : zone.uly / ImageNormalizationCoefficient;
            var newCenter = new OpenSeadragon.Point(oldCenter.x, newY);
            viewerHandler.viewer.viewport.panTo(newCenter);
         };

         viewerHandler.showHotSpot = function (zones) {

            var rectObjs = [];
            for (var i = 0; i < zones.length; i++) {

               var r = new OpenSeadragon.Rect(
                  zones[i].ulx / ImageNormalizationCoefficient,
                  zones[i].uly / ImageNormalizationCoefficient,
                  (zones[i].lrx - zones[i].ulx) / ImageNormalizationCoefficient,
                  (zones[i].lry - zones[i].uly) / ImageNormalizationCoefficient);

               rectObjs.push(r);
            }

            var hrefElts = [];
            for (var j = 0; j < zones.length; j++) {
               var content = zones[j].content;
               var id = zones[j].id;
               var zone = zones[j];

               var hrefElt = document.createElement('div');
               hrefElt.id = 'hotspot-overlay_selected-' + id;
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
               hrefElts.push(hrefElt);
            }

            viewerHandler.viewer.zoomPerClick = 1;
            for (var k = 0; k < zones.length; k++) {
               viewerHandler.viewer.addOverlay({
                  element: hrefElts[k],
                  location: rectObjs[k],
               });
            }
         };

         var showDivHotSpot = function (elem) {
            if (!divHotSpotToggle) {
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

               var divElt = document.createElement('div');
               divElt.id = 'div-hotspot-overlay_selected-' + elem.dataset.id;
               divElt.className = 'hotspot-dida';        
               
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
               };

               closeIcon.onmouseout = function(){
                  viewerHandler.viewer.zoomPerClick = 1.5;
               };

               divCloser.appendChild(closeIcon);
               divTitleElt.appendChild(divCloser);

               var divBodyElt = document.createElement('div');
               divBodyElt.id = 'div-body-hotspot-overlay_selected-' + elem.dataset.id;
               divBodyElt.className = 'hotspot-dida-body';
               
               divBodyElt.innerHTML = elem.dataset.content;


               divElt.appendChild(divTitleElt);
               divElt.appendChild(divBodyElt);

               var OSDOverlay = {
                  element: divElt,
                  location: rect,
                  rotationMode: OpenSeadragon.OverlayRotationMode.NO_ROTATION,
               };

               divHotSpotToggle = !divHotSpotToggle;
               viewerHandler.viewer.addOverlay(OSDOverlay);
               $(OSDOverlay.element).draggable();
               
               
            }
            return divHotSpotToggle;
         };

         var hiddenDivHotSpot = function (elem) {
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
            try {
               for (var i = 0; i < zones.length; i++) {
                  viewerHandler.viewer.removeOverlay('hotspot-overlay_selected-' + zones[i].id);
               }
            } catch (error) {
               console.error('no hotspot overlay', error);
            }
         };

         viewerHandler.lineZone = function(zone){
            var rectObj = convertZoneToOSD(zone);
            var elt = document.createElement("div");
            elt.id = "line-div-overlay_"+zone.id;
            elt.dataset['lb'] = zone.id.replace('line','lb');
            elt.className = "line-overlay";

            elt.onmouseover = function(){
               var ITLactive = evtInterface.getToolState('ITL') === 'active';
               var currentViewMode = evtInterface.getState('currentViewMode');
               
               if (ITLactive && currentViewMode === 'imgTxt'){
                  this.className += ' selectedHighlight';
                  var elemsInLine = document.querySelectorAll('[data-line=\'' + this.dataset['lb'] + '\']');
                  if(elemsInLine.length == 0){
                     var dataLine = this.dataset['lb'].replace('reg','orig');
                     elemsInLine = document.querySelectorAll('[data-line=\'' + dataLine + '\']');
                  }
                  for(var i=0; i < elemsInLine.length; i++){
                     elemsInLine[i].className += ' lineHover';
                  }
               } 
            };

            elt.onmouseout = function(){
               var ITLactive = evtInterface.getToolState('ITL') === 'active';
               var currentViewMode = evtInterface.getState('currentViewMode');
               
               if (ITLactive && currentViewMode === 'imgTxt') {

                  this.className = this.className.replace(' selectedHighlight', '') || '';
                  var elemsInLine = document.querySelectorAll('[data-line=\'' + this.dataset['lb'] + '\']');
                  if(elemsInLine.length == 0){
                     var dataLine = this.dataset['lb'].replace('reg','orig');
                     elemsInLine = document.querySelectorAll('[data-line=\'' + dataLine + '\']');
                  }
                  for(var i=0; i < elemsInLine.length; i++){
                   elemsInLine[i].className = elemsInLine[i].className.replace(' lineHover', '') || '';
                  }
               }
            };

            elt.onclick = function(){
            };

            viewerHandler.viewer.addOverlay({
               element: elt,
               location: rectObj
            });

            return elt;
         };

         viewerHandler.testFun = function () {
            return 'ok';
         };
      });
})();
