angular.module('evtviewer.search')

.controller('SearchBoxCtrl', ['$scope', 'config', 'evtInterface', 'evtSearchBox', 'evtSearchIndex', 'evtSearch', function ($scope, config, evtInterface, evtSearchBox, evtSearchIndex, evtSearch) {
    var vm = this;
    
    vm.searchInput = '';
    vm.searchResults = '';
    
    vm.getSearchBoxPosition = function() {
        var currentPos = config.searchBoxPosition,
			availablePos = evtSearchBox.getDefaults('availableSearchBoxPositions');
		
        return !availablePos.includes(currentPos) ? evtSearchBox.getDefaults('searchBoxPosition') : currentPos;
    };
	
    vm.getState = function(key) {
        return evtSearchBox.getStatus(key);
    };
    
    vm.updateState = function(key) {
		var currentState = vm.getState(key);
        currentState = !currentState;
		
        return currentState;
    };
	
    vm.getCurrentEdition = function() {
       return evtInterface.getState('currentEdition');
    };
    
    vm.getIndex = function() {
       return evtSearchIndex.getIndex();
    };
    
    vm.getSearchResults = function() {
       return vm.searchResults;
    };
    
    vm.doSearchCallback = function() {
       var result,
          inputValue = vm.searchInput;
   
       if(inputValue !== '') {
          var index = vm.getIndex(),
             res = evtSearch.query(index, inputValue, index.ref),
             currentEdition = vm.getCurrentEdition();
      
          console.log(res);
          result = evtSearch.handleSearchResults(inputValue, res, currentEdition);
      
       }
       else {
          result = 'Enter your query into the search box above';
       }
       vm.searchResults = result;
       evtSearchBox.openBox('searchResults');
       evtSearchBox.showSearchResultsHideBtn();
    };
}]);
