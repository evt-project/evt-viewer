var module = angular.module('evtviewer.tdhop', ["evtviewer.tdhop", "evtviewer.interface"]);

module.directive('tredhop', ['tredhop', "evtInterface", "$timeout", function(evtInterface, $ocLazyLoad, $timeout, tredhop) {
	return {
		restrict: 'AE',
		scope: {
         canvas: '@',
         measurebox:'@',
         options: "=",
         name: "=",
         presenter:"=",
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
      }, 10);
      }
   };
}]);
