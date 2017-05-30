angular.module('evtviewer.namedEntity')

.provider('evtNamedEntityRef', function() {

    var defaults = this.defaults;

    this.setDefaults = function(_defaults) {
        defaults = _defaults;
    };

    this.$get = function($timeout, parsedData, evtNamedEntitiesParser, baseData) {
        var namedEntityRef    = {},
            collection = {},
            collectionByEntity = {},
            list       = [],
            idx        = 0,
            activeEntityRef,
            activeEntityTypes = [];
        
        var goToEntityInList = function(e) {
            var vm = this;
            vm.active = !vm.active;
            if (vm.active) {
                namedEntityRef.setActiveEntity(vm.uid);
            } else {
                namedEntityRef.setActiveEntity(undefined);
            }
            $timeout(function(){
                vm.toggleActive();
                vm.updateDetailsPosition(e, vm);
            }, 20);
        };

        // 
        // NamedEntityRef builder
        // 
        
        namedEntityRef.build = function(id, scope) {
            var currentId  = idx++,
                entityId   = id || undefined,
                entityType = scope.entityType || 'generic';

            var scopeHelper = {};
            
            if (typeof(collection[currentId]) !== 'undefined') {
                return;
            }
            
            switch (entityType) {
                case 'persName':
                    entityType = 'person';
                    break;
                case 'placeName': 
                case 'orgName':
                    entityType = entityType.replace('Name', '');
                    break;
                default:
                    entityType = entityType;
            }

            scopeHelper = {
                // expansion
                uid           : currentId,
                entityId      : entityId,
                entityType    : entityType,
                
                highlight     : false,

                defaults      : angular.copy(defaults),

                // functions
                goToEntityInList : goToEntityInList
            };

            collection[currentId] = angular.extend(scope.vm, scopeHelper);
            list.push({
                id: currentId,
                entityId: entityId
            });

            if (!collectionByEntity[entityId]) {
                collectionByEntity[entityId] = [];
            } 
            collectionByEntity[entityId].push(currentId);
            
            return collection[currentId];
        };


        //
        // Service function
        // 
        namedEntityRef.getActiveEntityTypes = function() {
            return activeEntityTypes;
        };

        namedEntityRef.addActiveType = function(entityType) {
            if (activeEntityTypes.indexOf(entityType) < 0) {
                activeEntityTypes.push(entityType);
            }
        };

        namedEntityRef.removeActiveType = function(entityType) {
            var indexType = activeEntityTypes.indexOf(entityType);
            activeEntityTypes.splice(indexType, 1);
        };

        namedEntityRef.highlightByEntityId = function(entityId) {
            //TODO
            console.log('# TODO # ', collectionByEntity[entityId]);
        };

        namedEntityRef.getActiveEntity = function() {
            return activeEntityRef;
        };

        namedEntityRef.setActiveEntity = function(entityRefId) {
            namedEntityRef.deactivateEntity(activeEntityRef);
            activeEntityRef = entityRefId;
        };

        namedEntityRef.deactivateEntity = function(entityRefId) {
            if (entityRefId !== undefined && collection[entityRefId] !== undefined) {
                collection[entityRefId].active = false;
                collection[entityRefId].toggleActive();
            }
        };

        namedEntityRef.getById = function(appId) {
            var foundNamedEntityRef;
            angular.forEach(collection, function(currentNamedEntityRef) {
                if (currentNamedEntityRef.appId === appId) {
                    foundNamedEntityRef = currentNamedEntityRef;
                }
            });  
            return foundNamedEntityRef;
        };

        namedEntityRef.getList = function() {
            return list;
        };

        namedEntityRef.destroy = function(tempId) {
            delete collection[tempId];
        };

        return namedEntityRef;
    };

});