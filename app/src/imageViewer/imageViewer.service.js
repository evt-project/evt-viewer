(function () {
    angular.module('evtviewer.imageViewerService',[])
    
    .service('imageViewerModel',function(){
        var viewerModel = this;
        
        console.log("caricato servizio  imageViewerService");
    
        var options = {
            id: "osd_img",
            prefixUrl: "bower_components/openseadragon/built-openseadragon/openseadragon/images/",
            tileSources: "data/tails/scaled_70_verticale.dzi",
            //tileSources: "data/test-img/quamusdzi/QuamusImgManuscript.dzi", // immagine per Marocco
            //overlays: [{
            //    id: 'example-overlay',
            //    x: 0.03,
            //    y: 0.20,
            //    width: 0.15,
            //    height: 0.45,
            //    className: 'nohighlight'
            //}],            
            /*tileSources: ["data/bellinidzi/4-26giugno1834a.dzi", // immagini per bellini
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
            showRotationControl: true,                
            showNavigator: true,
            //navigatorId: "navscroll",
            visibilityRatio: 0.8,
            defaultZoomLevel: 1,
            panHorizontal: true,
            constrainDuringPan: true,
            minZoomLevel: 0.8,
            maxZoomLevel: 4.0,
    
            wrapVertical: false,
            navigatorPosition: "ABSOLUTE",
            navigatorTop: "0",
            navigatorLeft: "94%",
            navigatorHeight: "100%",
            navigatorWidth: "6%"
         };
    
         viewerModel.getOptions = function(){
            console.log("getOpt di   imageViewerService");
             return options;
         };
    
    
    
    
    });
    console.log("caricato modulo evtviewer.imageViewerService");
})();
/*
*/

