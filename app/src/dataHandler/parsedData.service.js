angular.module('evtviewer.dataHandler')

.service('parsedData', function($log) {
    var parsedData = {};
    var _console = $log.getInstance('dataHandler');

    // TODO manage unique value for pages, documents and editions

    var pagesCollection = []; // {value: 'page', label: 'page label', title: 'page title'}
    var documentsCollection = {
        length: 0,
        list: {}
    }; 
    
    var pagesCollectionTexts = []; 
    
    var witnessesCollection = {
        list: {}
    };

    var witnessesGroupCollection = {};

    var criticalAppCollection = {};
   
    parsedData.getPages = function() {
        return pagesCollection;
    };

    // TODO: add attribute for the original xml reference
    parsedData.addPage = function(value, label, title) {
        pagesCollection.push({
            value: value,
            label: label,
            title: title
        });
        pagesCollectionTexts[value] = parsedData.getPageText(value);
        // _console.log('parsedData - addPage ' + value);
    };
    parsedData.findPage = function(value) {
        var i = 0;
        while ( i < pagesCollection.length && pagesCollection[i].value !== value) {
            i++;
        }
        return pagesCollection[i];
    };


    parsedData.getPageText = function(pageId) {
        // var texts = mockText1;

        // var i = 0;
        // while ( i < texts.length && texts[i].page !== pageId) {
        //     i++;
        // }
        // return texts[i];
        return {};
    };

    parsedData.getPageImage = function(pageId) {
        // var images = mockImage1;

        // var i = 0;
        // while ( i < images.length && images[i].page !== pageId) {
        //     i++;
        // }
        // return images[i];
        return {};
    };


    parsedData.addDocument = function(doc) {
        var docId = doc.value;
        if ( documentsCollection.length === undefined ) {
            documentsCollection.length = 0;
        }
        
        if ( doc.value == '' ) {
            docId = doc.value = 'doc_'+(documentsCollection.length+1);
        }
        if ( documentsCollection.list[docId] === undefined ) {
            documentsCollection[documentsCollection.length] = docId;
            documentsCollection.list[docId] = doc;
            documentsCollection.length++;
            _console.log('parsedData - addDocument ', doc);
        }
    };

    parsedData.getDocuments = function() {
        return documentsCollection;
    };

    parsedData.getDocumentsList = function() {
        _console.log('parsedData - getDocumentsList ', documentsCollection.list);
        return documentsCollection.list;
    };

    parsedData.getDocument = function(docId) {
        return documentsCollection.list[docId];
    }
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
        return criticalAppCollection;
        // _console.log('parsedData - getCriticalEntries ', criticalAppCollection);
    };

    return parsedData;
});