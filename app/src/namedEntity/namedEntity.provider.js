/**
 * @ngdoc service
 * @module evtviewer.namedEntity
 * @name evtviewer.namedEntity.evtNamedEntity
 * @description
 * # evtNamedEntity
 * This provider expands the scope of the
 * {@link evtviewer.namedEntity.directive:evtNamedEntity evtNamedEntity} directive
 * and stores its reference untill the directive remains instantiated.
 *
 * @requires $timeout
 * @requires evtviewer.core.config
 * @requires evtviewer.dataHandler.parsedData
 * @requires evtviewer.dataHandler.evtNamedEntitiesParser
 * @requires evtviewer.dataHandler.baseData
 * @requires evtviewer.interface.evtInterface
 * @requires evtviewer.namedEntity.evtNamedEntityRef
 * @requires evtviewer.UItools.evtPinnedElements
**/
angular.module('evtviewer.namedEntity')

.provider('evtNamedEntity', function() {

    var defaults = this.defaults;

    this.setDefaults = function(_defaults) {
        defaults = _defaults;
    };

    /**
     * @ngdoc object
     * @module evtviewer.namedEntity
     * @name evtviewer.namedEntity.controller:NamedEntityCtrl
     * @description
     * # NamedEntityCtrl
     * <p>This is controller for the {@link evtviewer.namedEntity.directive:evtNamedEntity evtNamedEntity} directive. </p>
     * <p>It is not actually implemented separately but its methods are defined in the
     * {@link evtviewer.namedEntity.evtNamedEntity evtNamedEntity} provider
     * where the scope of the directive is extended with all the necessary properties and methods
     * according to specific values of initial scope properties.</p>
     **/
    this.$get = function($timeout, config, parsedData, evtNamedEntitiesParser, baseData, evtInterface, evtNamedEntityRef, evtPinnedElements) {
        var namedEntity    = {},
            collection = {},
            list       = [],
            idx        = 0;
        /**
         * @ngdoc method
         * @name evtviewer.namedEntity.controller:NamedEntityCtrl#getElementContent
         * @methodOf evtviewer.namedEntity.controller:NamedEntityCtrl
         *
         * @description
         * <p>Get the main output of scope named entity.</p>
         * <p>This method is defined and attached to controller scope in the
         * {@link evtviewer.namedEntity.evtNamedEntity evtNamedEntity} provider file.</p>
         */
        var getElementContent = function() {
            var vm = this;
            var namedEntity = parsedData.getNamedEntity(vm.entityId);
            return namedEntity.output;
        };
        /**
         * @ngdoc method
         * @name evtviewer.namedEntity.controller:NamedEntityCtrl#toggle
         * @methodOf evtviewer.namedEntity.controller:NamedEntityCtrl
         *
         * @description
         * <p>Open/close the details panel of named entity element.</p>
         * <p>This method is defined and attached to controller scope in the
         * {@link evtviewer.namedEntity.evtNamedEntity evtNamedEntity} provider file.</p>
         */
        var toggle = function() {
            var vm = this;
            if (vm.location !== 'mainText') {
                vm.toggleSubContent(vm._firstSubContentOpened);

                vm.opened = !vm.opened;
                vm.toggleState();
            }
        };
        /**
         * @ngdoc method
         * @name evtviewer.namedEntity.controller:NamedEntityCtrl#toggleOccurrences
         * @methodOf evtviewer.namedEntity.controller:NamedEntityCtrl
         *
         * @description
         * <p>Open/close the "Occurrences" tab of named entity details panel.</p>
         * <p>This method is defined and attached to controller scope in the
         * {@link evtviewer.namedEntity.evtNamedEntity evtNamedEntity} provider file.</p>
         */
        var toggleOccurrences = function() {
            var vm = this;
            if (!vm.occurrences) {
                vm.occurrences = namedEntity.getOccurrences(vm.entityId);
            }
            vm.occurrencesOpened = !vm.occurrencesOpened;
            vm.toggleSection('occurrencesOpened');
        };
        /**
         * @ngdoc method
         * @name evtviewer.namedEntity.controller:NamedEntityCtrl#toggleMoreInfo
         * @methodOf evtviewer.namedEntity.controller:NamedEntityCtrl
         *
         * @description
         * <p>Open/close the "More Info" tab of named entity details panel.</p>
         * <p>This method is defined and attached to controller scope in the
         * {@link evtviewer.namedEntity.evtNamedEntity evtNamedEntity} provider file.</p>
         */
        var toggleMoreInfo = function() {
            var vm = this;
            vm.moreInfoOpened = !vm.moreInfoOpened;
            vm.toggleSection('moreInfoOpened');
        };
        /**
         * @ngdoc method
         * @name evtviewer.namedEntity.controller:NamedEntityCtrl#goToOccurrence
         * @methodOf evtviewer.namedEntity.controller:NamedEntityCtrl
         *
         * @description
         * <p>Navigate to given document and page of given occurrence.</p>
         * <p>Highlight the occurrence in arrival page.</p>
         * <p>This method is defined and attached to controller scope in the
         * {@link evtviewer.namedEntity.evtNamedEntity evtNamedEntity} provider file.</p>
         * @param {Object} occurrence Object representing the occurence we want to navigate to.
         * It contains all the information about document and page to which navigate.
         */
        var goToOccurrence = function(occurrence) {
            var vm = this;
            evtInterface.updateState('currentPage', occurrence.pageId);
            evtInterface.updateState('currentDoc', occurrence.docId);
            evtInterface.updateUrl();
            if (evtInterface.getState('secondaryContent') === 'entitiesList') {
                evtInterface.updateState('secondaryContent', '');
            }
            $timeout(function() {
                evtNamedEntityRef.highlightByEntityId(vm.entityId);
            }, 500);
        };
        /**
         * @ngdoc method
         * @name evtviewer.namedEntity.controller:NamedEntityCtrl#toggleSubContent
         * @methodOf evtviewer.namedEntity.controller:NamedEntityCtrl
         *
         * @description
         * <p>Open/close a given tab of named entity details panel.</p>
         * <p>This method is defined and attached to controller scope in the
         * {@link evtviewer.namedEntity.evtNamedEntity evtNamedEntity} provider file.</p>
         * @param {string} subContentName Name of tab to toggle
         */
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
        /**
         * @ngdoc method
         * @name evtviewer.namedEntity.controller:NamedEntityCtrl#isPinAvailable
         * @methodOf evtviewer.namedEntity.controller:NamedEntityCtrl
         *
         * @description
         * <p>Check whether the "Pin" tool is available or not.</p>
         * <p>This method is defined and attached to controller scope in the
         * {@link evtviewer.namedEntity.evtNamedEntity evtNamedEntity} provider file.</p>
         * @returns {boolean} whether the "Pin" tool is available or not
         */
        var isPinAvailable = function(){
            return config.toolPinAppEntries;
        };
        /**
         * @ngdoc method
         * @name evtviewer.namedEntity.controller:NamedEntityCtrl#isPinned
         * @methodOf evtviewer.namedEntity.controller:NamedEntityCtrl
         *
         * @description
         * <p>Check whether the named entity is "Pinned" or not.</p>
         * <p>This method is defined and attached to controller scope in the
         * {@link evtviewer.namedEntity.evtNamedEntity evtNamedEntity} provider file.</p>
         * @returns {boolean} whether the named entity is "Pinned" or not
         */
        var isPinned = function(){
            var vm = this;
            return evtPinnedElements.isPinned(vm.entityId);
        };
        /**
         * @ngdoc method
         * @name evtviewer.namedEntity.controller:NamedEntityCtrl#getPinnedState
         * @methodOf evtviewer.namedEntity.controller:NamedEntityCtrl
         *
         * @description
         * <p>Get "pinned" icon state.</p>
         * <p>This method is defined and attached to controller scope in the
         * {@link evtviewer.namedEntity.evtNamedEntity evtNamedEntity} provider file.</p>
         * @returns {string} name of class to give to "Pin" button:
         * "pin-on" if the named entity is "Pinned", "pin-off" othewise
         */
        var getPinnedState = function() {
            var vm = this;
            return vm.isPinned() ? 'pin-on' : 'pin-off';
        };
        /**
         * @ngdoc method
         * @name evtviewer.namedEntity.controller:NamedEntityCtrl#getPinnedState
         * @methodOf evtviewer.namedEntity.controller:NamedEntityCtrl
         *
         * @description
         * <p>Toggle "pinned" state.</p>
         * <p>This method is defined and attached to controller scope in the
         * {@link evtviewer.namedEntity.evtNamedEntity evtNamedEntity} provider file.</p>
         */
        var togglePin = function(){
            var vm = this;
            if (vm.isPinned()) {
                evtPinnedElements.removeElement({id: vm.entityId, type: 'namedEntity_'+vm.entityType });
            } else {
                evtPinnedElements.addElement({ id: vm.entityId, type: 'namedEntity_'+vm.entityType });
                var pinnedElements = evtPinnedElements.getPinned();
                if (pinnedElements && pinnedElements.length === 1) {
                  evtInterface.updateState('isPinnedAppBoardOpened', true);
                }
            }
        };
        /**
         * @ngdoc method
         * @name evtviewer.namedEntity.controller:NamedEntityCtrl#isCurrentPageDoc
         * @methodOf evtviewer.namedEntity.controller:NamedEntityCtrl
         *
         * @description
         * <p>Check whether a given occurrence is pointing to the current Doc/Page pair.</p>
         * <p>This method is defined and attached to controller scope in the
         * {@link evtviewer.namedEntity.evtNamedEntity evtNamedEntity} provider file.</p>
         * @param {Object} occurrence Object representing the occurence we want to navigate to.
         * It contains all the information about document and page to which navigate.
         */
        var isCurrentPageDoc = function(occurrence) {
            var currentDoc = evtInterface.getState('currentDoc'),
                currentPage = evtInterface.getState('currentPage');
            return (currentDoc === occurrence.docId && currentPage === occurrence.pageId);
        };
        //
        // NamedEntity builder
        //
        /**
         * @ngdoc method
         * @name evtviewer.namedEntity.evtNamedEntity#build
         * @methodOf evtviewer.namedEntity.evtNamedEntity
         *
         * @description
         * <p>This method will extend the scope of {@link evtviewer.namedEntity.directive:evtNamedEntity evtNamedEntity} directive
         * according to selected configurations and parsed data.</p>
         *
         * @param {string} id Named Entity unique identifier
         * @param {Object} scope initial scope of the directive:
            <pre>
                var scope: {
                    entityId   : '@',
                    entityType : '@',
                    location   : '@'
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
                    entityTypeIcon,
                    location,

                    entity,
                    occurrences,

                    opened,
                    moreInfoOpened,
                    occurrencesOpened,
                    noMoreInfo,
                    _firstSubContentOpened,
                    _subContentOpened,
                    over,
                    tabs,

                    defaults,

                    // functions
                    getElementContent,
                    toggle,
                    toggleMoreInfo,
                    toggleOccurrences,
                    goToOccurrence,
                    toggleSubContent,
                    isCurrentPageDoc,

                    // pin tool
                    isPinAvailable,
                    isPinned,
                    getPinnedState,
                    togglePin
                };
            </pre>
         */
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
            tabs.moreInfo = { label: 'NAMED_ENTITIES.MORE_INFO' };

            if (entityType !== 'relation') {
                tabs._indexes.push('occurrences');
                tabs.occurrences = { label: 'NAMED_ENTITIES.OCCURRENCES' };
            }

            tabs._indexes.push('xmlSource');
            tabs.xmlSource = { label: 'NAMED_ENTITIES.XML' };

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
        /**
         * @ngdoc method
         * @name evtviewer.namedEntity.evtNamedEntity#getOccurrences
         * @methodOf evtviewer.namedEntity.evtNamedEntity
         *
         * @description
         * <p>Get the list of occurrences of a given named entity.</p>
         * <p>Data are parsed from originale XML source document, by using
         * {@link evtviewer.dataHandler.evtNamedEntitiesParser#parseEntitiesOccurrences parseEntitiesOccurrences}
         * method</p>
         *
         * @param {string} refId Named entity unique identifier
         * @returns {array} List of occurrences of given named entity
         */
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
        /**
         * @ngdoc method
         * @name evtviewer.namedEntity.evtNamedEntity#getById
         * @methodOf evtviewer.namedEntity.evtNamedEntity
         *
         * @description
         * Get the reference of the instance of a particular <code>&lt;evt-named-entity&gt;</code>.
         *
         * @param {string} entityId Id of <code>&lt;evt-named-entity&gt;</code> to retrieve
         *
         * @returns {Object} Reference of the instance of <code>&lt;evt-named-entity&gt;</code> with given id
         */
        namedEntity.getById = function(entityId) {
            var foundNamedEntity;
            angular.forEach(collection, function(currentNamedEntity) {
                if (currentNamedEntity.entityId === entityId) {
                    foundNamedEntity = currentNamedEntity;
                }
            });
            return foundNamedEntity;
        };
        /**
         * @ngdoc method
         * @name evtviewer.namedEntity.evtNamedEntity#getList
         * @methodOf evtviewer.namedEntity.evtNamedEntity
         *
         * @description
         * Get the list of all the instance of <code>&lt;evt-named-entity&gt;</code>.
         *
         * @returns {array} array of ids of all the instance of <code>&lt;evt-named-entity&gt;</code>.
         */
        namedEntity.getList = function() {
            return list;
        };
        /**
         * @ngdoc method
         * @name evtviewer.namedEntity.evtNamedEntity#getPinned
         * @methodOf evtviewer.namedEntity.evtNamedEntity
         *
         * @description
         * Get the list of all the ids of named entity that are "pinned".
         * It uses the {@link evtviewer.UITools.evtPinnedElements#getPinnedByType getPinnedByType} method
         * defined in {@link evtviewer.UITools.evtPinnedElements evtPinnedElements} service.
         *
         * @returns {array} array of ids of named entity that are "pinned".
         */
        namedEntity.getPinned = function() {
            return evtPinnedElements.getPinnedByType('namedEntity');
        };
        /**
         * @ngdoc method
         * @name evtviewer.namedEntity.evtNamedEntity#destroy
         * @methodOf evtviewer.namedEntity.evtNamedEntity
         *
         * @description
         * Delete the reference of the instance of a particular <code>&lt;evt-named-entity&gt;</code>
         *
         * @param {string} tempId id of <code>&lt;evt-named-entity&gt;</code> to destroy
         */
        namedEntity.destroy = function(tempId) {
            delete collection[tempId];
        };

        return namedEntity;
    };

});
