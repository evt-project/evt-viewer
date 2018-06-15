angular.module('evtviewer.search')
   .provider('evtSearchBox', function () {
      var defaults = this.defaults;
      
      this.setDefaults = function (_defaults) {
         defaults = _defaults;
      };
      
      this.$get = function (evtBox) {
         var searchBox = [],
            collection = {};
         
         searchBox.build = function (scope, vm) {
            var status = {
               searchResultBox: false,
               searchCaseSensitive : false,
               progressBar : false,
               indexingInProgress : false
            };
            var searchBoxBtn = [
               {title: 'Show Results', label: '', icon: 'search-results-show', type: 'searchResultsShow'},
               {title: 'Hide Results', label: '', icon: 'search-results-hide', type: 'searchResultsHide'},
               {title: 'Virtual Keyboard', label: '', icon: 'keyboard', type: 'searchVirtualKeyboard'},
               {title: 'Case Sensitive', label: '', icon: 'case-sensitive', type: 'searchCaseSensitive'},
               {title: 'Previous', label: '', icon: 'previous', type: 'searchPrevResult'},
               {title: 'Next', label: '', icon: 'next', type: 'searchNextResult'},
               {title: 'Search', label: '', icon: 'search', type: 'search'}
            ];
            var parentBoxId = scope.$parent.id;
            
            var scopeHelper = {
               status: status,
               searchBoxBtn: searchBoxBtn,
               parentBoxId: parentBoxId
            };
            
            collection = angular.extend(vm, scopeHelper);
            return collection;
         };
         
         searchBox.getDefaults = function (key) {
            return defaults[key];
         };
         
         searchBox.getSearchResults = function () {
            return collection.searchResults;
         };
         
         searchBox.getInputValue = function () {
            return collection.searchedTerm;
         };
         
         searchBox.getStatus = function (key) {
            if(collection.status) {
               return collection.status[key];
            }
         };
         
         searchBox.getBoxEdition = function (boxId) {
            return evtBox.getEditionById(boxId);
         };
         
         searchBox.updateStatus = function (key) {
            collection.status[key] = !collection.status[key];
         };
         
         searchBox.closeBox = function (key) {
            return collection.closeBox(key);
         };
         
         return searchBox;
      };
   });
