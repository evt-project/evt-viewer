angular.module('evtviewer.search')

.controller('SearchBoxCtrl', function (config, evtSearchBox) {
    var vm = this;
    
    // 
    // Control function
    //
    this.getPosition = function() {
        var currentPos = config.searchBoxPosition,
			availablePos = evtSearchBox.getDefaults('availableSearchBoxPositions');
		
        return !availablePos.includes(currentPos) ? evtSearchBox.getDefaults('searchBoxPosition') : currentPos;
    };
	
    this.getState = function(key) {
        return evtSearchBox.getStatus(key);
    };
	
	this.updateState = function(key) {
		var currentState = vm.getState(key);
        currentState = !currentState;
		
        return currentState;
    };
});