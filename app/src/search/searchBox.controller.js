angular.module('evtviewer.search')

.controller('SearchBoxCtrl', ['config', 'evtInterface', 'evtSearchBox', 'evtSearchIndex', function (config, evtInterface, evtSearchBox, evtSearchIndex) {
    var vm = this;
    
    vm.searchInput = '';
    
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
    
}]);
