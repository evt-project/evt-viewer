/**
 * @ngdoc service
 * @module evtviewer.popover
 * @name evtviewer.popover.evtpopoverRef
 * @description 
 * # evtpopoverRef
 * This provider expands the scope of the
 * {@link evtviewer.popover.directive:evtpopoverRef evtpopoverRef} directive 
 * and stores its reference untill the directive remains instantiated.
 *
 * @requires $timeout
 * @requires evtviewer.dataHandler.parsedData
 * @requires evtviewer.dataHandler.evtNamedEntitiesParser
 * @requires evtviewer.dataHandler.baseData
 * @requires evtviewer.core.Utils
**/
angular.module('evtviewer.popover')

.provider('evtpopoverRef', function() {

    var defaults = this.defaults;

    this.setDefaults = function(_defaults) {
        defaults = _defaults;
    };
    /**
     * @ngdoc object
     * @module evtviewer.popover
     * @name evtviewer.popover.controller:popoverRefCtrl
     * @description 
     * # popoverRefCtrl
     * <p>This is controller for the {@link evtviewer.popover.directive:evtpopoverRef evtpopoverRef} directive. </p>
     * <p>It is not actually implemented separately but its methods are defined in the 
     * {@link evtviewer.popover.evtpopoverRef evtpopoverRef} provider 
     * where the scope of the directive is extended with all the necessary properties and methods
     * according to specific values of initial scope properties.</p>
     **/
    this.$get = function($timeout, parsedData, evtNamedEntitiesParser, baseData, Utils) {
        var popoverRef    = {},
            collection = {},
            collectionByEntity = {},
            list       = [],
            idx        = 0,
            activeEntityRef,
            activeEntityTypes = [],
            currentHighlighted;
        /**
         * @ngdoc method
         * @name evtviewer.popover.controller:popoverRefCtrl#goToEntityInList
         * @methodOf evtviewer.popover.controller:popoverRefCtrl
         *
         * @description
         * <p>Open the details of connected named entity..</p>
         * <p>This method is defined and attached to controller scope in the 
         * {@link evtviewer.popover.evtpopoverRef evtpopoverRef} provider file.</p>
         * @param {$event} $event Click event (needed to stop propagation and handle nested named entity references).
         */
        var goToEntityInList = function($event) {
            $event.stopPropagation();
            var target = $event.target;
            if (target && !Utils.DOMutils.isNestedInElem(target, 'evt-named-entity') || Utils.DOMutils.isNestedInElem(target, 'evt-list')) {
                var vm = this;
                if (vm.realpopover) {
                    if (popoverRef.getCurrentHighlighted() !== vm.entityId) {
                        popoverRef.highlightByEntityId(undefined);
                    }
                    vm.active = !vm.active;
                    if (vm.active) {
                        popoverRef.setActiveEntity(vm.uid);
                    } else {
                        popoverRef.setActiveEntity(undefined);
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
        // popoverRef builder
        // 
        /**
         * @ngdoc method
         * @name evtviewer.popover.evtpopoverRef#build
         * @methodOf evtviewer.popover.evtpopoverRef
         *
         * @description
         * <p>This method will extend the scope of {@link evtviewer.popover.directive:evtpopoverRef evtpopoverRef} directive 
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
                    realpopover,

                    initHighlight,

                    defaults,

                    // functions
                    goToEntityInList
                };
            </pre>
         */
        popoverRef.build = function(id, scope) {
            var currentId  = idx++,
                entityId   = id || undefined,
                entityType = scope.entityType ? scope.entityType : parsedData.getpopoverType(entityId),
                realpopover = id !== undefined, 
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
                realpopover : realpopover,

                initHighlight : (realpopover && popoverRef.getCurrentHighlighted() === entityId),

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
         * @name evtviewer.popover.evtpopoverRef#getActiveEntityTypes
         * @methodOf evtviewer.popover.evtpopoverRef
         *
         * @description
         * Get the list of all highlighted types of named entity references.
         *
         * @returns {array} array of ids of all highlighted types of named entity references.
         */
        popoverRef.getActiveEntityTypes = function() {
            return activeEntityTypes;
        };
        /**
         * @ngdoc method
         * @name evtviewer.popover.evtpopoverRef#addActiveType
         * @methodOf evtviewer.popover.evtpopoverRef
         *
         * @description
         * Add a type to the list of highlighted types of named entity references.
         *
         * @param {string} entityType Named entity type to add to list of highlighted ones.
         */
        popoverRef.addActiveType = function(entityType) {
            if (activeEntityTypes.indexOf(entityType) < 0) {
                activeEntityTypes.push(entityType);
            }
        };
        /**
         * @ngdoc method
         * @name evtviewer.popover.evtpopoverRef#removeActiveType
         * @methodOf evtviewer.popover.evtpopoverRef
         *
         * @description
         * Remove a type from the list of highlighted types of named entity references.
         *
         * @param {string} entityType Named entity type to remove from list of highlighted ones.
         */
        popoverRef.removeActiveType = function(entityType) {
            var indexType = activeEntityTypes.indexOf(entityType);
            activeEntityTypes.splice(indexType, 1);
        };
        /**
         * @ngdoc method
         * @name evtviewer.popover.evtpopoverRef#getActiveEntity
         * @methodOf evtviewer.popover.evtpopoverRef
         *
         * @description
         * Get the list of all active named entity references.
         *
         * @returns {array} array of ids of all active named entity references.
         */
        popoverRef.getActiveEntity = function() {
            return activeEntityRef;
        };
        /**
         * @ngdoc method
         * @name evtviewer.popover.evtpopoverRef#setActiveEntity
         * @methodOf evtviewer.popover.evtpopoverRef
         *
         * @description
         * Add a named entity reference id to the list of all active ones.
         *
         * @param {string} entityRefId Identifier of named entity reference to be added to list of active ones.
         */
        popoverRef.setActiveEntity = function(entityRefId) {
            popoverRef.deactivateEntity(activeEntityRef);
            activeEntityRef = entityRefId;
        };
        /**
         * @ngdoc method
         * @name evtviewer.popover.evtpopoverRef#deactivateEntity
         * @methodOf evtviewer.popover.evtpopoverRef
         *
         * @description
         * Remove a named entity reference id from the list of all active ones.
         *
         * @param {string} entityRefId Identifier of named entity reference to be removed from list of active ones.
         */
        popoverRef.deactivateEntity = function(entityRefId) {
            if (entityRefId !== undefined && collection[entityRefId] !== undefined) {
                collection[entityRefId].active = false;
                collection[entityRefId].toggleActive();
            }
        };
        /**
         * @ngdoc method
         * @name evtviewer.popover.evtpopoverRef#highlightByEntityId
         * @methodOf evtviewer.popover.evtpopoverRef
         *
         * @description
         * Highlight all the references of a given named entity.
         *
         * @param {string} entityId Identifier of named entity to handle.
         */
        popoverRef.highlightByEntityId = function(entityId) {
            popoverRef.setCurrentHighlighted(entityId);
            angular.forEach(collection, function(currentpopover) {
                if (currentpopover.toggleHighlight) {
                    if (currentpopover.realpopover && currentpopover.entityId === entityId) {
                        currentpopover.toggleHighlight(true);
                    } else {
                        currentpopover.toggleHighlight(false);
                    }
                }
            });  
        };
        /**
         * @ngdoc method
         * @name evtviewer.popover.evtpopoverRef#getCurrentHighlighted
         * @methodOf evtviewer.popover.evtpopoverRef
         *
         * @description
         * Get the list of all highlighted named entity references.
         *
         * @returns {array} array of ids of all highlighted named entity references.
         */
        popoverRef.getCurrentHighlighted = function() {
            return currentHighlighted;
        };
        /**
         * @ngdoc method
         * @name evtviewer.popover.evtpopoverRef#setCurrentHighlighted
         * @methodOf evtviewer.popover.evtpopoverRef
         *
         * @description
         * Add a named entity id to the list of all highlighted named entity references.
         *
         * @param {string} entityId Identifier of named entity to be added to the list of all highlighted named entity references
         */
        popoverRef.setCurrentHighlighted = function(entityId) {
            currentHighlighted = entityId;
        };
        /**
         * @ngdoc method
         * @name evtviewer.popover.evtpopoverRef#getById
         * @methodOf evtviewer.popover.evtpopoverRef
         *
         * @description
         * Get the reference of the instance of a particular <code>&lt;evt-named-entity-ref&gt;</code>.
         * 
         * @param {string} entityId Id of <code>&lt;evt-named-entity-ref&gt;</code> to retrieve
         *
         * @returns {Object} Reference of the instance of <code>&lt;evt-named-entity-ref&gt;</code> with given id
         */
        popoverRef.getById = function(entityId) {
            var foundpopoverRef;
            angular.forEach(collection, function(currentpopoverRef) {
                if (currentpopoverRef.entityId === entityId) {
                    foundpopoverRef = currentpopoverRef;
                }
            });  
            return foundpopoverRef;
        };
        /**
         * @ngdoc method
         * @name evtviewer.popover.evtpopoverRef#getList
         * @methodOf evtviewer.popover.evtpopoverRef
         *
         * @description
         * Get the list of all the instance of <code>&lt;evt-named-entity-ref&gt;</code>.
         *
         * @returns {array} array of ids of all the instance of <code>&lt;evt-named-entity-ref&gt;</code>.
         */
        popoverRef.getList = function() {
            return list;
        };
        /**
         * @ngdoc method
         * @name evtviewer.popover.evtpopoverRef#destroy
         * @methodOf evtviewer.popover.evtpopoverRef
         *
         * @description
         * Delete the reference of the instance of a particular <code>&lt;evt-named-entity-ref&gt;</code>
         * 
         * @param {string} tempId id of <code>&lt;evt-named-entity-ref&gt;</code> to destroy
         */
        popoverRef.destroy = function(tempId) {
            delete collection[tempId];
        };

        return popoverRef;
    };

});