angular.module('evtviewer.dataHandler')

.service('parsedData', function($log) {
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
    var witnessesList = {
        length : 0
    };
    var witnessesCollection = {
        length : 0,
        _groups : []
    };

    var witnessesTextsCollection = {};
    var witnessesPagesCollection = {};
    var criticalAppCollection = {
        length: 0,
        filters: { }
    };

    var criticalTextMock = [];
    
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
    parsedData.addWitnessInCollection = function(element) {
        if ( witnessesCollection.length === undefined ) {
            witnessesCollection.length = 0;
        }
        if ( witnessesCollection[element.id] === undefined ) {
            witnessesCollection[witnessesCollection.length] = element.id;
            witnessesCollection[element.id] = element;
            witnessesCollection.length++;
            if (element.type === 'group') {
                witnessesCollection._groups.push(element.id);
            }
        }
        if (element.type !== 'group') {
            parsedData.addWitnessInList(element);
        }
    };
    parsedData.addWitnessInList = function(element){
        if ( witnessesList.length === undefined ) {
            witnessesList.length = 0;
        }
        if (witnessesList[element.id] === undefined) {
            witnessesList[witnessesList.length] = element.id;
            witnessesList[element.id] = element;
            witnessesList.length++;
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
    parsedData.getWitnessesTextsCollection = function() {
        return witnessesTextsCollection;
    };
    parsedData.getWitnessesList = function() {
        return witnessesList;
    };
    parsedData.getWitnesses = function() {
        return witnessesCollection;
    };
    parsedData.getWitness = function(witId) {
        if ( witnessesCollection[witId] !== undefined ) {
            return witnessesCollection[witId];    
        } else {
            // altrimenti cerco all'interno di ogni gruppo finché non lo trovo
            var groups = witnessesCollection._groups;
            var i = 0,
                found = false,
                witness;
            while ( i < groups.length && !found) {
                if (witnessesCollection[groups[i]].content[witId] !== undefined) {
                    witness = witnessesCollection[groups[i]].content[witId];
                    found = true;
                }
                i++;
            }
            return witness;
        }
    };
    parsedData.getWitnessPages = function(witId) {
        if ( witnessesPagesCollection[witId] !== undefined ) {
            return witnessesPagesCollection[witId];
        } else {
            var pages = { length: 0 };
            for ( var i = 0; i < pagesCollection.length; i++ ) {
                var page = pagesCollection[pagesCollection[i]];
                if ( page.ed === '#'+witId ) {
                    pages[pages.length] = pagesCollection[i];
                    pages[pagesCollection[i]] = page;
                    pages.length++;
                }
            }
            witnessesPagesCollection[witId] = pages;
        }
        // _console.log(witnessesPagesCollection[witId]);
        return witnessesPagesCollection[witId];
    };
    parsedData.isWitnessesGroup = function(sigla) {
        return witnessesCollection[sigla] !== undefined && witnessesCollection[sigla].type === 'group';
    };
    parsedData.getWitnessesInGroup = function(groupId) {
        var wits = [];
        if (witnessesCollection[groupId] !== undefined && witnessesCollection[groupId].type === 'group') {
            wits = witnessesCollection[groupId].content;
        }
        return wits;
    };

    /* CRITICAL ENTRIES */
    parsedData.addCriticalText = function(text, docId) {
        criticalTextMock.push(text);
    };

    parsedData.getCriticalText = function(docId) {
        return criticalTextMock[0];
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
    };

    parsedData.getCriticalEntriesFilters = function() {
        return criticalAppCollection.filters;
    };

    parsedData.getCriticalEntriesFilterValues = function(filter) {
        return criticalAppCollection.filters[filter];
    };

    return parsedData;
});