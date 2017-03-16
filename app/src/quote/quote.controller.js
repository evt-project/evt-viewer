angular.module('evtviewer.quote')

.controller('QuoteCtrl', function($log, $scope, evtQuote) {
    $scope.content = {};
    var vm = this;
    
    var _console = $log.getInstance('quote');

    // 
    // Control function
    // 




    //this.destroy = function() {
        //var tempId = this.uid;
        // TODO: remove from list and collection
        // this.$destroy();
        //evtQuote.destroy(tempId);
        // _console.log('vm - destroy ' + tempId);
    //};
    // _console.log('QuoteCtrl running');
});