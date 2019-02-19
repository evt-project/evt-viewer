angular.module('evtviewer.search')
   .controller('SearchBoxCtrl', ['$rootScope', 'config', 'evtInterface', 'evtSearchBox', 'evtSearchResults', 'evtBox',
      function ($rootScope, config, evtInterface, evtSearchBox, evtSearchResults, evtBox) {
      var vm = this,
         searchBtn = [];
      
      vm.searchInput = '';
      vm.searchedTerm = '';
      vm.resList = [];
      vm.visibleRes = [];
      
      vm.getState = function (key) {
         if(vm.status) {
            return vm.status[key];
         }
      };
      
      vm.updateState = function (key) {
         vm.status[key] = !vm.status[key];
         return vm.status[key];
      };
      
      vm.getBoxEdition = function (boxId) {
        return evtBox.getEditionById(boxId);
      };
      
      vm.getInputValue = function () {
         return vm.searchInput;
      };
      
      vm.getSearchedTerm = function () {
         return vm.searchedTerm;
      };
      
      vm.closeBox = function(key) {
         vm.status[key] = false;
         return vm.status[key];
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
      
      vm.highlightSearchResults = function (mainBoxId, inputValue) {
         return evtSearchResults.highlightSearchResults(mainBoxId, inputValue);
      };
      
      vm.doSearchCallback = function () {
         for(var i in searchBtn) {
            if(searchBtn[i].parentId === vm.parentBoxId) {
               searchBtn[i].btn.doCallback();
            }
         }
      };
      
      vm.getBtnLimit = function() {
         var vm = this;
         
         for (var i in vm.searchBoxBtn) {
            if (vm.searchBoxBtn[i].type === "searchVirtualKeyboard") {
               return 5;
            }
         }
         return 4;
      };
      
      $rootScope.$on('searchBtn', function(e, data){
         searchBtn.push(data);
      });
   }]);
