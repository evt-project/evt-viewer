angular.module('evtviewer.openseadragon')
     .provider('osd', function(){

               
        this.$get = function(parsedData, config) {
            var imageViewer = {};

            imageViewer.test = function(param){
                return (param)?true:true;
            }

            imageViewer.imgCoeff = function(){
                return config.imageNormalizationCoefficient;
            }

             imageViewer.build = function(name){
                 var options = config.imageViewerOptions;

                 var pages = parsedData.getPages();
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
                     }
     
                 }
                 options.id = "osd-img";
                 return options;

             }

            return imageViewer;

        };
    });
    
//     .service('imageViewerModel',function(parsedData){
//         var viewerModel = this;
        
//         console.log("caricato servizio  imageViewerService");
//         console.log("#!!# con parsedData #!!#", parsedData);
//         console.log("#!!# page di parsedData #!!#", parsedData.getPage('page1').source);
    
//         var options = {
//             id: "osd-img",
//             prefixUrl: "bower_components/openseadragon/built-openseadragon/openseadragon/images/",
//             //data/test-img/vb/VB_fol_104v_big.jpg
//             tileSources:[] , // immagine per rotulo Alba
//             //tileSources: "data/test-img/quamusdzi/QuamusImgManuscript.dzi", // immagine per Marocco
//             //overlays: [{
//             //    id: 'example-overlay',
//             //    x: 0.03,
//             //    y: 0.20,
//             //    width: 0.15,
//             //    height: 0.45,
//             //    className: 'nohighlight'
//             //}],            
//             /*tileSources: ["data/bellinidzi/4-26giugno1834a.dzi", // immagini per bellini
//                             "data/bellinidzi/4-26giugno1834b.dzi"],
            
//                             overlays: [{
//                                 id: 'example-overlay',
//                                 x: 0.26,
//                                 y: 0.39,
//                                 width: 0.22,
//                                 height: 0.27,
//                                 className: 'nohighlight'
//                             }], */
    
//             //sequenceMode: true,
//             //degrees:90,
//             //toolbar:"toolbar-div",
//             showRotationControl: true,                
//             showNavigator: true,
//             //navigatorId: "navscroll",
//             //visibilityRatio: 0.8,
//             visibilityRatio: 1, 
//             defaultZoomLevel: 0.7,
//             panHorizontal: true,
//             constrainDuringPan: true,
//             //minZoomLevel: 0.8,
//             minZoomLevel: 0.5,
//             maxZoomLevel: 2.0,
    
//             wrapVertical: false,
//             //navigatorPosition: "ABSOLUTE",
//             //navigatorTop: "0",
//             //navigatorLeft: "94%",
//             //navigatorHeight: "100%",
//             //navigatorWidth: "6%",
//             //navigatorTop:"1%",
//             //navigatorLeft:"94%",
//             //navigatorHeight:"95%",
//             //navigatorWidth:"6%"
//          };
//          // {id:"box_body_mainImage",prefixUrl:"images/",tileSources:"data/tails/scaled_70_verticale.dzi",showNavigator:!0,visibilityRatio:1,defaultZoomLevel:1,panHorizontal:!0,constrainDuringPan:!0,minZoomLevel:1,wrapVertical:!0,navigatorPosition:"ABSOLUTE",navigatorTop:"1%",navigatorLeft:"98%",navigatorHeight:"95%",navigatorWidth:"8%"}
    
//          viewerModel.getOptions = function(){

//             console.log("getOpt di   imageViewerService");
//             // data/test-img/vb/VB_fol_104v_big.jpg
//             // data/test-img/vb/VB_fol_105r_big.jpg
//             var imgobj1 = {type:"image", url:"data/test-img/vb/VB_fol_104v_big.jpg"};
//             var imgobj2 = {type:"image", url:"data/test-img/vb/VB_fol_105r_big.jpg"};
            
//             var pages = parsedData.getPages();
//             console.log('******pages*******: ', pages);
//             var lenght = pages.length;
//             console.log('lunghezza pagine: ', lenght);
//             var p;
//             var pp;
//             var source="";
//             for(var i = 0; i < lenght; i++){
//                 var imgobj = {type:"image", url:""};
//                 p = pages[i];
//                 pp = parsedData.getPage(p);
//                 source = pp.source;
//                 if(source!==undefined && source!=='' && source!==' ' && source!==null){
//                 console.log('***** pp ******', source);  
//                 imgobj.url = source;
//                 options.tileSources.push(imgobj);
//                 }

//             }
//             // options.tileSources.push(imgobj2);
//             // options.tileSources.push(imgobj1);
//             //options.tileSources[1].url= "data/test-img/vb/VB_fol_105r_big.jpg";
//             //parsedData.getPage('page1').source;
//              return options;
//          };
    
    
    
    
//     });
    
/*
*/

