angular.module('evtviewer.bibliography')

.controller('BibliographyCtrl', function($scope, $element, $log, $attrs, parsedData, config, evtBibliographyParser, evtInterface, evtHighlight) {
	var _console = $log.getInstance('BibliographyCtrl');
	//recupero stili bibliografici
	$scope.styles = config.allowedBibliographicStyles;
	$scope.initialSelectedStyle = $scope.styles.Chicago;
	
	//recupero i criteri di ordinamento (le label)
	$scope.sortBy = config.bibliographicEntriesSortBy;
	$scope.selectedSorting = $scope.sortBy.Author;
	
	//recupero l'ordine per  l'ordinamento (le label)
	$scope.sortOrder = config.bibliographySortOrder;
	$scope.selectedSortOrder = $scope.sortOrder.ASC;
	
	
	$scope.bibliographicRefsCollection = parsedData.getBibliographicRefsCollection();

	_console.log($scope.styles);
	$scope.getFormattedBibl = function(BiblElement) {
		if (!BiblElement.outputs[$scope.initialSelectedStyle]) {
			evtBibliographyParser.formatResult($scope.initialSelectedStyle, BiblElement);
		}
		return BiblElement.outputs[$scope.initialSelectedStyle];
	};
	$scope.pubblicationType = function(BiblElement) {
		return evtBibliographyParser.getType(BiblElement);
	};

	$scope.isEntryHighlighted = function(entry) {
		return (entry && evtHighlight.getHighlighted()!== '' && evtHighlight.getHighlighted() === entry.id);
	};
	
	$scope.myComparator = function(bibl) {
		var result = '';
		//surname/name/forename sorting
		if ($scope.selectedSorting === $scope.sortBy.Author) {
			//check if author exist
			if (typeof bibl.author !== 'undefined' && bibl.author.length > 0){
				//first try to compare according to author's surname
				if (bibl.author[0].surname !== ''){
					result = bibl.author[0].surname;
				}
				//try to compare according to author's name
				else if (bibl.author[0].name !== '') {
					result = bibl.author[0].name;
				}
				// try to compare according to author's forename
				else if (bibl.author[0].forename !== '') {
					result = bibl.author[0].forename;
				}				
			}
		}
		//year sorting
		else if ($scope.selectedSorting === $scope.sortBy.Year){
			result = bibl.date;
		}
		return result;
	}
});