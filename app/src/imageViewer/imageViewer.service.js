(function () {
    angular.module('evtviewer.imageViewerService',['evtviewer.dataHandler'])
    
    .service('imageViewerModel',function(parsedData){
        var viewerModel = this;
        
        console.log("caricato servizio  imageViewerService");
        console.log("#!!# con parsedData #!!#", parsedData);
        console.log("#!!# page di parsedData #!!#", parsedData.getPage('page1').source);
    
        var options = {
            id: "osd-img",
            prefixUrl: "bower_components/openseadragon/built-openseadragon/openseadragon/images/",
            tileSources: "data/tails/sanmatteo.dzi", 
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
            //navigatorPosition: "ABSOLUTE",
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
            // data/test-img/vb/VB_fol_104v_big.jpg
            // data/test-img/vb/VB_fol_105r_big.jpg
            var imgobj1 = {type:"image", url:"data/test-img/vb/VB_fol_104v_big.jpg"};
            var imgobj2 = {type:"image", url:"data/test-img/vb/VB_fol_105r_big.jpg"};
            
            var pages = parsedData.getPages();
            console.log('******pages*******: ', pages);
            var lenght = pages.length;
            console.log('lunghezza pagine: ', lenght);
            var p;
            var pp;
            var source="";
            for(var i = 0; i < lenght; i++){
                var imgobj = {type:"image", url:""};
                p = pages[i];
                pp = parsedData.getPage(p);
                source = pp.source;
                if(source!==undefined && source!=='' && source!==' ' && source!==null){
                console.log('***** pp ******', source);  
                imgobj.url = source;
                options.tileSources.push(imgobj);
                }

            }
            // options.tileSources.push(imgobj2);
            // options.tileSources.push(imgobj1);
            //options.tileSources[1].url= "data/test-img/vb/VB_fol_105r_big.jpg";
            //parsedData.getPage('page1').source;
             return options;
         };
    
    
    
    
    });
    console.log("caricato modulo evtviewer.imageViewerService");
})();
/*
*/

