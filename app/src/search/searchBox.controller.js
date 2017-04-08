angular.module('evtviewer.search')

.controller ('SearchBoxCtrl', function(config, evtSearchBox) {
    var vm = this;
    
    // 
    // Control function
    //
    this.getPosition = function() {
        var position = config.searchBoxPosition /*|| evtSearchBox.getDefaults('searchBoxPosition')*/;
        return position;
    };
    
     this.open = function(key){
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