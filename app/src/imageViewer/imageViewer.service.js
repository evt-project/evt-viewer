(function () {
    angular.module('evtviewer.imageViewerService',[])
    
    .service('imageViewerModel',function(){
        var viewerModel = this;
        
        console.log("caricato servizio  imageViewerService");
    
        var options = {
            id: "osd_img",
            prefixUrl: "bower_components/openseadragon/built-openseadragon/openseadragon/images/",
            tileSources: "data/tails/sanmatteo.dzi", //Senza questo nome visualizzao errore HTTP 404 attempting to load tilesource
            // tileSources: "data/tails/sanmatteo.dzi", immagine per San Matteo
            showRotationControl: true,                
            showNavigator: true,
            //navigatorId: "navscroll",
            //visibilityRatio: 0.8,
            visibilityRatio: 1, 
            defaultZoomLevel: 0,
            panHorizontal: true,
            constrainDuringPan: true,
            //minZoomLevel: 0.8,
            minZoomLevel: 1,
            maxZoomLevel: 8.0,   
            wrapVertical: false,
            navigatorPosition: "ABSOLUTE",
            //navigatorTop: "0",
            //navigatorLeft: "94%",
            //navigatorHeight: "100%",
            //navigatorWidth: "6%",
            navigatorTop:"0",
            navigatorBottom:"0",
            //navigatorLeft:"94%",
            navigatorHeight:"100%",
            //navigatorWidth:"6%"
         };
         // {id:"box_body_mainImage",prefixUrl:"images/",tileSources:"data/tails/scaled_70_verticale.dzi",showNavigator:!0,visibilityRatio:1,defaultZoomLevel:1,panHorizontal:!0,constrainDuringPan:!0,minZoomLevel:1,wrapVertical:!0,navigatorPosition:"ABSOLUTE",navigatorTop:"1%",navigatorLeft:"98%",navigatorHeight:"95%",navigatorWidth:"8%"}
    
         viewerModel.getOptions = function(){
            console.log("getOpt di   imageViewerService");
             return options;
         };
    
    
    
    
    });
    console.log("caricato modulo evtviewer.imageViewerService");
})();
/*
*/

