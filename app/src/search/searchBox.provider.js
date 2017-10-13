angular.module('evtviewer.search')

.provider('evtSearchBox', function () {

   var defaults =  this.defaults;

   this.setDefaults = function(_defaults) {
      defaults = _defaults;
   };

   this.$get = function($log, config, baseData, evtSearchParser) {
      var currentPosition = config.searchBoxPosition,
         searchBox = {},
         collection = {},
         check = true;
      var _console = $log.getInstance('search');

      //
      // Search Box builder
      //
      searchBox.build = function(scope, vm) {
         var currentPosition = config.searchBoxPosition;
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
         var scopeHelper;

         scopeHelper = {
            status          : status,
            searchBoxBtn    : searchBoxBtn
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
         return collection.getPosition();
      };

      searchBox.getStatus = function(key) {
         return collection.status[key];
      };

      searchBox.openBox = function(key) {
         var btnStatus = collection.updateState(key),
             doc;

         if(btnStatus && check) {
            check = false;
            doc = baseData.getXML();
            evtSearchParser.getText(doc);
         }

         collection.status[key] = btnStatus;
         return btnStatus;
      };

      return searchBox;
   };
});
