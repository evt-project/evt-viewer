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
    };

    return parser;
});