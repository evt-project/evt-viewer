angular.module('evtviewer.reading')

.controller('QuoteCtrl', function() {
    var vm = this;
    
    var _console = $log.getInstance('quote');

    // 
    // Control function
    // 




    this.destroy = function() {
        var tempId = this.uid;
        // TODO: remove from list and collection
        // this.$destroy();
        evtReading.destroy(tempId);
        // _console.log('vm - destroy ' + tempId);
    };
    // _console.log('ReadingCtrl running');
});