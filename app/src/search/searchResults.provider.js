angular.module('evtviewer.search')

.provider('evtSearchResultsProvider',function () {
   function SearchResults() {
   }
   
   this.$get = function(evtSearchResults, evtSearchBox) {
      var collection = {};
      
      SearchResults.prototype.build = function(scope, vm) {
         var status = {
            searchResults : false
         };
         var scopeHelper = {
            status: status
         };
   
         collection = angular.extend(vm, scopeHelper);
         return collection;
      };
      
      SearchResults.prototype.getOriginalText = function(lineId, currentEdition) {
         return evtSearchResults.getOriginalText(lineId, currentEdition);
      };
      
      SearchResults.prototype.getStatus = function(key) {
         return collection.status[key];
      };
   
      SearchResults.prototype.getInputValue = function() {
        return evtSearchBox.getInputValue();
      };
      
      SearchResults.prototype.getVisibleResults = function() {
         return evtSearchResults.getVisibleResults();
      };
      
      SearchResults.prototype.getResultsNumber = function() {
         var results = collection.currentEditionResults,
            resNumber = 0;
         
         results.forEach(function(result) {
            resNumber += result.resultsNumber;
         });
         
         return resNumber;
      };
      
      SearchResults.prototype.toggleSearchResults = function() {
         var searchResultsIsOpen = collection.status.searchResults,
            searchResultsBoxStatus;
      
         $('[data-type=\'searchResultsShow\']').toggleClass('hide-visibility');
         $('[data-type=\'searchResultsHide\']').toggleClass('show');
      
         searchResultsBoxStatus = {
            'true': function() {
               SearchResults.prototype.closeBox('searchResults');
               SearchResults.prototype.showSearchResultsShowBtn();
            },
            'false': function() {
               SearchResults.prototype.openBox('searchResults');
               SearchResults.prototype.showSearchResultsHideBtn();
            }
         };
         searchResultsBoxStatus[searchResultsIsOpen]();
      };
      
      SearchResults.prototype.openBox = function(key) {
         collection.status[key] = true;
      };
   
      SearchResults.prototype.closeBox = function(key) {
         collection.status[key] = false;
      };
   
      SearchResults.prototype.showSearchResultsShowBtn = function() {
         $('[data-type=\'searchResultsShow\']').removeClass('hide-visibility');
         $('[data-type=\'searchResultsHide\']').removeClass('show');
      };
      
      SearchResults.prototype.showSearchResultsHideBtn = function() {
         $('[data-type=\'searchResultsShow\']').addClass('hide-visibility');
         $('[data-type=\'searchResultsHide\']').addClass('show');
      };
      
      return new SearchResults();
   };
});
