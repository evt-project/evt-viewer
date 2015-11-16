angular.module('evtviewer.dataHandler')

.service('parsedData', function($log) {
    var parsedData = {};
    var _console = $log.getInstance('dataHandler');

    _console.log('parsedData running');
    // TODO manage unique value for pages, documents and editions
    var pagesCollection = {
        length: 0,
        list: {}
    };
    var documentsCollection = {
        length: 0,
        list: {}
    }; 
    
    // var pagesCollectionTexts = []; 
    
    var witnessesCollection = {
        length: 0,
        list: {}
    };

    var witnessesGroupCollection = {};

    var criticalAppCollection = {};
   
    // TODO: add attribute for the original xml reference
    parsedData.addPage = function(page) {
        var pageId = page.value;
        if ( pagesCollection.length === undefined ) {
            pagesCollection.length = 0;
        }
        
        if ( page.value === '' ) {
            pageId = page.value = 'page_'+(pagesCollection.length+1);
        }
        if ( pagesCollection.list[pageId] === undefined ) {
            pagesCollection[pagesCollection.length] = pageId;
            pagesCollection.list[pageId] = page;
            pagesCollection.length++;
            // _console.log('parsedData - addPage ', page);
        }
    };
    parsedData.getPages = function() {
        return pagesCollection;
    };

    parsedData.getPagesList = function() {
        return pagesCollection.list;
    };
    
    parsedData.getPage = function(pageId) {
        return pagesCollection.list[pageId];
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
        if ( documentsCollection.list[docId] === undefined ) {
            documentsCollection[documentsCollection.length] = docId;
            documentsCollection.list[docId] = doc;
            documentsCollection.length++;
            // _console.log('parsedData - addDocument ', doc);
        }
    };

    parsedData.getDocuments = function() {
        return documentsCollection;
    };

    parsedData.getDocumentsList = function() {
        return documentsCollection.list;
    };

    parsedData.getDocument = function(docId) {
        return documentsCollection.list[docId];
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
    parsedData.addWitness = function(witness) {
        var witId = witness.value;
        if ( witnessesCollection.length === undefined ) {
            witnessesCollection.length = 0;
        }
        if ( witnessesCollection.list[witId] === undefined ) {
            witnessesCollection[witnessesCollection.length] = witId;
            witnessesCollection.list[witId] = witness;
            witnessesCollection.length++;
            // _console.log('parsedData - addWitness ', witnessesCollection);
        }
    };
    parsedData.addWitnessGroup = function(group) {
        var grpId = group.id;
        if ( witnessesGroupCollection.length === undefined ) {
            witnessesGroupCollection.length = 0;
        }
        if ( witnessesGroupCollection[grpId] === undefined ) {
            witnessesGroupCollection[witnessesGroupCollection.length] = grpId;
            witnessesGroupCollection[grpId] = group;
            witnessesGroupCollection.length++;
            // _console.log('parsedData - addWitnessGroup ', witnessesGroupCollection);
        }
    };
    parsedData.addWitnessText = function(witId, content) {
        if ( witnessesCollection.list[witId] === undefined ) {
            parsedData.addWitness(witId);
        } 
        witnessesCollection.list[witId].content = content;
    };

    parsedData.getWitnesses = function() {
        return witnessesCollection;
    };

    parsedData.getWitnessesList = function() {
        return witnessesCollection.list;
    };

    parsedData.getWitness = function(witId) {
        return witnessesCollection.list[witId];
    };

    parsedData.getWitnessesGroups = function() {
        return witnessesGroupCollection;
    };

    parsedData.getGroup = function(grpId) {
        return witnessesGroupCollection[grpId];
    };

    /* CRITICAL APPARATUS */
    parsedData.addCriticalEntry = function(entry, entryId) {
        // var entryId = entry.id;
        if ( criticalAppCollection.length === undefined ) {
            criticalAppCollection.length = 0;
        }
        if ( criticalAppCollection[entryId] === undefined ) {
            criticalAppCollection[criticalAppCollection.length] = entryId;
            criticalAppCollection[entryId] = entry;
            criticalAppCollection.length++;
            // _console.log('parsedData - addCriticalEntry ', criticalAppCollection);
        }
    };

    parsedData.getCriticalEntries = function() {
        // _console.log('parsedData - getCriticalEntries ', criticalAppCollection);
        return criticalAppCollection;
    };

    parsedData.getCriticalEntryByPos = function(entryPos) {
        // _console.log('parsedData - getCriticalEntryByPos ', entryPos);
        return criticalAppCollection[entryPos];
    };
    return parsedData;
});