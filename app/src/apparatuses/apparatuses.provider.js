angular.module('evtviewer.apparatuses')

.provider('evtApparatuses', function() {

    var defaults = this.defaults;

    this.setDefaults = function(_defaults) {
        defaults = _defaults;
    }

    var currentApparatuses = '';

    this.$get = function(parsedData, evtInterface, evtVersionReading, evtReading) {
        var apparatuses = {},
            collection = {},
            list = [],
            idx = 0;
        
        apparatuses.build = function(scope) {
            var currentId = idx++;

            if (collection[currentId] !== undefined) {
                return;
            }
            //Aggiungere l'apparato da aprire per configurazione
            //Aggiungere nella configurazione, un array con l'ordine degli apparati
            //E la struttura dei tabs
            var currentApparatus = scope.currentApparatus || 'Critical Apparatus',//l'apparato selezionato nell'interfaccia
                apparatuses = [],
                appStructure = 'tabs'
                appList = [],
                quotesList = [],
                analoguesList = [],
                appEntries = parsedData.getCriticalEntries(),
                quotesEntries = parsedData.getQuotes(),
                analoguesEntries = parsedData.getAnalogues();//tutti gli apparati disponibili
            
            for (var i in appEntries) {
                if (appEntries[i]._isInMainVersion) {
                    appList.push(appEntries[i].id);
                }
            }

            for (var j in quotesEntries) {
                if (quotesEntries[j]._isInMainVersion) {
                    quotesList.push(quotesEntries[j].id);
                }
            }

            for (var h in analoguesEntries) {
                if (analoguesEntries[h]._isInMainVersion) {
                    analoguesList.push(analoguesEntries[h].id);
                }
            }

            if (currentApparatus === 'Critical Apparatus') {
                evtInterface.updateCurrentApparatus('Critical Apparatus');
            }
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

            var scopeHelper = {
                uid : currentId,
                currentApparatus : currentApparatus,
                apparatuses : apparatuses,
                appStructure : appStructure
            };

            collection[currentId] = angular.extend(scope.vm, scopeHelper);
            list.push({
                id: currentId
            });

            return collection[currentId];
        }

        apparatuses.setCurrentApparatus = function(app) {
            evtInterface.updateCurrentApparatus(app);
            angular.forEach(collection, function(currentApparatuses){
                currentApparatuses.currentApparatus = app;
            });
        };
        
        apparatuses.getCurrentApparatus = function() {
            return currentApparatuses.currentApparatus;
        }

        apparatuses.destroy = function(tempId) {
            delete collection[tempId];
        };

        apparatuses.unselectAllCriticalElements = function() {
            //
        }

        return apparatuses;
    };
});