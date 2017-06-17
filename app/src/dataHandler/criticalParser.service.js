angular.module('evtviewer.dataHandler')

.service('evtCriticalParser', function($q, parsedData, evtParser, evtCriticalApparatusParser, evtSourcesParser, evtAnaloguesParser, evtCriticalElementsParser, xmlParser, config) {
    var parser = {};

    var apparatusEntryDef = '<app>',
        lemmaDef          = '<lem>',
        readingDef        = lemmaDef+', <rdg>',
        readingGroupDef   = '<rdgGrp>',
        quoteDef          = '<quote>';
        analogueDef       = '<seg>,<ref[type=parallelPassage]>',
        analogueRegExpr   = evtParser.createRegExpr(analogueDef); 

    var skipFromBeingParsed   = '<evt-reading>,<pb>,'+apparatusEntryDef+','+readingDef+','+readingGroupDef+','+quoteDef+','+analogueDef+',<evt-quote>,<evt-analogue>,<evt-version-reading>',
        skipWitnesses         = config.skipWitnesses.split(',').filter(function(el) { return el.length !== 0; });


    /* ************************** */
    /* parseWitnessText(doc, wit) */
    /* ************************************************************************************** */
    /* Function to parse the XML of the document and generate the text of a specified witness */
    /* @doc   -> XML to be parsed                                                             */
    /* @docID -> ID of current DOC                                                            */
    /* @wit   -> witness specified                                                            */
    /* ************************************************************************************** */
    parser.parseWitnessText = function(doc, docId, wit) {
        //console.log('parseWitnessText', wit);
        var deferred = $q.defer();
        var witnessText;
        if ( doc !== undefined ) {
            doc = doc.cloneNode(true);
            var docDOM = doc.getElementsByTagName('body')[0],
                witObj = parsedData.getWitness(wit);

            var apps   = docDOM.getElementsByTagName(apparatusEntryDef.replace(/[<>]/g, '')),
                j      = apps.length-1;
            while(j < apps.length && j >= 0) {
                var appNode = apps[j];
                if (!evtParser.isNestedInElem(appNode, apparatusEntryDef.replace(/[<>]/g, ''))) {
                    var id;
                    if (appNode.getAttribute('xml:id')) {
                        id = 'app_'+appNode.getAttribute('xml:id');
                    } else {
                        id = evtParser.xpath(appNode).substr(1);
                    }
                    var spanElement, entry;

                    if (appNode.hasAttribute('type') && (appNode.getAttribute('type') === 'recensio')) {
                        entry = parsedData.getVersionEntry(id);
                    } else {
                        entry = parsedData.getCriticalEntryById(id);
                    }
                    // If I've already parsed all critical entries,
                    // or I've alreafy parsed the current entry...
                    // ...I can simply access the model to get the right output
                    // ... otherwise I parse the DOM and save the entry in the model
                    if (!config.loadCriticalEntriesImmediately && entry === undefined) {
                        // Check if the app is of type recensio
                        if (appNode.hasAttribute('type') && (appNode.getAttribute('type') === 'recensio')) {
                            evtCriticalElementsParser.handleVersionEntry(appNode);
                            entry = parsedData.getVersionEntry(id);
                        } else {
                            evtCriticalElementsParser.handleAppEntry(appNode);
                            var subApps = appNode.getElementsByTagName(apparatusEntryDef.replace(/[<>]/g, ''));
                            if (subApps.length > 0){
                                for (var z = 0; z < subApps.length; z++) {
                                    evtCriticalElementsParser.handleAppEntry(subApps[z]);
                                }
                            }
                            entry = parsedData.getCriticalEntryById(id);
                        }                        
                    }
                    if (entry !== undefined) {
                        // If the app is of type "recensio" it is transformed into the evt-recensio-reading directive
                        if (entry.type === 'recensioApp') {
                            spanElement = evtCriticalElementsParser.getVersionEntryReadingText(entry, wit);
                        // Otherwise it is transformed in a evt-reading directive 
                        } else {
                            spanElement = evtCriticalElementsParser.getEntryWitnessReadingText(entry, wit);
                        }                        
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

                //docDOM.getElementsByTagName(quoteDef.replace(/[<>]/g, ''))
                var quotes   = [];
                if (quoteDef.lastIndexOf('<') !== 0){
                    var tags = quoteDef.split(',');
                    for (var i = 0; i < tags.length; i++) {
                        var q = docDOM.getElementsByTagName(tags[i].replace(/[<>]/g, ''));
                        for (var j = 0; j < q.length; j++){
                            quotes.push(q[j]);
                        }
                    }                    
                } else {
                    var quo = docDOM.getElementsByTagName(quoteDef.replace(/[<>]/g, ''));
                    for (var f = 0; f < quo.length; f++) {
                        quotes.push(quo[f]);
                    }
                }
            k      = quotes.length-1, 
            c  = 0;

            while(k < quotes.length && k >= 0) {
                var element = quotes[k];
                var ide;
                if (element.getAttribute('xml:id')) {
                    ide = element.getAttribute('xml:id');
                } else {
                    ide = evtParser.xpath(element).substr(1);
                }
                var quote = parsedData.getQuote(ide);
                if (quote !== undefined){
                    var prova = evtCriticalElementsParser.getQuoteText(quote, wit, doc);
                    element.parentNode.replaceChild(prova, element);
                }
                k--;
            }
            
            //ANALOGUES
                var analogues = [],
                //TO DO: trovare alternativa meno dispendiosa di memoria
                    allEl = docDOM.getElementsByTagName("*");
                for (var i = 0; i < allEl.length; i++) {
                    var inner = allEl[i].innerHTML.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, '');
                    var el = allEl[i].outerHTML.replace(inner, '');
                    if (analogueRegExpr.test(el)) {
                        analogues.push(allEl[i]);
                    }
                }

                var h = analogues.length - 1;
                while(h < quotes.length && h >= 0) {
                    var element = analogues[h];
                    var id;
                    if (element.getAttribute('xml:id')) {
                        id = element.getAttribute('xml:id');
                    } else {
                        id = evtParser.xpath(element).substr(1);
                    }
                    var analogue = parsedData.getAnalogue(id);
                    if (analogue !== undefined){
                        var prova = evtCriticalElementsParser.getAnalogueText(analogue, wit, doc);
                        element.parentNode.replaceChild(prova, element);
                    }
                    h--;
                }

            docDOM.innerHTML = docDOM.innerHTML.replace(/>[\s\r\n]*?</g,'><');

            angular.forEach(docDOM.children, function(elem){
                var skip = skipFromBeingParsed+','+config.lacunaMilestone+','+config.fragmentMilestone;
                elem.parentNode.replaceChild(evtParser.parseXMLElement(doc, elem, skip), elem);
            });

            //parse <pb>
            evtCriticalApparatusParser.parseWitnessPageBreaks(docDOM, witObj);
            
            //parse lacunas
            evtCriticalApparatusParser.parseWitnessLacunas(docDOM, wit);

            if (evtCriticalApparatusParser.isFragmentaryWitness(docDOM, wit)) {
                // DA PROBLEMI [ma serve per parsare i frammenti]
                docDOM.innerHTML = docDOM.innerHTML.replace(/xmlns="http:\/\/www\.w3\.org\/1999\/xhtml"/g, '');
                var fragmentaryText = evtCriticalApparatusParser.parseFragmentaryWitnessText(docDOM, wit);
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

 

    /* ************* */
    /* CRITICAL TEXT */
    /* ************* */

    /* ************************** */
    /* parseCriticalText(doc) */
    /* ************************************************************************ */
    /* Function to parse the XML of the document and generate the critical text */
    /* @doc -> XML to be parsed                                                 */
    /* @docID -> ID of current DOC                                              */
    /* @scopeVersion -> version of the text that has to be parsed               */
    /* ************************************************************************ */
    parser.parseCriticalText = function(doc, docId, scopeVersion) {
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
                
                //READINGS
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
                        var spanElement, entry;
                        
                        if (appNode.hasAttribute('type') && (appNode.getAttribute('type') === 'recensio')) {
                            entry = parsedData.getVersionEntry(id);
                        } else {
                            entry = parsedData.getCriticalEntryById(id);
                        }
                        
                        // If I've already parsed all critical entries,
                        // or I've already parsed the current entry...
                        // ...I can simply access the model to get the right output
                        // ... otherwise I parse the DOM and save the entry in the model
                        if (!config.loadCriticalEntriesImmediately || entry === undefined) {
                            if (appNode.hasAttribute('type') && (appNode.getAttribute('type') === 'recensio')) {
                                evtCriticalElementsParser.handleVersionEntry(appNode);
                                entry = parsedData.getVersionEntry(id);
                            } else {
                                evtCriticalElementsParser.handleAppEntry(appNode);
                                var subApps = appNode.getElementsByTagName(apparatusEntryDef.replace(/[<>]/g, ''));
                                if (subApps.length > 0){
                                    for (var z = 0; z < subApps.length; z++) {
                                        evtCriticalElementsParser.handleAppEntry(subApps[z]);
                                    }   
                                }
                                entry = parsedData.getCriticalEntryById(id);
                            }
                        }
                        if (entry !== undefined) {
                            if (entry.type === 'recensioApp') {
                                spanElement = evtCriticalElementsParser.getVersionEntryLemma(entry, '', scopeVersion);
                            } else {
                                spanElement = evtCriticalElementsParser.getEntryLemmaText(entry, '');
                            }
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

                //QUOTES
                var quotes   = [];
                if (quoteDef.lastIndexOf('<') != 0){
                    var tags = quoteDef.split(',');
                    for (var i = 0; i < tags.length; i++) {
                        var q = docDOM.getElementsByTagName(tags[i].replace(/[<>]/g, ''));
                        for (var j = 0; j < q.length; j++){
                            quotes.push(q[j]);
                        }
                    }                    
                } else {
                    var quo = docDOM.getElementsByTagName(quoteDef.replace(/[<>]/g, ''));
                    for (var f = 0; f < quo.length; f++) {
                        quotes.push(quo[f]);
                    }
                }
                var k      = quotes.length-1, 
                    c  = 0;

                while(k < quotes.length && k >= 0) {
                    var element = quotes[k];
                    var id;
                    if (element.getAttribute('xml:id')) {
                        id = element.getAttribute('xml:id');
                    } else {
                        id = evtParser.xpath(element).substr(1);
                    }
                    var quote = parsedData.getQuote(id);
                    if (quote !== undefined){
                        var prova = evtCriticalElementsParser.getQuoteText(quote, '', doc);
                        element.parentNode.replaceChild(prova, element);
                    }
                    k--;
                }
                
                //ANALOGUES
                var analogues = [],
                //TO DO: trovare alternativa meno dispendiosa di memoria
                    allEl = docDOM.getElementsByTagName("*");
                for (var i = 0; i < allEl.length; i++) {
                    var inner = allEl[i].innerHTML.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, '');
                    var el = allEl[i].outerHTML.replace(inner, '');
                    if (analogueRegExpr.test(el)) {
                        analogues.push(allEl[i]);
                    }
                }

                var h = analogues.length - 1;
                while(h < quotes.length && h >= 0) {
                    var element = analogues[h];
                    var id;
                    if (element.getAttribute('xml:id')) {
                        id = element.getAttribute('xml:id');
                    } else {
                        id = evtParser.xpath(element).substr(1);
                    }
                    var analogue = parsedData.getAnalogue(id);
                    
                    if (analogue !== undefined){
                        var prova = evtCriticalElementsParser.getAnalogueText(analogue, '', doc);
                        element.parentNode.replaceChild(prova, element);
                    }
                    h--;
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

        // If scopeVersion is defined it adds it to VersionTexts in parsedData
        if (scopeVersion !== undefined) {
            parsedData.addVersionText(criticalText, docId, scopeVersion);
        }
        
        deferred.resolve('success');
        return deferred;
    };

    /*************/
    /*SOURCE TEXT*/
    /*************/

    /*parseSourceText(*/
    parser.parseSourceText = function(doc, sourceId) {
        var deferred = $q.defer();
        var sourceText,
            currentDoc = angular.element(doc);

        if (doc !== undefined) {
            doc = doc.cloneNode(true);
            var docDOM = doc.getElementsByTagName('body')[0];
            
            var segs = docDOM.getElementsByTagName('seg'),
                i = segs.length - 1;

            var element,
                id,
                newElement,
                textContent;

            var correspId = parsedData.getSources()._indexes.correspId[sourceId];

            while (i >= 0) {
                element = segs[i];
                if (element.hasAttribute('type')
                    && element.getAttribute('type') === 'srcTxtLink') {
                    if (element.hasAttribute('xml:id')) {
                        id = element.getAttribute('xml:id');
                    }
                    if (correspId[id] !== undefined) {
                        newElement = document.createElement('evt-source-seg');
                        newElement.setAttribute('data-seg-id', id);
                        newElement.setAttribute('data-source-id', sourceId);
                        textContent = element.innerHTML;
                        newElement.innerHTML = textContent;
                        element.parentNode.replaceChild(newElement, element);
                    }
                }
                i--;
            }

            angular.forEach(docDOM.children, function(elem) {
                var skip = skipFromBeingParsed + '<evt-source-seg>';
                elem.parentNode.replaceChild(evtParser.parseXMLElement(doc, elem, skip), elem);
            });
            sourceText = docDOM.outerHTML;
        } else {
            sourceText = '<span>Text not available.</span>'
        }

        if (sourceText === undefined) {
            var errorMsg = '<span class="alert-msg alert-msg-error">There was an error in the parsing of the text. <br />Try a different browser or contact the developers.</span>';
             sourceText = errorMsg;
        }

        parsedData.getSource(sourceId).text = sourceText;
        deferred.resolve('success');
        return deferred;
    };

    return parser;
});