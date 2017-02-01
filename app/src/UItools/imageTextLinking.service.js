angular.module('evtviewer.UItools')

.service('evtImageTextLinking', function(evtInterface, Utils) {
    var ITLutils = {};

    ITLutils.prepareLines = function() {
    	//TODO: Move function in proper service
        var lbs = document.getElementsByClassName('lb');
        for (var i = 0; i < lbs.length; i++) {
            //TODO: handle <lb> with _reg and _orig
            if (i === lbs.length-1) {
                // Ultima linea da gestire con riferimento diverso
                var nextElem = lbs[i].nextElementSibling;
                var lbId = lbs[i].id;
                while (nextElem && nextElem.className.indexOf('inLine') < 0) {
                    this.preapareElementInLine(nextElem, lbId);
                    nextElem = nextElem.nextElementSibling || lbs[i].parentNode.nextElementSibling || undefined;
                }
            } else {
                var lbStart = lbs[i],
                    lbEnd = lbs[i+1];
                //Todo: Handle _reg e _orig
                var lbId = lbStart.id;
                if (lbId) {
                    if (lbStart && lbEnd) {
                        var elems = Utils.DOMutils.getElementsBetweenTree(lbStart, lbEnd);
                        for (var el in elems) { 
                            this.preapareElementInLine(elems[el], lbId);
                        }
                    }
                }
            }
        }
    };

    ITLutils.preapareElementInLine = function(elementInLine, lineId) {
    	elementInLine.className += ' inLine';
        elementInLine.setAttribute("data-line", lineId); 
        elementInLine.onmouseover = function() { 
            var lineId = this.getAttribute("data-line");
            var elemsInSameLine = document.querySelectorAll("[data-line='"+lineId+"']"); 
            for (var i = 0; i < elemsInSameLine.length; i++) { 
                elemsInSameLine[i].className += " lineHover";
            } 
        };
        elementInLine.onmouseout = function() {
            var lineId = this.getAttribute("data-line");
            var elemsInSameLine = document.querySelectorAll("[data-line='"+lineId+"']"); 
            for (var i = 0; i < elemsInSameLine.length; i++) { 
                elemsInSameLine[i].className = elemsInSameLine[i].className.replace(" lineHover", "") || "";
            } 
        }; 
        elementInLine.onclick = function() { 
            var lineId = this.getAttribute("data-line"),
                currentHzone = evtInterface.getCurrentHighlightZone();

            if (currentHzone && currentHzone.name === 'lb') {
                // Deselect current selected
                var currentSelected = document.querySelectorAll("[data-line='" + currentHzone.id + "']"); 
                for (var i = 0; i < currentSelected.length; i++) {
                    currentSelected[i].className = currentSelected[i].className.replace(" lineSelected", "") || "";
                }    
            }
            
            // Select this and set current
            if (!currentHzone || (currentHzone.name === 'lb' && currentHzone.id !== lineId)) {
                evtInterface.updateCurrentHighlightZone({ name: 'lb', id: lineId } );
                var elemsInSameLine = document.querySelectorAll("[data-line='"+lineId+"']"); 
                for (var i = 0; i < elemsInSameLine.length; i++) { 
                    elemsInSameLine[i].className += " lineSelected";
                } 
            } else {
                evtInterface.updateCurrentHighlightZone(undefined);

            }
        };
    }

    return ITLutils;
});