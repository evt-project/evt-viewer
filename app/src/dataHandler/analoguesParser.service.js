angular.module('evtviewer.dataHandler')

.service('evtAnaloguesParser', function($q, parsedData, evtCriticalApparatusParser, evtSourcesParser, config) {
    //TODO
    //Forse dovrai spostare tutti i parser degli elementi critici in un unico file :(
    var parser = {}

    var analoguesUrl = '';

        parser.parseExternalAnalogues = function(doc) {
        //TODO: risolvere problema di childNodes[0]
        var deferred = $q.defer();
        for (var i = 0; i < doc.childNodes.length; i++) {
            //handleAnalogue(doc.childNodes[i]);
        }
        console.log('## External Analogues Received ##', parsedData.getAnaloguesEntries());

        //updateQuotes();
        
        deferred.resolve('success');
        return deferred;
    }

    return parser;
});