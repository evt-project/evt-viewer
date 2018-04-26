angular.module('evtviewer.search')
   .controller('SearchBoxCtrl', ['config', 'evtInterface', 'evtSearchBox', 'evtSearchResultsProvider', 'evtSearchResults', 'evtButtonSwitch', function (config, evtInterface, evtSearchBox, evtSearchResultsProvider, evtSearchResults, evtButtonSwitch) {
      var vm = this;
      
      vm.searchInput = '';
      vm.searchedTerm = '';
      vm.resList = [];
      vm.visibleRes = [];
      
      vm.getState = function (key) {
         return evtSearchBox.getStatus(key);
      };
      
      vm.updateState = function (key) {
         var currentState = vm.getState(key);
         currentState = !currentState;
         return currentState;
      };
      
      vm.getSearchResultsState = function () {
         return evtSearchResultsProvider.getStatus('searchResults');
      };
      
      vm.getInputValue = function () {
         return evtSearchBox.getInputValue();
      };
      
      vm.loadMoreElements = function () {
         var i = 0;
         
         while (i < 10 && i < vm.resList.length) {
            var last = vm.visibleRes.length - 1,
               newEl = vm.resList[last + 1];
            if (newEl) {
               vm.visibleRes.push(newEl);
               vm.searchResults += newEl;
            }
            i++;
         }
      };
      
      vm.highlightSearchResults = function (inputValue) {
         return evtSearchResults.highlightSearchResults(inputValue);
      };
      
      vm.doSearchCallback = function () {
         var btnList = evtButtonSwitch.getList(),
            searchBtn;
         
         btnList.forEach(function (btn) {
            if (btn.type === 'search') {
               searchBtn = evtButtonSwitch.getById(btn.id);
            }
         });
         
         searchBtn.doCallback();
      };
      
   }]);
