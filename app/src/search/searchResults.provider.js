angular.module('evtviewer.search')
   .provider('evtSearchResult', function () {
      this.$get = function () {
        var searchResult = [],
           searchResultCollection = {};
        
        searchResult.build = function (scope, vm) {
           var parentBoxId = scope.$parent.id,
              scopeHelper = {
                  parentBoxId: parentBoxId
              };
   
           searchResultCollection[parentBoxId] = angular.extend(vm, scopeHelper);
           return searchResultCollection[parentBoxId];
        };
        
        searchResult.setPlaceholder = function (parentBoxId, value) {
           searchResultCollection[parentBoxId].placeholder = value;
        };
        
        searchResult.setVisibleRes = function (parentBoxId, value) {
          searchResultCollection[parentBoxId].visibleRes = value;
        };
        
        searchResult.setCurrentEditionResults = function (parentBoxId, value) {
           searchResultCollection[parentBoxId].currentEditionResults = value;
        };
        
        return searchResult;
      };
   });
