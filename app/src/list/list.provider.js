angular.module('evtviewer.list')

.provider('evtList', function() {

    var defaults = this.defaults;

    this.setDefaults = function(_defaults) {
        defaults = _defaults;
    };

    var currentList = '';

    this.$get = function(parsedData) {
        var list    = {},
            collection = {},
            list       = [];
        

        // 
        // List builder
        // 
        var selectLetter = function(letter) {
            var vm = this;
            vm.selectedLetter = letter;
        };

        var getVisibleElements = function() {
            var vm = this;
            if (vm.selectedLetter) {
                var visibleElements = parsedData.getNamedEntitiesCollectionByNameAndPos(vm.listId, vm.selectedLetter);
                visibleElements = visibleElements ? visibleElements._indexes : [];
                return visibleElements;
            }
            return [];
        };

        list.build = function(id, scope) {
            var currentId = id, //ID is listName
                listType = scope.listType || 'generic';

            var scopeHelper = {};
            
            if (typeof(collection[currentId]) !== 'undefined') {
                return;
            }
            
            var parsedElements = parsedData.getNamedEntitiesCollectionByName(currentId);
            var selectedLetter = parsedElements ? parsedElements._listKeys[0] : undefined;
            scopeHelper = {
                // expansion
                uid      : currentId,
                listType : listType,
                listKeys : parsedElements ? parsedElements._listKeys : [],
                elements : parsedElements ? parsedElements._indexes  : [],

                selectedLetter: selectedLetter,

                //functions
                selectLetter       : selectLetter,
                getVisibleElements : getVisibleElements
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