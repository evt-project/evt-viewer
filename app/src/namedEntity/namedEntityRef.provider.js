/**
 * @ngdoc service
 * @module evtviewer.namedEntity
 * @name evtviewer.namedEntity.evtNamedEntityRef
 * @description 
 * # evtNamedEntityRef
 * This provider expands the scope of the
 * {@link evtviewer.namedEntity.directive:evtNamedEntityRef evtNamedEntityRef} directive 
 * and stores its reference untill the directive remains instantiated.
 *
 * @requires $timeout
 * @requires evtviewer.dataHandler.parsedData
 * @requires evtviewer.dataHandler.evtNamedEntitiesParser
 * @requires evtviewer.dataHandler.baseData
 * @requires evtviewer.core.Utils
**/
angular.module('evtviewer.namedEntity')

.provider('evtNamedEntityRef', function() {

    var defaults = this.defaults;

    this.setDefaults = function(_defaults) {
        defaults = _defaults;
    };
    /**
     * @ngdoc object
     * @module evtviewer.namedEntity
     * @name evtviewer.namedEntity.controller:NamedEntityRefCtrl
     * @description 
     * # NamedEntityRefCtrl
     * <p>This is controller for the {@link evtviewer.namedEntity.directive:evtNamedEntityRef evtNamedEntityRef} directive. </p>
     * <p>It is not actually implemented separately but its methods are defined in the 
     * {@link evtviewer.namedEntity.evtNamedEntityRef evtNamedEntityRef} provider 
     * where the scope of the directive is extended with all the necessary properties and methods
     * according to specific values of initial scope properties.</p>
     **/
    this.$get = function($timeout, parsedData, evtNamedEntitiesParser, baseData, Utils) {
        var namedEntityRef    = {},
            collection = {},
            collectionByEntity = {},
            list       = [],
            idx        = 0,
            activeEntityRef,
            activeEntityTypes = [],
            currentHighlighted;
        /**
         * @ngdoc method
         * @name evtviewer.namedEntity.controller:NamedEntityRefCtrl#goToEntityInList
         * @methodOf evtviewer.namedEntity.controller:NamedEntityRefCtrl
         *
         * @description
         * <p>Open the details of connected named entity..</p>
         * <p>This method is defined and attached to controller scope in the 
         * {@link evtviewer.namedEntity.evtNamedEntityRef evtNamedEntityRef} provider file.</p>
         * @param {$event} $event Click event (needed to stop propagation and handle nested named entity references).
         */
        var goToEntityInList = function($event) {
            $event.stopPropagation();
            var target = $event.target;
            if (target && !Utils.DOMutils.isNestedInElem(target, 'evt-named-entity') || Utils.DOMutils.isNestedInElem(target, 'evt-list')) {
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
        /**
         * @ngdoc method
         * @name evtviewer.namedEntity.evtNamedEntityRef#build
         * @methodOf evtviewer.namedEntity.evtNamedEntityRef
         *
         * @description
         * <p>This method will extend the scope of {@link evtviewer.namedEntity.directive:evtNamedEntityRef evtNamedEntityRef} directive 
         * according to selected configurations and parsed data.</p>
         * 
         * @param {string} id Named Entity unique identifier
         * @param {Object} scope initial scope of the directive:
            <pre>
                var scope: {
                    entityId   : '@',
                    entityType : '@'
                };
            </pre>
         *
         * @returns {Object} extended scope:
            <pre>
                var scopeHelper = {
                    // expansion
                    uid,
                    entityId,
                    entityType,
                    detailsInPopup,
                    realNamedEntity,

                    initHighlight,

                    defaults,

                    // functions
                    goToEntityInList
                };
            </pre>
         */
        namedEntityRef.build = function(id, scope) {
            var currentId  = idx++,
                entityId   = id || undefined,
                entityType = scope.entityType ? scope.entityType : parsedData.getNamedEntityType(entityId),
                realNamedEntity = id !== undefined, 
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

                initHighlight : (realNamedEntity && namedEntityRef.getCurrentHighlighted() === entityId),

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
        /**
         * @ngdoc method
         * @name evtviewer.namedEntity.evtNamedEntityRef#getActiveEntityTypes
         * @methodOf evtviewer.namedEntity.evtNamedEntityRef
         *
         * @description
         * Get the list of all highlighted types of named entity references.
         *
         * @returns {array} array of ids of all highlighted types of named entity references.
         */
        namedEntityRef.getActiveEntityTypes = function() {
            return activeEntityTypes;
        };
        /**
         * @ngdoc method
         * @name evtviewer.namedEntity.evtNamedEntityRef#addActiveType
         * @methodOf evtviewer.namedEntity.evtNamedEntityRef
         *
         * @description
         * Add a type to the list of highlighted types of named entity references.
         *
         * @param {string} entityType Named entity type to add to list of highlighted ones.
         */
        namedEntityRef.addActiveType = function(entityType) {
            if (activeEntityTypes.indexOf(entityType) < 0) {
                activeEntityTypes.push(entityType);
            }
        };
        /**
         * @ngdoc method
         * @name evtviewer.namedEntity.evtNamedEntityRef#removeActiveType
         * @methodOf evtviewer.namedEntity.evtNamedEntityRef
         *
         * @description
         * Remove a type from the list of highlighted types of named entity references.
         *
         * @param {string} entityType Named entity type to remove from list of highlighted ones.
         */
        namedEntityRef.removeActiveType = function(entityType) {
            var indexType = activeEntityTypes.indexOf(entityType);
            activeEntityTypes.splice(indexType, 1);
        };
        /**
         * @ngdoc method
         * @name evtviewer.namedEntity.evtNamedEntityRef#getActiveEntity
         * @methodOf evtviewer.namedEntity.evtNamedEntityRef
         *
         * @description
         * Get the list of all active named entity references.
         *
         * @returns {array} array of ids of all active named entity references.
         */
        namedEntityRef.getActiveEntity = function() {
            return activeEntityRef;
        };
        /**
         * @ngdoc method
         * @name evtviewer.namedEntity.evtNamedEntityRef#setActiveEntity
         * @methodOf evtviewer.namedEntity.evtNamedEntityRef
         *
         * @description
         * Add a named entity reference id to the list of all active ones.
         *
         * @param {string} entityRefId Identifier of named entity reference to be added to list of active ones.
         */
        namedEntityRef.setActiveEntity = function(entityRefId) {
            namedEntityRef.deactivateEntity(activeEntityRef);
            activeEntityRef = entityRefId;
        };
        /**
         * @ngdoc method
         * @name evtviewer.namedEntity.evtNamedEntityRef#deactivateEntity
         * @methodOf evtviewer.namedEntity.evtNamedEntityRef
         *
         * @description
         * Remove a named entity reference id from the list of all active ones.
         *
         * @param {string} entityRefId Identifier of named entity reference to be removed from list of active ones.
         */
        namedEntityRef.deactivateEntity = function(entityRefId) {
            if (entityRefId !== undefined && collection[entityRefId] !== undefined) {
                collection[entityRefId].active = false;
                collection[entityRefId].toggleActive();
            }
        };
        /**
         * @ngdoc method
         * @name evtviewer.namedEntity.evtNamedEntityRef#highlightByEntityId
         * @methodOf evtviewer.namedEntity.evtNamedEntityRef
         *
         * @description
         * Highlight all the references of a given named entity.
         *
         * @param {string} entityId Identifier of named entity to handle.
         */
        namedEntityRef.highlightByEntityId = function(entityId) {
            namedEntityRef.setCurrentHighlighted(entityId);
            angular.forEach(collection, function(currentNamedEntity) {
                if (currentNamedEntity.toggleHighlight) {
                    if (currentNamedEntity.realNamedEntity && currentNamedEntity.entityId === entityId) {
                        currentNamedEntity.toggleHighlight(true);
                    } else {
                        currentNamedEntity.toggleHighlight(false);
                    }
                }
            });  
        };
        /**
         * @ngdoc method
         * @name evtviewer.namedEntity.evtNamedEntityRef#getCurrentHighlighted
         * @methodOf evtviewer.namedEntity.evtNamedEntityRef
         *
         * @description
         * Get the list of all highlighted named entity references.
         *
         * @returns {array} array of ids of all highlighted named entity references.
         */
        namedEntityRef.getCurrentHighlighted = function() {
            return currentHighlighted;
        };
        /**
         * @ngdoc method
         * @name evtviewer.namedEntity.evtNamedEntityRef#setCurrentHighlighted
         * @methodOf evtviewer.namedEntity.evtNamedEntityRef
         *
         * @description
         * Add a named entity id to the list of all highlighted named entity references.
         *
         * @param {string} entityId Identifier of named entity to be added to the list of all highlighted named entity references
         */
        namedEntityRef.setCurrentHighlighted = function(entityId) {
            currentHighlighted = entityId;
        };
        /**
         * @ngdoc method
         * @name evtviewer.namedEntity.evtNamedEntityRef#getById
         * @methodOf evtviewer.namedEntity.evtNamedEntityRef
         *
         * @description
         * Get the reference of the instance of a particular <code>&lt;evt-named-entity-ref&gt;</code>.
         * 
         * @param {string} entityId Id of <code>&lt;evt-named-entity-ref&gt;</code> to retrieve
         *
         * @returns {Object} Reference of the instance of <code>&lt;evt-named-entity-ref&gt;</code> with given id
         */
        namedEntityRef.getById = function(entityId) {
            var foundNamedEntityRef;
            angular.forEach(collection, function(currentNamedEntityRef) {
                if (currentNamedEntityRef.entityId === entityId) {
                    foundNamedEntityRef = currentNamedEntityRef;
                }
            });  
            return foundNamedEntityRef;
        };
        /**
         * @ngdoc method
         * @name evtviewer.namedEntity.evtNamedEntityRef#getList
         * @methodOf evtviewer.namedEntity.evtNamedEntityRef
         *
         * @description
         * Get the list of all the instance of <code>&lt;evt-named-entity-ref&gt;</code>.
         *
         * @returns {array} array of ids of all the instance of <code>&lt;evt-named-entity-ref&gt;</code>.
         */
        namedEntityRef.getList = function() {
            return list;
        };
        /**
         * @ngdoc method
         * @name evtviewer.namedEntity.evtNamedEntityRef#destroy
         * @methodOf evtviewer.namedEntity.evtNamedEntityRef
         *
         * @description
         * Delete the reference of the instance of a particular <code>&lt;evt-named-entity-ref&gt;</code>
         * 
         * @param {string} tempId id of <code>&lt;evt-named-entity-ref&gt;</code> to destroy
         */
        namedEntityRef.destroy = function(tempId) {
            delete collection[tempId];
        };

        return namedEntityRef;
    };

});