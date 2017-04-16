angular.module('evtviewer.bibliography')

.controller('BibliographyCtrl', function($scope, $element, $log, $attrs, parsedData, config, evtBibliographyParser, evtInterface, evtHighlight) {
    var _console = $log.getInstance('BibliographyCtrl');
	var vm = this;
	vm.biblSortSelectVisibility = true;
	vm.biblSortStyleSelectVisibility = true;
	vm.biblSortOrderSelectVisibility = true;
	
    //recupero stili bibliografici
    vm.styles = config.allowedBibliographicStyles;
    vm.initialSelectedStyle = vm.styles.Chicago;
	//controlliamo quali info possiamo usare, in base a quelli mostriamo/nascondiamo elementi
	if(!evtBibliographyParser.bibliographicStyleInfoDetected()){
		vm.biblSortStyleSelectVisibility = false;
	}
	
    //recupero i criteri di ordinamento (le label)
    vm.sortBy = config.bibliographicEntriesSortBy;
	//controlliamo quali info possiamo usare, in base a quelli mostriamo/nascondiamo elementi
	if (!evtBibliographyParser.authorInfoDetected()){
		delete vm.sortBy.Author;
	}
	if (!evtBibliographyParser.yearInfoDetected()){
		delete vm.sortBy.Year;
	}
	if (!evtBibliographyParser.titleInfoDetected()){
		delete vm.sortBy.Title;
	}	
	if (Object.keys(vm.sortBy).length > 0) {
		var firstKey;
		if(typeof vm.sortBy.Author !== 'undefined'){
			firstKey = vm.sortBy.Author;
		}
		else {
			firstKey = Object.keys(vm.sortBy)[0];
		}
		vm.selectedSorting = vm.sortBy[firstKey];
	}
	else {
		vm.biblSortSelectVisibility = false;
	}

    //recupero l'ordine per  l'ordinamento (le label)
    vm.sortOrder = config.bibliographySortOrder;
    vm.selectedSortOrder = vm.sortOrder.ASC;
	//se le select per stile/ordinamento sono nascoste, nascondiamo anche quella per il reverse sorting
	if (!vm.biblSortSelectVisibility){
		vm.biblSortOrderSelectVisibility = false;
	}
	
	//recupero collezione bibliografica
    vm.biblRefsCollection = parsedData.getBibliographicRefsCollection();

    vm.getFormattedBibl = function(biblId) {
        var biblElement = vm.getBibliographicRefById(biblId);
        if (!biblElement.outputs[vm.initialSelectedStyle]) {
            evtBibliographyParser.formatResult(vm.initialSelectedStyle, biblElement);
        }
        return biblElement.outputs[vm.initialSelectedStyle];
    };
    vm.pubblicationType = function(biblId) {
        var biblElement = vm.getBibliographicRefById(biblId),
            type = evtBibliographyParser.getType(biblElement);
        type = type ? type : 'unknown';
        return type;
    };

    vm.isEntryHighlighted = function(entryId) {
        return (evtHighlight.getHighlighted() !== '' && evtHighlight.getHighlighted() === entryId);
    };
	
	vm.getBibliographicRefById =function(biblId){
		return parsedData.getBibliographicRefById(biblId);;
	}
	
	vm.myComparator = function(biblId1,biblId2) {
        var result1 = result2 = '';
		//sorting by author
		if (vm.selectedSorting === vm.sortBy.Author) {
            if (typeof biblId1.value.author !== 'undefined' && biblId1.value.author.length > 0) {
                //first try to compare according to author's name, then surname if provided
				result1 = biblId1.value.author[0].name !== '' ? biblId1.value.author[0].name : '';
                result1 = biblId1.value.author[0].surname !== '' ? biblId1.value.author[0].surname : result1;
            }
			if (typeof biblId2.value.author !== 'undefined' && biblId2.value.author.length > 0) {
                //first try to compare according to author's surname
				result2 = biblId2.value.author[0].name !== '' ? biblId2.value.author[0].name : '';
                result2 = biblId2.value.author[0].surname !== '' ? biblId2.value.author[0].surname : result2;
            }
		}
		//sorting by year
		else if (vm.selectedSorting === vm.sortBy.Year) {
			if (typeof biblId1.value.date !== 'undefined'){
                    result1 = biblId1.value.date !== '' ? Number(biblId1.value.date) : '';
                }
			if (typeof biblId2.value.date !== 'undefined') {
				result2 = biblId1.value.date !== '' ? Number(biblId2.value.date) : '';
			}
        }	
		else if (vm.selectedSorting === vm.sortBy.Title) {
			//sorting by analytic title or normale title 
            if (typeof biblId1.value.titleAnalytic !== 'undefined') {
                result1 = biblId1.value.titleAnalytic !== '' && result1 === '' ? biblId1.value.titleAnalytic : '';
            }
			if (typeof biblId1.value.titleMonogr !== 'undefined') {
                result1 = biblId1.value.titleMonogr !== '' && result1 === '' ? biblId1.value.titleMonogr : '';
			}
			if (typeof biblId2.value.titleAnalytic !== 'undefined') {
                result2 = biblId2.value.titleAnalytic !== '' && result2 === '' ? biblId2.value.titleAnalytic : '';
            }
			if (typeof biblId2.value.titleMonogr !== 'undefined') {
                result2 = biblId2.value.titleMonogr !== '' && result2 === '' ? biblId2.value.titleMonogr : '';
            }
		}
		return result1.toString().localeCompare(result2.toString());
	}
	
	

});