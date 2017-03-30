angular.module('evtviewer.bibliography')

.controller('BibliographyCtrl', function($scope, $element, $log, $attrs, parsedData, config, evtBibliographyParser, evtInterface, evtHighlight) {
	var _console = $log.getInstance('BibliographyCtrl');

	$scope.styles = config.allowedBibliographicStyles;
	$scope.selectedStyle = $scope.styles[0];

	$scope.sortBy = config.bibliographicEntriesSortBy;
	$scope.selectedSorting = $scope.sortBy[0];

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

	$scope.isEntryHighlighted = function(entry) {
		return (entry && evtHighlight.getHighlighted() === entry.id);
	};
	
	$scope.myComparator = function(bibl) {
		var result = '';
		//surname/name/forename sorting
		if ($scope.selectedSorting === $scope.sortBy[0]) {
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
		else {
			result = bibl.date;
		}
		return result;
	}
});