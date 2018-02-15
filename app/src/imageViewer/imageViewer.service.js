(function () {
    angular.module('evtviewer.imageViewerService',[] )
    
    .service('imageViewerModel',function(){
        var viewerModel = this;
        
        console.log("caricato servizio  imageViewerService");
    
        var options = {
            id: "osd_img",
            prefixUrl: "bower_components/openseadragon/built-openseadragon/openseadragon/images/",
            tileSources: "data/tails/scaled_70_verticale.dzi",
             /*tileSources: ["data/bellinidzi/4-26giugno1834a.dzi",
                            "data/bellinidzi/4-26giugno1834b.dzi"],
            
                            overlays: [{
                                id: 'example-overlay',
                                x: 0.26,
                                y: 0.39,
                                width: 0.22,
                                height: 0.27,
                                className: 'nohighlight'
                            }], */
    
            //sequenceMode: true,
            //degrees:90,
            //showRotationControl: true,                
            showNavigator: true,
            //navigatorId: "navscroll",
            visibilityRatio: 1,
            defaultZoomLevel: 1,
            panHorizontal: false,
            constrainDuringPan: true,
            minZoomLevel: 1,
            //maxZoomLevel: 4.0,
    
            wrapVertical: true,
            navigatorPosition: "ABSOLUTE",
            navigatorTop: "1%",
            navigatorLeft: "94%",
            navigatorHeight: "95%",
            navigatorWidth: "6%"
         };
    
         viewerModel.getOptions = function(){
            console.log("getOpt di   imageViewerService");
             return options;
         };
    
    
    
    
    });
})();
/*
*/

