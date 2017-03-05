angular.module('evtviewer.bibliography')

   .controller('BibliographyCtrl', function($scope, $element, $log, $attrs, parsedData, config, evtBibliographyParser) {
      var _console = $log.getInstance('BibliographyCtrl');

      $scope.styles = config.allowedBibliographicStyles;
      $scope.selectedStyle = $scope.styles[0];

      $scope.string = [];
      $scope.bibliographicRefsCollection = parsedData.getBibliographicRefsCollection();

      _console.log($scope.allowedBibliographicStyles);
      $scope.getFormattedBibl = function(BiblElement) {
         if (!BiblElement.outputs[$scope.selectedStyle]) {
            evtBibliographyParser.formatResult($scope.selectedStyle, BiblElement);
         }
         return BiblElement.outputs[$scope.selectedStyle];
      }
   });
