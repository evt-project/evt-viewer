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
		
	//osseriviamo evtHighlight.highlight, qui risiede l'id dell'entrata bibliografia	
	 $scope.$watch('highlight.highlight',function(newVal){
		 mentre nel template della bibliografia viene registrato l'attributo 'highlight' qui effettuiamo lo scrolling
		 $scope.scrollToElement(newVal);
	 });/*/
	/*/
	  $scope.scrollToElement = function(elementID){
		  $location.hash(elementID);
		  $anchorScroll();
	  }/*/
   });
