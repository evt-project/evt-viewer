angular.module('evtviewer.dataHandler')

.service('evtParser', function(parsedData) {
    var parser = {};

    // TODO: create module provider and add default configuration
    var defAttributes = ['n', 'n', 'n'];
    var defPageElement = 'pb';
    var defDocElement = 'div[subtype="edition_text"]';

    parser.parsePages = function(doc) {
        var currentDocument = angular.element(doc);
        var attributes = [];
        angular.forEach(currentDocument.find(defPageElement), 
            function(element) {
                for (var i in defAttributes){
                    attributes.push(element.getAttribute(defAttributes[i]));
                }
                parsedData.addPage(attributes[0], attributes[1], attributes[2]);
                attributes = [];
        });
        console.log('## Pages ##', parsedData.getPages());
    };

    parser.parseDocuments = function(doc) {
        var currentDocument = angular.element(doc);
        var attributes = [];
        angular.forEach(currentDocument.find(defDocElement), 
            function(element) {
                for (var i in defAttributes){
                    attributes.push(element.getAttribute(defAttributes[i]));
                }
                parsedData.addDocuments(attributes[0], attributes[1], attributes[2]);
                attributes = [];
        });
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

    parser.parseCriticalEntries = function(doc) {
        var currentDocument = angular.element(doc);
        angular.forEach(currentDocument.find('app'), 
            function(element) {
                var entry = {};
                
                for (var i = 0; i < element.attributes.length; i++) {
                    var attrib = element.attributes[i];
                    if (attrib.specified) {
                        entry[attrib.name] = attrib.value;
                    }
                } 
                var entryId = element.getAttribute('xml:id')  || Math.random().toString(36).substr(2, 9);

                entry.lemma = {};
                var lemmaElem = element.getElementsByTagName('lem')[0];
                if (lemmaElem !== undefined) {
                    entry.lemma.content = lemmaElem.textContent;
                    for (i = 0; i < lemmaElem.attributes.length; i++) {
                        var lemmaAttrib = lemmaElem.attributes[i];
                        if (lemmaAttrib.specified) {
                            entry.lemma[lemmaAttrib.name] = lemmaAttrib.value;
                        }
                    }
                }
                
                var readings = element.getElementsByTagName('rdg');
                if ( readings !== undefined ) {
                    entry.readings = { length: 0 };

                    for (i = 0; i < readings.length; i++) {
                        var r = readings[i];
                        var rdg = {};
                        rdg.content = r.textContent;
                        for (var j = 0; j < r.attributes.length; j++) {
                            var rdgAttrib = r.attributes[j];
                            if (rdgAttrib.specified) {
                                rdg[rdgAttrib.name] = rdgAttrib.value;
                            }
                        }
                        var id = r.getAttribute('xml:id')  || Math.random().toString(36).substr(2, 9);
                        entry.readings[entry.readings.length] = id;
                        entry.readings[id] = rdg;
                        entry.readings.length++;
                    }
                }

                parsedData.addCriticalEntry(entry, entryId);
        });

        console.log('## Critical entries ##', JSON.stringify(parsedData.getCriticalEntries()));
    };
    
    return parser;
});