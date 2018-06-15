angular.module('evtviewer.search')
   .controller('SearchBoxCtrl', ['$scope', 'config', 'evtInterface', 'evtSearchBox', 'evtSearchResultsProvider', 'evtSearchResults', 'evtButtonSwitch',
      function ($scope, config, evtInterface, evtSearchBox, evtSearchResultsProvider, evtSearchResults) {
      var vm = this;
      
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
      
      vm.getExternalBoxStatus = function (key) {
         return evtSearchBox.getStatus(key);
      };
      
      vm.getBoxEdition = function (boxId) {
        return evtSearchBox.getBoxEdition(boxId);
      };
      
      vm.closeBox = function(key) {
         vm.status[key] = false;
         return vm.status[key];
      };
      
      vm.getInputValue = function () {
         return vm.searchInput;
      };
      
      vm.getSearchedTerm = function () {
         return vm.searchedTerm;
      }
      
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
         if($scope.$$childTail.$$childHead) {
            var currentSearchBtn = $scope.$$childTail.$$childHead.vm;
            currentSearchBtn.doCallback();
         }
      };
      
   }]);
