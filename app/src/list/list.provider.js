/**
 * @ngdoc service
 * @module evtviewer.list
 * @name evtviewer.list.evtList
 * @description 
 * # evtList
 * TODO: Add description and comments for every method
**/
angular.module('evtviewer.list')

.provider('evtList', function() {

    var defaults = this.defaults;

    this.setDefaults = function(_defaults) {
        defaults = _defaults;
    };

    var currentList = '';

    this.$get = function(parsedData) {
        var collection = {},
            list       = [];
        

        // 
        // List builder
        // 
        var destroy = function() {
            var tempId = this.uid;
            // this.$destroy();
            delete collection[tempId];
            // _console.log('vm - destroy ' + tempId);
        };

        var loadMoreElements = function() {
            var vm = this,
                last = vm.visibleElements.length,
                i = 0; 
            while (i < 10 && i < vm.elementsInListKey.length) {
                var newElement = vm.elementsInListKey[last+i];
                if (newElement && vm.visibleElements.indexOf(newElement) <= 0) {
                    vm.visibleElements.push(newElement);                    
                }
                i++;
            }
        };

        var getVisibleElements = function(listId, letter) {
            var visibleElements = [];
            if (letter) {
                visibleElements = parsedData.getNamedEntitiesCollectionByNameAndPos(listId, letter);
                visibleElements = visibleElements ? visibleElements._indexes : [];
            }
            return visibleElements;
        };

        var selectLetter = function(letter) {
            var vm = this;
            vm.selectedLetter = letter;
            vm.elementsInListKey = getVisibleElements(vm.uid, letter);
            vm.visibleElements = vm.elementsInListKey ? vm.elementsInListKey.slice(0, 40) : [];
        };


        list.build = function(id, scope) {
            var currentId = id, //ID is listName
                listType = scope.listType || 'generic';

            var scopeHelper = {};
            
            if (typeof(collection[currentId]) !== 'undefined') {
                return;
            }
            
            var parsedElements = parsedData.getNamedEntitiesCollectionByName(currentId),
                selectedLetter = parsedElements ? parsedElements._listKeys[0] : undefined,
                elementsInListKey = getVisibleElements(currentId, selectedLetter),
                visibleElements = elementsInListKey ? elementsInListKey.slice(0, 40) : [];

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
        
        list.destroy = function(tempId) {
            delete collection[tempId];
        };

        return list;
    };

});