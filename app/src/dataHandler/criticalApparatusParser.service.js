angular.module('evtviewer.dataHandler')

.service('evtCriticalApparatusParser', function($q, parsedData, evtParser, xmlParser, config, evtCriticalElementsParser) {
    var parser = {};

    var apparatusEntryDef     = '<app>',
        lemmaDef              = '<lem>',
        readingDef            = lemmaDef+', <rdg>',
        readingGroupDef       = '<rdgGrp>',
        quoteDef              = '<quote>';
    var skipFromBeingParsed   = '<evt-reading>,<pb>,'+apparatusEntryDef+','+readingDef+','+readingGroupDef+','+quoteDef, //Da aggiungere anche <evt-source>, quando lo avrai creato.
        skipWitnesses         = config.skipWitnesses.split(',').filter(function(el) { return el.length !== 0; });

    // Al momento ho usato solo questa variabile

    
    //Queste due le userò appena inizierò a parsare le fonti
    var sourceDef = '<cit>';
    var sourcesUrl = ''; // Parsing di più documenti


    parser.findCriticalEntryById = function(doc, appId){
        if ( doc !== undefined ) {
            var appSelector = appId.replace(/\w-/g, '$&0>').replace(/[0-9]+/g, ':eq($&)').replace(/-:eq/g, ':eq');
            var appElement = $(doc).find(appSelector);
            evtCriticalElementsParser.handleAppEntry(appElement.get(0));
        } else {
            console.log('ERROR');
        }
    };
    /* ******************** */
    /* parseListWit(listWit) */
    /* ********************************************************** */
    /* Function to parse a list of witnesses                      */
    /* @return a json object containing the list info read        */
    /* ********************************************************** */
    var parseListWit = function(doc, listWit) {
        var skipWitnesses = config.skipWitnesses.split(',').filter(function(el) { return el.length !== 0; });
        var list = {
            id      : listWit.getAttribute('xml:id'),
            name    : '',
            content : [],
            _type   : 'group',
            _group  : undefined,
            text    : {}
        };

        // Added to handle the listWit of a version (@author -> CM)
        var ver;
        if (config.versions !== undefined && config.versions.length > 1) {
            if (listWit.hasAttribute('ana')) {
                var anaVal = listWit.getAttribute('ana').replace('#', '');
                if (config.versions.indexOf(anaVal) >= 0 ) {
                    ver = anaVal;
                }
            }
        }
        
        angular.forEach(listWit.childNodes, function(child){
            if (child.nodeType === 1) {
                if (child.tagName === 'head') {
                    list.name = child.innerHTML;
                }
                else if (config.listDef.indexOf('<'+child.tagName+'>') >= 0) { //group
                    if (skipWitnesses.indexOf(list.id) < 0){
                        var subList = parseListWit(doc, child);
                        subList._group = list.id;
                        parsedData.addElementInWitnessCollection(subList);
                        list.content.push(subList.id);
                    }
                } 
                else if (config.versionDef.indexOf('<'+child.tagName+'>') >= 0){ //witness
                    var witnessElem = {
                        id          : child.getAttribute('xml:id'),
                         attributes  : evtParser.parseElementAttributes(child),
                        description : evtParser.parseXMLElement(doc, child, {skip: ''}),
                        _group      : list.id,
                        _type       : 'witness'
                    };
                    if (skipWitnesses.indexOf(witnessElem.id) < 0){
                        parsedData.addElementInWitnessCollection(witnessElem);
                        list.content.push(witnessElem.id);
                        // Add the witness to the witMap of the versionEntries collection (@author -> CM)
                        if (ver !== undefined) {
                            parsedData.addVersionWitness(ver, witnessElem.id);
                        }                        
                    }
                }
            }
        });
        return list;
    };

    /* ******************** */
    /* parseWitnesses(doc) */
    /* ********************************************************** */
    /* Function to parse a the witnesses existing in the XML file */
    /* and save them in parsedData                                 */
    /* @doc document -> XML to be parsed                          */
    /* ********************************************************** */
    parser.parseWitnesses = function(doc) {
        var skipWitnesses = config.skipWitnesses.split(',').filter(function(el) { return el.length !== 0; });
        var currentDocument = angular.element(doc);
        if (currentDocument.find(config.listDef.replace(/[<>]/g, '')).length > 0) {
            angular.forEach(currentDocument.find(config.listDef.replace(/[<>]/g, '')), 
                function(element) {
                    if ( !evtParser.isNestedInElem(element, element.tagName) ) {
                        angular.forEach(element.childNodes, function(child){
                            if (child.nodeType === 1) {
                                var el = {};
                                el.id = child.getAttribute('xml:id');
                                if (skipWitnesses.indexOf(el.id) < 0) {
                                    if (config.listDef.indexOf('<'+child.tagName+'>') >= 0) { // group
                                        el = parseListWit(doc, child);
                                    } else if (config.versionDef.indexOf('<'+child.tagName+'>') >= 0) { // witness
                                        el = {
                                            id          : child.getAttribute('xml:id'),
                                            description : evtParser.parseXMLElement(doc, child, {skip: ''}),
                                            _group      : undefined,
                                            _type       : 'witness',
                                            text        : {}
                                        };

                                        // Added to handle the listWit of a version (@author -> CM)
                                        var ver;
                                        if (config.versions !== undefined && config.versions.length > 1) {
                                            if (child.hasAttribute('ana')) {
                                                var anaVal = child.getAttribute('ana').replace('#', '');
                                                if (config.versions.indexOf(anaVal) >= 0 ) {
                                                    ver = anaVal;
                                                }
                                            }
                                        }
                                        // Add the witness to the witMap of the versionEntries collection (@author -> CM)
                                        if (ver !== undefined) {
                                            parsedData.addVersionWitness(ver, el.id);
                                        }
                                    }
                                    parsedData.addElementInWitnessCollection(el);
                                }
                            }
                        });
                    }
            });
        } else {
            console.log('WARNING: '+config.listDef+' missing. Please add this element to make EVT work properly with different witnesses.');
        }
        // console.log('## Witnesses ##', JSON.stringify(parsedData.getWitnesses()));
        console.log('## Witnesses ##', parsedData.getWitnesses());
    };

    /* ************************* */
    /* parseCriticalEntries(doc) */
    /* ***************************************************************** */
    /* Function to parse a the critical entries existing in the XML file */
    /* and save them in parsedData                                       */
    /* @doc document -> XML to be parsed                                 */
    /* ***************************************************************** */
    // It searches for <app> elements and for each one of them
    // it calls the function handleAppEntry(element)
    // and add the json object generated into parsedData with the function parsedData.addCriticalEntry();
    parser.parseCriticalEntries = function(doc) {
        parsedData.resetCriticalEntries();
        var deferred = $q.defer();
        var currentDocument = angular.element(doc);
        angular.forEach(currentDocument.find(apparatusEntryDef.replace(/[<>]/g, '')), 
            function(element) {
                //TODO: if-else per handleRecensioEntry
                if (!element.hasAttribute('type') || (element.getAttribute('type') !== 'recensio')){
                    evtCriticalElementsParser.handleAppEntry(element);
                }
            });
        // console.log('## Critical entries ##', JSON.stringify(parsedData.getCriticalEntries()));
        parsedData.setCriticalEntriesLoaded(config.loadCriticalEntriesImmediately);
        console.log('## Critical entries ##', parsedData.getCriticalEntries());
        deferred.resolve('success');
        return deferred;
    };

    /****************************/
    /* parseVersionEntries(doc) */
    /****************************************************************************/
    /* Function to parse the critical entries that contain passages that differ */
    /* in two or more versions of the text.                                     */
    /* @doc --> XML file encoded by the editor    |     @author --> CM          */
    /****************************************************************************/
    parser.parseVersionEntries = function(doc) {
        var deferred = $q.defer(),
            currentDocument = angular.element(doc);
        
        angular.forEach(currentDocument.find(apparatusEntryDef.replace(/[<>]/g, '')+'[type=recensio]'), function(element) {
            evtCriticalElementsParser.handleVersionEntry(element);
        });
        
        console.log('## Version Entries ##', parsedData.getVersionEntries());
        
        deferred.resolve('success');
        return deferred;
    };

    /* ******* */
    /* WITNESS */
    /* ******* */
    parser.containsWitnessReading = function(elem, witObj) {
        if (elem === null) {
            return false;
        } else {
            return (witObj.group !== undefined && elem.indexOf('#'+witObj.group) >= 0) || (elem.indexOf('#') >= 0 && elem.indexOf('#'+witObj.id) >= 0) || elem.indexOf(witObj.id) >= 0;
        }
    };

    /* ************************************* */
    /* parseWitnessPageBreaks(docDOM, wit) */
    /* ******************************************************************************** */
    /* Function to parse page breaks and select only those of the specified witness     */
    /* @docDOM -> XML to be parsed                                                      */
    /* @wit -> witness specified                                                        */
    /* ******************************************************************************** */
    // It will look for XML element representing a page break (<pb> in XML-TEI P5)
    // – if they belong the the specified witness they will be replaced with a <span> element
    // - otherwise they will be removed
    parser.parseWitnessPageBreaks = function(docDOM, witObj) {
        var pbs = docDOM.getElementsByTagName('pb'),
            k   = 0;
        while ( k < pbs.length) {
            var pbNode = pbs[k];
            if (parser.containsWitnessReading(pbNode.getAttribute('ed'), witObj)){
                var newPbElem = document.createElement('span'),
                    id;
                if (pbNode.getAttribute('ed')) {
                    id  = pbNode.getAttribute('xml:id') || pbNode.getAttribute('ed').replace('#', '')+'-'+pbNode.getAttribute('n') || 'page_'+k;
                } else {
                    id  = pbNode.getAttribute('xml:id') || 'page_'+k;
                }
                newPbElem.className = 'pb';
                newPbElem.setAttribute('data-wit', pbNode.getAttribute('ed'));
                newPbElem.setAttribute('data-id', id);
                newPbElem.setAttribute('id', 'pb_'+id);
                newPbElem.textContent = pbNode.getAttribute('n');
                pbNode.parentNode.replaceChild(newPbElem, pbNode);
            } else {
                pbNode.parentNode.removeChild(pbNode); 
            }
        }
    };

    /* ******************************** */
    /* parseWitnessLacunas(docDOM, wit) */
    /* ********************************** */
    /* Function to parse lacuna start/end */
    /* @docDOM -> XML to be parsed        */
    /* @wit -> witness specified          */
    /* ********************************** */
    parser.parseWitnessLacunas = function(docDOM, wit) {
        var startLacunas = docDOM.getElementsByTagName('lacunaStart'),
            endLacunas   = docDOM.getElementsByTagName('lacunaEnd'),
            startLacunasWit = [],
            endLacunasWit   = [], 
            appId,
            readingId,
            readingWits;
        for (var i = 0; i < startLacunas.length; i++) {
            appId       = startLacunas[i].parentNode.getAttribute('data-app-id');
            readingId   = startLacunas[i].parentNode.getAttribute('data-reading-id');
            readingWits = parsedData.getCriticalEntryById(appId).content[readingId].wits;
            if (readingWits !== undefined) {
                if (readingWits.indexOf(wit) >= 0) {
                    startLacunasWit.push(startLacunas[i]);
                }
            }
        }
        for (var j = 0; j < endLacunas.length; j++) {
            appId       = endLacunas[j].parentNode.getAttribute('data-app-id');
            readingId   = endLacunas[j].parentNode.getAttribute('data-reading-id');
            readingWits = parsedData.getCriticalEntryById(appId).content[readingId].wits;
            if (readingWits !== undefined) {
                if (readingWits.indexOf(wit) >= 0) {
                    endLacunasWit.push(endLacunas[j]);
                }
            }
        }
        if (startLacunasWit.length === endLacunasWit.length) {
            for(var k = startLacunasWit.length-1; k >= 0; k--) {
                var appStart = startLacunasWit[k].parentNode, 
                    appEnd   = endLacunasWit[k].parentNode;
                
                var appStartId = appStart.getAttribute('data-app-id'),
                    appEndId   = appEnd.getAttribute('data-app-id');
                
                var match = '<evt-reading.*data-app-id.*'+appStartId+'.*<\/evt-reading>(.|[\r\n])*?<evt-reading.*data-app-id.*'+appEndId+'.*<\/evt-reading>';
                var sRegExInput = new RegExp(match, 'ig'),
                    newHTML     = '<span data-app-id-start="'+appStartId+'" data-app-id-end="'+appEndId+'" class="lacuna">[LACUNA]</span>';
                docDOM.innerHTML = docDOM.innerHTML.replace(sRegExInput, newHTML);
                docDOM.innerHTML = evtParser.balanceXHTML(docDOM.innerHTML);
            }
        } else {
            docDOM.innerHTML = '<span class="error">{{ \'MESSAGES.ERROR_IN_PARSING_LACUNA\' | translate }}</span>';
        }
    };

    /* ************************************ */
    /* isFragmentaryWitness(docDOM, wit) */
    /* ********************************************************** */
    /* Function to check if a witness is a fragmentary one or not */
    /* ********************************************************** */
    parser.isFragmentaryWitness = function(docDOM, wit){
        try {
            if (docDOM.querySelectorAll('witStart[wit*=\'#'+wit+'\']').length > 0) {
                return true;
            } else if (docDOM.querySelectorAll('rdg[wit*=\'#'+wit+'\'] witStart:not([wit]').length > 0 || 
                       docDOM.querySelectorAll('lem[wit*=\'#'+wit+'\'] witStart:not([wit]').length > 0 ) {
                return true;
            } else {
                return false;
            }
        } catch(err) {
            return false;
        }
    };

    /* ******************************************* */
    /* parseFragmentaryWitnessText(docDOM, witObj) */
    /* ********************************************* */
    /* Function to parse text of fragmentary witness */
    /* ********************************************* */
    parser.parseFragmentaryWitnessText = function(docDOM, wit) {
        var starts = docDOM.getElementsByTagName('witStart'),
            ends   = docDOM.getElementsByTagName('witEnd'),
            startsWit = [],
            endsWit   = [],
            appId,
            readingId,
            readingWits;
        for (var i = 0; i < starts.length; i++) {
            appId       = starts[i].parentNode.getAttribute('data-app-id');
            readingId   = starts[i].parentNode.getAttribute('data-reading-id');
            readingWits = parsedData.getCriticalEntryById(appId).content[readingId].wits;
            if (readingWits !== undefined) {
                if (readingWits.indexOf(wit) >= 0) {
                    startsWit.push(starts[i]);
                }
            }
        }
        for (var j = 0; j < ends.length; j++) {
            appId       = ends[j].parentNode.getAttribute('data-app-id');
            readingId   = ends[j].parentNode.getAttribute('data-reading-id');
            readingWits = parsedData.getCriticalEntryById(appId).content[readingId].wits;
            if (readingWits !== undefined) {
                if (readingWits.indexOf(wit) >= 0) {
                    endsWit.push(ends[j]);
                }
            }
        }
        var fragmentaryText = '';
        if (starts.length === ends.length) {
            for(var k = startsWit.length-1; k >= 0; k--) {
                var appStart = startsWit[k].parentNode,
                    appEnd   = endsWit[k].parentNode;

                var appStartId = appStart.getAttribute('data-app-id'),
                    appEndId   = appEnd.getAttribute('data-app-id');
                
                var match = '<evt-reading data-app-id="'+appStartId+'.*<\/evt-reading>(.|[\r\n])*?<evt-reading data-app-id.*'+appEndId+'.*<\/evt-reading>';
                var sRegExInput = new RegExp(match, 'ig'); 
                fragmentaryText = '<span class="fragment fragment-start"></span>'+(docDOM.innerHTML.match(sRegExInput))+'<span class="fragment fragment-end"></span>'+fragmentaryText;
            }
            return fragmentaryText;
        } else {
            return '<span class="error">{{ \'MESSAGES.ERROR_IN_PARSING_FRAGMENTARY_TEXT\' | translate }}</span>';
        }
    };

    return parser;
});