angular.module('evtviewer.namedEntity')

.provider('evtNamedEntityRef', function() {

    var defaults = this.defaults;

    this.setDefaults = function(_defaults) {
        defaults = _defaults;
    };

    this.$get = function(parsedData, evtNamedEntitiesParser, baseData) {
        var namedEntityRef    = {},
            collection = {},
            list       = [],
            idx        = 0;
        
        var goToEntityInList = function() {
            var vm = this;
            console.log("# TODO # Go to entity "+vm.entityId+" at pos "+vm.entityListPos);
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
                
                active        : false,
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

            return collection[currentId];
        };


        //
        // Service function
        // 
        namedEntityRef.highlightByEntityId = function(entityId) {
            angular.forEach(collection, function(currentNamedEntityRef) {
                foundNamedEntityRef.highlight = (currentNamedEntityRef.entityId === entityId);
            });
        };

        namedEntityRef.setActiveByType = function(entityType) {
            angular.forEach(collection, function(currentNamedEntityRef) {
                foundNamedEntityRef.active = (currentNamedEntityRef.entityType === entityType);
            });
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