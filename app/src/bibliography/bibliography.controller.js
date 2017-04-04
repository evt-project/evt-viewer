angular.module('evtviewer.bibliography')

.controller('BibliographyCtrl', function($scope, $element, $log, $attrs, parsedData, config, evtBibliographyParser, evtInterface, evtHighlight) {
    var _console = $log.getInstance('BibliographyCtrl');
	var vm = this;
    //recupero stili bibliografici
    vm.styles = config.allowedBibliographicStyles;
    vm.initialSelectedStyle = vm.styles.Chicago;

    //recupero i criteri di ordinamento (le label)
    vm.sortBy = config.bibliographicEntriesSortBy;
    vm.selectedSorting = vm.sortBy.Author;

    //recupero l'ordine per  l'ordinamento (le label)
    vm.sortOrder = config.bibliographySortOrder;
    vm.selectedSortOrder = vm.sortOrder.ASC;


    vm.biblRefsCollection = parsedData.getBibliographicRefsCollection();

    vm.getFormattedBibl = function(biblId) {
        var biblElement = parsedData.getBibliographicRefById(biblId);
        if (!biblElement.outputs[vm.initialSelectedStyle]) {
            evtBibliographyParser.formatResult(vm.initialSelectedStyle, biblElement);
        }
        return biblElement.outputs[vm.initialSelectedStyle];
    };
    vm.pubblicationType = function(biblId) {
        var biblElement = parsedData.getBibliographicRefById(biblId),
            type = evtBibliographyParser.getType(biblElement);
        type = type ? type : 'unknown';
        return type;
    };

    vm.isEntryHighlighted = function(entryId) {
        return (evtHighlight.getHighlighted() !== '' && evtHighlight.getHighlighted() === entryId);
    };

    vm.myComparator = function(biblId) {
        var result = '',
            biblElement = parsedData.getBibliographicRefById(biblId);
        //surname/name/forename sorting
        if (vm.selectedSorting === vm.sortBy.Author) {
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
        else if (vm.selectedSorting === vm.sortBy.Year) {
            result = biblElement.date;
        }
        return result;
    }
});