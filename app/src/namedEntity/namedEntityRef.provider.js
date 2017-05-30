angular.module('evtviewer.namedEntity')

.provider('evtNamedEntityRef', function() {

    var defaults = this.defaults;

    this.setDefaults = function(_defaults) {
        defaults = _defaults;
    };

    this.$get = function(parsedData, evtNamedEntitiesParser, baseData) {
        var namedEntityRef    = {},
            collection = {},
            collectionByEntity = {},
            list       = [],
            idx        = 0,
            activeEntityTypes = [];
        
        var goToEntityInList = function() {
            var vm = this;
            console.log('# TODO # Go to entity '+vm.entityId+' at pos '+vm.entityListPos);
        };

        // 
        // NamedEntityRef builder
        // 
        
        namedEntityRef.build = function(id, scope) {
            var currentId  = idx++,
                entityId   = id || undefined,
                entityType = scope.entityType || 'generic',
                entityListPos = scope.entityListPos || '',
                attributes = '';

            var scopeHelper = {};
            
            if (typeof(collection[currentId]) !== 'undefined') {
                return;
            }
            //TODO: retrieve list id from parsed data

            scopeHelper = {
                // expansion
                uid           : currentId,
                entityId      : entityId,
                entityType    : entityType,
                entityListPos : entityListPos,
                
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