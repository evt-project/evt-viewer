angular.module('evtviewer.search')

.controller('SearchBoxCtrl', ['$scope', 'config', 'evtInterface', 'evtSearchBox', 'evtSearchIndex', 'evtSearch', 'evtSearchResults', '$anchorScroll', function ($scope, config, evtInterface, evtSearchBox, evtSearchIndex, evtSearch, evtSearchResults, $anchorScroll, $location) {
    var vm = this;
    
    vm.searchInput = '';
    vm.searchResults = '';
    vm.index = evtSearchIndex.getIndex();
    vm.resList = [];
    vm.visibleRes = [];
    
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
    
    vm.getSearchResults = function() {
       return vm.searchResults;
    };
    
    vm.loadMoreElements = function() {
       var i = 0;
       
       while(i < 10 && i < vm.resList.length) {
          var last = vm.visibleRes.length -1,
             newEl = vm.resList[last+1];
          if (newEl) {
             vm.visibleRes.push(newEl);
             vm.searchResults += newEl;
          }
          i++;
       }
    }
    
    vm.doSearchCallback = function() {
       vm.searchResults = '';
       vm.visibleRes = [];
       
       var result = '',
          inputValue = vm.searchInput;
   
       if(inputValue !== '') {
          var currentEdition = vm.getCurrentEdition(),
             res = evtSearch.query(vm.index, inputValue, vm.index.ref),
             i = 0;
      
          vm.resList = evtSearchResults.renderSearchResults(inputValue, res, currentEdition);
          
          while(i < 10 && i < vm.resList.length) {
             vm.visibleRes.push(vm.resList[i]);
             result += vm.resList[i];
             i++;
          }
       }
       else {
          result = 'Enter your query into the search box above';
       }
       vm.searchResults = result;
       evtSearchBox.openBox('searchResults');
       evtSearchBox.showSearchResultsHideBtn();
    };
   
    vm.highlightSearchResults = function(inputValue) {
       return evtSearchResults.highlightSearchResults(inputValue);
    };
    
    vm.goToAnchorPage = function() {
       var anchorPageId,
          anchorDocId;
   
       anchorPageId = document.getElementsByClassName('resultInfo selected')[0].getElementsByClassName('resultPage')[0].getAttribute('id');
       anchorDocId = document.getElementsByClassName('resultInfo selected')[0].getElementsByClassName('resultDoc')[0].getAttribute('id');
       evtInterface.updateState('currentPage', anchorPageId);
       evtInterface.updateState('currentDoc', anchorDocId);
   
       evtInterface.updateUrl();
    };
    
    vm.goToAnchor = function() {
       var eventElement;
   
       evtSearchBox.closeBox('searchResults');
       
       eventElement = window.event.currentTarget;
       $(eventElement).addClass('selected');
       
       vm.goToAnchorPage();
    };
}]);
