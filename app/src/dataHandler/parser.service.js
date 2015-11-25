angular.module('evtviewer.dataHandler')

.service('evtParser', function(parsedData) {
    var parser = {};

    // TODO: create module provider and add default configuration
    // var defAttributes = ['n', 'n', 'n'];
    var defPageElement = 'pb';
    
    var xpath = function(el) {
        if (typeof el === 'string') {
            // document.evaluate(xpathExpression, contextNode, namespaceResolver, resultType, result );
            return document.evaluate(el, document, null, 0, null);
        }
        if (!el || el.nodeType !== 1) {
            return '';
        }

        var sames      = [].filter.call(el.parentNode.children, function (x) { return x.tagName === el.tagName; });
        var countIndex = sames.length > 1 ? ([].indexOf.call(sames, el)+1) : '';
        countIndex     = countIndex > 1 ? countIndex : '';
        var tagName    = el.tagName.toLowerCase() !== 'tei' ? '.'+el.tagName.toLowerCase() : '';
        return xpath(el.parentNode) + tagName + countIndex;
    };

    parser.parsePages = function(doc, docId) {
        var currentDocument = angular.element(doc);
        angular.forEach(currentDocument.find(defPageElement), 
            function(element) {
                var newPage    = {},
                    attributes = [];
                newPage.value  = element.getAttribute('xml:id') || 'page_'+(parsedData.getPages().length+1);
                newPage.label  = element.getAttribute('n')      || 'Page '+(parsedData.getPages().length+1);
                newPage.title  = element.getAttribute('n')      || 'Page '+(parsedData.getPages().length+1); 
                for (var i = 0; i < element.attributes.length; i++) {
                    var attrib = element.attributes[i];
                    if (attrib.specified) {
                        newPage[attrib.name] = attrib.value;
                    }
                }
                newPage.doc = docId;
                parsedData.addPage(newPage);
        });
        // console.log('## Pages ##', parsedData.getPages());
    };

    parser.parseDocuments = function(doc) {
        var currentDocument = angular.element(doc),
            defDocElement;
        if ( currentDocument.find('text').length > 0 ) {
            defDocElement = 'text';
        } else if ( currentDocument.find('div[subtype="edition_text"]').length > 0 ) {
            defDocElement = 'div[subtype="edition_text"]';
        }
        angular.forEach(currentDocument.find(defDocElement), 
            function(element) {
                var newDoc   = { };
                newDoc.value = element.getAttribute('xml:id')  || xpath(doc).substr(1) || 'doc_'+(parsedData.getDocuments().length+1);
                newDoc.label = element.getAttribute('n')       || 'Doc '+(parsedData.getDocuments().length+1);
                newDoc.title = element.getAttribute('n')       || 'Document '+(parsedData.getDocuments().length+1); 
                for (var i = 0; i < element.attributes.length; i++) {
                    var attrib = element.attributes[i];
                    if (attrib.specified) {
                        newDoc[attrib.name] = attrib.value;
                    }
                }
                newDoc.content = '<text>'+element.innerHTML+'</text>';
                parsedData.addDocument(newDoc);
                parser.parsePages(element, newDoc.value);
        });
        // console.log('## Documents ##', parsedData.getDocuments());
    };

    parser.parseWitnesses = function(doc) {
        var currentDocument = angular.element(doc);
        angular.forEach(currentDocument.find('witness'), 
            function(element) {
                var witness = {},
                    group   = {};
                if (element.parentNode.tagName === 'listWit' && element.parentNode.getAttribute('xml:id') !== null){
                    group = {
                        id:  element.parentNode.getAttribute('xml:id')
                    };
                    parsedData.addWitnessGroup(group);
                }
                witness = {
                    value : element.getAttribute('xml:id'),
                    label : element.getAttribute('xml:id'),
                    title : element.textContent || element.getAttribute('xml:id'),
                    group : group.id || ''
                };
                parsedData.addWitness(witness);
        });
        console.log('## Witnesses ##', parsedData.getWitnesses());
    };

    var parseAppReading = function(elem){
        var reading = {
            id           : elem.getAttribute('xml:id') || xpath(elem).substr(1),
            attributes   : [ ],
            content      : [ ],
            note         : '',
            __xmlElem    : elem.tagName,
            __xmlContent : elem.innerHTML
        };
        // Recupero tutti gli attributi dell'elemento
        for (var i = 0; i < elem.attributes.length; i++) {
            var attrib = elem.attributes[i];
            if (attrib.specified) {
                reading.attributes[attrib.name] = attrib.value;
            }
        }
        // Ciclare i figli di elem
        // per ogni <rdgGrp> o un <app> devo lanciare parseAppEntry su tali elementi e salvare in content l'entryObj
        // per ogni <node> devo salvare il contenuto del nodo in reading.node
        // per ogni altro nodo aggiungo il contenuto in reading.content        
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

    var parseAppEntry = function(app) {
        var entry = { 
                id         : app.getAttribute('xml:id')  || xpath(app).substr(1),
                attributes : [ ],
                lemma      : '',
                readings   : { 
                    length      : 0,
                    __elemTypes : { },
                },
                note       : '',
                // __xmlContent: app.innerHTML
            };
        // Recupero tutti gli attributi dell'elemento <app>
        for (var i = 0; i < app.attributes.length; i++) {
            var attrib = app.attributes[i];
            if (attrib.specified) {
                entry.attributes[attrib.name] = attrib.value;
            }
        }
        
        // ciclo i nodi figli per recuperare le varianti
        angular.forEach(app.children, function(child){
            // se <lem> o <rdg> (caso base)
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
            // se <rdgGrp> o <app> (annidamento)
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
    parser.parseCriticalEntries = function(doc) {
        var currentDocument = angular.element(doc);
        angular.forEach(currentDocument.find('app'), 
            function(element) {
                // if (!isNestedApp(element)) {
                    var entry = parseAppEntry(element);
                    parsedData.addCriticalEntry(entry, entry.id);
                // }
        });
        
        // console.log('## Critical entries ##', JSON.stringify(parsedData.getCriticalEntries()));
        console.log('## Critical entries ##', parsedData.getCriticalEntries());
    };

    var isNestedApp = function(appNode) {
        if (appNode.parentNode.tagName === 'text' ) {
            return false;
        } else if (appNode.parentNode.tagName === 'app') {
            return true;
        } else {
            return isNestedApp(appNode.parentNode);
        }
    };
    var parseXMLElement = function(element){
        if (element.nodeType === 3 ) { // Text
            return element;
        } else {
            var newElement;
            newElement           = document.createElement('span');
            newElement.className = element.tagName;
            for (var i = 0; i < element.attributes.length; i++) {
                var attrib = element.attributes[i];
                if (attrib.specified) {
                    if (attrib.name !== 'xml:id') {
                        newElement.setAttribute('data-'+attrib.name, attrib.value);
                        if (attrib.name !== 'wit') {
                            parsedData.addCriticalEntryFilter(attrib.name, attrib.value);
                        }
                    }
                }
            }
            for (var j = 0; j < element.childNodes.length; j++) {
                newElement.appendChild(parseXMLElement(element.childNodes[j]));
            }
            return newElement;
        }
    };
    var parseWitnessApp = function(app, wit, evtReadingElement) {
        for (var k = 0; k < app.attributes.length; k++) {
            var attrib = app.attributes[k];
            if (attrib.specified) {
                if (attrib.name !== 'xml:id' && attrib.name !== 'wit') {
                    evtReadingElement.setAttribute('data-'+attrib.name, attrib.value);
                    parsedData.addCriticalEntryFilter(attrib.name, attrib.value);
                }
            }
        }
        if ( app.innerHTML.indexOf('#'+wit) >= 0 ) {
            var children = app.childNodes;
            for (var i = 0; i < children.length; i++) {
                var childNode = children[i];
                if (childNode.nodeType === 3 ) { // Text
                    evtReadingElement.appendChild(childNode.cloneNode(true));
                } else {
                    if (childNode.tagName === 'lem' || childNode.tagName === 'rdg') {
                        if ( childNode.getElementsByTagName('app').length > 0 || 
                             childNode.getElementsByTagName('rdgGrp').length > 0 ) {
                            if ( childNode.innerHTML.indexOf('#'+wit) >= 0 ) {
                                parseWitnessApp(childNode, wit, evtReadingElement);
                            }
                        } else {
                            if ( childNode.getAttribute('wit') !== null && childNode.getAttribute('wit').indexOf('#'+wit) >= 0 ) {
                                evtReadingElement.appendChild(parseXMLElement(childNode));
                            }
                        }
                        for (var j = 0; j < childNode.attributes.length; j++) {
                            var attrib = childNode.attributes[j];
                            if (attrib.specified) {
                                if (attrib.name !== 'xml:id' && attrib.name !== 'wit') {
                                    evtReadingElement.setAttribute('data-'+attrib.name, attrib.value);
                                    parsedData.addCriticalEntryFilter(attrib.name, attrib.value);
                                }
                            }
                        }
                    } else if (childNode.tagName === 'rdgGrp') {
                        if (childNode.innerHTML.indexOf('#'+wit) >= 0) {
                            parseWitnessApp(childNode, wit, evtReadingElement);
                        }
                    } else if (childNode.tagName === 'app') {
                        if (childNode.innerHTML.indexOf('#'+wit) >= 0) {
                            var id         = childNode.getAttribute('xml:id') || xpath(childNode).substr(1),
                                newElement = document.createElement('evt-reading');
                            newElement.setAttribute('data-entry-id', xpath(childNode.parentNode).substr(1));
                            newElement.setAttribute('data-app-id', id);
                            parseWitnessApp(childNode, wit, newElement);
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
                evtReadingElement.appendChild(parseXMLElement(lem));
            }
        }
    };

    var parseCriticalTextApp = function(app, lemElement){
        for (var k = 0; k < app.attributes.length; k++) {
            var attrib = app.attributes[k];
            if (attrib.specified) {
                if (attrib.name !== 'xml:id') {
                    lemElement.setAttribute('data-'+attrib.name, attrib.value);
                }
            }
        }
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
                            lemElement.appendChild(parseXMLElement(childNode));
                        }
                        for (var j = 0; j < childNode.attributes.length; j++) {
                            var attrib = childNode.attributes[j];
                            if (attrib.specified) {
                                if (attrib.name !== 'xml:id') {
                                    lemElement.setAttribute('data-'+attrib.name, attrib.value);
                                    if (attrib.name !== 'wit') {
                                        parsedData.addCriticalEntryFilter(attrib.name, attrib.value);
                                    }
                                }
                            }
                        }
                    } else if (childNode.tagName === 'app') {
                        if ( childNode.getElementsByTagName('lem').length > 0 ) {
                            var id         = childNode.getAttribute('xml:id') || xpath(childNode).substr(1),
                                newElement = document.createElement('evt-reading');
                            newElement.setAttribute('data-entry-id', xpath(childNode.parentNode).substr(1));
                            newElement.setAttribute('data-app-id', id);
                            parseCriticalTextApp(childNode, newElement);
                            lemElement.appendChild(newElement);
                        }
                    } else if (childNode.tagName !== 'rdg' && childNode.tagName !== 'rdgGrp') {
                        lemElement.appendChild(childNode.cloneNode(true));
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
                for (var k = 0; k < rdgs.length; k++) {
                    var rdgNode = rdgs[k];
                    lemText    += rdgNode.textContent+', ',
                    wits       += rdgNode.getAttribute('wit');
                }
                lemText = lemText.slice(0, -2)+'}';
                
                lemElem.textContent = lemText;
                lemElement.appendChild(lemElem);
                lemElement.setAttribute('data-wit', wits);
            }
        }
    };
    parser.parseWintessPageBreaks = function(docDOM, wit) {
        var pbs = docDOM.getElementsByTagName('pb'),
            k   = 0;
        while ( k < pbs.length) {
            var pbNode = pbs[k];
            if (pbNode.getAttribute('ed') !== '#'+wit) {
                pbNode.parentNode.removeChild(pbNode); 
            } else {
                k++;
            }
        }
    };

    parser.parseNote = function(docDOM) {
        var notes = docDOM.getElementsByTagName('note');
        var n = 0;
        while (n < notes.length) {
            var noteNode    = notes[n],
                popoverElem = document.createElement('evt-popover');
            if (noteNode.parentNode.tagName !== 'app' &&
                noteNode.parentNode.tagName !== 'evt-reading' ) {
                popoverElem.setAttribute('data-trigger', 'click');
                popoverElem.setAttribute('data-tooltip', noteNode.innerHTML);
                popoverElem.innerHTML = '[•]';
                noteNode.parentNode.replaceChild(popoverElem, noteNode);
            } else {
                noteNode.parentNode.removeChild(noteNode);
            }
        }
    };

    parser.parseWitnessText = function(doc, wit) {
        var witnessText;
        if ( doc !== undefined ) {
            var docDOM = doc.documentElement.getElementsByTagName('body')[0],
                apps   = docDOM.getElementsByTagName('app'),
                j      = apps.length-1, 
                count  = 0;
            
            while(j < apps.length && j >= 0) {
                var appNode = apps[j];
                if (!isNestedApp(appNode)) {
                    // var id: appNode.getAttribute('xml:id') || xpath(appNode).substr(1),
                    var id          = appNode.getAttribute('xml:id') || xpath(appNode).substr(1), //'app-'+count,
                        spanElement = document.createElement('evt-reading');
                    spanElement.setAttribute('data-app-id', id);
                    parseWitnessApp(appNode, wit, spanElement);
                    appNode.parentNode.replaceChild(spanElement, appNode);
                    count++;
                }
                j--;
            }
            //parse <pb>
            parser.parseWintessPageBreaks(docDOM, wit);
            //parse <note>
            parser.parseNote(docDOM);
            witnessText = docDOM;
        } else {
            witnessText = '<span>Testo non disponibile.</span>';
        }
        //save witness text
        parsedData.addWitnessText(wit, witnessText);
        return witnessText;
    };

    parser.parseCriticalText = function(doc) {
        var criticalText;
        if ( doc !== undefined ) {
            var docDOM = doc.documentElement.getElementsByTagName('body')[0],
                apps   = docDOM.getElementsByTagName('app'),
                j      = apps.length-1, 
                count  = 0;
            
            while(j < apps.length && j >= 0) {
                var appNode = apps[j];
                if (!isNestedApp(appNode)) {
                    // var id: appNode.getAttribute('xml:id') || xpath(appNode).substr(1),
                    var id          = appNode.getAttribute('xml:id') || xpath(appNode).substr(1), //'app-'+count,
                        spanElement = document.createElement('evt-reading');
                    spanElement.setAttribute('data-app-id', id);
                    parseCriticalTextApp(appNode, spanElement);
                    appNode.parentNode.replaceChild(spanElement, appNode);
                    count++;
                }
                j--;
            }
            
            parser.parseNote(docDOM);
            criticalText = docDOM;
        } else {
            criticalText = '<span>Testo non disponibile.</span>';
        }
        parsedData.addCriticalText(criticalText, '');
    };
    
    return parser;
});