angular.module('evtviewer.search')

.provider('evtSearchBox', function() {
    this.$get = function() {
        var searchBox = {},
            collection = {};
        
        //
        // Search Box builder
        //
        searchBox.build = function(vm) {
            var status = {
                searchBtn   : false
            };
            
            var searchBoxBtn = [
                    {title: 'Show Results', label: '', icon: 'search-results-show', type: ''},
                    {title: 'Advanced Search', label: '', icon: 'search-advanced', type: ''},
                    {title: 'Virtual Keyboard', label: '', icon: 'keyboard', type: ''},
                    {title: 'Previous', label: '', icon: 'previous', type: ''},
                    {title: 'Next', label: '', icon: 'next', type: ''},
                    {title: 'Search', label: '', icon: 'search', type: ''}
            ];
            
            var scopeHelper = {
                status          : status,
                searchBoxBtn    : searchBoxBtn,
            };

            collection = angular.extend(vm, scopeHelper);
            
            return collection;  
        };
        
        //
        // Service function
        //
        searchBox.getStatus = function(key) {
            return collection.status[key];
        };
        
        searchBox.openBox = function(key) {
            var BtnStatus = collection.open(key);
            collection.status[key] = BtnStatus;
            return BtnStatus;
        };

        return searchBox;
    };
});