angular.module('evtviewer.openseadragonService')

   .service('overlayHandler', function () {
    var handler = this;

    handler.test = function(msg){
        console.log(msg);
    }

});
