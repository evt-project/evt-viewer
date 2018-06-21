angular.module('evtviewer.search')

.provider('evtSearchResultsProvider',function () {
   function SearchResults() {
   }
   
   this.$get = function() {
      var collection = {};
      
      SearchResults.prototype.build = function(vm) {
         collection = vm;
         return collection;
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
