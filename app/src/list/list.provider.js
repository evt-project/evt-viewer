/**
 * @ngdoc service
 * @module evtviewer.list
 * @name evtviewer.list.evtList
 * @description 
 * # evtList
 * This provider expands the scope of the
 * {@link evtviewer.list.directive:evtList evtList} directive 
 * and stores its reference untill the directive remains instantiated.
 *
 * @requires evtviewer.dataHandler.parsedData
**/
angular.module('evtviewer.list')

.provider('evtList', function() {

    var defaults = this.defaults;

    this.setDefaults = function(_defaults) {
        defaults = _defaults;
    };

    var currentList = '';
    /**
     * @ngdoc object
     * @module evtviewer.list
     * @name evtviewer.list.controller:ListCtrl
     * @description 
     * # ListCtrl
     * <p>This is controller for the {@link evtviewer.list.directive:evtList evtList} directive. </p>
     * <p>It is not actually implemented separately but its methods are defined in the 
     * {@link evtviewer.list.evtList evtList} provider 
     * where the scope of the directive is extended with all the necessary properties and methods
     * according to specific values of initial scope properties.</p>
     **/
    this.$get = function(parsedData, evtInterface) {
        var collection = {},
            list       = [];
        

        // 
        // List builder
        // 
        /**
         * @ngdoc method
         * @name evtviewer.list.controller:ListCtrl#destroy
         * @methodOf evtviewer.list.controller:ListCtrl
         *
         * @description
         * <p>Remove instance from saved instances in {@link evtviewer.list.evtList evtList} provider.</p>
         * <p>This method is defined and attached to controller scope in the 
         * {@link evtviewer.list.evtList evtList} provider file.</p>
         */
        var destroy = function() {
            var tempId = this.uid;
            // this.$destroy();
            delete collection[tempId];
            // _console.log('vm - destroy ' + tempId);
        };
        /**
         * @ngdoc method
         * @name evtviewer.list.controller:ListCtrl#loadMoreElements
         * @methodOf evtviewer.list.controller:ListCtrl
         *
         * @description
         * <p>Show (and initialize) 10 more elements on screen.</p>
         * <p>This method is defined and attached to controller scope in the 
         * {@link evtviewer.list.evtList evtList} provider file.</p>
         */
        var loadMoreElements = function() {
            var vm = this,
                last = vm.visibleElements.length,
                i = 0; 
            while (i < 10 && i < vm.elementsInListKey.length) {
                var newElement = vm.elementsInListKey[last+i];
                if (newElement && vm.visibleElements.indexOf(newElement) < 0) {
                    vm.visibleElements.push(newElement);                    
                }
                i++;
            }
        };
        // getVisibleElements. 
        // Support function. Retrieve visible element for a certain list at a certain letter
        var getVisibleElements = function(listId, letter) {
            var visibleElements = [];
            if (letter) {
                visibleElements = parsedData.getNamedEntitiesCollectionByNameAndPos(listId, letter);
                visibleElements = visibleElements ? visibleElements._indexes : [];
            }
            return visibleElements;
        };

        /**
         * @ngdoc method
         * @name evtviewer.list.controller:ListCtrl#selectLetter
         * @methodOf evtviewer.list.controller:ListCtrl
         *
         * @description
         * <p>Retrieve the list of elements, indexed at given letter.</p>
         * <p>This method is defined and attached to controller scope in the 
         * {@link evtviewer.list.evtList evtList} provider file.</p>
         * @param {string} letter indexing letter to select
         */
        var selectLetter = function(letter) {
            var vm = this;
            vm.selectedLetter = letter;
            vm.elementsInListKey = getVisibleElements(vm.uid, letter);
            vm.visibleElements = vm.elementsInListKey ? vm.elementsInListKey.slice(0, 40) : [];
        };

        /**
         * @ngdoc method
         * @name evtviewer.list.evtList#build
         * @methodOf evtviewer.list.evtList
         *
         * @description
         * <p>This method will extend the scope of {@link evtviewer.list.directive:evtList evtList} directive 
         * according to selected configurations and parsed data.</p>
         * 
         * @param {Object} scope initial scope of the directive:
            <pre>
                var scope: {
                    listId : '@',
                    listType: '@'
                };
            </pre>
         *
         * @returns {Object} extended scope:
            <pre>
                var scopeHelper = {
                    // expansion
                    uid,
                    listType,
                    listKeys,
                    elements, // All elements
                    elementsInListKey, // Elements in selected letter
                    visibleElements, // Elements shown
                    selectedLetter,

                    //functions
                    loadMoreElements,
                    selectLetter,
                    destroy
                };
            </pre>
         */
        list.build = function(id, scope) {
            var currentId = id, //ID is listName
                listType = scope.listType || 'generic';

            var scopeHelper = {};
            
            if (typeof(collection[currentId]) !== 'undefined') {
                return;
            }

            var currentEntity = evtInterface.getState('currentNamedEntity'),
                entity = currentEntity ? parsedData.getNamedEntity(currentEntity) : undefined,
                parsedElements = parsedData.getNamedEntitiesCollectionByName(currentId),
                selectedLetter;

            if (entity && listType === parsedData.getNamedEntityType(currentEntity)) {
                selectedLetter = entity._listPos || undefined;
            } else {
                selectedLetter = parsedElements ? parsedElements._listKeys[0] : undefined;
            }

            var elementsInListKey = getVisibleElements(currentId, selectedLetter),
                startPos = 0,
                entityPos = entity && listType === parsedData.getNamedEntityType(currentEntity) ? elementsInListKey.indexOf(currentEntity) : undefined,
                endPos = entityPos ? entityPos + 10 : startPos + 41,
                visibleElements = elementsInListKey ? elementsInListKey.slice(startPos, endPos) : [];

            scopeHelper = {
                // expansion
                uid      : currentId,
                listType : listType,
                listKeys : parsedElements ? parsedElements._listKeys : [],
                elements : parsedElements ? parsedElements._indexes  : [],
                elementsInListKey: elementsInListKey,
                visibleElements : visibleElements,
                selectedLetter: selectedLetter,

                //functions
                loadMoreElements : loadMoreElements,
                selectLetter : selectLetter,
                destroy      : destroy
            };

            collection[currentId] = angular.extend(scope.vm, scopeHelper);
            list.push({
                id: currentId
            });

            return collection[currentId];
        };


        //
        // Service function
        // 
        /**
         * @ngdoc method
         * @name evtviewer.list.evtList#destroy
         * @methodOf evtviewer.list.evtList
         *
         * @description
         * Delete the reference of the instance of a particular <code>&lt;evt-list&gt;</code>
         * 
         * @param {string} tempId id of <code>&lt;evt-list&gt;</code> to destroy
         */
        list.destroy = function(tempId) {
            delete collection[tempId];
        };

        list.scrollToElemById = function(listId, entityId) {
            angular.forEach(list, function(currentList) {
                if (currentList.id === listId) {
                    collection[listId].scrollToElement(entityId);
                }
            });
        }

        return list;
    };

});