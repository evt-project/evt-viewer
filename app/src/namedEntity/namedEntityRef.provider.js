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
            activeEntityTypes = [],
            currentHighlighted;
        
        var goToEntityInList = function($event) {
            $event.stopPropagation();
            var target = $event.target;
            if (target && target.className.indexOf('namedEntityRef') >= 0) {
                var vm = this;
                if (vm.realNamedEntity) {
                    if (namedEntityRef.getCurrentHighlighted() !== vm.entityId) {
                        namedEntityRef.highlightByEntityId(undefined);
                    }
                    vm.active = !vm.active;
                    if (vm.active) {
                        namedEntityRef.setActiveEntity(vm.uid);
                    } else {
                        namedEntityRef.setActiveEntity(undefined);
                    }
                    vm.toggleActive();
                    if (vm.detailsInPopup) {
                        $timeout(function(){
                            vm.updateDetailsPosition($event, vm);
                        }, 20);
                    }
                }
            }
        };

        // 
        // NamedEntityRef builder
        // 
        
        namedEntityRef.build = function(id, scope) {
            var currentId  = idx++,
                entityId   = id || undefined,
                entityType = scope.entityType ? scope.entityType : parsedData.getNamedEntityType(entityId),
                realNamedEntity = entityId !== undefined, 
                detailsInPopup = false; //TODO: differentiate depending on type

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
                detailsInPopup : detailsInPopup,
                realNamedEntity : realNamedEntity,

                initHighlight : (namedEntityRef.getCurrentHighlighted() === entityId),

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

        namedEntityRef.highlightByEntityId = function(entityId) {
            namedEntityRef.setCurrentHighlighted(entityId);
            angular.forEach(collection, function(currentNamedEntity) {
                if (currentNamedEntity.toggleHighlight) {
                    if (currentNamedEntity.entityId === entityId) {
                        currentNamedEntity.toggleHighlight(true);
                    } else {
                        currentNamedEntity.toggleHighlight(false);
                    }
                }
            });  
        };

        namedEntityRef.getCurrentHighlighted = function() {
            return currentHighlighted;
        };

        namedEntityRef.setCurrentHighlighted = function(entityId) {
            currentHighlighted = entityId;
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