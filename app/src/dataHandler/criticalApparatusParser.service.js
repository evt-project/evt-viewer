/**
 * @ngdoc service
 * @module evtviewer.dataHandler
 * @name evtviewer.dataHandler.evtCriticalApparatusParser
 * @description
 * # evtCriticalApparatusParser
 * Service containing methods to parse data regarding critical apparatus.
 *
 * @requires $q
 * @requires xmlParser
 * @requires evtviewer.dataHandler.parsedData
 * @requires evtviewer.dataHandler.evtParser
 * @requires evtviewer.core.config
 * @requires evtviewer.dataHandler.evtCriticalElementsParser
**/
angular.module('evtviewer.dataHandler')

.service('evtCriticalApparatusParser', function($q, parsedData, evtParser, xmlParser, config, evtCriticalElementsParser, evtDepaParser) {
    var parser = {};

    var apparatusEntryDef     = '<app>',
        lemmaDef              = '<lem>',
        readingDef            = lemmaDef+', <rdg>',
        readingGroupDef       = '<rdgGrp>',
        quoteDef              = config.quoteDef || '<quote>';
    var skipFromBeingParsed   = '<evt-reading>,<pb>,'+apparatusEntryDef+','+readingDef+','+readingGroupDef+','+quoteDef, //Da aggiungere anche <evt-source>, quando lo avrai creato.
        skipWitnesses         = config.skipWitnesses.split(',').filter(function(el) { return el.length !== 0; });

    // Al momento ho usato solo questa variabile


    //Queste due le userò appena inizierò a parsare le fonti
    var sourceDef = '<cit>';
    var sourcesUrl = ''; // Parsing di più documenti

    /**
     * @ngdoc function
     * @name evtviewer.dataHandler.evtCriticalApparatusParser#findCriticalEntryById
     * @methodOf evtviewer.dataHandler.evtCriticalApparatusParser
     *
     * @description
     * Find critical entry in source document by id. Function to be used when critical entries are not loaded all together.
     * When found, the entry is then parsed with {@link evtviewer.dataHandler.evtCriticalElementsParser#handleAppEntry handleAppEntry()}
     * and stored in {@link evtviewer.dataHandler.parsedData parsedData}.
     *
     * @param {element} doc XML of the edition
     * @param {string} appId id of critical entry to be found
     *
     * @author CDP
     */
    parser.findCriticalEntryById = function(doc, appId){
        if ( doc !== undefined ) {
            var appSelector = appId.replace(/\w-/g, '$&0>').replace(/[0-9]+/g, ':eq($&)').replace(/-:eq/g, ':eq');
            var appElement = $(doc).find(appSelector);
            evtCriticalElementsParser.handleAppEntry(appElement.get(0));
        } else {
            console.log('ERROR');
        }
    };

    /**
     * @ngdoc function
     * @name evtviewer.dataHandler.evtCriticalApparatusParser#parseListWit
     * @methodOf evtviewer.dataHandler.evtCriticalApparatusParser
     *
     * @description
     * [PRIVATE] This function will parse the list of witness.
     *
     * @param {string} doc string representing the XML to be parsed
     * @param {element} listWit DOM element representing a single witness
     *
     * @returns {Object} JSON object containing the information about witnesses list read from <code>doc</code>:
         <pre>
            var list = {
                id      : '',
                name    : '',
                content : [],
                _type   : '',
                _group  : '',
                text    : {}
            };
         </pre>
     *
     * @author CDP
     */
    var parseListWit = function(doc, listWit) {
        var skipWitnesses = config.skipWitnesses.split(',').filter(function(el) { return el.length !== 0; });
        var list = {
            id      : listWit.getAttribute('xml:id') || evtParser.xpath(listWit).substr(1),
            sigla   : listWit.getAttribute('xml:id'),
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
                        id          : child.getAttribute('xml:id') || evtParser.xpath(child).substr(0),
                        sigla       : child.getAttribute('xml:id'),
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
    /**
     * @ngdoc function
     * @name evtviewer.dataHandler.evtCriticalApparatusParser#parseWitnesses
     * @methodOf evtviewer.dataHandler.evtCriticalApparatusParser
     *
     * @description
     * This method will parse the list of witnesses and groups of witnesses existing in the XML file
     * and save it in {@link evtviewer.dataHandler.parsedData parsedData}.
     *
     * @param {string} doc string representing the XML to be parsed
     *
     * @author CDP
     */
    parser.parseWitnesses = function(doc) {
        var skipWitnesses = config.skipWitnesses.split(',').filter(function(el) { return el.length !== 0; });
        var currentDocument = angular.element(doc);
        var witnessesList = currentDocument.find(config.listDef.replace(/[<>]/g, ''));
        if (witnessesList.length > 0) {
            angular.forEach(witnessesList,
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
                                            id          : child.getAttribute('xml:id') || evtParser.xpath(child).substr(0),
                                            sigla       : child.getAttribute('xml:id'),
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
    /**
     * @ngdoc function
     * @name evtviewer.dataHandler.evtCriticalApparatusParser#parseCriticalEntries
     * @methodOf evtviewer.dataHandler.evtCriticalApparatusParser
     *
     * @description
     * This method will parse the critical entries existing in the XML file
     * and save them in {@link evtviewer.dataHandler.parsedData parsedData}.
     * It searches for elements with <code>tagName</code> equals to that defined in <code>apparatusEntryDef</code>
     * and for each one of them it calls the function {@link evtviewer.dataHandler.evtCriticalElementsParser#handleAppEntry handleAppEntry}.
     * Finally it adds the JSON object generated into {@link evtviewer.dataHandler.parsedData parsedData}
     * using the method {@link evtviewer.dataHandler.parsedData#addCriticalEntry addCriticalEntry()}.
     *
     * @param {string} doc string representing the XML to be parsed
     *
     * @returns {promise} promise when parsed will end
     * @author CDP
     */
    parser.parseCriticalEntries = function(doc) {
        parsedData.resetCriticalEntries();
        var deferred = $q.defer();
        var currentDocument = angular.element(doc);
        angular.forEach(currentDocument.find(apparatusEntryDef.replace(/[<>]/g, '')),
            function(element) {
                //TODO: if-else per handleRecensioEntry
                if (!element.hasAttribute('type') || (element.getAttribute('type') !== 'recensio')){
                    var entry = evtCriticalElementsParser.handleAppEntry(element);
                    if (!entry.lemma && parsedData.getEncodingDetail('variantEncodingMethod') === 'double-end-point') {
                        evtDepaParser.getLemma(entry, doc);
                    }
                }
            });
        // console.log('## Critical entries ##', JSON.stringify(parsedData.getCriticalEntries()));
        parsedData.setCriticalEntriesLoaded(config.loadCriticalEntriesImmediately);
        console.log('## Critical entries ##', parsedData.getCriticalEntries());
        deferred.resolve('success');
        return deferred;
    };
    /**
     * @ngdoc function
     * @name evtviewer.dataHandler.evtCriticalApparatusParser#parseVersionEntries
     * @methodOf evtviewer.dataHandler.evtCriticalApparatusParser
     *
     * @description
     * This method will parse the critical entries that contain passages that differ
     * in two or more versions of the text.
     *
     * @param {string} doc string representing the XML to be parsed
     *
     * @returns {promise} promise when parsed will end
     * @author CM
     */
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

    // /////// //
    // WITNESS //
    // /////// //
    /**
     * @ngdoc function
     * @name evtviewer.dataHandler.evtCriticalApparatusParser#containsWitnessElement
     * @methodOf evtviewer.dataHandler.evtCriticalApparatusParser
     *
     * @description
     * This method will check is a particular element should be considered belongin to a specific witness or group of witnesses.
     *
     * @param {string} attr attribute containing the list of witnesses or group of witnesses siglas, each one preceded by a <code>#</code>, and eventually divided by a space.
     * @param {Object} witObj JSON object representing the the witness or the group of witnesses
     *
     * @returns {boolean} whether the element belongs to the specific witness(es) or not
     * @author CDP
     */
    parser.containsWitnessElement = function(attr, witObj) {
        if (attr === null) {
            return false;
        } else {
            return (witObj.group !== undefined && attr.indexOf('#'+witObj.group) >= 0) || (attr.indexOf('#') >= 0 && attr.indexOf('#'+witObj.id) >= 0) || attr.indexOf(witObj.id) >= 0;
        }
    };
    /**
     * @ngdoc function
     * @name evtviewer.dataHandler.evtCriticalApparatusParser#parseWitnessPageBreaks
     * @methodOf evtviewer.dataHandler.evtCriticalApparatusParser
     *
     * @description
     * This method will parse page breaks and select only those of the given witness.
     * It will look for XML element representing a page break (<code>pb</code> in XML-TEI P5)
     * – if they belong the the specified witness they will be replaced with a <code>span</code> element
     * - otherwise they will be removed
     *
     * @param {element} docDOM XML element to be parsed
     * @param {Object} witObj JSON object representing the the witness or the group of witnesses
     *
     * @author CDP
     */
    parser.parseWitnessPageBreaks = function(docDOM, witObj) {
        var pbs = docDOM.getElementsByTagName('pb'),
            k   = 0;
        while ( k < pbs.length) {
            var pbNode = pbs[k];
            if (parser.containsWitnessElement(pbNode.getAttribute('ed'), witObj)){
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
    /**
     * @ngdoc function
     * @name evtviewer.dataHandler.evtCriticalApparatusParser#parseWitnessLacunas
     * @methodOf evtviewer.dataHandler.evtCriticalApparatusParser
     *
     * @description
     * This method will parse lacuna start/end in witnesses.
     * - It retrieves <code>lacunaStart</code> and <code>lacunaEnd</code> elements and save them in two different arrays.
     * - It prepares two empy arrays that will store <code>lacunaStart</code> and <code>lacunaEnd</code> elements of the given witness
     * (<code>startLacunasWit</code> and <code>endLacunasWit</code>).
     * - Then it loop over those arrays and for each element retrieve the critical apparatus entry id (<code>appId</code>),
     * the reading id (<code>readingId</code>) and the reading witnesses siglas (<code>readingWits</code>).
     *  - If the reading belongs to the given witness if will add it in the array of start/end lacunas for the witness.
     * - Then if start and end elements for lacunas in given witness are the same in number, thanks to a regular expression
     * it will replace the XML string contained between each pair of start and end elements with a pair of
     * <code>evt-reading</code>s that will have respectively the <code>data-app-id</code> property equals to the
     * <code>startLacuna</code> and <code>endLacuna</code> element id.
     * - Otherwise it will replace the text of the all witness with an error message.
     *
     * @param {element} docDOM XML element to be parsed
     * @param {string} wit id of witness to be considered
     *
     * @author CDP
     */
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
    /**
     * @ngdoc function
     * @name evtviewer.dataHandler.evtCriticalApparatusParser#isFragmentaryWitness
     * @methodOf evtviewer.dataHandler.evtCriticalApparatusParser
     *
     * @description
     * This method will check if a witness is a fragmentary one or not
     * It will look if in the XML document there are <code>witStart</code> elements with <code>wit</code>
     * attribute equal to the sigla of the given witness.
     *
     * @param {element} docDOM XML element to be parsed
     * @param {string} wit id of witness to be considered
     *
     * @returns {boolean} whether the given witness is fragmentary or not
     * @author CDP
     */
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
    /**
     * @ngdoc function
     * @name evtviewer.dataHandler.evtCriticalApparatusParser#parseFragmentaryWitnessText
     * @methodOf evtviewer.dataHandler.evtCriticalApparatusParser
     *
     * @description
     * This method will parse text of fragmentary witness.
     * - It retrieves <code>witStart</code> and <code>witEnd</code> elements and save them in two different arrays.
     * - It prepares two empy arrays that will store <code>witStart</code> and <code>witEnd</code> elements of the given witness
     * (<code>startsWit</code> and <code>endsWit</code>).
     * - Then it loop over those arrays and for each element retrieve the critical apparatus entry id (<code>appId</code>),
     * the reading id (<code>readingId</code>) and the reading witnesses siglas (<code>readingWits</code>).
     *  - If the reading belongs to the given witness if will add it in the array of start/end fragments for the witness.
     * - Then if start and end elements for fragments in given witness are the same in number, thanks to a regular expression
     * it will replace the XML string contained between each pair of start and end elements with a pair of
     * <code>evt-reading</code>s that will have respectively the <code>data-app-id</code> property equals to the
     * <code>witStart</code> and <code>witEnd</code> element id.
     * Those <code>evt-reading</code>s will be both preceded by a <code>span</code> element indicating the start or end of the fragment
     * (and will be used just to show a grafic separator for the fragment).
     * - Otherwise it will replace the text of the all witness with an error message.
     *
     * @param {element} docDOM XML element to be parsed
     * @param {string} wit id of witness to be considered
     *
     * @author CDP
     */
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
