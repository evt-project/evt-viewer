angular.module('evtviewer.search')

.controller('SearchBoxCtrl', function (config, evtSearchBox) {
    var vm = this;
    
    // 
    // Control function
    //
    this.getPosition = function() {
        var currentPos = config.searchBoxPosition,
			availablePos = GLOBALCONFIG.availableSearchBoxPositions;
		
		if (!availablePos.includes(currentPos)) {
			currentPos = evtSearchBox.getDefaults('searchBoxPosition');
		}
        return currentPos;
    };
    
     this.open = function(key) {
        var currentState = vm.getState(key);
        if(currentState !== undefined) {
            currentState = !currentState;
        }
        return currentState;
    };
    
    this.getState = function(key) {
        return evtSearchBox.getStatus(key);
    };
});