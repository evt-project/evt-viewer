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


    $scope.biblRefsCollection = parsedData.getBibliographicRefsCollection();

    $scope.getFormattedBibl = function(biblId) {
        var biblElement = parsedData.getBibliographicRefById(biblId);
        if (!biblElement.outputs[$scope.initialSelectedStyle]) {
            evtBibliographyParser.formatResult($scope.initialSelectedStyle, biblElement);
        }
        return biblElement.outputs[$scope.initialSelectedStyle];
    };
    $scope.pubblicationType = function(biblId) {
        var biblElement = parsedData.getBibliographicRefById(biblId),
            type = evtBibliographyParser.getType(biblElement);
        type = type ? type : 'unknown';
        return type;
    };

    $scope.isEntryHighlighted = function(entryId) {
        return (evtHighlight.getHighlighted() !== '' && evtHighlight.getHighlighted() === entryId);
    };

    $scope.myComparator = function(biblId) {
        var result = '',
            biblElement = parsedData.getBibliographicRefById(biblId);
        //surname/name/forename sorting
        if ($scope.selectedSorting === $scope.sortBy.Author) {
            //check if author exist
            if (typeof biblElement.author !== 'undefined' && biblElement.author.length > 0) {
                //first try to compare according to author's surname
                if (biblElement.author[0].surname !== '') {
                    result = biblElement.author[0].surname;
                }
                //try to compare according to author's name
                else if (biblElement.author[0].name !== '') {
                    result = biblElement.author[0].name;
                }
                // try to compare according to author's forename
                else if (biblElement.author[0].forename !== '') {
                    result = biblElement.author[0].forename;
                }
            }
        }
        //year sorting
        else if ($scope.selectedSorting === $scope.sortBy.Year) {
            result = biblElement.date;
        }
        return result;
    }
});