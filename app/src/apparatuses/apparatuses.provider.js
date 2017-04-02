angular.module('evtviewer.apparatuses')

.provider('evtApparatuses', function() {

    /*var defaults = this.defaults;

    this.setDefaults = function(_defaults) {
        defaults = _defaults;
    }*/

    this.$get = function(parsedData, evtInterface) {
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
                openApparatus,// = evtInterface.getCurrentApparatus() || '',//l'apparato selezionato, ergo il contenuto del box e della fascia in fondo
                openApparatusContent,
                updateApparatus,//funzione che aggiorna l'apparato
                apparatuses = [],
                appStructure = 'tabs'
                appList = parsedData.getCriticalEntries()._indexes.encodingStructure,
                quotesList = parsedData.getQuotes()._indexes.encodingStructure,
                analoguesList = parsedData.getAnalogues()._indexes.encodingStructure;//tutti gli apparati disponibili

            /*JSON.stringify(config.apparatusStructure) --> tabs || boxes*/

            if (appList.length > 0) {
                apparatuses.push({label: 'Critical Apparatus', list: appList});
            }
            if (quotesList.length > 0) {
                apparatuses.push({label: 'Sources', list: quotesList});
            }
            if (analoguesList.length > 0) {
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