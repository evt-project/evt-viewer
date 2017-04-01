angular.module('evtviewer.apparatuses')

.provider('evtApparatuses', function() {

    /*var defaults = this.defaults;

    this.setDefaults = function(_defaults) {
        defaults = _defaults;
    }*/

    this.$get = function(parsedData) {
        var apparatuses = {},
            collection = {},
            list = [],
            idx = 0;
        
        apparatuses.build = function(scope) {
            var currentId = idx++;

            if (typeof(collection[currentId]) !== 'undefined') {
                return;
            }
            var scopeHelper = {},
                openApparatus = '',//l'apparato selezionato, ergo il contenuto del box e della fascia in fondo
                //updateApparatus,//funzione che aggiorna l'apparato
                apparatuses = [],
                appStructure = 'tabs';//tutti gli apparati disponibili

            /*JSON.stringify(config.apparatusStructure) --> tabs || boxes*/

            if (parsedData.getCriticalEntries()._indexes.encodingStructure.length > 0) {
                var appList = parsedData.getCriticalEntries()._indexes.appEntries;
                apparatuses.push({label: 'Critical Apparatus', list: appList});
                openApparatus = 'Critical Apparatus';
            }
            if (parsedData.getQuotes()._indexes.encodingStructure.length > 0) {
                var quotesList = parsedData.getQuotes()._indexes.encodingStructure;
                apparatuses.push({label: 'Sources', list: quotesList});
            }
            if (parsedData.getAnalogues()._indexes.encodingStructure.length > 0) {
                var analoguesList = parsedData.getAnalogues()._indexes.encodingStructure;
                apparatuses.push({label: 'Analogues', list: analoguesList});
            }

            /*updateApparatus = function(app) {
                if (app === 'Critical Apparatus') {
                    
                }
            }*/

            scopeHelper = {
                uid : currentId,
                openApparatus : openApparatus,
                //updateApparatus : updateApparatus,
                apparatuses : apparatuses,
                appStructure : appStructure
            };

            collection[currentId] = angular.extend(scope.vm, scopeHelper);
            list.push({
                id: currentId
            });

            return collection[currentId];
        }

        apparatuses.destroy = function(tempId) {
            delete collection[tempId];
        };

        return apparatuses;
    };
});