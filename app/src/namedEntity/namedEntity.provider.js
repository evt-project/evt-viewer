angular.module('evtviewer.namedEntity')

.provider('evtNamedEntity', function() {

    var defaults = this.defaults;

    this.setDefaults = function(_defaults) {
        defaults = _defaults;
    };

    this.$get = function(parsedData, evtNamedEntitiesParser, baseData) {
        var namedEntity    = {},
            collection = {},
            list       = [],
            idx        = 0;
        
        var getElementContent = function() {
            var vm = this;
            var namedEntity = parsedData.getNamedEntity(vm.entityId);
            return namedEntity.output;
        };

        var toggle = function() {
            var vm = this;
            vm.opened = !vm.opened;
            vm.toggleState();
        };

        var toggleOccurrences = function() {
            var vm = this;
            if (!vm.occurrences) {
                vm.occurrences = namedEntity.getOccurrences(vm.entityId);
            } 
            vm.occurrencesOpened = !vm.occurrencesOpened;
            vm.toggleSection('occurrencesOpened');
        };

        var toggleMoreInfo = function() {
            var vm = this;
            vm.moreInfoOpened = !vm.moreInfoOpened;
            vm.toggleSection('moreInfoOpened');
        };

        var goToOccurrence = function(occurrence) {
            //TODO
            console.log('# TODO: # Go to occurrence ', occurrence);
        };

        // 
        // NamedEntity builder
        // 
        
        namedEntity.build = function(id, scope) {
            var currentId  = idx++,
                entityId   = id || undefined,
                entityType = scope.entityType || 'generic',
                attributes = '';

            var scopeHelper = {};
            
            if (typeof(collection[currentId]) !== 'undefined') {
                return;
            }

            var namedEntity = parsedData.getNamedEntity(entityId);
            var moreInfoAvailable = true;

            // Handle More info about entity
            // generic
            moreInfoAvailable = namedEntity !== undefined && namedEntity.notes !== undefined && namedEntity.notes.length > 0;
            // specific
            if (entityType === 'org') {
                moreInfoAvailable = moreInfoAvailable || namedEntity.desc !== undefined;
            } else if (entityType === 'generic') {
                moreInfoAvailable = moreInfoAvailable || namedEntity.details !== undefined;
            }

            // Handle entity occurrences
            var occurrences;
            if (namedEntity && namedEntity.occurrences) {
                occurrences = namedEntity.occurrences;
            } else {
                // Ask interface to calculate occurrences for entity
                //occurrences = [{ pageId: "fol_214v", pageLabel: "214v", docId: "CI_118", docLabel: "CI (118)" }];
            }

            scopeHelper = {
                // expansion
                uid           : currentId,
                entityId      : entityId,
                entityType    : entityType,
                
                entity        : namedEntity ? namedEntity : {},
                occurrences   : occurrences,

                opened         : false,
                moreInfoOpened : moreInfoAvailable,
                occurrencesOpened : false,
                noMoreInfo    :  !moreInfoAvailable,

                defaults      : angular.copy(defaults),

                // functions
                getElementContent : getElementContent,
                toggle            : toggle,
                toggleMoreInfo    : toggleMoreInfo,
                toggleOccurrences : toggleOccurrences,
                goToOccurrence    : goToOccurrence
            };

            collection[currentId] = angular.extend(scope.vm, scopeHelper);
            list.push({
                id: currentId,
                entityId: entityId
            });

            return collection[currentId];
        };


        //
        // Service function
        // 
        namedEntity.getOccurrences = function(refId) {
            var documentsCollection = parsedData.getDocuments(),
                documentsIndexes = documentsCollection._indexes || [],
                totOccurrences = [];
            for (var i = 0; i < documentsIndexes.length; i++) {
                var currentDoc = documentsCollection[documentsIndexes[i]],
                    docPages = evtNamedEntitiesParser.parseEntitiesOccurrences(currentDoc, refId);
                totOccurrences = totOccurrences.concat(docPages);
            }
            return totOccurrences;
        };

        namedEntity.getById = function(appId) {
            var foundNamedEntity;
            angular.forEach(collection, function(currentNamedEntity) {
                if (currentNamedEntity.appId === appId) {
                    foundNamedEntity = currentNamedEntity;
                }
            });  
            return foundNamedEntity;
        };

        namedEntity.getList = function() {
            return list;
        };

        namedEntity.destroy = function(tempId) {
            delete collection[tempId];
        };

        return namedEntity;
    };

});