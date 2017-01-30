angular.module('evtviewer.dataHandler')

.service('parsedData', function($log, config) {
    var parsedData = {};
    var _console = $log.getInstance('dataHandler');

    _console.log('parsedData running');
    
    var projectInfo = {
        fileDescription     : '',
        encodingDescription : '',
        textProfile         : '',
        outsideMetadata     : '',
        revisionHistory     : ''
    }

    // TODO manage unique value for pages, documents and editions
    var pagesCollection = {
        length: 0
    };
    var documentsCollection = {
        length: 0
    }; 
    
    // var pagesCollectionTexts = []; 
    
    var witnessesCollection = {
        _indexes : {
            witnesses         : [],
            groups            : [],
            encodingStructure : []
        }
    };

    var genericColors = config.genericColors;

    var criticalAppCollection = {
        filtersCollection: { 
            filters     : { },
            length      : 0, 
            forLemmas   : 0,
            forVariants : 0,
            colors      : []
            
            // colors : ['rgb(215,48,39)','rgb(244,109,67)','rgb(253,174,97)','rgb(254,224,139)','rgb(217,239,139)','rgb(166,217,106)','rgb(102,189,99)','rgb(26,152,80)'],
            // colors : ['rgb(51,102,204)', 'rgb(16,150,24)', 'rgb(255,153,0)', 
            //           'rgb(221,68,119)', 'rgb(34,170,153)', 
            //           'rgb(153,0,153)', 'rgb(220,57,18', 'rgb(0,153,198)', 'rgb(102,170,0)',
            //           'rgb(184,46,46)', 'rgb(49,99,149)', 'rgb(153,68,153)'],
        },
        __allLoaded   : false,
        _maxVariance  : 0,
        _indexes      : {
            encodingStructure : [],
            appEntries        : []
        }
    };

    var criticalTexts = {};
    
    // TODO: Gestire edizioni
    var mockEditions = [
        {
            value: 'critical',
            label: 'Critical',
            title: 'Critical edition'
        },
        {
            value: 'interpretative',
            label: 'Interpretative',
            title: 'Interpretative edition'
        }, 
        {
            value: 'diplomatic',
            label: 'Diplomatic',
            title: 'Diplomatic edition'
        }
    ]; 
    
    var criticalEdition = false;
    /* PAGES */
    // TODO: add attribute for the original xml reference
    parsedData.addPage = function(page) {
        var pageId = page.value;
        if ( pagesCollection.length === undefined ) {
            pagesCollection.length = 0;
        }
        
        if ( page.value === '' ) {
            pageId = page.value = 'page_'+(pagesCollection.length+1);
        }
        if ( pagesCollection[pageId] === undefined ) {
            pagesCollection[pagesCollection.length] = pageId;
            pagesCollection[pageId] = page;
            pagesCollection.length++;
            // _console.log('parsedData - addPage ', page);
        }
    };
    parsedData.getPages = function() {
        return pagesCollection;
    };
    parsedData.getPage = function(pageId) {
        return pagesCollection[pageId];
    };

    parsedData.setPageText = function(pageId, docId, editionLevel, HTMLtext) {
        var pageObj = pagesCollection[pageId];
        if (pageObj) {
            if (!pageObj.text) {
                pageObj.text = {};
            }
            var pageDocObj = pageObj.text[docId];
            if (pageDocObj !== undefined && pageDocObj[editionLevel] !== undefined) {
                pageDocObj[editionLevel] += HTMLtext;
            } else if (pageDocObj !== undefined) {
                pageDocObj[editionLevel] = HTMLtext;
            } else {
                pageObj.text[docId] = { };
                pageObj.text[docId][editionLevel] = HTMLtext;
            }
        }
    };

    parsedData.getPageText = function(pageId, docId, editionLevel) {
        var pageObj = pagesCollection[pageId];
        if (pageObj && pageObj.text && pageObj.text[docId]) {
            return pageObj.text[docId][editionLevel];
        }
        return undefined;
    };
    
    parsedData.getPageImage = function(pageId) {
        var images = [];

        var i = 0;
        while ( i < images.length && images[i].page !== pageId) {
            i++;
        }
        // return images[i];
        return {};
    };

    /* DOCUMENTS */
    parsedData.addDocument = function(doc) {
        var docId = doc.value;
        if ( documentsCollection.length === undefined ) {
            documentsCollection.length = 0;
        }
        
        if ( doc.value === '' ) {
            docId = doc.value = 'doc_'+(documentsCollection.length+1);
        }
        if ( documentsCollection[docId] === undefined ) {
            documentsCollection[documentsCollection.length] = docId;
            documentsCollection[docId] = doc;
            documentsCollection.length++;
            // _console.log('parsedData - addDocument ', doc);
        }
    };
    parsedData.getDocuments = function() {
        return documentsCollection;
    };
    parsedData.getDocument = function(docId) {
        return documentsCollection[docId];
    };

    /* EDITION */
    parsedData.setCriticalEditionAvailability = function(isAvailable) {
        console.log('setCriticalEditionAvailability', isAvailable);
        criticalEdition = isAvailable; 
    };

    parsedData.isCriticalEditionAvailable = function() {
        return criticalEdition;
    };

    parsedData.addEditions = function() {
        // var mock = {
        //     value: 'edition3',
        //     label: 'edition3 label',
        //     title: 'edition3 title'
        // };
        // mockEditions.push(mock);
    };
    parsedData.getEditions = function() {
        return mockEditions;
    };
    parsedData.getEdition = function(editionId) {
        //TODO: Rifare
        var i = 0,
            edition;
        while (i < mockEditions.length && edition === undefined) {
            if (mockEditions[i].value === editionId) {
                edition = mockEditions[i];
            }
            i++;
        }
        return edition;
    };

    /* WITNESSES */
    parsedData.addElementInWitnessCollection = function(element){
        var skipWitnesses = config.skipWitnesses.split(',').filter(function(el) { return el.length !== 0; });
        if (skipWitnesses.indexOf(element.id) < 0){
            if (witnessesCollection[element.id] === undefined) {
                witnessesCollection[element.id] = element;
                
                if (element._type === 'group') {
                    witnessesCollection._indexes.groups.push(element.id);
                } else {
                    witnessesCollection._indexes.witnesses.push(element.id);    
                }
                
                if (element._group === undefined) {
                    witnessesCollection._indexes.encodingStructure.push(element.id);
                }
            }
        }
    };

    parsedData.addWitnessText = function(witId, docId, content) {
        if (witnessesCollection[witId] !== undefined) {
            if (witnessesCollection[witId].text === undefined){
                witnessesCollection[witId].text = {};
            }
            witnessesCollection[witId].text[docId] = content;
        }
    };
    parsedData.getWitnessText = function(witId, docId) {
        if (witnessesCollection[witId] !== undefined) {
            if (witnessesCollection[witId].text !== undefined && witnessesCollection[witId].text[docId] !== undefined){
                return witnessesCollection[witId].text[docId];
            }
        }
    };
    parsedData.getWitnessesList = function() {
        return witnessesCollection._indexes.witnesses;
    };
    parsedData.getWitnesses = function() {
        return witnessesCollection;
    };
    parsedData.getWitness = function(witId) {
        return witnessesCollection[witId];
    };
    parsedData.getWitnessPages = function(witId) {
        if ( witnessesCollection[witId] !== undefined) {
            if (witnessesCollection[witId].pages === undefined) {
                var pages = { length: 0 };
                for ( var i = 0; i < pagesCollection.length; i++ ) {
                    var page = pagesCollection[pagesCollection[i]];
                    if ( page.ed === '#'+witId ) {
                        pages[pages.length] = pagesCollection[i];
                        pages[pagesCollection[i]] = page;
                        pages.length++;
                    }
                }
                witnessesCollection[witId].pages = pages;
            }
            return witnessesCollection[witId].pages;
        }
    };
    parsedData.isWitnessesGroup = function(sigla) {
        return witnessesCollection[sigla] !== undefined && witnessesCollection[sigla]._type === 'group';
    };
    parsedData.getWitnessesInGroup = function(groupId) {
        var wits = [];
        if (witnessesCollection[groupId] !== undefined && witnessesCollection[groupId]._type === 'group') {
            var groupContent = witnessesCollection[groupId].content;
            for (var wit in groupContent) {
                var sigla = groupContent[wit];
                if (parsedData.isWitnessesGroup(sigla)){
                    wits.push.apply(wits, parsedData.getWitnessesInGroup(sigla));
                } else {
                    wits.push(sigla);
                }
            }
        }
        return wits;
    };

    //temp
    parsedData.getWitnessesListFormatted = function(){
        var structure = witnessesCollection._indexes.encodingStructure;
        var content;
        content = '<ul>';
        for (var i = 0; i < structure.length; i++) {
            var element = witnessesCollection[structure[i]];
            if (element._type === 'witness') {
                content += '<li>';
                    content += '<strong>#'+element.id+'</strong><br /><div>'+element.description.innerHTML+'</div>';
                content += '</li>';
            } else {
                content += '<li>';
                    content += '<strong>#'+element.id+'</strong><br /><div>'+element.name+'</div>';
                    content += '<ul>';
                    for (var j = 0; j < element.content.length; j++) {
                        var subElement = witnessesCollection[element.content[j]];
                        if (subElement._type === 'witness') {
                            content += '<li>';
                            content += '<strong>#'+subElement.id+'</strong><br /><div>'+subElement.description.innerHTML+'</div>';
                            content += '</li>';
                        }
                        //TO DO RICORSIVA!!!            
                    }
                    content += '</ul>';
                content += '</li>';
            }
        }
        content += '</ul>';
        return content;
    };

    /* **************** */
    /* CRITICAL ENTRIES */
    /* **************** */
    parsedData.getCriticalTextsCollection = function() {
        return criticalTexts;
    };
    parsedData.addCriticalText = function(text, docId) {
        criticalTexts[docId] = text;
    };

    parsedData.getCriticalText = function(docId) {
        return criticalTexts[docId];
    };

    parsedData.addCriticalEntry = function(entry) {
        if ( criticalAppCollection[entry.id] === undefined ) {
            criticalAppCollection[entry.id] = entry;
            criticalAppCollection._indexes.appEntries.push(entry.id);
            if (!entry._subApp) {
                criticalAppCollection._indexes.encodingStructure.push(entry.id);
            }
        }
        if (entry._variance > criticalAppCollection._maxVariance){
            criticalAppCollection._maxVariance = entry._variance;
        }
    };

    parsedData.setCriticalEntriesLoaded = function(status) {
        criticalAppCollection.__allLoaded = status;
    };

    parsedData.getCriticalEntries = function() {
        return criticalAppCollection;
    };

    parsedData.getCriticalEntryById = function(entryPos) {
        return criticalAppCollection[entryPos];
    };

    parsedData.getCriticalEntriesMaxVariance = function() {
        return criticalAppCollection._maxVariance;
    }; 

    parsedData.getReadingAttributes = function(readingId, appId){
        var attributes = [];
        if (criticalAppCollection[appId].content[readingId] !== undefined){
            attributes = criticalAppCollection[appId].content[readingId].attributes;
        }
        return attributes;
    };

    /* CRITICAL ENTRIES FILTERS */
    parsedData.getGenericColorForAppEntry = function(index){
        var filtersCollection = criticalAppCollection.filtersCollection,
            color;
        if (filtersCollection.colors === undefined || 
            filtersCollection.colors.indexOf(genericColors[index]) < 0) {
            color = genericColors[index];
            genericColors.splice(index, 1);
        } else {
            color = parsedData.getGenericColorForAppEntry(index+1);
        }
        return color;
    };

    parsedData.addCriticalEntryFilter = function(name, value) {
        var possibleVariantFilters = config.possibleVariantFilters,
            possibleLemmaFilters   = config.possibleLemmaFilters,
            filtersCollection      = criticalAppCollection.filtersCollection;
        // Add filter to collection
        // if it can be a filter
        if (possibleVariantFilters.indexOf(name) >= 0 || possibleLemmaFilters.indexOf(name) >= 0) {
            // create group for filter if not exist
            if ( filtersCollection.filters[name] === undefined ) {
                filtersCollection.filters[name] = {
                    name   : name,
                    possibleFor : {
                        lemma   : possibleLemmaFilters.indexOf(name) >= 0,
                        variant : possibleVariantFilters.indexOf(name) >= 0 
                    },
                    values : {}
                };
            }
            // add value if not already added
            if ( filtersCollection.filters[name].values[value] === undefined) {
                // assign color
                var color;
                if (config.variantColors[name] !== undefined && 
                    config.variantColors[name][value] !== undefined && config.variantColors[name][value] !== '' ){
                    color = config.variantColors[name][value];
                    if (genericColors.indexOf(color) >= 0) {
                        genericColors.splice(genericColors.indexOf(color), 1);
                    }
                } else {
                    color = parsedData.getGenericColorForAppEntry(0);
                }
                filtersCollection.colors.push(color);

                var valueObj = {
                    name  : value,
                    color : color
                };
                filtersCollection.filters[name].values[value] = valueObj;
                filtersCollection.length++;
                if (possibleVariantFilters.indexOf(name) >= 0) {
                    filtersCollection.forVariants++;
                }
                if (possibleLemmaFilters.indexOf(name) >= 0) {
                    filtersCollection.forLemmas++;   
                }
            }
        }
    };
    
    parsedData.getCriticalEntriesFiltersCollection = function() {
        return criticalAppCollection.filtersCollection;
    };

    parsedData.getCriticalEntriesFilters = function() {
        return criticalAppCollection.filtersCollection.filters;
    };

    parsedData.getCriticalEntriesFilterValues = function(filter) {
        return criticalAppCollection.filtersCollection.filters[filter];
    };

    parsedData.getCriticalEntriesFilterColor = function(filter, value) {
        return criticalAppCollection.filtersCollection.filters[filter].values[value].color;
    };

    /* ************ */
    /* PROJECT INFO */
    /* ************ */
    parsedData.updateProjectInfoContent = function(newContent, type){
        projectInfo[type] = newContent;
    };
    parsedData.getProjectInfo = function(){
        return projectInfo;
    }
    return parsedData;
});