angular.module('evtviewer.tdhop')
   .directive('tredhop', ['tredhop', "evtInterface", "$timeout", function(tredhop, evtInterface, $timeout) {
	return {
		restrict: 'AE',
		scope: {
         canvas: '@',
         measurebox:'@',
         options: "=",
         name: "=",
      },
      controllerAs: "vm",
      controller: "TreDHOPCtrl",
      templateUrl: 'src/tdhop/tdhop.directive.tmpl.html',

      transclude: true,
      //template: "<div id='tdhop' class='box-tdhop box-body Edition noBottomMenu'>",

		link: function(scope, element, attrs) {
         $timeout(function () {
         var start=0;
         var name="";
         var myurl="";
         var mdI="";
         var stMinD=0;
         var stMaxD=0;
         var stMinT=0;
         var stMaxT=0;
         var _PanX = 0.0;
         var ANNOTATIONDATA ={};
         var tipo_hs="Sphere";
         var url_hs="models/singleres/sphere.ply";
         var HOTSPOTSDATA ={};
         // Initialize tabs container
         var currentTdhop = tredhop.build(scope);

         // Garbage collection
         scope.$on('$destroy', function() {
             if (currentTdhop){
               tredhop.destroy(currentTdhop.currentId);
             }
         });
      }, 10);
      }
   };
}]);
