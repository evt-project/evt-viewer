angular.module('evtviewer.dataHandler')

.service('evtCriticalParser', function($q, parsedData, evtParser, xmlParser, config) {
    var parser = {};

    var apparatusEntryDef     = '<app>',
        lemmaDef              = '<lem>',
        readingDef            = lemmaDef+', <rdg>',
        readingGroupDef       = '<rdgGrp>';
    var skipFromBeingParsed   = '<evt-reading>,<pb>,'+apparatusEntryDef+','+readingDef+','+readingGroupDef,
        skipWitnesses         = config.skipWitnesses.split(',').filter(function(el) { return el.length !== 0; });

    parser.findCriticalEntryById = function(doc, appId){
        if ( doc !== undefined ) {
            var appSelector = appId.replace(/\w-/g, '$&0>').replace(/[0-9]+/g, ':eq($&)').replace(/-:eq/g, ':eq');
            var appElement = $(doc).find(appSelector);
            handleAppEntry(appElement.get(0));
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
        var list = {
            id      : listWit.getAttribute('xml:id') || evtParser.xpath(listWit).substr(1),
            name    : '',
            content : [],
            _type   : 'group',
            _group  : undefined,
            text    : {}
        };
        
        angular.forEach(listWit.childNodes, function(child){
            if (child.nodeType === 1) {
                if (child.tagName === 'head') {
                    list.name = child.innerHTML;
                }
                else if (config.listDef.indexOf(child.tagName) >= 0) { //group
                    var subList = parseListWit(doc, child);
                    subList._group = list.id;
                    parsedData.addElementInWitnessCollection(subList);
                    list.content.push(subList.id);
                } 
                else if (config.versionDef.indexOf(child.tagName) >= 0){ //witness
                    var witnessElem = {
                        id          : child.getAttribute('xml:id'),
                        description : evtParser.parseXMLElement(doc, child, ''),
                        _group      : list.id,
                        _type       : 'witness'
                    };
                    if (skipWitnesses.indexOf(witnessElem.id) < 0){
                        parsedData.addElementInWitnessCollection(witnessElem);
                        list.content.push(witnessElem.id);
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
        var currentDocument = angular.element(doc);
        if (currentDocument.find(config.listDef).length > 0) {
            angular.forEach(currentDocument.find(config.listDef), 
                function(element) {
                    if ( !evtParser.isNestedInElem(element, element.tagName) ) {
                        angular.forEach(element.childNodes, function(child){
                            if (child.nodeType === 1) {
                                var el = {};
                                
                                if (config.listDef.indexOf(child.tagName) >= 0) { // group
                                    el = parseListWit(doc, child);
                                } else if (config.versionDef.indexOf(child.tagName) >= 0) { // witness
                                    el = {
                                        id          : child.getAttribute('xml:id'),
                                        description : evtParser.parseXMLElement(doc, child, ''),
                                        _group      : undefined,
                                        _type       : 'witness',
                                        text        : {}
                                    };
                                }
                                parsedData.addElementInWitnessCollection(el);
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
    /* parseGenericElement(elem) */
    /* ******************************************************************** */
    /* Function to parse a generic XML element inside the apparatus reading */
    /* @elem element -> xml element to be parsed                            */
    /* @return a json object representing the apparatus reading             */
    /* ******************************************************************** */
    var parseGenericElement = function(elem) {
        if (config.lacunaMilestone.indexOf('<'+elem.tagName+'>') < 0 && config.fragmentMilestone.indexOf('<'+elem.tagName+'>') < 0) {
            var genericElement = {
                tagName    : elem.tagName,
                type       : 'genericElement',
                attributes : [],
                content    : []
            };
            
            if (elem.attributes) {
                for (var i = 0; i < elem.attributes.length; i++) {
                    var attrib = elem.attributes[i];
                    if (attrib.specified) {
                        genericElement.attributes[attrib.name] = attrib.value;
                    }
                }
            }

            angular.forEach(elem.childNodes, function(child) {
                if (child.nodeType === 3) {
                    if (child.textContent.trim() !== '') {
                        genericElement.content.push(child.textContent.trim());
                    }
                } else {
                    if ('<'+child.tagName+'>' === apparatusEntryDef) {
                        // Sub apparatus
                        var entryApp = handleAppEntry(child);
                        genericElement.content.push({id: entryApp.id, type: 'subApp'});
                    } else {
                        if (config.fragmentMilestone.indexOf(child.tagName) >= 0 && child.getAttribute('wit') === null) {
                            var fragmentSigla = elem.getAttribute('wit');
                            child.setAttribute('wit', fragmentSigla);
                        }

                        if (config.lacunaMilestone.indexOf(child.tagName) >= 0 && child.getAttribute('wit') === null) {
                            var lacunaSigla = elem.getAttribute('wit');
                            child.setAttribute('wit', lacunaSigla);
                        }
                        if (angular.element(child).find(apparatusEntryDef.replace(/[<>]/g, ''))){
                            genericElement.content.push(parseGenericElement(child));
                        } else {
                            genericElement.content.push(child.cloneNode(true));
                        }
                    }
                }
            });
            return genericElement;    
        } else {
            return elem;
        }
        
    };
    /* ********************* */
    /* parseAppReading(elem) */
    /* ******************************************************************* */
    /* Function to parse the XML element representing an apparatus reading */
    /* (<lem> o <rdg> in XML-TEI P5)                                       */
    /* @elem element -> xml element to be parsed                           */
    /* @return a json object representing the apparatus reading            */
    /* ******************************************************************* */
    var parseAppReading = function(entry, elem){
        var reading = {
            id           : '',
            attributes   : [],
            content      : [
                //text
                //node
                //subapp { id, type='subApp'}
            ],
            note         : '',
            _significant : true,
            _group       : undefined,
            _xmlTagName  : elem.tagName,
            _xmlSource   : elem.outerHTML
        };

        var id;
        if (elem.getAttribute('xml:id')) {
            id = 'rdg_'+elem.getAttribute('xml:id');
        } else {
            id = evtParser.xpath(elem).substr(1);
        }
        reading.id = id;

        for (var i = 0; i < elem.attributes.length; i++) {
            var attrib = elem.attributes[i];
            if (attrib.specified) {
                reading.attributes[attrib.name] = attrib.value;
                
                if (attrib.name === 'wit' || attrib.name === 'source') {
                    var wits = attrib.value.split('#').filter(function(el) { return el.length !== 0; });
                    reading.wits = [];
                    for(var s in wits){
                        var sigla = wits[s].replace(' ', '');
                        if (parsedData.getWitness(sigla) !== undefined) { //exclude siglas without reference
                            if (parsedData.isWitnessesGroup(sigla)) {
                                var witsInGroup = parsedData.getWitnessesInGroup(sigla);
                                reading.wits.push.apply(reading.wits, witsInGroup);
                                for (var wit in witsInGroup) {
                                    if (entry._indexes.witMap[witsInGroup[wit]] === undefined){
                                        entry._indexes.witMap[witsInGroup[wit]] = id;
                                    }
                                }
                            } else {
                                reading.wits.push(sigla);
                                if (entry._indexes.witMap[sigla] === undefined){
                                    entry._indexes.witMap[sigla] = id;
                                }
                            }
                        }
                    }
                }
                if (reading._significant) {
                    if (config.notSignificantVariant.indexOf('['+attrib.name+'='+attrib.value+']') >= 0) {
                        reading._significant = false;
                    }
                }
                parsedData.addCriticalEntryFilter(attrib.name, attrib.value);
            }
        }

        angular.forEach(elem.childNodes, function(child) {
            if (child.nodeType === 3) {
                if (child.textContent.trim() !== '') {
                    reading.content.push(child.textContent.trim());
                }
            } else {
                if (child.tagName === 'note') {
                    reading.note = child.innerHTML;
                } else if ( apparatusEntryDef.indexOf('<'+child.tagName+'>') >= 0 ) {
                    // Sub apparatus
                    var entryApp = handleAppEntry(child, entry.id);
                    reading.content.push({id: entryApp.id, type: 'subApp'});
                    entry._indexes.subApps.push(entryApp.id);
                } else {
                    if (reading._significant) {
                        if (config.notSignificantVariant.indexOf('<'+child.tagName+'>') >= 0) {
                            reading._significant = false;
                        }
                    }
                    if (config.fragmentMilestone.indexOf(child.tagName) >= 0 && child.getAttribute('wit') === null) {
                        var fragmentSigla = elem.getAttribute('wit');
                        child.setAttribute('wit', fragmentSigla);
                    }

                    if (config.lacunaMilestone.indexOf(child.tagName) >= 0 && child.getAttribute('wit') === null) {
                        var lacunaSigla = elem.getAttribute('wit');                        
                        child.setAttribute('wit', lacunaSigla);
                    }
                    if (angular.element(child).find(apparatusEntryDef.replace(/[<>]/g, ''))){
                        reading.content.push(parseGenericElement(child));
                    } else {
                        reading.content.push(child.cloneNode(true));
                    }
                }
            }
        });
        
        return reading;
    };

    /* ****************************** */
    /* parseGroupReading(entry, elem) */
    /* ************************************************************************* */
    /* Function to parse the XML element representing an apparatus reading group */
    /* (<rdgGrp> in XML-TEI P5)                                                  */
    /* @entry element -> json element representing parent apparatus entry        */
    /* @elem element -> xml element to be parsed                                 */
    /* @return void                                                              */
    /* ************************************************************************* */
    var parseGroupReading = function(entry, elem) {
        var groupObj = {
            attributes : [],
            content    : []
        };

        var id;
        if (elem.getAttribute('xml:id')) {
            id = 'rdg_'+elem.getAttribute('xml:id');
        } else {
            id = evtParser.xpath(elem).substr(1);
        }
        groupObj.id = id;

        angular.forEach(elem.childNodes, function(child) {
            if (readingDef.indexOf('<'+child.tagName+'>') >= 0) {
                var readingObj = parseAppReading(entry, child);
                readingObj._group = groupObj.id;
                groupObj.content.push(readingObj.id);
                
                for (var i = 0; i < elem.attributes.length; i++) {
                    var attrib = elem.attributes[i];
                    if (attrib.specified) {
                        groupObj.attributes[attrib.name] = attrib.value;
                        if (readingObj.attributes[attrib.name] === undefined) {
                            readingObj.attributes[attrib.name] = attrib.value;
                            if (readingObj._significant) {
                                if (config.notSignificantVariant.indexOf('['+attrib.name+'='+attrib.value+']') >= 0) {
                                    readingObj._significant = false;
                                }
                            }
                        }
                        parsedData.addCriticalEntryFilter(attrib.name, attrib.value);
                    }
                }

                entry._indexes.readings._indexes.push(readingObj.id);
                entry.content[readingObj.id] = readingObj;

                if (readingObj._significant || child.tagName === 'lem') {
                    entry._indexes.readings._significant.push(readingObj.id);
                }
            } else if (readingGroupDef.indexOf('<'+child.tagName+'>') >= 0) {
                //TODO
            }
        });
        entry._indexes.groups.push(groupObj.id);
        entry.content[groupObj.id] = groupObj;
        entry._indexes.encodingStructure.push(groupObj.id);
    };

    /* ****************** */
    /* parseAppEntry(app) */
    /* ********************************************************************************** */
    /* Function to parse the XML element representing an apparatus entry or a group       */
    /* (<app> o <rdgGrp> in XML-TEI P5)                                                   */
    /* @app element -> xml element representing the apparatus entry or group to be parsed */
    /* @return a json object representing the apparatus entry read                        */
    /* ********************************************************************************** */
    var parseAppEntry = function(app) {
        var entry = {
            id         : '',
            attributes : [],
            lemma      : '',
            note       : '',
            content    : {
                // READINGS
                // GROUPS
                // SUBAPP
            },
            _indexes   : {
                encodingStructure : [],
                readings          : {
                    _indexes     : [],
                    _significant : []
                },
                groups            : [],
                subApps           : [],
                witMap            : { }
            },
            _subApp    : false,
            _xmlSource : app.outerHTML || ''
        };

        var id;
        if (app.getAttribute('xml:id')) {
            id = 'app_'+app.getAttribute('xml:id');
        } else {
            id = evtParser.xpath(app).substr(1);
        }
        entry.id = id;
        
        if (app.attributes) {
            for (var i = 0; i < app.attributes.length; i++) {
                var attrib = app.attributes[i];
                if (attrib.specified) {
                    entry.attributes[attrib.name] = attrib.value;
                    parsedData.addCriticalEntryFilter(attrib.name, attrib.value);
                }
            }
        }
        entry._subApp = evtParser.isNestedInElem(app, apparatusEntryDef.replace(/[<>]/g, ''));
        angular.forEach(app.childNodes, function(child){
            if (child.nodeType === 1) {
                if (readingDef.indexOf('<'+child.tagName+'>') >= 0) {
                    var reading  = parseAppReading(entry, child);
                    
                    if (lemmaDef.indexOf('<'+child.tagName+'>') >= 0) {
                        entry.lemma = reading.id;
                    } else {
                        entry._indexes.readings._indexes.push(reading.id);
                        if (reading._significant && 
                            entry._indexes.readings._significant.indexOf(reading.id) < 0) {
                            entry._indexes.readings._significant.push(reading.id);
                        }
                    }
                    
                    entry.content[reading.id] = reading;
                    entry._indexes.encodingStructure.push(reading.id);
                } 
                else if (readingGroupDef.indexOf('<'+child.tagName+'>') >= 0) {
                    parseGroupReading(entry, child);
                } 
                else if (apparatusEntryDef.indexOf('<'+child.tagName+'>') >= 0) {
                    var entryObj = handleAppEntry(child, id);
                    var subApp = {id: entryObj.id, type: 'subApp'};
                    entry.content[entryObj.id] = subApp;
                    entry._indexes.encodingStructure.push(entryObj.id);
                    entry._indexes.subApp.push(entryObj.id);
                } else if ( child.tagName === 'note' ) {
                    entry.note = child.innerHTML;
                } 
            }
        });
        
        return entry;
    };
    
    var handleAppEntry = function(app, parentEntryId) {
        // if (app.getAttribute('type') || app.getAttribute('type') !== 'note') {
            var entry = parseAppEntry(app) || undefined;

            // controllo testimoni mancanti
            
            if (app.querySelectorAll('rdg lacunaStart').length > 0 || app.querySelectorAll('rdg lacunaEnd').length > 0) {
                entry._lacuna = true;
            }
            if (app.querySelectorAll('rdg witStart').length > 0 || app.querySelectorAll('rdg witEnd').length > 0) {
                entry._fragment = true;
            }

            // Save variance
            var significantReadings    = entry._indexes.readings._significant,
                significantReadingsTot = significantReadings.length;
            if (entry.lemma !== '' && significantReadings.indexOf(entry.lemma) >= 0) {
                significantReadingsTot -= 1; //escludo lemma
            }
            var totWits = parsedData.getWitnessesList();
            
            var variance = significantReadingsTot/totWits.length;
            entry._variance = variance;

            //Find witnesses not encoded in app
            var encodedWits = Object.keys(entry._indexes.witMap),
                missingWits = [];

            if (encodedWits.length < totWits.length){
                for (var i in totWits) {
                    if (encodedWits.indexOf(totWits[i]) < 0){
                        missingWits.push(totWits[i]);
                    }
                }
            }
            entry._indexes.missingWits = missingWits;

            var entryLemmaObj = entry.content[entry.lemma];
            if (entryLemmaObj) {
                if (!entryLemmaObj.wits || entryLemmaObj.wits.length === 0){
                    entryLemmaObj.autoWits = missingWits;
                }
            }
            
            if (parentEntryId) {
                entry._indexes._parentEntry = parentEntryId;
            }
            parsedData.addCriticalEntry(entry);
            return entry;
        // }
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
        var deferred = $q.defer();
        var currentDocument = angular.element(doc);
        angular.forEach(currentDocument.find(apparatusEntryDef.replace(/[<>]/g, '')), 
            function(element) {
                handleAppEntry(element);
        });
        // console.log('## Critical entries ##', JSON.stringify(parsedData.getCriticalEntries()));
        parsedData.setCriticalEntriesLoaded(config.loadCriticalEntriesImmediately);
        console.log('## Critical entries ##', parsedData.getCriticalEntries());
        deferred.resolve('success');
        return deferred;
    };

    /* ******* */
    /* WITNESS */
    /* ******* */
    var containsWitnessReading = function(elem, witObj) {
        if (elem === null) {
            return false;
        } else {
            return (witObj.group !== undefined && elem.indexOf('#'+witObj.group) >= 0) || (elem.indexOf('#') >= 0 && elem.indexOf('#'+witObj.id) >= 0) || elem.indexOf(witObj.id) >= 0;
        }
    };

    /* ************************************* */
    /* parseWintessPageBreaks(docDOM, wit) */
    /* ******************************************************************************** */
    /* Function to parse page breaks and select only those of the specified witness     */
    /* @docDOM -> XML to be parsed                                                      */
    /* @wit -> witness specified                                                        */
    /* ******************************************************************************** */
    // It will look for XML element representing a page break (<pb> in XML-TEI P5)
    // – if they belong the the specified witness they will be replaced with a <span> element
    // - otherwise they will be removed
    parser.parseWintessPageBreaks = function(docDOM, witObj) {
        var pbs = docDOM.getElementsByTagName('pb'),
            k   = 0;
        while ( k < pbs.length) {
            var pbNode = pbs[k];
            if (containsWitnessReading(pbNode.getAttribute('ed'), witObj)){
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
    /* parseWintessLacunas(docDOM, wit) */
    /* ********************************** */
    /* Function to parse lacuna start/end */
    /* @docDOM -> XML to be parsed        */
    /* @wit -> witness specified          */
    /* ********************************** */
    parser.parseWintessLacunas = function(docDOM, wit) {
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
            docDOM.innerHTML = '<span class="error">There was a problem in loading lacuna for this witness.</span>';
        }
    };

    /* ************************************ */
    /* isFragmentaryWitness(docDOM, wit) */
    /* ********************************************************** */
    /* Function to check if a witness is a fragmentary one or not */
    /* ********************************************************** */
    var isFragmentaryWitness = function(docDOM, wit){
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
            return '<span class="error">There was a problem in loading fragmentary witness.</span>';
        }
    };

    /* ******************************************* */
    /* getEntryWitnessReadingText(entry, wit) */
    /* ******************************************************************************************************* */
    /* Function to get the text of the reading for a particular witness in a specific critical apparatus entry */
    /* @entry -> critical entry object from model                                                              */
    /* @wit -> witness specified                                                                               */
    /* ******************************************************************************************************* */
    var getEntryWitnessReadingText = function(entry, wit){
        var spanElement;
        if (entry !== null) {
            var entryReadings = entry._indexes.readings._indexes;
            spanElement = document.createElement('evt-reading');
            
            if (entry.lemma !== '' && !entry._lacuna && entryReadings.length === 1) {
                var entryWits = entry.content[entryReadings[0]].wits || [];
                if(entryWits.length === parsedData.getWitnessesList().length) {
                    spanElement = document.createElement('span');
                    spanElement.className = entry.content[entryReadings[0]]._xmlTagName;
                }
            }
            spanElement.setAttribute('data-app-id', entry.id);
            /* 
                IMPORTANT: data-app-id should be the first attribute added to the element
                otherwise the parser for fragmentary witnesses will not work.
            */
            spanElement.setAttribute('data-scope-wit', wit);
            var readingId = entry._indexes.witMap[wit];
            if (readingId !== undefined && readingId !== '') {
                spanElement.setAttribute('data-reading-id', readingId);
                var readingContent = entry.content[readingId].content;
                if (readingContent.length > 0) {
                    for (var i in readingContent) {
                        if (typeof(readingContent[i]) === 'string'){
                            spanElement.appendChild(document.createTextNode(readingContent[i]));
                        } else {
                            if (readingContent[i].type === 'subApp'){
                                var subEntry = parsedData.getCriticalEntryById(readingContent[i].id);
                                var subEntryElem = getEntryWitnessReadingText(subEntry, wit);
                                var subReadingId = subEntry._indexes.witMap[wit] || '';
                                subEntryElem.setAttribute('data-reading-id', subReadingId);
                                if (subEntryElem !== null) {
                                    spanElement.appendChild(subEntryElem);
                                }
                            } else if (readingContent[i].type === 'genericElement'){
                                var genericElement = getGenericElementText(readingContent[i], wit);
                                spanElement.appendChild(genericElement);
                            } else {
                                spanElement.appendChild(readingContent[i]);
                            }
                        }
                    }
                } else if (!entry._lacuna){
                    var omitElement = document.createElement('span');
                        omitElement.className = 'omission';
                    spanElement.appendChild(omitElement);
                } else {
                    var lacunaElement = document.createElement('span');
                        lacunaElement.className = 'lacunaApp icon-evt_note';
                    spanElement.appendChild(lacunaElement);
                }

                // var attribKeys = Object.keys(entry.content[readingId].attributes);
                // for (var key in attribKeys) {
                //     var attrib = attribKeys[key];
                //     var value  = entry.content[readingId].attributes[attrib];
                //     if (attrib !== 'xml:id') {
                //         spanElement.setAttribute('data-entry-attr-'+attrib, value);
                //     }
                // }

            } else if (entry.lemma){
                spanElement = getEntryLemmaText(entry, wit);
            } else {
                var noRdgElement = document.createElement('span');
                    noRdgElement.className = 'empty';
                    noRdgElement.setAttribute('title', 'noRdg');
                spanElement.appendChild(noRdgElement);
            }
        } else {
            var errorElement = document.createElement('span');
                errorElement.className = 'encodingError';
                errorElement.setAttribute('title', 'General error');
            spanElement.appendChild(errorElement);
        }
        spanElement.setAttribute('data-type', 'variant');
        return spanElement;
    };
    
    /* ************************** */
    /* parseWitnessText(doc, wit) */
    /* ************************************************************************************** */
    /* Function to parse the XML of the document and generate the text of a specified witness */
    /* @doc   -> XML to be parsed                                                             */
    /* @docID -> ID of current DOC                                                            */
    /* @wit   -> witness specified                                                            */
    /* ************************************************************************************** */
    parser.parseWitnessText = function(doc, docId, wit) {
        // console.log('parseWitnessText', wit);
        var deferred = $q.defer();
        var witnessText;
        if ( doc !== undefined ) {
            doc = doc.cloneNode(true);
            var docDOM = doc.getElementsByTagName('body')[0],
                witObj = parsedData.getWitness(wit);

            var apps   = docDOM.getElementsByTagName(apparatusEntryDef.replace(/[<>]/g, '')),
                j      = apps.length-1;
            while (j < apps.length && j >= 0) {
                var appNode = apps[j];
                if (!evtParser.isNestedInElem(appNode, apparatusEntryDef.replace(/[<>]/g, ''))) {
                    var id;
                    if (appNode.getAttribute('xml:id')) {
                        id = 'app_'+appNode.getAttribute('xml:id');
                    } else {
                        id = evtParser.xpath(appNode).substr(1);
                    }
                    var spanElement;
                    var entry = parsedData.getCriticalEntryById(id);
                    // If I've already parsed all critical entries,
                    // or I've alreafy parsed the current entry...
                    // ...I can simply access the model to get the right output
                    // ... otherwise I parse the DOM and save the entry in the model
                    if (!config.loadCriticalEntriesImmediately && entry === undefined) {
                        handleAppEntry(appNode);
                        var subApps = appNode.getElementsByTagName(apparatusEntryDef.replace(/[<>]/g, ''));
                        if (subApps.length > 0){
                            for (var z = 0; z < subApps.length; z++) {
                                handleAppEntry(subApps[z]);
                            }
                        }
                        entry = parsedData.getCriticalEntryById(id);
                    }
                    if (entry !== undefined) {
                        spanElement = getEntryWitnessReadingText(entry, wit);
                    } else {
                        spanElement = document.createElement('span');
                        spanElement.className = 'encodingError';
                    }
                    if (spanElement !== null) {
                        appNode.parentNode.replaceChild(spanElement, appNode);
                    }
                }
                j--;
            }
            //docDOM.innerHTML = docDOM.innerHTML.replace(/>[\s\r\n]*?</g,'><');
            
            angular.forEach(docDOM.children, function(elem){
                var skip = skipFromBeingParsed+','+config.lacunaMilestone+','+config.fragmentMilestone;
                elem.parentNode.replaceChild(evtParser.parseXMLElement(doc, elem, skip), elem);
            });

            //parse <pb>
            parser.parseWintessPageBreaks(docDOM, witObj);
            
            //parse lacunas
            parser.parseWintessLacunas(docDOM, wit);

            if (isFragmentaryWitness(docDOM, wit)) {
                // DA PROBLEMI [ma serve per parsare i frammenti]
                docDOM.innerHTML = docDOM.innerHTML.replace(/xmlns="http:\/\/www\.w3\.org\/1999\/xhtml"/g, '');
                var fragmentaryText = parser.parseFragmentaryWitnessText(docDOM, wit);
                witnessText = evtParser.balanceXHTML(fragmentaryText);
            } else {
                witnessText = docDOM.innerHTML;
            }

            witnessText = evtParser.balanceXHTML(witnessText);
            //TODO: Split witness into pages
        } else {
            witnessText = '<span>Text not available.</span>';
        }
        
        //save witness text
        parsedData.addWitnessText(wit, docId, witnessText);
        
        deferred.resolve('success');
        return deferred;
    };

    /* ******************************************* */
    /* getGenericElementText(element, wit) */
    /* ************************************************************************************ */
    /* Function to get the text of a generic element in a specific critical apparatus entry */
    /* @element -> generic element from model                                               */
    /* @wit -> current witness (optional)                                                   */
    /* ************************************************************************************ */
    var getGenericElementText = function(element, wit){
        var spanElement = document.createElement('span');
        spanElement.className = element.tagName;
        
        var attribKeys = Object.keys(element.attributes);
        for (var key in attribKeys) {
            var attrib = attribKeys[key];
            var value = element.attributes[attrib];
            if (attrib !== 'xml:id') {
                spanElement.setAttribute('data-'+attrib, value);
            }
        }

        var elementContent = element.content;
        for (var i in elementContent) {
            if (typeof(elementContent[i]) === 'string'){
                spanElement.appendChild(document.createTextNode(elementContent[i]));
            } else {
                if (elementContent[i].type === 'subApp'){
                    var subEntry = parsedData.getCriticalEntryById(elementContent[i].id);
                    var subEntryElem = wit === '' ? getEntryLemmaText(subEntry, wit) : getEntryWitnessReadingText(subEntry, wit);
                    var subReadingId = subEntry._indexes.witMap[wit] || '';
                    subEntryElem.setAttribute('data-reading-id', subReadingId);
                    if (subEntryElem !== null){
                        spanElement.appendChild(subEntryElem);
                    }
                } else if (elementContent[i].type === 'genericElement'){
                    var genericElement = getGenericElementText(elementContent[i], wit);
                    spanElement.appendChild(genericElement);
                }
            }
        }

        return spanElement;
    };

    /* ************* */
    /* CRITICAL TEXT */
    /* ************* */

    /* ******************************************* */
    /* getEntryLemmaText(entry, wit) */
    /* **************************************************************************** */
    /* Function to get the text of the lemma in a specific critical apparatus entry */
    /* @entry -> critical entry object from model                                   */
    /* @wit -> current witness (optional)                                           */
    /* **************************************************************************** */
    var getEntryLemmaText = function(entry, wit){
        var spanElement,
            errorElement;
            
        if (entry !== null) {
            spanElement = document.createElement('evt-reading');
            spanElement.setAttribute('data-app-id', entry.id);
            /* 
                IMPORTANT: data-app-id should be the first attribute added to the element
                otherwise the parser for fragmentary witnesses will not work.
            */
            spanElement.setAttribute('data-scope-wit', wit);
            spanElement.setAttribute('data-type', 'lemma');
            if (entry._lacuna) {
                var lacunaElement = document.createElement('span');
                    lacunaElement.className = 'lacunaApp icon-evt_note';
                spanElement.appendChild(lacunaElement);
            } else if (entry.lemma !== undefined && entry.lemma !== '') {
                spanElement.setAttribute('data-reading-id', entry.lemma);
                var lemmaContent = entry.content[entry.lemma].content;
                for (var i in lemmaContent) {
                    if (typeof(lemmaContent[i]) === 'string'){
                        spanElement.appendChild(document.createTextNode(lemmaContent[i]));
                    } else {
                        if (lemmaContent[i].type === 'subApp'){
                            var subEntry = parsedData.getCriticalEntryById(lemmaContent[i].id);
                            var subEntryElem = wit === '' ? getEntryLemmaText(subEntry, wit) : getEntryWitnessReadingText(subEntry, wit);
                            var subReadingId = subEntry._indexes.witMap[wit] || '';
                            subEntryElem.setAttribute('data-reading-id', subReadingId);
                            if (subEntryElem !== null){
                                spanElement.appendChild(subEntryElem);
                            }
                        } else if (lemmaContent[i].type === 'genericElement'){
                            var genericElement = getGenericElementText(lemmaContent[i], wit);
                            spanElement.appendChild(genericElement);
                        }
                    }
                }
            } else {
                if (config.preferredWitness !== '') {
                    spanElement = getEntryWitnessReadingText(entry, config.preferredWitness);
                    if (spanElement !== null){
                        spanElement.className = 'autoLemma';
                    }
                } else {
                    errorElement = document.createElement('span');
                    errorElement.className = 'encodingError';
                    errorElement.setAttribute('title', 'General error');
                    spanElement.appendChild(errorElement);        
                }
            }
            if (spanElement !== null) {
                var attribKeys = Object.keys(entry.attributes);
                for (var key in attribKeys) {
                    var attrib = attribKeys[key];
                    var value = entry.attributes[attrib];
                    if (attrib !== 'xml:id') {
                        spanElement.setAttribute('data-'+attrib.replace(':','-'), value);
                    }
                }

                if (entry._variance !== undefined) {
                    spanElement.setAttribute('data-variance', entry._variance);
                    // da pesare sulla varianza massima
                }
            }
        } else {
            errorElement = document.createElement('span');
            errorElement.className = 'encodingError';
            errorElement.setAttribute('title', 'General error');
            spanElement.appendChild(errorElement);
        }
        
        return spanElement;
    };

    /* ************************** */
    /* parseCriticalText(doc) */
    /* ************************************************************************ */
    /* Function to parse the XML of the document and generate the critical text */
    /* @doc -> XML to be parsed                                                 */
    /* @docID -> ID of current DOC                                              */
    /* ************************************************************************ */
    parser.parseCriticalText = function(doc, docId) {
        // console.log('parseCriticalText');
        var deferred = $q.defer();
        var criticalText;
        if ( doc !== undefined ) {
            doc = doc.cloneNode(true);
            var docDOM = doc.getElementsByTagName('body')[0];
            // lemmas = docDOM.getElementsByTagName(lemmaDef.replace(/[<>]/g, ''));
            // if (lemmas.length > 0 || 
            //     (parsedData.getWitness(config.preferredWitness) !== undefined &&
            //      parsedData.getWitness(config.preferredWitness) !== '') ) {
                var apps   = docDOM.getElementsByTagName(apparatusEntryDef.replace(/[<>]/g, '')) || [],
                    j      = apps.length-1, 
                    count  = 0;
            
                while(j < apps.length && j >= 0) {
                    var appNode = apps[j];
                    if (!evtParser.isNestedInElem(appNode, apparatusEntryDef.replace(/[<>]/g, ''))) {
                        // var id: appNode.getAttribute('xml:id') || evtParser.xpath(appNode).substr(1),
                        var id;
                        if (appNode.getAttribute('xml:id')) {
                            id = 'app_'+appNode.getAttribute('xml:id');
                        } else {
                            id = evtParser.xpath(appNode).substr(1);
                        }
                        var spanElement;
                        var entry = parsedData.getCriticalEntryById(id);
                        
                        // If I've already parsed all critical entries,
                        // or I've already parsed the current entry...
                        // ...I can simply access the model to get the right output
                        // ... otherwise I parse the DOM and save the entry in the model
                        if (!config.loadCriticalEntriesImmediately || entry === undefined) {
                            handleAppEntry(appNode);
                            var subApps = appNode.getElementsByTagName(apparatusEntryDef.replace(/[<>]/g, ''));
                            if (subApps.length > 0){
                                for (var z = 0; z < subApps.length; z++) {
                                    handleAppEntry(subApps[z]);
                                }
                            }
                            entry = parsedData.getCriticalEntryById(id);
                        }
                        if (entry !== undefined) {
                            spanElement = getEntryLemmaText(entry, '');
                        } else {
                            spanElement = document.createElement('span');
                            spanElement.className = 'errorMsg';
                            spanElement.textContent = 'ERROR';
                        }
                        if (spanElement !== null){
                            appNode.parentNode.replaceChild(spanElement, appNode);
                        }
                        count++;
                    }
                    j--;
                }

                //remove <pb>
                var pbs = docDOM.getElementsByTagName('pb'),
                    k   = 0;
                while ( k < pbs.length) {
                    var pbNode = pbs[k];
                        pbNode.parentNode.removeChild(pbNode);
                }
                
                angular.forEach(docDOM.children, function(elem){
                    var skip = skipFromBeingParsed+','+config.lacunaMilestone+','+config.fragmentMilestone;
                    elem.parentNode.replaceChild(evtParser.parseXMLElement(doc, elem, skip), elem);
                });
                criticalText = docDOM.outerHTML;
            // } else {
            //     criticalText = '<span>Text not available.</span>';
            // }   
        } else {
            criticalText = '<span>Text not available.</span>';
        }

        if (criticalText === undefined) {
             var errorMsg = '<span class="alert-msg alert-msg-error">There was an error in the parsing of the text. <br />Try a different browser or contact the developers.</span>';
             criticalText = errorMsg;
        }
        parsedData.addCriticalText(criticalText, docId);
        
        deferred.resolve('success');
        return deferred;
    };

    return parser;
});