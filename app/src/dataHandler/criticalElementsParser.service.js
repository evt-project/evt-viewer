angular.module('evtviewer.dataHandler')

.service('evtCriticalElementsParser', function(evtParser, parsedData, config, xmlParser) {
    var parser = {};

    var apparatusEntryDef = '<app>',
        lemmaDef          = '<lem>',
        readingDef        = lemmaDef+', <rdg>',
        readingGroupDef   = '<rdgGrp>',
        quoteDef          = '<quote>';
        analogueDef       = '<seg>,<ref[type=parallelPassage]>', 
        analogueRegExpr   = evtParser.createRegExpr(analogueDef);
    
    /**************** */
    /*CRITICAL ENTRIES*/
    /**************** */

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
                        var entryApp = parser.handleAppEntry(child);
                        genericElement.content.push({id: entryApp.id, type: 'subApp'});
                    } else {
                        var subst = angular.element(child)["0"].innerHTML.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, '');
                        var childXml = angular.element(child)["0"].outerHTML.replace(subst, '');
                        if (config.fragmentMilestone.indexOf(child.tagName) >= 0 && child.getAttribute('wit') === null) {
                            var fragmentSigla = elem.getAttribute('wit');
                            child.setAttribute('wit', fragmentSigla);
                        }
                        if (config.lacunaMilestone.indexOf(child.tagName) >= 0 && child.getAttribute('wit') === null) {
                            var lacunaSigla = elem.getAttribute('wit');
                            child.setAttribute('wit', lacunaSigla);
                        } if (quoteDef.indexOf('<'+child.tagName+'>') >= 0) {
                            genericElement.content.push(parser.parseQuote(child));
                        } if (analogueRegExpr.test(childXml)) {
                            reading.content.push(parser.parseAnalogue(child));
                        } if (angular.element(child).find(apparatusEntryDef.replace(/[<>]/g, ''))){
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
            } else if (child.nodeType === 1) {
                if (child.tagName === 'note') {
                    reading.note = child.innerHTML;
                } else if ( apparatusEntryDef.indexOf('<'+child.tagName+'>') >= 0 ) {
                    // Sub apparatus
                    var entryApp = parser.handleAppEntry(child, entry.id);
                    reading.content.push({id: entryApp.id, type: 'subApp'});
                    entry._indexes.subApps.push(entryApp.id);
                } else {
                    var subst = '',
                        childXml = '';
                    if (angular.element(child)["0"].innerHTML !== undefined){
                        subst = angular.element(child)["0"].innerHTML.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, '');
                        var childXml = angular.element(child)["0"].outerHTML.replace(subst, '');
                    }                  
                    
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
                    if (quoteDef.indexOf('<'+child.tagName+'>') >= 0) {
                        reading.content.push(parser.parseQuote(child));
                    }
                    else if (analogueRegExpr.test(childXml)) {
                        reading.content.push(parser.parseAnalogue(child));
                    }
                    else if (angular.element(child).find(apparatusEntryDef.replace(/[<>]/g, ''))){
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
            type : 'app',
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
                    var entryObj = parser.handleAppEntry(child, id);
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
    
    /************************************/
    /*handleAppEntry(app, parentEntryId)*/
    /********************************** */
    parser.handleAppEntry = function(app, parentEntryId) {
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
                if (!entryLemmaObj.wits || entryLemmaObj.wits.length == 0){
                    entryLemmaObj['autoWits'] = missingWits;
                }
            }
            
            if (parentEntryId) {
                entry._indexes._parentEntry = parentEntryId;
            }
            parsedData.addCriticalEntry(entry);
            return entry;
        // }
    };

        /* ******************************************* */
    /* getEntryWitnessReadingText(entry, wit) */
    /* ******************************************************************************************************* */
    /* Function to get the text of the reading for a particular witness in a specific critical apparatus entry */
    /* @entry -> critical entry object from model                                                              */
    /* @wit -> witness specified                                                                               */
    /* ******************************************************************************************************* */
    parser.getEntryWitnessReadingText = function(entry, wit){
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
                                var subEntryElem = parser.getEntryWitnessReadingText(subEntry, wit);
                                var subReadingId = subEntry._indexes.witMap[wit] || '';
                                subEntryElem.setAttribute('data-reading-id', subReadingId);
                                if (subEntryElem !== null) {
                                    spanElement.appendChild(subEntryElem);
                                }
                            } else if (readingContent[i].type === 'quote') {
                                var quoteElement = parser.getQuoteText(readingContent[i], wit);
                                spanElement.appendChild(quoteElement);
                            } else if (readingContent[i].type === 'analogue') {
                                var analogueElement = parser.getAnalogueText(readingContent[i], wit);
                                spanElement.appendChild(analogueElement);
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
                spanElement = parser.getEntryLemmaText(entry, wit);
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
                    var subEntryElem = wit === '' ? parser.getEntryLemmaText(subEntry, wit) : parser.getEntryWitnessReadingText(subEntry, wit);
                    var subReadingId = subEntry._indexes.witMap[wit] || '';
                    subEntryElem.setAttribute('data-reading-id', subReadingId);
                    if (subEntryElem !== null){
                        spanElement.appendChild(subEntryElem);
                    }
                } else if (elementContent[i].type === 'quote') {
                    var quoteElement = parser.getQuoteText(elementContent[i], wit);
                    spanElement.appendChild(quoteElement);
                } else if (elementContent[i].type === 'analogue') {
                    var analogueElement = parser.getAnalogueText(elementContent[i], wit);
                    spanElement.appendChild(analogueElement);
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
    parser.getEntryLemmaText = function(entry, wit){
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
                    lacunaElement.className = 'lacunaApp icon-evt_note'; //DA ELIMINARE QUI IL PALLINO
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
                            var subEntryElem = wit === '' ? parser.getEntryLemmaText(subEntry, wit) : parser.getEntryWitnessReadingText(subEntry, wit);
                            var subReadingId = subEntry._indexes.witMap[wit] || '';
                            subEntryElem.setAttribute('data-reading-id', subReadingId);
                            if (subEntryElem !== null){
                                spanElement.appendChild(subEntryElem);
                            }
                        } else if (lemmaContent[i].type === 'quote') {
                            var quoteElement = parser.getQuoteText(lemmaContent[i], wit);
                            spanElement.appendChild(quoteElement);
                        } else if (lemmaContent[i].type === 'analogue') {
                            var analogueElement = parser.getAnalogueText(lemmaContent[i], wit);
                            spanElement.appendChild(analogueElement);
                        } else if (lemmaContent[i].type === 'genericElement'){
                            var genericElement = getGenericElementText(lemmaContent[i], wit);
                            spanElement.appendChild(genericElement);
                        }
                    }
                }
            } else {
                if (config.preferredWitness !== '') {
                    spanElement = parser.getEntryWitnessReadingText(entry, config.preferredWitness);
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

    /******************/
    /*QUOTES & SOURCES*/
    /******************/

    /**************************/
    /*parseQuoteContent(child)*/
    /********************************************************************************/
    /*Supporting function that parses the content of a quotation inside the critical*/
    /*text or the text of a witness. If it finds a nested quote, an analogue, a note*/
    /*or a critical apparatus entry, it calls the corresponding functions. If the   */
    /*parsed element has children, the function calls itself recursively, otherwise */
    /*the parseXMLElement function is called and the result added to the content.   */
    /*@child --> content element to be parsed | @author --> CM                      */
    /****************************************************************************** */
    var parseQuoteContent = function(elem) {
        var contentEl = {
            tagName : elem.tagName,
            type : 'quoteContent',
            attributes: [],
            content : [],
            _xmlSource: elem.outerHTML
        };
        
        if (elem.attributes) {
            for (var i = 0; i < elem.attributes.length; i++) {
                var attrib = elem.attributes[i];
                if (attrib.specified) {
                    contentEl.attributes[attrib.name] = attrib.value;
                }
            }
        }

        angular.forEach(elem.childNodes, function(child) {
            if (child.nodeType === 3) {
                if (child.textContent.trim() !== '') {
                    contentEl.content.push(child.textContent.trim());
                }
            } else if (child.nodeType === 1) {
                var subst = angular.element(child)["0"].innerHTML.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, '');
                var childXml = angular.element(child)["0"].outerHTML.replace(subst, '');
                
                if (quoteDef.indexOf('<'+child.tagName+'>') >= 0) {
                    contentEl.content.push(parser.parseQuote(child));
                } else if (apparatusEntryDef.indexOf('<'+child.tagName+'>') >= 0) {
                    contentEl.content.push(parser.handleAppEntry(child));
                } else if (analogueRegExpr.test(childXml)) {
                    contentEl.content.push(parser.parseAnalogue(child));
                } /*else if (child.tagName === 'witDetail') {
                    contentEl.content.push(parser.parseWitDetail(child));
                }*/ else if (child.tagName === 'note') {
                    contentEl.content.push(evtParser.parseNote(child));
                } else if (child.children.length > 0) {
                    for (var i = 0; i < child.children.length; i++) {
                        contentEl.content.push(child.children[i].cloneNode(true));
                        parseQuoteContent(child.children[i])
                    }
                } else {
                    contentEl.content.push(parseQuoteContent(child));
                }
            }
        });

        return contentEl;
    }

    /* *************** */
    /* parseQuote(doc) */
    /* ****************************************************************** */
    /* Function to parse the content and the attributes of a single entry */
    /* of the sources apparatus inside of the critical text and save it   */
    /* in parsedData.                                                     */
    /* @entry-> the XML element that marks up the quotation of a source   */
    /* inside the text to be parsed                                       */
    /* @author: CM                                                        */
    /* ****************************************************************** */
    parser.parseQuote = function(entry){
        
        var quote = {
            type: 'quote',
            id : '',
            attributes: [],
            content: [],
            _indexes: {
                sourceId: [],//array in cui salvo gli id delle entrate bibliografiche nell'elemento
                sourceRefId: [], //array in cui salvo gli id delle fonti cui l'entrata fa riferimento
                subQuotes: [], //salvo gli id dei quoteDef annidati                
            },
            _subQuote: false, //indica se l'entrata in questione è annidata o meno in un quoteDef
            _xmlSource: entry.outerHTML
        }

        //Parsing the id or creating it with the evtParser.xpath method
        var id;
        if (entry.getAttribute('xml:id')) {
            id = entry.getAttribute('xml:id');
        } else {
            id = evtParser.xpath(entry).substr(1);
        }
        quote.id = id;

        //Parsing the attributes
        if (entry.attributes) {
            for (var i = 0; i < entry.attributes.length; i++) {
                var attrib = entry.attributes[i];
                if (attrib.specified) {                    
                    quote.attributes[attrib.name] = attrib.value;                 
                }
                if (attrib.name === 'source') {
                    var values = attrib.value.replace(/#/g, '').split(" ");
                    quote._indexes.sourceRefId = values;
                }
                if (attrib.name === 'corresp') {
                    var values = attrib.value.replace(/#/g, '').split(" ");
                    quote._indexes.sourceRefId = values;
                }
                if (attrib.name === 'ref') {
                    var values = attrib.value.replace(/#/g, '').split(" ");
                    quote._indexes.sourceRefId = values;
                }
            }
        }

        //Check if the quoteDef element is nested in another quoteDef element
        var aQuoteDef = quoteDef.split(","),
        i = 0;
        while (i < aQuoteDef.length && !quote._subQuote) {
            quote._subQuote = evtParser.isNestedInElem(entry, aQuoteDef[i].replace(/[<>]/g, ''));
            i++;
        }

        //Parsing the contents
        angular.forEach(entry.childNodes, function(child) {
            if (child.nodeType === 3) {
                if (child.textContent.trim() !== '') {
                    quote.content.push(child.textContent.trim());
                }
            } else if (child.nodeType === 1) {

                var subst = angular.element(child)["0"].innerHTML.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, '');
                var childXml = angular.element(child)["0"].outerHTML.replace(subst, '');

                //Array of TEI-elements for bibliographic references
                var biblEl = ['bibl', 'biblStruct', 'biblFull', 'msDesc'];
                //Array of TEI-elements for pointers
                var linkEl = ['ptr', 'ref', 'link'];

                //Parsing bibliographic references
                //If there is a listBibl...
                if (child.tagName === 'listBibl') {
                    //...parse the childNodes that are a link or a ptr
                    for (var i = 0; i < child.children.length; i++) {
                        if (biblEl.indexOf(child.children[i].tagName) >= 0) {
                            var bibl = parser.parseSource(child.children[i], entry);
                            //...then add their id to the sourceId array.
                            quote._indexes.sourceId.push(bibl.id);
                            quote.content.push(bibl);
                        } else {
                            quote.content.push(parseQuoteContent(child.children[i]));
                        }
                    }
                } // If there is a bibliographic element, parse it as a Source.
                  else if (biblEl.indexOf(child.tagName) >= 0) {
                    var bib = parser.parseSource(child, entry);
                    //Then add its id to the sourceId array.
                    quote._indexes.sourceId.push(bib.id);
                    quote.content.push(bib);
                } //If there is a link or pointer or ref...
                  else if (linkEl.indexOf(child.tagName) >= 0) {
                    quote.content.push(parseQuoteContent(child));
                    if (child.hasAttribute('target')) {
                        var attrib = child.getAttribute('target');
                        var values = attrib.replace(/#/g, '').split(" ");
                        for (var i = 0; i < values.length; i++) {
                            //...add its target values to the sourceRefId array.
                            quote._indexes.sourceRefId.push(values[i]);
                        }
                    }
                } //If there is a linkGrp...
                  else if (child.tagName === 'linkGrp') {
                      //...parse the children...
                    for (var i = 0; i < child.children.length; i++) {
                        if (linkEl.indexOf(child.children[i].tagName) >= 0) {
                            quote.content.push(parseQuoteContent(child.children[i]));
                            if (child.children[i].hasAttribute('target')) {
                                var attr = child.children[i].getAttribute('target');
                                var val = attr.replace(/#/g, '').split(" ");
                                for (var i = 0; i < val.length; i++) {
                                    //...and add their target values to the SourceRefId array.
                                    quote._indexes.sourceRefId.push(val[i]);
                                }
                            }
                        }
                    }
                } //If there is an apparatus Entry, parse it with handleAppEntry.
                  else if (apparatusEntryDef.indexOf('<'+child.tagName+'>') >= 0) {
                    quote.content.push(parser.handleAppEntry(child));
                } //If there is a nested quote, parse it recursively.
                  else if (quoteDef.indexOf('<'+child.tagName+'>') >= 0) {
                    var subQuote = parser.parseQuote(child);
                    quote.content.push(subQuote);
                    //Then add the id to the subQuotes array.
                    quote._indexes.subQuotes.push(subQuote.id);
                } else if (analogueRegExpr.test(childXml)) {
                    content.push(parser.parseAnalogue(child));
                } /*else if (child.tagName === 'witDetail') {
                    content.push(evtCriticalApparatusParser.parseWitDetail(child));
                }*/ else if (child.tagName === 'note') {
                    quote.content.push(evtParser.parseNote(child));
                } 
                  else {
                    quote.content.push(parseQuoteContent(child));
                }
            }
        });

        return quote;
    }

    /* ******* */
    /* SOURCES */
    /* ******* */

    /********************************* */
    /* parseSourceContent(elem, source)*/
    /***********************************************************/
    /* Function to parse an element inside of a source content.*/
    /* @elem --> an element inside of source                   */
    /* @source --> the source                                  */
    /* @author: CM                                             */
    /***********************************************************/
    var parseSourceContent = function (elem, source) {
        var contentEl = {
            tagName : elem.tagName,
            type : 'sourceContent',
            attributes: [],
            content : [],
            url: []
        };
        
        if (elem.attributes) {
            for (var i = 0; i < elem.attributes.length; i++) {
                var attrib = elem.attributes[i];
                if (attrib.specified) {
                    contentEl.attributes[attrib.name] = attrib.value;
                }
            }
        }

        angular.forEach(elem.childNodes, function(child) {
            if (child.nodeType === 3) {
                if (child.textContent.trim() !== '') {
                    contentEl.content.push(child.textContent.trim());
                }
            } else if (child.nodeType === 1) {
                if (child.tagName === 'citedRange') {
                    if (child.getAttribute('target') !== null && child.getAttribute('target') !== '') {
                        contentEl.url.push(child.getAttribute('target'));
                    }
                } else if (child.children.length > 0) {
                    for (var i = 0; i < child.children.length; i++) {
                        contentEl.content.push(parseSourceContent(child.children[i]));                        
                    }
                } else {
                    contentEl.content.push(parseSourceContent(child));
                }
            }
        });

        return contentEl;
    }

    /*********************/
    /*parseSource(source)*/
    /**************************************************************/
    /*Function to parse a source bibliographic reference, and save*/
    /*it in SourcesCollection.                                    */
    /*@source --> source to parse                                 */
    /*@quote (optional) --> quote that contains the parsed source */
    /*@author --> CM                                              */
    /************************************************************ */
    parser.parseSource = function(entry, quote) {
        var source = {
            id: '',
            abbr: {
                title: [],
                author: [],
                msId: []
            },            
            attributes: [],
            quotesEntriesId: [],
            bibl: [], //Array that saves the full bibliographic reference of the source (which almost always corresponds the content of the source itself)
            text: {},
            url: [], //Array that saves the link to the full text of the source
            quote: [],
            _xmlSource: entry.outerHTML
        }

        //Parsing the attributes and saving the id
        var id;
        if (entry.attributes) {
            for (var i = 0; i < entry.attributes.length; i++) {
                var attrib = entry.attributes[i];
                if (attrib.specified) {
                    if (attrib.name === 'xml:id') {
                        id = attrib.value;
                    }
                    if (attrib.name === 'target' ||
                        attrib.name === 'source' ||
                        attrib.name === 'ref') {
                            var values = attrib.value.replace(/#/g, '').split(" ");
                            for (var i = 0; i < values.length; i++) {
                                url.push(values[i]);
                            }
                        }
                    source.attributes[attrib.name] = attrib.value;
                    source.attributes.length++;
                }
            }
        }
        if (id === undefined) {
            id = evtParser.xpath(entry).substr(1);
        }
        source.id = id;
        
        //Parsing the quotes that refer to this source.
        if (parsedData.getQuotes()._indexes.sourcesRef[source.id] !== undefined) {
            source.quotesEntriesId = parsedData.getQuotes()._indexes.sourcesRef[source.id];
        } else {
            //If the bibliographic reference of the source is inside a quote,
            //the id of the quote is pushed int he quotesEntriesId array.
            if (quote.hasAttribute('xml:id')) {
                source.quotesEntriesId.push(quote.getAttribute('xml:id'));
            } else {
                source.quotesEntriesId.push(evtParser.xpath(quote).substr(1));
            }
        }

        //Adding info that will form the source abbreviated reference (.abbr)
        var elem = angular.element(entry);
        if (entry.tagName === 'msDesc') {
            angular.forEach(elem.find('idno'), function(el) {
                source.abbr.msId.push(parseSourceContent(el));
            });
        } else {
            angular.forEach(elem.find('author'), function(el) {
                source.abbr.author.push(parseSourceContent(el));
            });
            angular.forEach(elem.find('title'), function(el) {
                source.abbr.title.push(parseSourceContent(el));
            });
        }

        angular.forEach(entry.childNodes, function(child){
            if (child.nodeType === 3) {
                if (child.textContent.trim() !== '') {
                    source.bibl.push(child.textContent.trim());
                }
            }
            else if (child.nodeType === 1) {
                //Array of TEI-elements for pointers
                var linkEl = ['ptr', 'ref', 'link'];

                if (entry.tagName === 'cit' && child.tagName === 'quote') {
                    var contentEl = parseSourceContent(child);
                    source.quote.push(contentEl);
                } else if (linkEl.indexOf(child.tagName) >= 0) {
                    if (child.tagName === 'ref') {
                        source.bibl.push(parseSourceContent(child));
                    } else {
                        source.bibl.push(child);
                    }
                    if (child.hasAttribute('target')) {
                        var attrib = child.getAttribute('target');
                        var val = attrib.replace(/#/g, '').split(" ");
                        for (var i = 0; i < val.length; i++) {
                            //...add its target values to the url array.
                            source.url.push(val[i]);
                        }
                    }
                } //If there is a linkGrp...
                  else if (child.tagName === 'linkGrp') {
                      //...parse the children...
                    for (var i = 0; i < child.children.length; i++) {
                        if (linkEl.indexOf(child.children[i].tagName) >= 0) {
                            if (child.tagName === 'ref') {
                                source.bibl.push(parseSourceContent(child));
                            } else {
                                source.bibl.push(child.children[i]);
                            }
                            if (child.children[i].hasAttribute('target')) {
                                var attr = child.children[i].getAttribute('target');
                                var val = attr.replace(/#/g, '').split(" ");
                                for (var i = 0; i < val.length; i++) {
                                    //...and add their target values to the url array.
                                    source.url.push(val[i]);
                                }
                            }
                        }
                    }
                } else if (child.tagName === 'citedRange') {
                    if (child.getAttribute('target') !== null && child.getAttribute('target') !== '') {
                        source.url.push(child.getAttribute('target'));
                    }
                } else {
                    childContent = parseSourceContent(child, entry)
                    /*if (childContent.tagName === 'author') {
                        source.author.push(childContent.content);
                    }
                    if (childContent.tagName === 'title') {
                        source.title = childContent.content;
                    }*/
                    source.bibl.push(childContent);
                    for (var i = 0; i < childContent.url.length; i++) {
                        source.url.push(childContent.url[i]);
                    }
                }
            }
        });

        parsedData.addSource(source);

        return source;
    };

    /*********************************+** */
    /*getQuoteContentText(elem, wit, doc)*/
    /************************************** */
    var getQuoteContentText = function(elem, wit, doc) {
        var spanElement;

        if (elem.content !== undefined) {
            if (elem.content.length === 0) {
                var xmlEl = xmlParser.parse(elem._xmlSource.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, ''));
                var el = xmlEl.children[0];
                if (elem.tagName === 'pb') {
                    if (wit !== '' && (el.getAttribute('ed').indexOf(wit) >= 0)) {
                        var newPbElem = document.createElement('span'),
                            id;
                        if (el.getAttribute('ed')) {
                            id  = el.getAttribute('xml:id') || el.getAttribute('ed').replace('#', '')+'-'+el.getAttribute('n'); // || 'page_'+k;
                        } else {
                            id  = el.getAttribute('xml:id'); //|| 'page_'+k;
                        }
                        newPbElem.className = 'pb';
                        newPbElem.setAttribute('data-wit', el.getAttribute('ed'));
                        newPbElem.setAttribute('data-id', id);
                        newPbElem.setAttribute('id', 'pb_'+id);
                        newPbElem.textContent = el.getAttribute('n');
                        spanElement = newPbElem;
                    }
                } else {
                    spanElement = evtParser.parseXMLElement(doc, el, '');
                }
            }
            else if (elem.content.length === 1 && typeof elem.content[0] === 'string') {
                //spanElement = document.createTextNode('FATTO!!!');
                var xmlE = xmlParser.parse(elem._xmlSource.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, ''));
                var e = xmlE.children[0];
                spanElement = evtParser.parseXMLElement(doc, e, '');
            }
            else {
                spanElement = document.createElement('span');
                spanElement.className = elem.tagName;

                var attribKeys = Object.keys(elem.attributes);
                for (var key in attribKeys) {
                    var attrib = attribKeys[key];
                    var value = elem.attributes[attrib];
                    if (attrib !== 'xml:id') {
                        spanElement.setAttribute('data-'+attrib, value);
                    }
                }

                var content = elem.content;
                for (var i in content) {
                    if (typeof content[i] === 'string') {
                        var child = document.createElement('span');
                        child.setAttribute('class', 'textNode');
                        child.appendChild(document.createTextNode(content[i]))
                        spanElement.appendChild(child);
                    } else {
                        if (content[i].type === 'quote') {
                            spanElement.appendChild(parser.getQuoteText(content[i]));
                        } else if (content[i].tagName === 'EVT-POPOVER') {
                            spanElement.appendChild(content[i]);
                        } else if (content[i].type === 'app') {
                            if (wit === '') {
                                spanElement.appendChild(parser.getEntryLemmaText(content[i]));
                            } else {
                                spanElement.appendChild(parser.getEntryWitnessReadingText(content[i], wit));
                            }
                        } else if (content[i].type === 'analogue') {
                            spanElement.appendChild(parser.getAnalogueText(elementContent[i]))
                        } else {
                            var child = getQuoteContentText(content[i], wit, doc);
                            if (child !== undefined) {
                                spanElement.appendChild(child);
                            }
                        }
                    }
                }
            }
        }

        return spanElement;
    }

    /******************* */
    /*getQuoteText(quote)*/
    /******************* */
    parser.getQuoteText = function(quote, wit, doc){
        var spanElement,
            errorElement;

        spanElement = document.createElement('evt-quote');
        spanElement.setAttribute('data-quote-id', quote.id);
        spanElement.setAttribute('data-type', 'quote');
        if (wit !== '' && wit !== undefined){
            spanElement.setAttribute('data-scope-wit', wit);
        }
        var quoteContent = quote.content;

        var link = ['link', 'ptr', 'linkGrp'];

        for (var i in quoteContent) {
            if (typeof quoteContent[i] === 'string') {
                var child = document.createElement('span');
                child.setAttribute('class', 'textNode');
                child.appendChild(document.createTextNode(quoteContent[i]))
                spanElement.appendChild(child);
            } else {
                if (quoteContent[i].tagName === 'EVT-POPOVER') {
                    spanElement.appendChild(quoteContent[i]);
                } else if (quoteContent[i].type === 'app') {
                    if (wit === '') {
                        spanElement.appendChild(parser.getEntryLemmaText(quoteContent[i]));
                    } else {
                        spanElement.appendChild(parser.getEntryWitnessReadingText(quoteContent[i], wit));
                    }
                } else if (quoteContent[i].type === 'quote') {
                    spanElement.appendChild(parser.getQuoteText(quoteContent[i], wit, doc));
                } else if (quoteContent[i].type === 'analogue'){
                    spanElement.appendChild(parser.getAnalogueText(quoteContent[i], wit, doc))
                } else if (quoteContent[i].type === 'quoteContent' && link.indexOf(quoteContent[i].tagName) < 0) {
                     var child = getQuoteContentText(quoteContent[i], wit, doc);
                     if (child !== undefined) {
                         spanElement.appendChild(child);
                     }
                 }
            }
        }

        //console.log(spanElement);
        return spanElement;
    }

    /***********/
    /*ANALOGUES*/
    /***********/

        /****************************/
    /*parseAnalogueContent(elem)*/
    /******************************************************************************/
    /*Creates a new object of type 'analogueContent' that is added to the analogue*/
    /*content array.                                                              */
    /* @elem --> element nested in an AnalogueDef that has to be parsed           */
    /**************************************************************************** */
    var parseAnalogueContent = function(elem) {
        var contentEl = {
            tagName : elem.tagName,
            type : 'analogueContent',
            attributes: [],
            content : [],
            _xmlSource: elem.outerHTML
        };
        
        if (elem.attributes) {
            for (var i = 0; i < elem.attributes.length; i++) {
                var attrib = elem.attributes[i];
                if (attrib.specified) {
                    contentEl.attributes[attrib.name] = attrib.value;
                }
            }
        }

        angular.forEach(elem.childNodes, function(child) {
            if (child.nodeType === 3) {
                if (child.textContent.trim() !== '') {
                    contentEl.content.push(child.textContent.trim());
                }
            } else if (child.nodeType === 1) {
                var subst = angular.element(child)["0"].innerHTML.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, '');
                var childXml = angular.element(child)["0"].outerHTML.replace(subst, '');

                if (quoteDef.indexOf('<'+child.tagName+'>') >= 0) {
                    contentEl.content.push(evtSourcesParser.parseQuote(child));
                } else if (apparatusEntryDef.indexOf('<'+child.tagName+'>') >= 0) {
                    contentEl.content.push(evtCriticalApparatusParser.handleAppEntry(child));
                } else if (evtParser.createRegExpr(analogueDef).test(childXml)) {
                    contentEl.content.push(parser.parseAnalogue(child));
                }/* else if (child.tagName === 'witDetail') {
                    contentEl.content.push(evtCriticalApparatusParser.parseWitDetail(child));
                }*/ else if (child.tagName === 'note') {
                    contentEl.content.push(evtParser.parseNote(child));
                } else if (child.children.length > 0) {
                    for (var i = 0; i < child.children.length; i++) {
                        contentEl.content.push(child.children[i].cloneNode(true));
                        parseAnalogueContent(child.children[i])
                    }
                } else {
                    contentEl.content.push(parseAnalogueContent(child));
                }
            }
        });

        return contentEl;
    }
    
    /**********************/
    /*parseAnalogue(entry)*/
    /*****************************************************************************************/
    /*Saves all the information about the parsed XML Element in an object of type 'analogue'.*/
    /*@entry --> XML element to be parsed                                                    */
    /*************************************************************************************** */
    parser.parseAnalogue = function(entry) {
        var analogue = {
            id : '',
            type : '',
            attributes : [],
            content : [],
            sources : [],
            _indexes : {
                sourceId : [],
                sourceRefId : [],
                subAnalogues : []
            },
            _subAnalogue : false,
            _xmlSource : entry.outerHTML || ''
        }

        //Parsing the id or creating it with the evtParser.xpath method
        var id = entry.getAttribute('xml:id') || evtParser.xpath(entry).substr(1);
        analogue.id = id;

        //Parsing the attributes
        if (entry.attributes) {
            for (var i = 0; i < entry.attributes.length; i++) {
                var attrib = entry.attributes[i];
                if (attrib.specified) {                    
                    analogue.attributes[attrib.name] = attrib.value;                 
                }
                /*If there is a source or corresp or ref attribute, its values
                are saved inside the sourceRefId array*/
                if (attrib.name === 'source') {
                    var values = attrib.value.replace(/#/g, '').split(" ");
                    analogue._indexes.sourceRefId = values;
                }
                if (attrib.name === 'corresp') {
                    var values = attrib.value.replace(/#/g, '').split(" ");
                    analogue._indexes.sourceRefId = values;
                }
                if (attrib.name === 'ref') {
                    var values = attrib.value.replace(/#/g, '').split(" ");
                    analogue._indexes.sourceRefId = values;
                }
            }
        }

        //Nesting of the current analogueDef element in another analogueDef element
        //reg expr needed! or other solution :/

        //Parsing the contents
        angular.forEach(entry.childNodes, function(child) {
            if (child.nodeType === 3) {
                if (child.textContent.trim() !== '') {
                    analogue.content.push(child.textContent.trim());
                }
            } else if (child.nodeType === 1) {

                var subst = angular.element(child)["0"].innerHTML.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, '');
                var childXml = angular.element(child)["0"].outerHTML.replace(subst, '');
                //Array of TEI-elements for bibliographic references
                var biblEl = ['bibl', 'biblStruct', 'biblFull', 'msDesc'];
                //Array of TEI-elements for pointers
                var linkEl = ['ptr', 'ref', 'link'];

                //Parsing bibliographic references
                //If there is a listBibl...
                if (child.tagName === 'listBibl') {
                    //...parse the childNodes that are a link or a ptr
                    for (var i = 0; i < child.children.length; i++) {
                        if (biblEl.indexOf(child.children[i].tagName) >= 0) {
                            var bibl = parser.parseSource(child.children[i], entry);
                            //...then add their id to the sourceId array.
                            analogue._indexes.sourceId.push(bibl.id);
                            analogue.sources.push(bibl);
                            analogue.content.push(bibl);
                        } else {
                            analogue.content.push(parseAnalogueContent(child.children[i]));
                        }
                    }
                } // If there is a bibliographic element, parse it as a Source.
                  else if (biblEl.indexOf(child.tagName) >= 0) {
                    var bib = parser.parseSource(child, entry);
                    //Then add its id to the sourceId array.
                    analogue._indexes.sourceId.push(bib.id);
                    analogue.sources.push(bib);
                    analogue.content.push(bib);
                } //If there is a link or pointer or ref...
                  else if (linkEl.indexOf(child.tagName) >= 0) {
                    analogue.content.push(parseAnalogueContent(child));
                    if (child.hasAttribute('target')) {
                        var attrib = child.getAttribute('target');
                        var values = attrib.replace(/#/g, '').split(" ");
                        for (var i = 0; i < values.length; i++) {
                            //...add its target values to the sourceRefId array.
                            analogue._indexes.sourceRefId.push(values[i]);
                        }
                    }
                } //If there is a linkGrp...
                  else if (child.tagName === 'linkGrp') {
                      //...parse the children...
                    for (var i = 0; i < child.children.length; i++) {
                        if (linkEl.indexOf(child.children[i].tagName) >= 0) {
                            analogue.content.push(parseAnalogueContent(child.children[i]));
                            if (child.children[i].hasAttribute('target')) {
                                var attr = child.children[i].getAttribute('target');
                                var val = attr.replace(/#/g, '').split(" ");
                                for (var i = 0; i < val.length; i++) {
                                    //...and add their target values to the SourceRefId array.
                                    analogue._indexes.sourceRefId.push(val[i]);
                                }
                            }
                        }
                    }
                } //If there is an apparatus Entry, parse it with handleAppEntry.
                  else if (apparatusEntryDef.indexOf('<'+child.tagName+'>') >= 0) {
                    analogue.content.push(parser.handleAppEntry(child));
                } //If there is a nested quote, parse it recursively.
                  else if (quoteDef.indexOf('<'+child.tagName+'>') >= 0) {
                    analogue.content.push(parser.parseQuote(child));
                } else if (evtParser.createRegExpr(analogueDef).test(childXml)) {
                    analogue.content.push(parser.parseAnalogue(child));
                }/*else if (child.tagName === 'witDetail') {
                    content.push(evtCriticalApparatusParser.parseWitDetail(child));
                }*/ else if (child.tagName === 'note') {
                    analogue.content.push(evtParser.parseNote(child));
                } 
                  else {
                    analogue.content.push(parseAnalogueContent(child));
                }
            }
        });

        if (analogue._indexes.sourceId.length !== 0 || analogue._indexes.sourceRefId.length !== 0) {
            analogue.type = 'analogue';
        }

        return analogue;
    }

    /******************* */
    /*parseSource(source)*/
    /*************************************************************************** */
    /*Parses the source element in order to then push it inside the corresponding*/
    /*analogue array                                                             */
    /* @source --> XML element to be parsed                                      */
    /*************************************************************************** */
    parser.parseAnalogueSource = function(entry) {
        var source = {
            id : '',
            abbr: {
                title: [],
                author: [],
                msId: []
            },
            attributes : [],
            bibl : [],
            text : [],
            url : [],
            _xmlSource : entry.outerHTML || ''
        }

        //Parsing the attributes and creating source.id
        var id;
        if (entry.attributes) {
            for (var i = 0; i < entry.attributes.length; i++) {
                var attrib = entry.attributes[i];
                if (attrib.specified) {
                    if (attrib.name === 'xml:id') {
                        id = attrib.value;
                    }
                    if (attrib.name === 'target' ||
                        attrib.name === 'source' ||
                        attrib.name === 'ref') {
                            var values = attrib.value.replace(/#/g, '').split(" ");
                            for (var i = 0; i < values.length; i++) {
                                url.push(values[i]);
                            }
                        }
                    source.attributes[attrib.name] = attrib.value;
                    source.attributes.length++;
                }
            }
        }
        if (id === undefined) {
            id = evtParser.xpath(entry).substr(1);
        }
        source.id = id;

        var elem = angular.element(entry);
        if (entry.tagName === 'msDesc') {
            angular.forEach(elem.find('idno'), function(el) {
                source.abbr.msId.push(parseAnalogueSourceContent(el));
            });
        } else {
            angular.forEach(elem.find('author'), function(el) {
                source.abbr.author.push(parseAnalogueSourceContent(el));
            });
            angular.forEach(elem.find('title'), function(el) {
                source.abbr.title.push(parseAnalogueSourceContent(el));
            });
        }

        angular.forEach(entry.childNodes, function(child){
            if (child.nodeType === 3) {
                if (child.textContent.trim() !== '') {
                    source.bibl.push(child.textContent.trim());
                }
            }
            else if (child.nodeType === 1) {
                //Array of TEI-elements for pointers
                var linkEl = ['ptr', 'ref', 'link'];

                if (entry.tagName === 'cit' && child.tagName === 'quote') {
                    var contentEl = parseSourceContent(child);
                    source.text.push(contentEl);
                } else if (linkEl.indexOf(child.tagName) >= 0) {
                    if (child.tagName === 'ref') {
                        source.bibl.push(parseSourceContent(child));
                    } else {
                        source.bibl.push(child);
                    }
                    if (child.hasAttribute('target')) {
                        var attrib = child.getAttribute('target');
                        var val = attrib.replace(/#/g, '').split(" ");
                        for (var i = 0; i < val.length; i++) {
                            //...add its target values to the url array.
                            source.url.push(val[i]);
                        }
                    }
                } //If there is a linkGrp...
                  else if (child.tagName === 'linkGrp') {
                      //...parse the children...
                    for (var i = 0; i < child.children.length; i++) {
                        if (linkEl.indexOf(child.children[i].tagName) >= 0) {
                            if (child.tagName === 'ref') {
                                source.bibl.push(parseSourceContent(child));
                            } else {
                                source.bibl.push(child.children[i]);
                            }
                            if (child.children[i].hasAttribute('target')) {
                                var attr = child.children[i].getAttribute('target');
                                var val = attr.replace(/#/g, '').split(" ");
                                for (var i = 0; i < val.length; i++) {
                                    //...and add their target values to the url array.
                                    source.url.push(val[i]);
                                }
                            }
                        }
                    }
                } else if (child.tagName === 'citedRange') {
                    if (child.getAttribute('target') !== null && child.getAttribute('target') !== '') {
                        source.url.push(child.getAttribute('target'));
                    }
                } else {
                    childContent = parseSourceContent(child, entry)
                    if (childContent.tagName === 'author') {
                        source.author.push(childContent.content);
                    }
                    if (childContent.tagName === 'title') {
                        source.title = childContent.content;
                    }
                    source.bibl.push(childContent);
                    for (var i = 0; i < childContent.url.length; i++) {
                        source.url.push(childContent.url[i]);
                    }
                }
            }
        });

        return source;
    }

    /************************ */
    /*parseSourceContent(elem)*/
    /*******************************************************************/
    /* Function to parse the element contained inside a source element.*/
    /* @ elem --> element to be parsed                                 */
    /*******************************************************************/
    var parseAnalogueSourceContent = function (elem){
        var contentEl = {
            tagName : elem.tagName,
            type : 'sourceContent',
            attributes: [],
            content : [],
            url: []
        };
        
        if (elem.attributes) {
            for (var i = 0; i < elem.attributes.length; i++) {
                var attrib = elem.attributes[i];
                if (attrib.specified) {
                    contentEl.attributes[attrib.name] = attrib.value;
                }
            }
        }

        angular.forEach(elem.childNodes, function(child) {
            if (child.nodeType === 3) {
                if (child.textContent.trim() !== '') {
                    contentEl.content.push(child.textContent.trim());
                }
            } else if (child.nodeType === 1) {
                if (child.tagName === 'citedRange') {
                    if (child.getAttribute('target') !== null && child.getAttribute('target') !== '') {
                        contentEl.url.push(child.getAttribute('target'));
                    }
                } else if (child.children.length > 0) {
                    for (var i = 0; i < child.children.length; i++) {
                        contentEl.content.push(parseSourceContent(child.children[i]));                        
                    }
                } else {
                    contentEl.content.push(parseSourceContent(child));
                }
            }
        });

        return contentEl;
    }

    /************************************** */
    /*getAnalogueContentText(elem, wit, doc)*/
    /************************************** */
    var getAnalogueContentText = function(elem, wit, doc) {
        var spanElement;

        if (elem.content !== undefined) {
            if (elem.content.length === 0) {
                var xmlEl = xmlParser.parse(elem._xmlSource.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, ''));
                var el = xmlEl.children[0];
                if (elem.tagName === 'pb') {
                    if (wit !== '' && (el.getAttribute('ed').indexOf(wit) >= 0)) {
                        var newPbElem = document.createElement('span'),
                            id;
                        if (el.getAttribute('ed')) {
                            id  = el.getAttribute('xml:id') || el.getAttribute('ed').replace('#', '')+'-'+el.getAttribute('n'); // || 'page_'+k;
                        } else {
                            id  = el.getAttribute('xml:id'); //|| 'page_'+k;
                        }
                        newPbElem.className = 'pb';
                        newPbElem.setAttribute('data-wit', el.getAttribute('ed'));
                        newPbElem.setAttribute('data-id', id);
                        newPbElem.setAttribute('id', 'pb_'+id);
                        newPbElem.textContent = el.getAttribute('n');
                        spanElement = newPbElem;
                    }
                } else {
                    spanElement = evtParser.parseXMLElement(doc, el, '');
                }
            }
            else if (elem.content.length === 1 && typeof elem.content[0] === 'string') {
                var xmlE = xmlParser.parse(elem._xmlSource.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, ''));
                var e = xmlE.children[0];
                spanElement = evtParser.parseXMLElement(doc, e, '');
            }
            else {
                spanElement = document.createElement('span');
                spanElement.className = elem.tagName;

                var attribKeys = Object.keys(elem.attributes);
                for (var key in attribKeys) {
                    var attrib = attribKeys[key];
                    var value = elem.attributes[attrib];
                    if (attrib !== 'xml:id') {
                        spanElement.setAttribute('data-'+attrib, value);
                    }
                }

                var content = elem.content;
                for (var i in content) {
                    if (typeof content[i] === 'string') {
                        spanElement.appendChild(document.createTextNode(content[i]));
                    } else {
                        if (content[i].type === 'quote') {
                            spanElement.appendChild(parser.getQuoteText(content[i]));
                        } else if (content[i].tagName === 'EVT-POPOVER') {
                            spanElement.appendChild(content[i]);
                        } else if (content[i].type === 'app') {
                            if (wit === '') {
                                spanElement.appendChild(parser.getEntryLemmaText(content[i]));
                            } else {
                                spanElement.appendChild(parser.getEntryWitnessReadingText(content[i], wit));
                            }
                        } else if (content[i].type === 'analogue') {
                            spanElement.appendChild(parser.getAnalogueText(content[i]));
                        } else {
                            var child = getAnalogueContentText(content[i], wit, doc);
                            if (child !== undefined) {
                                spanElement.appendChild(child);
                            }
                        }
                    }
                }
            }
        }

        return spanElement;
    }

    /***************************/
    /*getAnalogueText(analogue)*/
    /***************************/
    parser.getAnalogueText = function(analogue, wit, doc){
        var spanElement,
            errorElement; //TO DO: implementare gestione errore

        spanElement = document.createElement('evt-analogue');
        spanElement.setAttribute('data-analogue-id', analogue.id);
        spanElement.setAttribute('data-type', 'analogue');
        if (wit !== '' && wit !== undefined){
            spanElement.setAttribute('data-scope-wit', wit);
        }
        var analogueContent = analogue.content;

        var link = ['link', 'ptr', 'linkGrp'];

        for (var i in analogueContent) {
            if (typeof analogueContent[i] === 'string') {
                var child = document.createElement('span');
                child.setAttribute('class', 'textNode');
                child.appendChild(document.createTextNode(analogueContent[i]))
                spanElement.appendChild(child);
            } else {
                if (analogueContent[i].tagName === 'EVT-POPOVER') {
                    spanElement.appendChild(analogueContent[i]);
                } else if (analogueContent[i].type === 'app') {
                    if (wit === '') {
                        spanElement.appendChild(parser.getEntryLemmaText(analogueContent[i]));
                    } else {
                        spanElement.appendChild(parser.getEntryWitnessReadingText(analogueContent[i], wit));
                    }
                } else if (analogueContent[i].type === 'quote') {
                    spanElement.appendChild(parser.getQuoteText(analogueContent[i], wit, doc));
                } else if (analogueContent[i].type === 'analogue') {
                    spanElement.appendChild(parser.getAnalogueText(analogueContent[i]));
                }
                 else if (analogueContent[i].type === 'analogueContent' && link.indexOf(analogueContent[i].tagName) < 0) {
                     var child = getAnalogueContentText(analogueContent[i], wit, doc);
                     if (child !== undefined) {
                         spanElement.appendChild(child);
                     }
                 } else {
                     if (analogueContent[i].content !== undefined && analogueContent[i].content.length !== 0) {
                         var child = getAnalogueContentText(analogueContent[i], wit, doc);
                         if (child !== undefined) {
                            spanElement.appendChild(child);
                        }
                    }
                 }
            }
        }

        //console.log(spanElement);
        return spanElement;
    }

    return parser;
})