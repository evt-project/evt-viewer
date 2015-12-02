angular.module('evtviewer.dataHandler')

.service('parsedData', function($log, xmlParser) {
    var parsedData = {};
    var _console = $log.getInstance('dataHandler');

    _console.log('parsedData running');
    // TODO manage unique value for pages, documents and editions
    var pagesCollection = {
        length: 0
    };
    var documentsCollection = {
        length: 0
    }; 
    
    // var pagesCollectionTexts = []; 
    
    var witnessesCollection = {
        length: 0
    };

    var witnessesTextsCollection = {};
    var criticalAppCollection = {
        length: 0,
        filters: { }
    };

    var criticalText_mock = [];
   
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


    parsedData.getPageText = function(pageId) {
        var texts = [];

        var i = 0;
        while ( i < texts.length && texts[i].page !== pageId) {
            i++;
        }
        // return texts[i];
        return {};
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
    parsedData.getEditions = function() {
        // return mockEditions;
    };

    parsedData.addEditions = function() {
        // var mock = {
        //     value: 'edition3',
        //     label: 'edition3 label',
        //     title: 'edition3 title'
        // };
        // mockEditions.push(mock);
    };

    /* WITNESSES */
    parsedData.addWitness = function(element) {
        if ( witnessesCollection.length === undefined ) {
            witnessesCollection.length = 0;
        }
        if ( witnessesCollection[element.id] === undefined ) {
            witnessesCollection[witnessesCollection.length] = element.id;
            witnessesCollection[element.id] = element;
            witnessesCollection.length++;
            // _console.log('parsedData - addWitness ', witnessesCollection);
        }
    };
    
    parsedData.addWitnessText = function(witId, content) {
        if ( witnessesTextsCollection[witId] === undefined ) {
            witnessesTextsCollection[witId] = '<text>'+content+'</text>';
        } 
    };

    parsedData.getWitnessText = function(witId) {
        if ( witnessesTextsCollection[witId] !== undefined ) {
            return witnessesTextsCollection[witId];
        } 
    };

    parsedData.getWitnesses = function() {
        return witnessesCollection;
    };

    parsedData.getWitnessById = function(witId) {
        return witnessesCollection[witId];
    };

    /* CRITICAL ENTRIES */
    parsedData.addCriticalText = function(text, docId) {
        criticalText_mock.push(text);
    };
    parsedData.getCriticalText = function(docId) {
        return criticalText_mock;
    };

    parsedData.addCriticalEntry = function(entry, entryId) {
        if ( criticalAppCollection.length === undefined ) {
            criticalAppCollection.length = 0;
        }
        if ( criticalAppCollection[entryId] === undefined ) {
            criticalAppCollection[criticalAppCollection.length] = entryId;
            criticalAppCollection[entryId] = entry;
            criticalAppCollection.length++;
        }
    };

    parsedData.getCriticalEntries = function() {
        return criticalAppCollection;
    };

    parsedData.getCriticalEntryByPos = function(entryPos) {
        return criticalAppCollection[entryPos];
    };

    /* CRITICAL ENTRIES FILTERS */
    parsedData.addCriticalEntryFilter = function(name, value) {
        if ( criticalAppCollection.filters[name] === undefined ) {
            criticalAppCollection.filters[name] = {
                name: name,
                values: [value]
            };
        } else {
            if ( criticalAppCollection.filters[name].values.indexOf(value) < 0 ) {
                criticalAppCollection.filters[name].values.push(value);
            }
        }
    }

    parsedData.getCriticalEntriesFilters = function() {
        return criticalAppCollection.filters;
    }

    parsedData.getCriticalEntriesFilterValues = function(filter) {
        return criticalAppCollection.filters[filter];
    }
    return parsedData;
});