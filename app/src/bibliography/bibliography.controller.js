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

/*     vm.myComparator = function(biblId) {
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
			else if (biblElement.plainText !== '') {
				result = biblElement.plainText;
			}
        }
        //year sorting
        else if (vm.selectedSorting === vm.sortBy.Year) {
            result = biblElement.date;
        }
		else if (vm.selectedSorting === vm.sortBy.Title) {
			result = biblElement.titleAnalytic !== '' ? biblElement.titleAnalytic : biblElement.titleMonogr;
		}
        return result;
    } */
	
	vm.getBibliographicRefById =function(biblId){
		return parsedData.getBibliographicRefById(biblId);;
	}
	
	vm.myComparator = function(biblId1,biblId2) {
        var result1 = result2 = '';
		//sorting by author
		if (vm.selectedSorting === vm.sortBy.Author) {
            if (typeof biblId1.value.author !== 'undefined' && biblId1.value.author.length > 0) {
                //first try to compare according to author's surname
                if (biblId1.value.author[0].surname !== '') {
                    result1 = biblId1.value.author[0].surname;
                }
            }	
			if (typeof biblId2.value.author !== 'undefined' && biblId2.value.author.length > 0) {
                //first try to compare according to author's surname
                if (biblId2.value.author[0].surname !== '') {
                    result2 = biblId2.value.author[0].surname;
                }
            }
			//if both doesn't have surname use name, so the remainig item without surnames will be sorted using it's name property
			if (result1 === '' && result2 === '' && 
			typeof biblId1.value.author !== 'undefined' && biblId1.value.author.length > 0 &&
			typeof biblId2.value.author !== 'undefined' && biblId2.value.author.length > 0) {
				result1 = biblId1.value.author[0].name;
				result2 = biblId2.value.author[0].name;
			}
		}
		//sorting by year
		else if (vm.selectedSorting === vm.sortBy.Year) {
			if (typeof biblId1.value.date !== 'undefined'){
                if (biblId1.value.date !== '') {
                    result1 = Number(biblId1.value.date);
                }
			}
			if (typeof biblId2.value.date !== 'undefined') {
                if (biblId2.value.date !== '') {
                    result2 = Number(biblId2.value.date);
                }
			}
        }	
		return result1.toString().localeCompare(result2.toString());
	}
	
	

});