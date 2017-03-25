angular.module('evtviewer.bibliography')

   .controller('BibliographyCtrl', function($scope, $element, $log, $attrs, parsedData, config, evtBibliographyParser,evtInterface,evtHighlight) {
      var _console = $log.getInstance('BibliographyCtrl');

      $scope.styles = config.allowedBibliographicStyles;
      $scope.selectedStyle = $scope.styles[0];


      $scope.bibliographicRefsCollection = parsedData.getBibliographicRefsCollection();

      _console.log($scope.allowedBibliographicStyles);
      $scope.getFormattedBibl = function(BiblElement) {
         if (!BiblElement.outputs[$scope.selectedStyle]) {
            evtBibliographyParser.formatResult($scope.selectedStyle, BiblElement);
         }
         return BiblElement.outputs[$scope.selectedStyle];
      };
	  $scope.pubblicationType = function(BiblElement) {
		  return evtBibliographyParser.getType(BiblElement);
		  };	
		
	 $scope.highlight=evtHighlight;
   });
