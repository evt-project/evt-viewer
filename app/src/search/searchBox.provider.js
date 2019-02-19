angular.module('evtviewer.search')
   .provider('evtSearchBox', function () {
      var defaults = this.defaults;
      
      this.setDefaults = function (_defaults) {
         defaults = _defaults;
      };
      
      this.$get = function (SEARCHBOXDEFAULTS, parsedData) {
         var searchBox = [],
            searchBoxCollection = {},
            parentBoxId,
            searchBoxId,
            glyphs = parsedData.getGlyphs();
         
         searchBox.build = function (scope, vm) {
            var status = {
               searchResultBox: false,
               searchCaseSensitive : false,
               searchExactWord: false,
               virtualKeyboard: false,
               progressBar : false
            };
            var searchBoxBtn = [],
               defaultSearchBoxBtn,
               currentBoxEdition = scope.$parent.edition;
            
            defaultSearchBoxBtn = currentBoxEdition === 'diplomatic' ? SEARCHBOXDEFAULTS.diplomaticSearchBoxBtn : SEARCHBOXDEFAULTS.interpretativeSearchBoxBtn;
            
            for(var btn in defaultSearchBoxBtn) {
               if(glyphs._indexes.length === 0) {
                  if(btn.toString() !== 'virtualKeyboard') {
                     searchBoxBtn.push(defaultSearchBoxBtn[btn]);
                  }
               }
               else {
                  searchBoxBtn.push(defaultSearchBoxBtn[btn]);
               }
            }
            
            parentBoxId = scope.$parent.id;
            searchBoxId = parentBoxId + 'SearchBox';
            
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
         
         searchBox.getCurrentBoxEdition = function (parentBoxId) {
           return searchBoxCollection[parentBoxId].getBoxEdition(parentBoxId);
         };
         
         searchBox.getSearchResults = function (parentBoxId) {
            return searchBoxCollection[parentBoxId].searchResults;
         };
         
         searchBox.getInputValue = function (parentBoxId) {
            return searchBoxCollection[parentBoxId].searchInput;
         };
   
         searchBox.clearInputValue = function (parentBoxId) {
            searchBoxCollection[parentBoxId].searchInput = '';
         };
         
         searchBox.getStatus = function (parentBoxId, key) {
            if(searchBoxCollection[parentBoxId].status) {
               return searchBoxCollection[parentBoxId].status[key];
            }
         };
         
         searchBox.setStatus = function (parentBoxId, key, value) {
            searchBoxCollection[parentBoxId].status[key] = value;
         };
   
         searchBox.updateStatus = function (parentBoxId, key) {
            searchBoxCollection[parentBoxId].status[key] = !searchBoxCollection[parentBoxId].status[key];
         };
   
         searchBox.setSearchedTerm = function (parentBoxId, value) {
            searchBoxCollection[parentBoxId].searchedTerm = value;
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
