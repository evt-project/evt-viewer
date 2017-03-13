angular.module('evtviewer.bibliography')

   .controller('BibliographyCtrl', function($scope, $element, $log, $attrs, parsedData, config, evtBibliographyParser) {
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
      }
	  $scope.pubblicationType = function(BiblElement) {
		  return evtBibliographyParser.getType(BiblElement);
		  }
		  
	  $scope.myComparator = function(author1,author2) {
		//il sistema fa del suo meglio, ordina per cognome (se noto) oppure per nome  
		author1=author1.value;
		author2=author2.value;
		var el1,el2;
		if(author1 !== undefined){
			if (author1.surname !== '')el1=author1.surname;
			else if (author1.name !== '')el1=author1.name;
		}
		else{
			return 1;
		}
		if(author2 !== undefined){
			if (author2.surname !== '')el2=author2.surname;
			else if (author2.name !== '')el2=author2.name;
		}
		else{
			return -1;
		}
		return el1.localeCompare(el2);
	  };		  
   });
