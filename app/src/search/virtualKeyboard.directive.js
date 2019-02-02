angular.module('evtviewer.search')
   .directive('evtVirtualKeyboard', ['evtVirtualKeyboard', 'parsedData',  function(evtVirtualKeyboard, parsedData) {
      return {
         restrict: 'E',
         templateUrl: 'src/search/virtualKeyboard.directive.tmpl.html',
         replace: true,
         link: function(scope) {
            var glyphs = parsedData.getGlyphs();
            if(glyphs._indexes.length !== 0) {
               evtVirtualKeyboard.build(scope, scope.vm);
            }
         }
      };
   }]);
