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
    var parseAppEntry = function(app) {
        var entry = { 
            __elemTypes : {},
            lemma       : {},
            readings    : { length : 0 },
            note        : ''
        };
        entry.id = app.getAttribute('xml:id')  || Math.random().toString(36).substr(2, 9);
        
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
                var id = child.getAttribute('xml:id')  || Math.random().toString(36).substr(2, 9);
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
        
        console.log('## Critical entries ##', JSON.stringify(parsedData.getCriticalEntries()));
        // console.log('## Critical entries ##', parsedData.getCriticalEntries());
    };
    
    return parser;
});