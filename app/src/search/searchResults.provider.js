angular.module('evtviewer.search')

.provider('evtSearchResultsProvider',function () {
   function SearchResults() {
   }
   
   this.$get = function(evtSearchResults) {
      var collection = {};
      
      SearchResults.prototype.build = function(vm) {
         collection = vm;
         return collection;
      };
      
      SearchResults.prototype.getOriginalText = function(lineId, currentEdition) {
         return evtSearchResults.getOriginalText(lineId, currentEdition);
      };
      
      SearchResults.prototype.getVisibleResults = function() {
         return evtSearchResults.getVisibleResults();
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
