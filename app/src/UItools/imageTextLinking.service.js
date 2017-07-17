/**
 * @ngdoc service
 * @module evtviewer.UItools
 * @name evtviewer.UItools.evtImageTextLinking
 * @description 
 * # evtImageTextLinking
 * TODO: Add description and comments for every method
**/
angular.module('evtviewer.UItools')

.service('evtImageTextLinking', function(evtInterface, Utils, parsedData) {
    var ITLutils = {};

    ITLutils.turnOnITL = function() {
        this.activateITL();
        evtInterface.setToolState('ITL', 'active');
    };

    ITLutils.turnOffITL = function() {
        this.deactivateITL();
        evtInterface.setToolState('ITL', 'inactive');
        evtInterface.updateCurrentHighlightZone(undefined);
    };

    ITLutils.activateITL = function() {
        this.prepareLines();
        this.prepareZoneInImgInteractions();
    };

    ITLutils.deactivateITL = function() {
        var currentHzone = evtInterface.getCurrentHighlightZone();
        // Deselect current selected
        if (currentHzone) {
            this.changeLinesHighlightStatus(currentHzone.id, 'unselect');
        }
        resetTextNodes();
    };

    /* ***************************************************************************
     * @ngdoc method                                                             *
     * @name evtImageTextLinkingService#prepareLines                             *
     * @param {void}                                                             *
     *                                                                           *
     * Prepare Lines for Image text linking to work properly                     *
     * Find elements between two different <lb/>s and add info about line.       *
     * Text Node are tranformed into <span class="textNode"> in order to be able *
     * to add/remove "lineHover" and "lineSelected" classes                      *
     *                                                                           *
     * @return {void}                                                            *
     * ************************************************************************* */
    ITLutils.prepareLines = function() {
        var lbs = document.getElementsByClassName('lb');
        for (var i = 0; i < lbs.length; i++) {
            var lbId;
            //TODO: handle <lb> with _reg and _orig
            if (i === lbs.length - 1) {
                // Ultima linea da gestire con riferimento diverso
                var nextElem = lbs[i].nextSibling;
                lbId = lbs[i].id;
                while (nextElem && (nextElem.nodeType === 3 || (nextElem.className && nextElem.className.indexOf('inLine') < 0))) {
                    if (nextElem.nodeType === 3) {
                        var newNextTextNode = document.createElement('span');
                        newNextTextNode.className = 'textNode';
                        newNextTextNode.textContent = nextElem.textContent;
                        nextElem.parentElement.replaceChild(newNextTextNode, nextElem);
                        nextElem = newNextTextNode;
                    }
                    preapareElementInLine(nextElem, lbId);
                    nextElem = nextElem.nextSibling || lbs[i].parentNode.nextSibling || undefined;
                }
            } else {
                var lbStart = lbs[i],
                    lbEnd = lbs[i + 1];
                //Todo: Handle _reg e _orig
                lbId = lbStart.id;
                if (lbId) {
                    if (lbStart && lbEnd) {
                        var elems = Utils.DOMutils.getElementsBetweenTree(lbStart, lbEnd);
                        for (var el in elems) {
                            var elementInLine = elems[el];
                            if (elementInLine.nodeType === 3) {
                                var newTextNode = document.createElement('span');
                                newTextNode.className = 'textNode';
                                newTextNode.textContent = elementInLine.textContent;
                                elementInLine.parentElement.replaceChild(newTextNode, elementInLine);
                                elementInLine = newTextNode;
                            }
                            preapareElementInLine(elementInLine, lbId);
                        }
                    }
                }
            }
        }
    };

    /* ***********************************************************************
     * @ngdoc method                                                         *
     * @name evtImageTextLinkingService#preapareElementInLine                *
     * @param {element} elementInLine element that rests inside a line       *
     * @param {string} lineId id of line in qhich element appears            *
     * Prepare Element that appear in a particular line by adding            *
     * class "inLine" and an attribute data-line with line ID reference      *
     * @return {void}                                                        *
     * ********************************************************************* */
    var preapareElementInLine = function(elementInLine, lineId) {
        if (elementInLine.className && elementInLine.className.indexOf('inLine') < 0) {
            elementInLine.className += ' inLine';
            elementInLine.setAttribute('data-line', lineId);
            elementInLine.onmouseover = function() {
                var lineId = this.getAttribute('data-line');
                ITLutils.changeLinesHighlightStatus(lineId, 'over');
            };
            elementInLine.onmouseout = function() {
                var lineId = this.getAttribute('data-line');
                ITLutils.changeLinesHighlightStatus(lineId, 'out');
            };
            elementInLine.onclick = function() {
                var lineId = this.getAttribute('data-line'),
                    currentHzone = evtInterface.getCurrentHighlightZone();

                if (currentHzone && currentHzone.name === 'Line') {
                    // Deselect current selected
                    ITLutils.changeLinesHighlightStatus(currentHzone.id, 'unselect');
                }

                // Select this and set current
                if (!currentHzone || (currentHzone.name === 'Line' && currentHzone.id !== lineId)) {
                    evtInterface.updateCurrentHighlightZone({
                        name: 'Line',
                        id: lineId
                    });
                    ITLutils.changeLinesHighlightStatus(lineId, 'select');
                } else {
                    evtInterface.updateCurrentHighlightZone(undefined);
                }
            };
        }
    };

    /* *********************************************************** *
     * @ngdoc method                                               *
     * @name evtImageTextLinkingService#resetTextNodes             *
     * @param {void}                                               *
     * Transform back <span class="textNode"> into actual textNode *
     * *********************************************************** */
    var resetTextNodes = function() {
        var textNodes = document.getElementsByClassName('textNode');
        for (var i in textNodes) {
            var element = textNodes[i];
            if (element.textContent) {
                var newTextNode = document.createTextNode(element.textContent);
                element.parentElement.replaceChild(newTextNode, element);
            }
        }
    };

    /* ************************************************************************************ *
     * @ngdoc method                                                                        *
     * @name evtImageTextLinkingService#changeLinesHighlightStatus                          *   
     * @param {string} lineId id line of line to change                                     *              
     * @param {string} statusToSet new status of line ['over', 'out', 'select', 'unselect'] *
     * Change status of elements in a particupar line                                       *
     * possible statuses are 'over', 'out', 'select', 'unselect'                            *
     * ************************************************************************************ */
    ITLutils.changeLinesHighlightStatus = function(lineId, statusToSet) {
        var ITLactive = evtInterface.getToolState('ITL') === 'active',
            currentViewMode = evtInterface.getCurrentViewMode();
        if (ITLactive && currentViewMode === 'imgTxt') {
            var elemsInLine = document.querySelectorAll('[data-line=\'' + lineId + '\']');
            for (var i = 0; i < elemsInLine.length; i++) {
                switch (statusToSet) {
                    case 'over':
                        elemsInLine[i].className += ' lineHover';
                        break;
                    case 'out':
                        elemsInLine[i].className = elemsInLine[i].className.replace(' lineHover', '') || '';
                        break;
                    case 'select':
                        elemsInLine[i].className += ' lineSelected';
                        break;
                    case 'unselect':
                        elemsInLine[i].className = elemsInLine[i].className.replace(' lineSelected', '') || '';
                        break;
                    default:
                        break;
                }
            }
        }
    };

    /* ***************************************************************************************** *
     * @ngdoc method                                                                             *
     * @name evtImageTextLinkingService#prepareZoneInImgInteractions                             *   
     * @param {void}                                                                             *
     * Prepare Zone in image that hase to be selected when user interacts with a particupar line *
     * possible statuses are 'over', 'out', 'select', 'unselect'                                 *
     * TO BE FINISHED WHEN WE HAVE A REAL VIEWER                                                 *
     * @return {void}                                                                            *
     * ***************************************************************************************** */
    ITLutils.prepareZoneInImgInteractions = function() {
        var zones = document.getElementsByClassName('zoneInImg');
        for (var i = 0; i < zones.length; i++) {
            var zone = zones[i];

            zone.onmouseover = zoneMouseOver;

            zone.onmouseout = zoneMouseOut;

            zone.onclick = zoneClick;
        }
    };

    var zoneMouseOver = function() {
        var zoneId = this.getAttribute('data-corresp-id');
        ITLutils.changeLinesHighlightStatus(zoneId, 'over');
    };

    var zoneMouseOut = function() {
        var zoneId = this.getAttribute('data-corresp-id');
        ITLutils.changeLinesHighlightStatus(zoneId, 'out');
    };

    var zoneClick = function() {
        var zoneId = this.getAttribute('data-corresp-id'),
            zoneName = this.getAttribute('data-zone-name'),
            currentHzone = evtInterface.getCurrentHighlightZone();

        // Deselect current selected
        if (currentHzone) {
            ITLutils.changeLinesHighlightStatus(currentHzone.id, 'unselect');
        }

        // Select this and set current
        if (!currentHzone || (currentHzone.name === zoneName && currentHzone.id !== zoneId)) {
            evtInterface.updateCurrentHighlightZone({
                name: zoneName,
                id: zoneId
            });
            ITLutils.changeLinesHighlightStatus(zoneId, 'select');
        } else {
            evtInterface.updateCurrentHighlightZone(undefined);
        }
    };
    
    ITLutils.highlightZoneInImage = function(zoneId) {
        var zone = parsedData.getZone(zoneId);
        if (zone) {
            console.log('## HIGHLIGHT ZONE : ', zone);
        }
    };

    return ITLutils;
});