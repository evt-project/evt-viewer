angular.module('evtviewer.search')

.controller('SearchBoxCtrl', function($scope, evtSearchBox) {
    var vm = this; 
    
    // 
    // Control function
    // 
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

