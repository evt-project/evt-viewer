angular.module('evtviewer.tdhop')
   .directive('evtRune', ['evtRune', "evtInterface", "$timeout", function(evtRune, evtInterface, $timeout) {
	return {
		restrict: 'AE',
		scope: {
         canvas: '@',
         measurebox:'@',
         options: "=",
         name: "=",
      },
      controllerAs: "vm",
      controller: "runeCtrl",
      templateUrl: 'src/tdhop/rune.directive.tmpl.html',

      transclude: true,

		link: function(scope, element, attrs) {

      }
   };
}]);
