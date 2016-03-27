angular.module('evtviewer.dataHandler')

.service('evtCriticalParser', function(parsedData, evtParser, xmlParser, GLOBALDEFAULTCONF) {
    var parser = {};
    var config = GLOBALDEFAULTCONF;
    
    var listDef               = config.listDef,
        versionDef            = config.versionDef,
        fragmentMilestone     = config.fragmentMilestone,
        lacunaMilestone       = config.lacunaMilestone,
        notSignificantVariant = config.notSignificantVariant;

    var apparatusEntryDef     = '<app>',
        lemmaDef              = '<lem>',
        readingDef            = lemmaDef+', <rdg>',
        readingGroupDef       = '<rdgGrp>';;
    var skipFromBeingParsed   = '<evt-reading>,<pb>,'+apparatusEntryDef+','+readingDef+','+readingGroupDef+','+lacunaMilestone+','+lacunaMilestone;

    parser.findCriticalEntryById = function(doc, appId){
        if ( doc !== undefined ) {
            var appSelector = appId.replace(/\w-/g, '$&0>').replace(/[0-9]+/g, ":eq($&)").replace(/-:eq/g, ':eq');
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
    var parseListWit = function(listWit) {
        var list = {
            id      : listWit.getAttribute('xml:id'),
            name    : '',
            content : [],
            _type   : 'group',
            _group  : undefined
        };
        
        angular.forEach(listWit.childNodes, function(child){
            if (child.nodeType === 1) {
                if (child.tagName === 'head') {
                    list.name = child.innerHTML;
                }
                else if (listDef.indexOf(child.tagName) >= 0) { //group
                    var subList = parseListWit(child);
                    subList._group = list.id;
                    parsedData.addElementInWitnessCollection(subList);
                    list.content.push(subList.id);
                } 
                else if (versionDef.indexOf(child.tagName) >= 0){ //witness
                    var witnessElem = {
                        id          : child.getAttribute('xml:id'),
                        description : evtParser.parseXMLElement(child, ''),
                        _group      : list.id,
                        _type       : 'witness'
                    };
                    parsedData.addElementInWitnessCollection(witnessElem);
                    list.content.push(witnessElem.id);
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
    // It searches for <listWit> elements not nested and cycles their children
    // For each children, if it is a nested <listWit> it calls the function parseListWit(element),
    // otherwise, if it is a <witness> element it create a json object with witness info
    // In both cases it add the json object generated (that is a group of witness or a simple witness)
    // to parsedData with the function parsedData.addWitness(json);
    parser.parseWitnesses = function(doc) {
        var currentDocument = angular.element(doc);
        if (currentDocument.find(listDef).length > 0) {
            angular.forEach(currentDocument.find(listDef), 
                function(element) {
                    if ( !evtParser.isNestedInElem(element, element.tagName) ) {
                        angular.forEach(element.childNodes, function(child){
                            if (child.nodeType === 1) {
                                var el = {};
                                
                                if (listDef.indexOf(child.tagName) >= 0) { // group
                                    el = parseListWit(child);
                                } else if (versionDef.indexOf(child.tagName) >= 0) { // witness
                                    el = {
                                        id          : child.getAttribute('xml:id'),
                                        description : evtParser.parseXMLElement(child, ''),
                                        _group      : undefined,
                                        _type       : 'witness'
                                    };
                                }
                                parsedData.addElementInWitnessCollection(el);
                            }
                        });
                    }
            });
        } else {
            console.log('ERROR: '+listDef+' missing. Please add this element to make EVT work properly.');
        }
        // console.log('## Witnesses ##', JSON.stringify(parsedData.getWitnesses()));
        console.log('## Witnesses ##', parsedData.getWitnesses());
    };

    /* ********************* */
    /* parseAppReading(elem) */
    /* ******************************************************************* */
    /* Function to parse the XML element representing an apparatus reading */
    /* (<lem> o <rdg> in XML-TEI P5)                                       */
    /* @elem element -> xml element to be parsed                           */
    /* @return a json object representing the apparatus reading        */
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
            _groupId     : undefined,
            _xmlTagName  : elem.tagName,
            _xmlSource   : elem.innerHTML
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
                
                if (attrib.name === 'wit') {
                    var wits = attrib.value.split('#').filter(function(el) { return el.length !== 0; });
                    reading.wits = [];
                    for(var s in wits){
                        var sigla = wits[s].replace(' ', '');
                        if (parsedData.getWitness(sigla) !== undefined) { //exclude siglas without reference
                            if (parsedData.isWitnessesGroup(sigla)) {
                                var witsInGroup = parsedData.getWitnessesInGroup(sigla);
                                reading.wits.push.apply(reading.wits, witsInGroup);
                                for (var wit in witsInGroup) {
                                    if (entry.content._witMap[witsInGroup[wit]] === undefined){
                                        entry.content._witMap[witsInGroup[wit]] = id;
                                    }
                                }
                            } else {
                                reading.wits.push(sigla);
                                if (entry.content._witMap[sigla] === undefined){
                                    entry.content._witMap[sigla] = id;
                                }
                            }
                        }
                    }
                }
                if (reading._significant) {
                    if (notSignificantVariant.indexOf('['+attrib.name+'='+attrib.value+']') >= 0) {
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
                } else if ('<'+child.tagName+'>' === apparatusEntryDef) {
                    var entryApp = parseAppEntry(child);
                    reading.content.push({id: entryApp.id, type: 'subApp'});
                } else {
                    if (reading._significant) {
                        if (notSignificantVariant.indexOf('<'+child.tagName+'>') >= 0) {
                            reading._significant = false;
                        }
                    }
                    if (fragmentMilestone.indexOf(child.tagName) >= 0 && child.getAttribute('wit') === null) {
                        var fragmentSigla = elem.getAttribute('wit');
                        child.setAttribute('wit', fragmentSigla);
                    }

                    if (lacunaMilestone.indexOf(child.tagName) >= 0 && child.getAttribute('wit') === null) {
                        var lacunaSigla = elem.getAttribute('wit');
                        child.setAttribute('wit', lacunaSigla);
                    }
                    reading.content.push(child.cloneNode(true));
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
                                if (notSignificantVariant.indexOf('['+attrib.name+'='+attrib.value+']') >= 0) {
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
                _witMap : { }
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
                subApps           : []
            },
            _subApp    : false,
            _xmlSource : app.innerHTML
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
                    var entryObj = parseAppEntry(child);
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
    
    var handleAppEntry = function(app) {
        if (app.getAttribute('type') || app.getAttribute('type') !== 'note') {
            var entry = parseAppEntry(app);

            // controllo testimoni mancanti
            
            if (app.querySelectorAll('rdg lacunaStart').length > 0 || app.querySelectorAll('rdg lacunaEnd').length > 0) {
                entry._lacuna = true;
            }
            if (app.querySelectorAll('rdg witStart').length > 0 || app.querySelectorAll('rdg witEnd').length > 0) {
                entry._fragment = true;
            }


            var significantReadings    = entry._indexes.readings._significant,
                significantReadingsTot = significantReadings.length;
            if (entry.lemma !== '' && significantReadings.indexOf(entry.lemma) >= 0) {
                significantReadingsTot -= 1; //escludo lemma
            }
            var totWits = parsedData.getWitnessesList().length;
            
            var variance = significantReadingsTot/totWits;
            entry._variance = variance;

            parsedData.addCriticalEntry(entry);
        }
    };
    /* ************************* */
    /* parseCriticalEntries(doc) */
    /* ***************************************************************** */
    /* Function to parse a the critical entries existing in the XML file */
    /* and save them in parsedData                                       */
    /* @doc document -> XML to be parsed                                 */
    /* ***************************************************************** */
    // It searches for <app> elements and for each one of them
    // it calls the function parseAppEntry(element)
    // and add the json object generated into parsedData with the function parsedData.addCriticalEntry();
    parser.parseCriticalEntries = function(doc) {
        var currentDocument = angular.element(doc);
        angular.forEach(currentDocument.find(apparatusEntryDef.replace(/[<>]/g, '')), 
            function(element) {
                handleAppEntry(element);
        });
        // console.log('## Critical entries ##', JSON.stringify(parsedData.getCriticalEntries()));
        parsedData.setCriticalEntriesLoaded(GLOBALDEFAULTCONF.loadCriticalEntriesImmediately);
        console.log('## Critical entries ##', parsedData.getCriticalEntries());
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
            readingWits = parsedData.getCriticalEntryByPos(appId).content[readingId].wits;
            if (readingWits !== undefined) {
                if (readingWits.indexOf(wit) >= 0) {
                    startLacunasWit.push(startLacunas[i]);
                }
            }
        }
        for (var j = 0; j < endLacunas.length; j++) {
            appId       = endLacunas[j].parentNode.getAttribute('data-app-id');
            readingId   = endLacunas[j].parentNode.getAttribute('data-reading-id');
            readingWits = parsedData.getCriticalEntryByPos(appId).content[readingId].wits;
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
                    newHTML     = appStart.outerHTML+'<span class="lacuna">[LACUNA]</span>'+appEnd.outerHTML;
                docDOM.innerHTML = docDOM.innerHTML.replace(sRegExInput, newHTML);
                docDOM.innerHTML = evtParser.balanceXHTML(docDOM.innerHTML);
            }
        } else {
            docDOM.innerHTML = '<span class="error">There was a problem in loading lacuna for this witness.</span>';
        }
    };

    /* ************************************ */
    /* isFragmentaryWitness(docDOM, witObj) */
    /* ********************************************************** */
    /* Function to check if a witness is a fragmentary one or not */
    /* ********************************************************** */
    var isFragmentaryWitness = function(docDOM, witObj){
        if (docDOM.querySelectorAll("rdg[wit*='#"+witObj.id+"'] witStart:not([wit]").length > 0 || 
            docDOM.querySelectorAll("lem[wit*='#"+witObj.id+"'] witStart:not([wit]").length > 0 ||
            docDOM.querySelectorAll("witStart[wit*='#"+witObj.id+"']").length > 0) {
            return true;
        } else {
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
            readingWits = parsedData.getCriticalEntryByPos(appId).content[readingId].wits;
            if (readingWits !== undefined) {
                if (readingWits.indexOf(wit) >= 0) {
                    startsWit.push(starts[i]);
                }
            }
        }
        for (var j = 0; j < ends.length; j++) {
            appId       = ends[j].parentNode.getAttribute('data-app-id');
            readingId   = ends[j].parentNode.getAttribute('data-reading-id');
            readingWits = parsedData.getCriticalEntryByPos(appId).content[readingId].wits;
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
        var spanElement = document.createElement('evt-reading');
            spanElement.setAttribute('data-app-id', entry.id);
            spanElement.setAttribute('data-scope-wit', wit);
            
        if (entry !== null) {
            var readingId = entry.content._witMap[wit];
            if (readingId !== undefined && readingId !== '') {
                spanElement.setAttribute('data-reading-id', readingId);
                var readingContent = entry.content[readingId].content;
                if (readingContent.length > 0) {
                    for (var i in readingContent) {
                        if (typeof(readingContent[i]) === 'string'){
                            spanElement.appendChild(document.createTextNode(readingContent[i]));
                        } else {
                            if (readingContent[i].type === 'subApp'){
                                var subEntry = parsedData.getCriticalEntryByPos(readingContent[i].id);
                                var subEntryElem = getEntryLemmaText(subEntry, wit);
                                spanElement.appendChild(subEntryElem);
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
                        lacunaElement.className = 'lacunaApp';
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

            } else {
                var noRdgElement = document.createElement('span');
                    noRdgElement.className = 'encodingError';
                    noRdgElement.setAttribute('title', 'noRdg');
                spanElement.appendChild(noRdgElement);
            }
        } else {
            var errorElement = document.createElement('span');
                errorElement.className = 'encodingError';
                errorElement.setAttribute('title', 'General error');
            spanElement.appendChild(errorElement);
        }
        return spanElement;
    };
    
    /* ************************** */
    /* parseWitnessText(doc, wit) */
    /* ************************************************************************************** */
    /* Function to parse the XML of the document and generate the text of a specified witness */
    /* @doc -> XML to be parsed                                                               */
    /* @wit -> witness specified                                                              */
    /* ************************************************************************************** */
    parser.parseWitnessText = function(doc, wit) {
        // console.log('parseWitnessText', wit);
        var witnessText;
        if ( doc !== undefined ) {
            doc = doc.cloneNode(true);
            var docDOM = doc.documentElement.getElementsByTagName('body')[0],
                witObj = parsedData.getWitness(wit);

            var apps   = docDOM.getElementsByTagName(apparatusEntryDef.replace(/[<>]/g, '')),
                j      = apps.length-1;
            docDOM.innerHTML = docDOM.innerHTML.replace(/>[\s\r\n]*?</g,'><');
            docDOM.innerHTML = docDOM.innerHTML.replace(/xmlns="http:\/\/www\.w3\.org\/1999\/xhtml"/g, '');
            while(j < apps.length && j >= 0) {
                var appNode = apps[j];
                if (!evtParser.isNestedInElem(appNode, apparatusEntryDef.replace(/[<>]/g, ''))) {
                    var id;
                    if (appNode.getAttribute('xml:id')) {
                        id = 'app_'+appNode.getAttribute('xml:id');
                    } else {
                        id = evtParser.xpath(appNode).substr(1);
                    }
                    var spanElement;
                    var entry = parsedData.getCriticalEntryByPos(id);
                    // If I've already parsed all critical entries,
                    // or I've alreafy parsed the current entry...
                    // ...I can simply access the model to get the right output
                    // ... otherwise I parse the DOM and save the entry in the model
                    if (!GLOBALDEFAULTCONF.loadCriticalEntriesImmediately && entry === undefined) {
                        handleAppEntry(appNode);
                        var subApps = appNode.getElementsByTagName(apparatusEntryDef.replace(/[<>]/g, ''));
                        if (subApps.length > 0){
                            for (var z = 0; z < subApps.length; z++) {
                                handleAppEntry(subApps[z]);
                            }
                        }
                        entry = parsedData.getCriticalEntryByPos(id);
                    }
                    if (entry !== undefined) {
                        spanElement = getEntryWitnessReadingText(entry, wit);
                    } else {
                        spanElement = document.createElement('span');
                        spanElement.className = 'encodingError';
                    }
                    appNode.parentNode.replaceChild(spanElement, appNode);
                }
                j--;
            }
            docDOM.innerHTML = docDOM.innerHTML.replace(/>[\s\r\n]*?</g,'><');

            // // DA PROBLEMI [ma serve per parsare i vari nodi XML]
            docDOM.innerHTML = docDOM.innerHTML.replace(/xmlns="http:\/\/www\.w3\.org\/1999\/xhtml"/g, '');
            docDOM.innerHTML = docDOM.innerHTML.replace(/xmlns="http:\/\/www\.tei-c\.org\/ns\/1.0"/g, '');
            
            angular.forEach(docDOM.children, function(elem){
                elem.parentNode.replaceChild(evtParser.parseXMLElement(elem, skipFromBeingParsed), elem);
            });

            //parse <pb>
            parser.parseWintessPageBreaks(docDOM, witObj);
            
            //parse lacunas
            parser.parseWintessLacunas(docDOM, wit);

            // DA PROBLEMI [ma serve per parsare i frammenti]
            docDOM.innerHTML = docDOM.innerHTML.replace(/xmlns="http:\/\/www\.w3\.org\/1999\/xhtml"/g, '');
            docDOM.innerHTML = docDOM.innerHTML.replace(/xmlns="http:\/\/www\.tei-c\.org\/ns\/1.0"/g, '');
            if (isFragmentaryWitness(docDOM, witObj)) {
                var fragmentaryText = parser.parseFragmentaryWitnessText(docDOM, wit);
                witnessText = evtParser.balanceXHTML(fragmentaryText);
            } else {
                witnessText = docDOM.innerHTML;
            }
        } else {
            witnessText = '<span>Text not available.</span>';
        }
        witnessText = evtParser.balanceXHTML(witnessText);
        
        //save witness text
        parsedData.addWitnessText(wit, witnessText);
        return witnessText;
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
        var spanElement = document.createElement('evt-reading'),
            errorElement;
        spanElement.setAttribute('data-app-id', entry.id);
        spanElement.setAttribute('data-scope-wit', wit);
            
        if (entry !== null) {
            if (entry._lacuna) {
                var lacunaElement = document.createElement('span');
                    lacunaElement.className = 'lacunaApp';
                spanElement.appendChild(lacunaElement);
            } else if (entry.lemma !== undefined && entry.lemma !== '') {
                var lemmaContent = entry.content[entry.lemma].content;
                for (var i in lemmaContent) {
                    if (typeof(lemmaContent[i]) === 'string'){
                        spanElement.appendChild(document.createTextNode(lemmaContent[i]));
                    } else {
                        if (lemmaContent[i].type === 'subApp'){
                            var subEntry = parsedData.getCriticalEntryByPos(lemmaContent[i].id);
                            var subEntryElem = getEntryLemmaText(subEntry, wit);
                            spanElement.appendChild(subEntryElem);
                        }
                    }
                }
            } else {
                if (GLOBALDEFAULTCONF.preferredWitness !== '') {
                    spanElement = getEntryWitnessReadingText(entry, GLOBALDEFAULTCONF.preferredWitness);
                    spanElement.className = 'autoLemma';
                } else {
                    errorElement = document.createElement('span');
                    errorElement.className = 'encodingError';
                    errorElement.setAttribute('title', 'General error');
                    spanElement.appendChild(errorElement);        
                }
            }
            
            var attribKeys = Object.keys(entry.attributes);
            for (var key in attribKeys) {
                var attrib = attribKeys[key];
                var value = entry.attributes[attrib];
                if (attrib !== 'xml:id') {
                    spanElement.setAttribute('data-'+attrib, value);
                }
            }

            if (entry._variance !== undefined) {
                spanElement.setAttribute('data-variance', entry._variance);
                // da pesare sulla varianza massima
            }
        } else {
            errorElement = document.createElement('span');
            errorElement.className = 'encodingError';
            errorElement.setAttribute('title', "General error");
            spanElement.appendChild(errorElement);
        }
        
        return spanElement;
    };

    /* ************************** */
    /* parseCriticalText(doc) */
    /* ************************************************************************ */
    /* Function to parse the XML of the document and generate the critical text */
    /* @doc -> XML to be parsed                                                 */
    /* ************************************************************************************** */
    parser.parseCriticalText = function(doc) {
        // console.log('parseCriticalText');
        var criticalText;
        if ( doc !== undefined ) {
            doc = doc.cloneNode(true);
            var docDOM = doc.documentElement.getElementsByTagName('body')[0],
                lemmas = docDOM.getElementsByTagName(lemmaDef.replace(/[<>]/g, ''));
            
            if (lemmas.length > 0 || 
                (parsedData.getWitness(GLOBALDEFAULTCONF.preferredWitness) !== undefined &&
                 parsedData.getWitness(GLOBALDEFAULTCONF.preferredWitness) !== '') ) {
                var apps   = docDOM.getElementsByTagName(apparatusEntryDef.replace(/[<>]/g, '')),
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
                        var entry = parsedData.getCriticalEntryByPos(id);
                        
                        // If I've already parsed all critical entries,
                        // or I've already parsed the current entry...
                        // ...I can simply access the model to get the right output
                        // ... otherwise I parse the DOM and save the entry in the model
                        if (!GLOBALDEFAULTCONF.loadCriticalEntriesImmediately || entry === undefined) {
                            handleAppEntry(appNode);
                            var subApps = appNode.getElementsByTagName(apparatusEntryDef.replace(/[<>]/g, ''));
                            if (subApps.length > 0){
                                for (var z = 0; z < subApps.length; z++) {
                                    handleAppEntry(subApps[z]);
                                }
                            }
                            entry = parsedData.getCriticalEntryByPos(id);
                        }
                        if (entry !== undefined) {
                            spanElement = getEntryLemmaText(entry, '');
                        } else {
                            spanElement = document.createElement('span');
                            spanElement.className = 'errorMsg';
                            spanElement.textContent = 'ERROR';
                        }
                        appNode.parentNode.replaceChild(spanElement, appNode);
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
                    elem.parentNode.replaceChild(evtParser.parseXMLElement(elem, skipFromBeingParsed), elem);
                });
                criticalText = docDOM;
            } else {
                criticalText = undefined;
            }   
        } else {
            criticalText = '<span>Text not available.</span>';
        }
        parsedData.addCriticalText(criticalText, '');
    };

    return parser;
});