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

        var getVisibleElements = function(listId, letter) {
            var visibleElements = [];
            if (letter) {
                var visibleElements = parsedData.getNamedEntitiesCollectionByNameAndPos(listId, letter);
                visibleElements = visibleElements ? visibleElements._indexes : [];
            }
            return visibleElements;
        };

        var selectLetter = function(letter) {
            var vm = this;
            vm.selectedLetter = letter;
            vm.visibleElements = getVisibleElements(vm.uid, letter);
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
                visibleElements = getVisibleElements(currentId, selectedLetter);
            scopeHelper = {
                // expansion
                uid      : currentId,
                listType : listType,
                listKeys : parsedElements ? parsedElements._listKeys : [],
                elements : parsedElements ? parsedElements._indexes  : [],
                visibleElements : visibleElements,
                selectedLetter: selectedLetter,

                //functions
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