(function () {
   angular.module('evtviewer.tdhopService', ['evtviewer.dataHandler', '$log', 'evtviewer.interface'])

   .service('tdhopViewerModel', "$log", function($log, evtInterface){
       var tdhopModel = this;
       var options = {
         id: "tdhop",
         name: "Mesh_1_mesh",
         url: "data/models/singleres/cross.ply",
         mesh: "Mesh_1_mesh",

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
