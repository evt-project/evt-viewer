(function () {
   angular.module('evtviewer.tdhopService', ['evtviewer.dataHandler'])

   .service('tdhopViewerModel',function(){
       var tdhopModel = this;

       var options = {
         id: "tdhop",
         name: "Bewcastle",
         url: "data/3Dmodels/multires/bewcastle.nxz",
         mesh: "Bewcastle",

         toolHome: true,
         toolZoomin: true,
         toolZoomout: true,
         toolLighting: true,
         toolLightControl: true,
         toolMeasure: true,
         toolPickPoint: true,
         toolPlaneSections: true,
         toolSolidColor: true,
         toolCamera: true,
         toolFullScreen: true
        };

        tdhopModel.getOptions = function(){
            return options;
        };
    });
})();
