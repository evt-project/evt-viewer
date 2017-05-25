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
        var getElementContent = function(element) {
            var vm = this;
            var parsedElement = parsedData.agetNamedEntityInCollection(vm.name, element.id, element.listKey);
        };

        var selectLetter = function(letter) {
            var vm = this;
            vm.selectedLetter = letter;
        };

        var getVisibleElements = function() {
            var vm = this;
            if (vm.selectedLetter) {
                var visibleElements = parsedData.getNamedEntitiesCollectionByNameAndPos(vm.name, vm.selectedLetter);
                visibleElements = visibleElements ? visibleElements._indexes : [];
                return visibleElements;
            }
            return [];
        };

        list.build = function(id, scope) {
            var currentId = id; //ID is listName

            var scopeHelper = {};
            
            if (typeof(collection[currentId]) !== 'undefined') {
                return;
            }
            
            var parsedElements = parsedData.getNamedEntitiesCollectionByName(currentId);
            var selectedLetter = parsedElements ? parsedElements._listKeys[0] : undefined;
            scopeHelper = {
                // expansion
                uid      : currentId,
                listKeys : parsedElements ? parsedElements._listKeys : [],
                elements : parsedElements ? parsedElements._indexes  : [],

                selectedLetter: selectedLetter,

                //functions
                getElementContent  : getElementContent,
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