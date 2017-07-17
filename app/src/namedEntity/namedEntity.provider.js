/**
 * @ngdoc service
 * @module evtviewer.namedEntity
 * @name evtviewer.namedEntity.evtNamedEntity
 * @description 
 * # evtNamedEntity
 * TODO: Add description and comments for every method
**/
angular.module('evtviewer.namedEntity')

.provider('evtNamedEntity', function() {

    var defaults = this.defaults;
    
    this.setDefaults = function(_defaults) {
        defaults = _defaults;
    };

    this.$get = function($timeout, config, parsedData, evtNamedEntitiesParser, baseData, evtInterface, evtNamedEntityRef, evtPinnedElements) {
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
            if (vm.location !== 'mainText') {
                vm.toggleSubContent(vm._firstSubContentOpened);
                
                vm.opened = !vm.opened;
                vm.toggleState();
            }
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
            var vm = this;
            evtInterface.updateCurrentPage(occurrence.pageId);
            evtInterface.updateCurrentDocument(occurrence.docId);
            evtInterface.updateUrl();
            if (evtInterface.getSecondaryContentOpened() === 'entitiesList') {
                evtInterface.updateSecondaryContentOpened('');        
            }
            $timeout(function() {
                evtNamedEntityRef.highlightByEntityId(vm.entityId);
            }, 500);
        };

        var toggleSubContent = function(subContentName) {
            var vm = this;
            if (subContentName === 'occurrences' && !vm.occurrences) {
                vm.occurrences = namedEntity.getOccurrences(vm.entityId);
            }
            if (vm._subContentOpened !== subContentName) {
                vm._subContentOpened = subContentName;
            } else {
                vm._subContentOpened = '';
            }

            vm.toggleSubContentClass();
        };

        //Pin Tool Functions
        var isPinAvailable = function(){
            return config.toolPinAppEntries;
        };
        var isPinned = function(){
            var vm = this;
            return evtPinnedElements.isPinned(vm.entityId);
        };

        var getPinnedState = function() {
            var vm = this;
            return vm.isPinned() ? 'pin-on' : 'pin-off';
        };

        var togglePin = function(){
            var vm = this;
            if (vm.isPinned()) {
                evtPinnedElements.removeElement({id: vm.entityId, type: 'namedEntity_'+vm.entityType });
            } else {
                evtPinnedElements.addElement({ id: vm.entityId, type: 'namedEntity_'+vm.entityType });
            }
        };

        var isCurrentPageDoc = function(occurrence) {
            var currentDoc = evtInterface.getCurrentDocument(),
                currentPage = evtInterface.getCurrentPage();
            return (currentDoc === occurrence.docId && currentPage === occurrence.pageId);
        };
        // 
        // NamedEntity builder
        // 
        
        namedEntity.build = function(id, scope) {
            var currentId  = idx++,
                entityId   = id || undefined,
                entityType = scope.entityType || parsedData.getNamedEntityType(entityId) || 'generic',
                location = scope.location || 'list',
                attributes = '';
                
            var scopeHelper = {};
            
            if (typeof(collection[currentId]) !== 'undefined') {
                return;
            }

            var namedEntity = parsedData.getNamedEntity(entityId),
                moreInfoAvailable = true,
                entityTypeIcon = parsedData.getNamedEntityTypeIcon(entityType);
            
            moreInfoAvailable = namedEntity !== undefined && namedEntity.notes !== undefined && namedEntity.notes.length > 0;
            switch (entityType) {
                case 'place':
                case 'placeName':
                case 'person':
                case 'pers':
                case 'persName':
                    break;
                case 'org':
                case 'orgName':
                    moreInfoAvailable = moreInfoAvailable || (namedEntity !== undefined && namedEntity.desc !== undefined);
                    break;
                default:
                    moreInfoAvailable = moreInfoAvailable || (namedEntity !== undefined && namedEntity.details !== undefined);
                    break;
            }

            // Handle entity occurrences
            var occurrences;
            if (namedEntity && namedEntity.occurrences) {
                occurrences = namedEntity.occurrences;
            } else {
                // Ask interface to calculate occurrences for entity
                //occurrences = [{ pageId: "fol_214v", pageLabel: "214v", docId: "CI_118", docLabel: "CI (118)" }];
            }
            var tabs = {
                _indexes : []
            };
            tabs._indexes.push('moreInfo');
            tabs.moreInfo = { label: 'More Info' };
            
            if (entityType !== 'relation') {
                tabs._indexes.push('occurrences');
                tabs.occurrences = { label: 'Occurrences' };
            }
            
            tabs._indexes.push('xmlSource');
            tabs.xmlSource = { label: 'XML' };

            var firstSubContentOpened = tabs && tabs._indexes && tabs._indexes.length > 0 ? tabs._indexes[0] : '';
            scopeHelper = {
                // expansion
                uid           : currentId,
                entityId      : entityId,
                entityType    : entityType,
                entityTypeIcon : entityTypeIcon,
                location      : location,

                entity        : namedEntity ? namedEntity : {},
                occurrences   : occurrences,

                opened         : false,
                moreInfoOpened : moreInfoAvailable,
                occurrencesOpened : false,
                noMoreInfo    :  !moreInfoAvailable,
                _firstSubContentOpened : firstSubContentOpened,
                _subContentOpened : '',
                over              : false,
                tabs              : tabs,

                defaults      : angular.copy(defaults),

                // functions
                getElementContent : getElementContent,
                toggle            : toggle,
                toggleMoreInfo    : toggleMoreInfo,
                toggleOccurrences : toggleOccurrences,
                goToOccurrence    : goToOccurrence,
                toggleSubContent  : toggleSubContent,
                isCurrentPageDoc  : isCurrentPageDoc,

                // pin tool
                isPinAvailable : isPinAvailable,
                isPinned: isPinned,
                getPinnedState: getPinnedState,
                togglePin: togglePin

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

        namedEntity.getById = function(entityId) {
            var foundNamedEntity;
            angular.forEach(collection, function(currentNamedEntity) {
                if (currentNamedEntity.entityId === entityId) {
                    foundNamedEntity = currentNamedEntity;
                }
            });  
            return foundNamedEntity;
        };

        namedEntity.getList = function() {
            return list;
        };

        namedEntity.getPinned = function() {
            return evtPinnedElements.getPinnedByType('namedEntity');
        };

        namedEntity.destroy = function(tempId) {
            delete collection[tempId];
        };

        return namedEntity;
    };

});