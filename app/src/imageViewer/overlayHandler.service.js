angular.module('evtviewer.openseadragonService')

   .service('overlayHandler', function () {
    console.log('caricato modulo factory overlay');
    var handler = this;

    handler.test = function(msg){
        console.log(msg);
    }

});
