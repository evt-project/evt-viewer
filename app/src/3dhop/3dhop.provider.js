/**
 * @ngdoc service
 * @module evtviewer.3dhop
 * @name evtviewer.3dhop.evtTreDHOP
 * @description 
 * # evtTreDHOP
 * This provider expands the scope of the
 * {@link evtviewer.3dhop.directive:evtTreDHOP evtTreDHOP} directive 
 * and stores its reference untill the directive remains instantiated.
 *
 * @requires $log
 * @requires evtviewer.interface.evtInterface
 * @requires evtviewer.core.config
 * @requires evtviewer.dataHandler.parsedData
**/
angular.module('evtviewer.3dhop')
.provider('evtTreDHOP', function() {

    this.$get = function($timeout, parsedData, config) {
        var tredhop = {};

        tredhop.build = function(name){
            var options = config.tredhopOptions;
            /*var pages = parsedData.getPages();
            var lenght = pages.length;
            var p;
            var pp;
            var source="";
            options.tileSources = [];
            for(var i = 0; i < lenght; i++){
                var imgobj = {type:"image", url:""};
                p = pages[i];
                pp = parsedData.getPage(p);
                source = pp.source;
                if(source!==undefined && source!=='' && source!==' ' && source!==null){
                imgobj.url = source;
                options.tileSources.push(imgobj);
                }*/
            options.id = "3dhop-obj";
            return options;
        }

       return tredhop;
   };
	
});