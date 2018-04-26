angular.module('evtviewer.search')
   .provider('evtSearchBox', function () {
      var defaults = this.defaults;
      
      this.setDefaults = function (_defaults) {
         defaults = _defaults;
      };
      
      this.$get = function ($log, config) {
         var currentPosition,
            searchBox = [],
            collection = {};
         
         searchBox.build = function (scope, vm) {
            var status = {
               searchBox: false
            };
            var searchBoxBtn = [
               {title: 'Show Results', label: '', icon: 'search-results-show', type: 'searchResultsShow'},
               {title: 'Hide Results', label: '', icon: 'search-results-hide', type: 'searchResultsHide'},
               {title: 'Advanced Search', label: '', icon: 'search-advanced', type: ''},
               {title: 'Virtual Keyboard', label: '', icon: 'keyboard', type: ''},
               {title: 'Previous', label: '', icon: 'previous', type: ''},
               {title: 'Next', label: '', icon: 'next', type: ''},
               {title: 'Search', label: '', icon: 'search', type: 'search'}
            ];
            var scopeHelper = {
               status: status,
               searchBoxBtn: searchBoxBtn
            };
            
            collection = angular.extend(vm, scopeHelper);
            return collection;
         };
         
         searchBox.getDefaults = function (key) {
            return defaults[key];
         };
         
         searchBox.getSearchResults = function () {
            return collection.searchResults;
         }
         
         searchBox.getStatus = function (key) {
            return collection.status[key];
         };
         
         searchBox.getInputValue = function () {
            return collection.searchedTerm;
         };
         
         searchBox.toggleBox = function (key) {
            collection.status[key] = collection.updateState(key);
         };
         
         searchBox.openBox = function (key) {
            collection.status[key] = true;
         };
         
         searchBox.closeBox = function (key) {
            collection.status[key] = false;
         };
         
         return searchBox;
      };
   });
