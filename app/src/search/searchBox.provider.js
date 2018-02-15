angular.module('evtviewer.search')

.provider('evtSearchBox', function () {

   var defaults =  this.defaults;

   this.setDefaults = function(_defaults) {
      defaults = _defaults;
   };

   this.$get = function($log, config) {
      var currentPosition = config.searchBoxPosition,
         searchBox = {},
         collection = {};
      
      var _console = $log.getInstance('search');

      //
      // Search Box builder
      //
      searchBox.build = function(scope, vm) {
         var currentPosition = config.searchBoxPosition;
         var status = {
            searchBox   : false,
            searchResults : false
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
         var scopeHelper;

         scopeHelper = {
            status          : status,
            searchBoxBtn    : searchBoxBtn,
         };

         collection = angular.extend(vm, scopeHelper);
         return collection;
      };

      //
      // Service function
      //
      searchBox.getDefaults = function(key) {
         return defaults[key];
      };

      searchBox.getCurrentPosition = function() {
         return collection.getSearchBoxPosition();
      };

      searchBox.getStatus = function(key) {
         return collection.status[key];
      };

      searchBox.toggleBox = function(key) {
         collection.status[key] = collection.updateState(key);
         return key;
      };
      
      searchBox.openBox = function(key) {
         collection.status[key] = true;
         return key;
      }

      searchBox.closeBox = function(key) {
         collection.status[key] = false;
         return key;
      }
      
      searchBox.toggleSearchResults = function() {
         $('[data-type=\'searchResultsShow\']').toggleClass('hide-visibility');
         $('[data-type=\'searchResultsHide\']').toggleClass('show');
      }
      
      searchBox.showSearchResultsShowBtn = function() {
         $('[data-type=\'searchResultsShow\']').removeClass('hide-visibility');
         $('[data-type=\'searchResultsHide\']').removeClass('show');
      }
      
      searchBox.showSearchResultsHideBtn = function() {
         $('[data-type=\'searchResultsShow\']').addClass('hide-visibility');
         $('[data-type=\'searchResultsHide\']').addClass('show');
      }
      
      return searchBox;
   };
});
