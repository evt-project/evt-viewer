angular.module('evtviewer.dataHandler')

.service('evtCriticalParser', function(parsedData, evtParser) {
    var parser = {};

    /* ******************** */
    /* parseListWit(listWit) */
    /* ********************************************************** */
    /* Function to parse a list of witnesses                      */
    /* @return a json object containing the list info read        */
    /* ********************************************************** */
    var parseListWit = function(listWit) {
        var list = {
            id          : listWit.getAttribute('xml:id'),
            type        : 'group',
            name        : '',
            content     : {
                length : 0
            }
        };
        
        angular.forEach(listWit.children, function(child){
            if (child.tagName === 'head') {
                list.name = child.innerHTML;
            }
            else if (child.tagName === 'listWit') {
                var subList = parseListWit(child);
                list.content[list.content.length] = subList.id;
                list.content[subList.id] = subList;
                list.content.length++;
            } 
            else {
                var witness = {
                    id          : child.getAttribute('xml:id'),
                    type        : 'witness',
                    name        : child.innerHTML,
                    group       : list.id
                };
                list.content[list.content.length] = witness.id;
                list.content[witness.id] = witness;
                list.content.length++;
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
        angular.forEach(currentDocument.find('listWit'), 
            function(element) {
                if ( !evtParser.isNestedInElem(element, 'listWit') ) {
                    angular.forEach(element.children, function(child){
                        if (child.tagName === 'listWit') {
                            var subList = parseListWit(child);
                            parsedData.addWitness(subList);
                        } else {
                            var witness = {
                                id          : child.getAttribute('xml:id'),
                                type        : 'witness',
                                name        : child.innerHTML
                            };
                            parsedData.addWitness(witness);
                        }
                    });
                }
        });
        // console.log('## Witnesses ##', parsedData.getWitnesses());
    };

    /* ********************* */
    /* parseAppReading(elem) */
    /* ******************************************************************* */
    /* Function to parse the XML element representing an apparatus reading */
    /* (<lem> o <rdg> in XML-TEI P5)                                       */
    /* @elem element -> xml element to be parsed                           */
    /* @return a json object representing the apparatus reading read       */
    /* ******************************************************************* */
    // It will save every attribute of the XML element
    // and then cycle its children in order to find eventual nested apparatus entries or groups:
    // - for each element representing a group or a nested apparatus entry (<rdgGrp> o <app> in XML-TEI P5) 
    //   it will call the function parseAppEntry(element) and then add the resulting json object in the "content" attribute of the reading object
    // - for each element representing a note (<note> in XML-TEI P5) 
    //   it will save its content in the "note" attribute of the reading object
    // – for any other kind of element 
    //   it will add its content in the "content" attribute of the reading object
    var parseAppReading = function(elem){
        var reading = {
            id           : elem.getAttribute('xml:id') || evtParser.xpath(elem).substr(1),
            attributes   : { },
            content      : [ ],
            note         : '',
            __xmlElem    : elem.tagName,
            __xmlContent : elem.innerHTML
        };
        for (var i = 0; i < elem.attributes.length; i++) {
            var attrib = elem.attributes[i];
            if (attrib.specified) {
                reading.attributes[attrib.name] = attrib.value;
            }
        }
        angular.forEach(elem.childNodes, function(child) {
            if (child.nodeType === 3) {
                if (child.textContent.trim() !== '') {
                    reading.content.push(child.textContent.trim());
                }
            } else if (child.tagName === 'rdgGrp' || child.tagName === 'app') {
                reading.content.push(parseAppEntry(child));
            } else if (child.tagName === 'note') {
                reading.note = child.innerHTML;
            } else {
                reading.content.push(child.outerHTML.trim());
            }
        });
        
        return reading;
    };

    /* ****************** */
    /* parseAppEntry(app) */
    /* ********************************************************************************** */
    /* Function to parse the XML element representing an apparatus entry or a group       */
    /* (<app> o <rdgGrp> in XML-TEI P5)                                                   */
    /* @app element -> xml element representing the apparatus entry or group to be parsed */
    /* @return a json object representing the apparatus entry read                        */
    /* ********************************************************************************** */
    // It will save every attribute of the XML element
    // and then cycle its children in order to find eventual nested apparatus entries or groups:
    // - for each element representing a group or a nested apparatus entry (<rdgGrp> o <app> in XML-TEI P5) 
    //   it will call the function parseAppEntry(element) and then add the resulting json object in the "readings" attribute of the entry object
    // - for each element representing a reading (<lem> o <rdg> in XML-TEI P5) 
    //   it will call the function parseAppReading(element) and then add the resulting json object in the "readings" attribute of the entry object.
    // - for each element representing an accepted reading (<lem> in XML-TEI P5) 
    //   it will also save the reference in the "lemma" attribute of the entry object
    // - for each element representing a note (<note> in XML-TEI P5) 
    //   it will save its content in the "note" attribute of the entry object
    var parseAppEntry = function(app) {
        var entry = { 
                id         : app.getAttribute('xml:id')  || evtParser.xpath(app).substr(1),
                attributes : { },
                lemma      : '',
                readings   : { 
                    length      : 0,
                    __elemTypes : { },
                },
                note       : '',
                // __xmlContent: app.innerHTML
            };
        for (var i = 0; i < app.attributes.length; i++) {
            var attrib = app.attributes[i];
            if (attrib.specified) {
                entry.attributes[attrib.name] = attrib.value;
            }
        }
        
        angular.forEach(app.children, function(child){
            if (child.tagName === 'lem' || child.tagName === 'rdg') {
                var reading  = parseAppReading(child);
                
                if (child.tagName === 'lem') {
                    entry.lemma = reading.id;
                }
                entry.readings.__elemTypes[reading.id] = child.tagName;
                entry.readings[entry.readings.length]  = reading.id;
                entry.readings[reading.id]             = reading;
                entry.readings.length++;
            } 
            else if (child.tagName === 'rdgGrp' || child.tagName === 'app') {
                var entryObj = parseAppEntry(child);
                entry.readings.__elemTypes[entryObj.id] = child.tagName;
                entry.readings[entry.readings.length]   = entryObj.id;
                entry.readings[entryObj.id]             = entryObj;
                entry.readings.length++;
            } else if ( child.tagName === 'note' ) {
                entry.note = child.innerHTML;
            } 
        });
        return entry;
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
        angular.forEach(currentDocument.find('app'), 
            function(element) {
                var entry = parseAppEntry(element);
                parsedData.addCriticalEntry(entry, entry.id);
        });
        // console.log('## Critical entries ##', JSON.stringify(parsedData.getCriticalEntries()));
        // console.log('## Critical entries ##', parsedData.getCriticalEntries());
    };

    /* ******* */
    /* WITNESS */
    /* ******* */
    var containsWitnessReading = function(elem, witObj) {
        return (witObj.group !== undefined && elem.indexOf('#'+witObj.group) >= 0) || 
                (elem.indexOf('#') >= 0 && elem.indexOf('#'+witObj.id) >= 0) || 
                elem.indexOf(witObj.id) >= 0;
    };

    /* ******************************************** */
    /* parseWitnessApp(app, wit, evtReadingElement) */
    /* ******************************************************************************** */
    /* Function to parse an XML node representing an apparatus entry                    */
    /* and filter its content for a particular witness                                  */
    /* @app XML element representing an apparatus entry                                 */
    /* @wit sigla of the witness                                                        */
    /* @evtReadingElement reference to the HTML element for the apparatus entry of @wit */
    /* ******************************************************************************** */
    // It will save every attribute of the XML element in a data-* attribute
    // (excluding @xml:id and @wit that will be handled differently)
    // and add them into the possible critical entry filters with parsedData.addCriticalEntryFilter()
    // if the entry contains a reading for the specified witness (@wit)
    // the function will look for it into the app children
    // otherwise if there is a lemma it will choose this one
    // The children cycle will consider
    // – textual nodes
    // – lemma/reading for the specified witness
    // – nested group of readings or sub-apparatus
    // The parsed content will be appended to the evtReadingElement
    var parseWitnessApp = function(app, witObj, evtReadingElement) {
        var wit = witObj.id;
        var attrib;
        for (var k = 0; k < app.attributes.length; k++) {
            attrib = app.attributes[k];
            if (attrib.specified) {
                if (attrib.name !== 'xml:id' && attrib.name !== 'wit') {
                    evtReadingElement.setAttribute('data-'+attrib.name, attrib.value);
                    parsedData.addCriticalEntryFilter(attrib.name, attrib.value);
                }
            }
        }

        if ( containsWitnessReading(app.innerHTML, witObj) ) {
            var children = app.childNodes;
            for (var i = 0; i < children.length; i++) {
                var childNode = children[i];
                if (childNode.nodeType === 3 ) { // Text
                    evtReadingElement.appendChild(childNode.cloneNode(true));
                } else {
                    if (childNode.tagName === 'lem' || childNode.tagName === 'rdg') {
                        if ( childNode.getElementsByTagName('app').length > 0 || 
                             childNode.getElementsByTagName('rdgGrp').length > 0 ) {
                            if ( childNode.innerHTML.indexOf('#'+wit) >= 0 || 
                                (witObj.group !== undefined && childNode.innerHTML.indexOf('#'+witObj.group) >= 0)) {
                                parseWitnessApp(childNode, witObj, evtReadingElement);
                                evtReadingElement.setAttribute('data-reading-type', childNode.tagName);
                            }
                        } else {
                            if ( childNode.getAttribute('wit') !== null ) {
                                if (containsWitnessReading(childNode.getAttribute('wit'), witObj)) {
                                    // evtReadingElement.appendChild(evtParser.parseXMLElement(childNode));
                                    evtReadingElement.appendChild(childNode.cloneNode(true));
                                    evtReadingElement.setAttribute('data-reading-type', childNode.tagName);
                                    for (var j = 0; j < childNode.attributes.length; j++) {
                                        attrib = childNode.attributes[j];
                                        if (attrib.specified) {
                                            if (attrib.name !== 'xml:id' && attrib.name !== 'wit') {
                                                evtReadingElement.setAttribute('data-entry-attr-'+attrib.name, attrib.value);
                                                parsedData.addCriticalEntryFilter(attrib.name, attrib.value);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    } else if (childNode.tagName === 'rdgGrp') {
                        if (containsWitnessReading(childNode.innerHTML, witObj)) {
                            parseWitnessApp(childNode, witObj, evtReadingElement);
                        }
                    } else if (childNode.tagName === 'app') {
                        if (containsWitnessReading(childNode.innerHTML, witObj)) {
                            var id         = childNode.getAttribute('xml:id') || evtParser.xpath(childNode).substr(1),
                                newElement = document.createElement('evt-reading');
                            newElement.setAttribute('data-entry-id', evtParser.xpath(childNode.parentNode).substr(1));
                            newElement.setAttribute('data-app-id', id);
                            parseWitnessApp(childNode, witObj, newElement);
                            evtReadingElement.appendChild(newElement);
                        }
                    } else {
                        evtReadingElement.appendChild(childNode.cloneNode(true));
                    }   
                }
            }
        } else {
            if ( app.getElementsByTagName('lem').length > 0) {
                var lem = app.getElementsByTagName('lem')[0];
                evtReadingElement.appendChild(evtParser.parseXMLElement(lem));
            }
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
                newPbElem.textContent = pbNode.getAttribute('n');
                pbNode.parentNode.replaceChild(newPbElem, pbNode);
            } else {
                pbNode.parentNode.removeChild(pbNode); 
            }
        }
    };

    /* ******************************** */
    /* parseWintessLacunas(docDOM, wit) */
    /* ******************************** */
    /* Function to parse lacuna start/end */
    /* @docDOM -> XML to be parsed        */
    /* @wit -> witness specified          */
    /* ********************************** */
    parser.parseWintessLacunas = function(docDOM, witObj) {
        var startLacunas = docDOM.getElementsByTagName('lacunaStart'),
            endLacunas   = docDOM.getElementsByTagName('lacunaEnd'),
            startLacunasWit = [],
            endLacunasWit   = [];
        for (var i = 0; i < startLacunas.length; i++) {
            if (startLacunas[i].getAttribute('wit') !== null &&
                containsWitnessReading(startLacunas[i].getAttribute('wit'), witObj)) {
                    startLacunasWit.push(startLacunas[i]);
            } else if ( startLacunas[i].parentNode.getAttribute('wit') !== null &&
                        containsWitnessReading(startLacunas[i].parentNode.getAttribute('wit'), witObj)){
                startLacunasWit.push(startLacunas[i]);
            }
        }
        for (var j = 0; j < endLacunas.length; j++) {
            if (endLacunas[j].getAttribute('wit') !== null &&
                containsWitnessReading(endLacunas[j].getAttribute('wit'), witObj)) {
                    endLacunasWit.push(endLacunas[j]);
            } else if ( endLacunas[j].parentNode.getAttribute('wit') !== null &&
                        containsWitnessReading(endLacunas[j].parentNode.getAttribute('wit'), witObj)){
                endLacunasWit.push(endLacunas[j]);
            }
        }
        for(var k = startLacunasWit.length-1; k >= 0; k--) {
            var appStart = startLacunasWit[k].parentNode.parentNode;
            var appEnd   = endLacunasWit[k].parentNode.parentNode;

            var newElement = document.createElement('span');
            newElement.setAttribute('data-wit', witObj.id);

            newElement.className = 'lacunaStart';
            startLacunasWit[k].parentNode.replaceChild(newElement.cloneNode(true), startLacunasWit[k]);
            newElement.className = 'lacunaEnd';
            endLacunasWit[k].parentNode.replaceChild(newElement.cloneNode(true), endLacunasWit[k]);
            
            var match = '<evt-reading.*data-app-id.*'+appStart.getAttribute('data-app-id')+'.*<\/evt-reading>(.|[\r\n])*?<evt-reading.*data-app-id.*'+appEnd.getAttribute('data-app-id')+'.*<\/evt-reading>';
            var sRegExInput = new RegExp(match, 'ig'); 
            docDOM.innerHTML = evtParser.balanceXHTML(docDOM.innerHTML.replace(sRegExInput, appStart.outerHTML+'<span class="lacuna">[LACUNA] </span>'+appEnd.outerHTML));
        }
    };


    /* ************************** */
    /* parseWitnessText(doc, wit) */
    /* ************************************************************************************** */
    /* Function to parse the XML of the document and generate the text of a specified witness */
    /* @doc -> XML to be parsed                                                               */
    /* @wit -> witness specified                                                              */
    /* ************************************************************************************** */
    // - It will look for every critical entries (<app> in XML-TEI P5),
    //   tranform them into evtReading directive, 
    //   and parse its content with the function parseWitnessApp() 
    //   in order to show only the reading of the specified witness
    // – It will parse the pages of the specified witness parseWintessPageBreaks()
    // – It will transform every element representing a note (<note> in XML-TEI P5)
    //   into an evtPopover directive
    // Before returning the parsed text it will store it (parsedData.addWitnessText())
    // in order to avoid the system to parse it every time it is needed
    parser.parseWitnessText = function(doc, wit) {
        var witnessText;
        if ( doc !== undefined ) {
            var docDOM = doc.documentElement.getElementsByTagName('body')[0],
                witObj = parsedData.getWitnessById(wit),
                apps   = docDOM.getElementsByTagName('app'),
                j      = apps.length-1, 
                count  = 0;
            docDOM.innerHTML = docDOM.innerHTML.replace(/>[\s\r\n]*?</g,'><');

            while(j < apps.length && j >= 0) {
                var appNode = apps[j];
                if (!evtParser.isNestedInElem(appNode, 'app')) {
                    // var id: appNode.getAttribute('xml:id') || evtParser.xpath(appNode).substr(1),
                    var id          = appNode.getAttribute('xml:id') || evtParser.xpath(appNode).substr(1), //'app-'+count,
                        spanElement = document.createElement('evt-reading');
                    spanElement.setAttribute('data-app-id', id);
                    parseWitnessApp(appNode, witObj, spanElement);
                    appNode.parentNode.replaceChild(spanElement, appNode);
                    count++;
                }
                j--;
            }
            docDOM.innerHTML = docDOM.innerHTML.replace(/>[\s\r\n]*?</g,'><');
            //parse <pb>
            parser.parseWintessPageBreaks(docDOM, witObj);
            //parse lacunas
            parser.parseWintessLacunas(docDOM, witObj);
            //parse lines
            evtParser.parseLines(docDOM);
            //parse <note>
            evtParser.parseNote(docDOM);
            witnessText = docDOM.innerHTML;
        } else {
            witnessText = '<span>Testo non disponibile.</span>';
        }
        witnessText = evtParser.balanceXHTML(witnessText);
        //save witness text
        parsedData.addWitnessText(wit, witnessText);
        // console.log('## Witnesses Texts ##', parsedData.getWitnessesTextsCollection());
        return witnessText;
    };

    /* ************* */
    /* CRITICAL TEXT */
    /* ************* */

    /* ************************************* */
    /* parseCriticalTextApp(app, lemElement) */
    /* ******************************************************************************** */
    /* Function to parse an XML node representing an apparatus entry                    */
    /* and filter its content for the critical text                                     */
    /* @app XML element representing an apparatus entry                                 */
    /* @lemElement reference to the HTML element representing the critical lemma        */
    /* ******************************************************************************** */
    // It will save every attribute of the XML element in a data-* attribute
    // (excluding @xml:id that will be handled differently)
    // if the entry contains a lemma
    // the function will look for it into the app children
    // otherwise it will append the content of every alternative reading to the lemElement
    // The children cycle will consider
    // – textual nodes
    // – lemma 
    // – nested group of readings or sub-apparatus both in the app node and in the chil node
    // The parsed content will be appended to the lemElement
    // For very reading or group of readings found it will add a criticalEntryFilter 
    // based on the attribute of the node parsedData.addCriticalEntryFilter()
    var parseCriticalTextApp = function(app, lemElement){
        var attrib;
        for (var k = 0; k < app.attributes.length; k++) {
            attrib = app.attributes[k];
            if (attrib.specified) {
                if (attrib.name !== 'xml:id') {
                    lemElement.setAttribute('data-'+attrib.name, attrib.value);
                }
            }
        }
        var variance = 0;
        if ( app.getElementsByTagName('lem').length > 0 ) {
            var children = app.childNodes;
            for (var i = 0; i < children.length; i++) {
                var childNode = children[i];
                if (childNode.nodeType === 3 ) { // Text
                    lemElement.appendChild(childNode.cloneNode(true));
                } else {
                    if (childNode.tagName === 'lem') {
                        if ( childNode.getElementsByTagName('app').length > 0 ) {
                            if ( childNode.getElementsByTagName('lem').length > 0 ) {
                                parseCriticalTextApp(childNode, lemElement);
                            }
                        } else {
                            // lemElement.appendChild(childNode.cloneNode(true));
                            lemElement.appendChild(evtParser.parseXMLElement(childNode));
                        }
                    } else if (childNode.tagName === 'app') {
                        if ( childNode.getElementsByTagName('lem').length > 0 ) {
                            var id         = childNode.getAttribute('xml:id') || evtParser.xpath(childNode).substr(1),
                                newElement = document.createElement('evt-reading');
                            newElement.setAttribute('data-entry-id', evtParser.xpath(childNode.parentNode).substr(1));
                            newElement.setAttribute('data-app-id', id);
                            parseCriticalTextApp(childNode, newElement);
                            lemElement.appendChild(newElement);
                        }
                    } else if (childNode.tagName !== 'rdg' && childNode.tagName !== 'rdgGrp') {
                        lemElement.appendChild(childNode.cloneNode(true));
                    }   
                    if (childNode.tagName === 'lem' || childNode.tagName === 'rdg' || childNode.tagName === 'rdgGrp' || childNode.tagName === 'app') {
                        variance++;
                        for (var j = 0; j < childNode.attributes.length; j++) {
                            attrib = childNode.attributes[j];
                            if (attrib.specified) {
                                if (attrib.name !== 'xml:id') {
                                    if (childNode.tagName === 'lem') {    
                                        lemElement.setAttribute('data-'+attrib.name, attrib.value);
                                    }
                                    if (attrib.name !== 'wit') {
                                        parsedData.addCriticalEntryFilter(attrib.name, attrib.value);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } else {
            // There are no <lem> elements
            var rdgs = app.getElementsByTagName('rdg'),
                wits = '';

            if ( rdgs.length > 0) {
                var lemElem = document.createElement('span'),
                    lemText = '{';
                for (var x = 0; x < rdgs.length; x++) {
                    var rdgNode = rdgs[x];
                    lemText    += rdgNode.textContent+', ';
                    wits       += rdgNode.getAttribute('wit');
                }
                lemText = lemText.slice(0, -2)+'}';
                
                lemElem.textContent = lemText;
                lemElement.appendChild(lemElem);
                lemElement.setAttribute('data-wit', wits);
            }
            variance += rdgs.length;
        }
        lemElement.setAttribute('data-variance', variance);
    };

    /* ************************** */
    /* parseCriticalText(doc) */
    /* ************************************************************************ */
    /* Function to parse the XML of the document and generate the critical text */
    /* @doc -> XML to be parsed                                                 */
    /* ************************************************************************************** */
    // - It will look for every critical entries (<app> in XML-TEI P5),
    //   tranform them into evtReading directive, 
    //   and parse its content with the function parseCriticalTextApp() 
    //   in order to show only the choosed reading (the lemma), if there is one
    // – It will transform every element representing a note (<note> in XML-TEI P5)
    //   into an evtPopover directive
    // Before returning the parsed text it will store it (parsedData.addCriticalText())
    // in order to avoid the system to parse it every time it is needed
    parser.parseCriticalText = function(doc) {
        var criticalText;
        if ( doc !== undefined ) {
            var docDOM = doc.documentElement.getElementsByTagName('body')[0],
                apps   = docDOM.getElementsByTagName('app'),
                j      = apps.length-1, 
                count  = 0;
            
            while(j < apps.length && j >= 0) {
                var appNode = apps[j];
                if (!evtParser.isNestedInElem(appNode, 'app')) {
                    // var id: appNode.getAttribute('xml:id') || evtParser.xpath(appNode).substr(1),
                    var id          = appNode.getAttribute('xml:id') || evtParser.xpath(appNode).substr(1), //'app-'+count,
                        spanElement = document.createElement('evt-reading');
                    spanElement.setAttribute('data-app-id', id);
                    parseCriticalTextApp(appNode, spanElement);
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
            //parse lines
            evtParser.parseLines(docDOM);
            
            evtParser.parseNote(docDOM);
            criticalText = docDOM;
        } else {
            criticalText = '<span>Testo non disponibile.</span>';
        }
        parsedData.addCriticalText(criticalText, '');
    };

    return parser;
});