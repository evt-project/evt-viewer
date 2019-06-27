(function () {
    angular.module('evtviewer.imageViewerService',['evtviewer.dataHandler'])
    
    .service('imageViewerModel',function(parsedData){
        var viewerModel = this;
      
        var options = {
            id: "osd-img",
            prefixUrl: "bower_components/openseadragon/built-openseadragon/openseadragon/images/",
            tileSources:[],
            showRotationControl: true,                
            showNavigator: true,
            visibilityRatio: 1, 
            defaultZoomLevel: 1,
            panHorizontal: true,
            constrainDuringPan: true,
            minZoomLevel: 0.8,
            maxZoomLevel: 2.0,
            wrapVertical: false,
            navigatorLeft: "94%",
            navigatorHeight: "100%",
            navigatorWidth: "50%",
            navigatorTop:"1%",
         };
    
         viewerModel.getOptions = function(){
            
            var pages = parsedData.getPages();
            var lenght = pages.length;
            var p;
            var pp;
            var source="";
            for(var i = 0; i < lenght; i++){
                var imgobj = {type:"image", url:""};
                p = pages[i];
                pp = parsedData.getPage(p);
                source = pp.source;
                if(source!==undefined && source!=='' && source!==' ' && source!==null){
                imgobj.url = source;
                options.tileSources.push(imgobj);
                }
            }
             return options;
         };
     });
})();
