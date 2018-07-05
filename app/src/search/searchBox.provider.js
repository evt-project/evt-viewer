angular.module('evtviewer.search')
   .provider('evtSearchBox', function () {
      var defaults = this.defaults;
      
      this.setDefaults = function (_defaults) {
         defaults = _defaults;
      };
      
      this.$get = function (evtBox) {
         var searchBox = [],
            searchBoxCollection = {},
            searchBoxId;
         
         searchBox.build = function (scope, vm) {
            var status = {
               searchResultBox: false,
               searchCaseSensitive : false,
               progressBar : false
            };
            var searchBoxBtn = [
               {title: 'Show Results', label: '', icon: 'search-results-show', type: 'searchResultsShow'},
               {title: 'Hide Results', label: '', icon: 'search-results-hide', type: 'searchResultsHide', hide: true},
               {title: 'Virtual Keyboard', label: '', icon: 'keyboard', type: 'searchVirtualKeyboard'},
               {title: 'Case Sensitive', label: '', icon: 'case-sensitive', type: 'searchCaseSensitive'},
               {title: 'Previous', label: '', icon: 'previous', type: 'searchPrevResult'},
               {title: 'Next', label: '', icon: 'next', type: 'searchNextResult'},
               {title: 'Search', label: '', icon: 'search', type: 'search'}
            ];
            var parentBoxId = scope.$parent.id;
            searchBoxId = parentBoxId + 'searchBox';
            
            var scopeHelper = {
               status: status,
               searchBoxBtn: searchBoxBtn,
               parentBoxId: parentBoxId,
               searchBoxId: searchBoxId
            };
            
            searchBoxCollection[parentBoxId] = angular.extend(vm, scopeHelper);
            return searchBoxCollection[parentBoxId];
         };
         
         searchBox.getDefaults = function (key) {
            return defaults[key];
         };
         
         searchBox.getSearchResults = function (parentBoxId) {
            return searchBoxCollection[parentBoxId].searchResults;
         };
         
         searchBox.getInputValue = function (parentBoxId) {
            searchBoxCollection[parentBoxId].searchedTerm = searchBoxCollection[parentBoxId].searchInput;
            return searchBoxCollection[parentBoxId].searchedTerm;
         };
         
         searchBox.getStatus = function (parentBoxId, key) {
            if(searchBoxCollection[parentBoxId].status) {
               return searchBoxCollection[parentBoxId].status[key];
            }
         };
         
         searchBox.updateStatus = function (parentBoxId, key) {
            searchBoxCollection[parentBoxId].status[key] = !searchBoxCollection[parentBoxId].status[key];
         };
         
         searchBox.closeBox = function (parentBoxId, key) {
            var currentBox;
            
            for(var i in searchBoxCollection) {
               currentBox = searchBoxCollection[i];
               if (currentBox.parentBoxId === parentBoxId) {
                  currentBox.status[key] = false;
                  return currentBox.status[key];
               }
            }
         };
         
         searchBox.showBtn = function (parentBoxId, type) {
            var currentBoxButtons = searchBoxCollection[parentBoxId].searchBoxBtn;
            for(var i in currentBoxButtons) {
               if(currentBoxButtons[i].type === type) {
                  currentBoxButtons[i].hide = false;
               }
            }
         };
   
         searchBox.hideBtn = function (parentBoxId, type) {
            var currentBoxButtons = searchBoxCollection[parentBoxId].searchBoxBtn;
            for(var i in currentBoxButtons) {
               if(currentBoxButtons[i].type === type) {
                  currentBoxButtons[i].hide = true;
               }
            }
         };
         
         return searchBox;
      };
   });
