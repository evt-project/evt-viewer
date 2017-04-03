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
                currentApparatus = scope.currentApparatus || '',//l'apparato selezionato nell'interfaccia
                openApparatusContent,
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

            scopeHelper = {
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
            angular.forEach(collection, function(currentApparatuses){
                currentApparatuses.currentApparatus = app;
            });
        };

        apparatuses.destroy = function(tempId) {
            delete collection[tempId];
        };

        return apparatuses;
    };
});