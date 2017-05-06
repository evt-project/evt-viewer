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
		vm.initialSelectedStyle = '';
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
	if (!evtBibliographyParser.publisherInfoDetected()){
		delete vm.sortBy.Publisher;
	}
	
	if (Object.keys(vm.sortBy).length > 0) {
		//setting the first sorting entry (if existing)
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
		switch ( vm.selectedSorting ) {
			case vm.sortBy.Author:
				//sorting by author
				if (typeof biblId1.value.author !== 'undefined' && biblId1.value.author.length > 0) {
					//first try to compare according to author's name, then surname if provided
					result1 = biblId1.value.author[0].name !== '' ? biblId1.value.author[0].name : '';
					result1 = biblId1.value.author[0].surname !== '' ? biblId1.value.author[0].surname : result1;
				}
				if (typeof biblId2.value.author !== 'undefined' && biblId2.value.author.length > 0) {
					//first try to compare according to author's name, then surname if provided
					result2 = biblId2.value.author[0].name !== '' ? biblId2.value.author[0].name : '';
					result2 = biblId2.value.author[0].surname !== '' ? biblId2.value.author[0].surname : result2;
				}
				break;
			
			case vm.sortBy.Year :
				//sorting by year
				if (typeof biblId1.value.date !== 'undefined'){
					/*/If Number() returns Nan, whe must must be sure to assign empty string to result variable in order to 
					provide the same sorting logic, element with no information are at the top of the final list.
					Infact: "".localeCompare(...) => -1 /*/
					result1 = biblId1.value.date !== '' && Number(biblId1.value.date) ? Number(biblId1.value.date) : '';
					}
				if (typeof biblId2.value.date !== 'undefined') {
					result2 = biblId1.value.date !== '' && Number(biblId2.value.date) ? Number(biblId2.value.date) : '';
				}
				break;
				
			case vm.sortBy.Title :
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
			    break;
				
			case vm.sortBy.Publisher :
				if (typeof biblId1.value.publisher !== 'undefined') {
					result1 = biblId1.value.publisher !== '' ? biblId1.value.publisher : '';
				}
				if (typeof biblId2.value.publisher !== 'undefined') {
					result2 = biblId2.value.publisher !== '' ? biblId2.value.publisher : '';
				}			
				break;	
		}
		return result1.toString().localeCompare(result2.toString());
	}
	
	

});