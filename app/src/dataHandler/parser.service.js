angular.module('evtviewer.dataHandler')

.service('evtParser', function(parsedData) {
    var parser = {};

    // TODO: create module provider and add default configuration
    var defAttributes = ['n', 'n', 'n'];
    var defPageElement = 'pb';
    
    var xpath = function(el) {
        if (typeof el === 'string') {
            // document.evaluate(xpathExpression, contextNode, namespaceResolver, resultType, result );
            return document.evaluate(el, document, null, 0, null);
        }
        if (!el || el.nodeType !== 1) {
            return '';
        }

        var sames = [].filter.call(el.parentNode.children, function (x) { return x.tagName === el.tagName; });
        return xpath(el.parentNode) + '-' + el.tagName.toLowerCase() + (sames.length > 1 ? ([].indexOf.call(sames, el)+1) : '');
    };

    parser.parsePages = function(doc, docId) {
        var currentDocument = angular.element(doc);
        var attributes = [];
        angular.forEach(currentDocument.find(defPageElement), 
            function(element) {
                var newPage = {};
                newPage.value = element.getAttribute('xml:id')  || 'page_'+(parsedData.getPages().length+1);
                newPage.label = element.getAttribute('n') || 'Page '+(parsedData.getPages().length+1);
                newPage.title = element.getAttribute('n') || 'Page '+(parsedData.getPages().length+1); 
                for (var i = 0; i < element.attributes.length; i++) {
                    var attrib = element.attributes[i];
                    if (attrib.specified) {
                        newPage[attrib.name] = attrib.value;
                    }
                }
                newPage.doc = docId;
                parsedData.addPage(newPage);
                attributes = [];
        });
        console.log('## Pages ##', parsedData.getPages());
    };

    parser.parseDocuments = function(doc) {
        var currentDocument = angular.element(doc);
        var attributes = [];
        var defDocElement;
        if ( currentDocument.find('text').length > 0 ) {
            defDocElement = 'text';
        } else if ( currentDocument.find('div[subtype="edition_text"]').length > 0 ) {
            defDocElement = 'div[subtype="edition_text"]';
        }
        angular.forEach(currentDocument.find(defDocElement), 
            function(element) {
                var newDoc = { };
                newDoc.value = element.getAttribute('xml:id')  || xpath(doc).substr(1) || 'doc_'+(parsedData.getDocuments().length+1);
                newDoc.label = element.getAttribute('n') || 'Doc '+(parsedData.getDocuments().length+1);
                newDoc.title = element.getAttribute('n') || 'Document '+(parsedData.getDocuments().length+1); 
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
        console.log('## Documents ##', parsedData.getDocuments());
    };

    parser.parseWitnesses = function(doc) {
        var currentDocument = angular.element(doc);
        angular.forEach(currentDocument.find('witness'), 
            function(element) {
                var witness = {};
                var group = {};
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

    var parseAppEntry = function(app) {
        var entry = { 
            __elemTypes : {},
            lemma       : {},
            readings    : { length : 0 },
            note        : ''
        };
        entry.id = app.getAttribute('xml:id')  || xpath(app);
        
        for (var i = 0; i < app.attributes.length; i++) {
            var attrib = app.attributes[i];
            if (attrib.specified) {
                entry[attrib.name] = attrib.value;
            }
        }
        angular.forEach(app.children, function(child){
            if (child.tagName === 'lem') {
                entry.lemma.content = child.innerHTML;
                for (i = 0; i < child.attributes.length; i++) {
                    var lemmaAttrib = child.attributes[i];
                    if (lemmaAttrib.specified) {
                        entry.lemma[lemmaAttrib.name] = lemmaAttrib.value;
                    }
                }
            } if (child.tagName === 'note') {
                entry.note = child.innerHTML;
            } else {
                var id = child.getAttribute('xml:id')  || xpath(child);
                var rdg = {};
                for (var j = 0; j < child.attributes.length; j++) {
                    var rdgAttrib = child.attributes[j];
                    if (rdgAttrib.specified) {
                        rdg[rdgAttrib.name] = rdgAttrib.value;
                    }
                }
                
                if (child.tagName === 'rdg') {
                    rdg.content = child.innerHTML;
                } else if (child.tagName === 'rdgGrp' || child.tagName === 'app') {
                    rdg.content = parseAppEntry(child);
                }

                entry.readings[entry.readings.length] = id;
                entry.readings[id] = rdg;
                entry.__elemTypes[id] = child.tagName;
                entry.readings.length++;
            }
        });
        return entry;
    };
    parser.parseCriticalEntries = function(doc) {
        var currentDocument = angular.element(doc);
        angular.forEach(currentDocument.find('app'), 
            function(element) {
                var entry = parseAppEntry(element);
                parsedData.addCriticalEntry(entry, entry.id);
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
    var parseWitnessApp = function(app, wit, appObj) {
        for (var k = 0; k < app.attributes.length; k++) {
            var attrib = app.attributes[k];
            if (attrib.specified) {
                if (attrib.name !== 'xml:id') {
                    if ( appObj.attributes[attrib.name] === undefined ) {
                        appObj.attributes[appObj.attributes.length] = attrib.name;
                        appObj.attributes[attrib.name] = attrib.value;
                        appObj.attributes.length++;
                    } 
                }
            }
        }

        if ( app.innerHTML.indexOf('#'+wit) >= 0 ) {
            var children = app.childNodes;
            for (var i = 0; i < children.length; i++) {
                var childNode = children[i];
                if (childNode.nodeType === 3 ) { // Text
                    appObj.content += childNode.nodeValue;
                } else {
                    if (childNode.tagName === 'lem' || childNode.tagName === 'rdg') {
                        if ( childNode.getElementsByTagName('app').length > 0 ) {
                            parseWitnessApp(childNode, wit, appObj);
                        } else {
                            if ( childNode.getAttribute('wit') !== null && childNode.getAttribute('wit').indexOf('#'+wit) >= 0 ) {
                                appObj.content += childNode.innerHTML;
                            }
                        }
                    } else if (childNode.tagName === 'rdgGrp' || childNode.tagName === 'app') {
                        if (childNode.innerHTML.indexOf('#'+wit) >= 0) {
                            parseWitnessApp(childNode, wit, appObj);
                        }
                    } else {
                        appObj.content += childNode.outerHTML;
                    }   
                }
            }
        } else {
            if ( app.getElementsByTagName('lem').length > 0) {
                var lem = app.getElementsByTagName('lem')[0];
                appObj.content += lem.outerHTML;
            }
        }
    };

    parser.parseWitnessText = function(doc, wit) {
        if ( doc !== undefined ) {
            var docDOM = doc.documentElement.getElementsByTagName('body')[0];
            var apps = docDOM.getElementsByTagName('app');
            var j = 0;
            while(j < apps.length) {
                var appNode = apps[j];
                if (!isNestedApp(appNode)) {
                    var appObject = {
                        id: appNode.getAttribute('xml:id') || xpath(appNode).substr(1),
                        attributes: {
                            length: 0
                        },
                        content: ''
                    };

                    parseWitnessApp(appNode, wit, appObject);

                    var spanElement = document.createElement('reading');
                    spanElement.setAttribute('data-app-entry-id', appObject.id);
                    for (var a = 0; a < appObject.attributes.length; a++) {
                        var attrName = appObject.attributes[a],
                            attrValue = appObject.attributes[appObject.attributes[a]];
                        spanElement.setAttribute('data-'+attrName, attrValue);
                    }
                    spanElement.style.color = '#f00';
                    spanElement.style.border = '1px solid #000';
                    spanElement.innerHTML = appObject.content;
                    // appNode.innerHTML = '';
                    // appNode.appendChild(spanElement);
                    appNode.parentNode.replaceChild(spanElement, appNode);
                }
            }
            var pbs = docDOM.getElementsByTagName('pb');
            var k = 0;
            while ( k < pbs.length) {
                var pbNode = pbs[k];
                if (pbNode.getAttribute('ed') !== '#'+wit) {
                    pbNode.parentNode.removeChild(pbNode); 
                } else {
                    k++;
                }
            }
            parsedData.addWitnessText(wit, docDOM);
            return docDOM;
        } else {
            return 'Testo non disponibile.';
        }
    };


    
    return parser;
});