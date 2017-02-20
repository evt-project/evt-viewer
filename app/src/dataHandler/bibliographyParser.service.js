angular.module('evtviewer.dataHandler')

.service('evtBibliographyParser', function($q, parsedData, evtParser, xmlParser) {
	console.log('Bibliography Parser service running');

	// Bibliographic data container
	var harvestedBiblContainer = [];
	
    var monographDef = '<monogr>',
		analyticDef  = '<analytic>',
		imprintDef 	 = '<imprint>',
		biblScopeDef = '<biblScope>',
		dateDef 	 = '<date>',
		noteDef 	 = '<note>',
		idnoDef 	 = '<idno>';
	
	// Tags in cui cercare info bibliografiche
    var bibliographyDef = ['<biblStruct>', '<bibl'];

	var parser = {};

    parser.parseBiblInfo = function(doc){
		var bibliographyContent = [],
        	currentDocument = angular.element(doc),
			biblStringArray = [];

		for (var c = 0; c < bibliographyDef.length; c++) {
			angular.forEach(currentDocument.find(bibliographyDef[c].replace(/[<>]/g, '')), 
				function(element) {
					var newBiblElement = parser.extractInfo(element);
					harvestedBiblContainer.push(newBiblElement);
					biblStringArray.push(parser.formatResult(1, newBiblElement));
			});
		}
		var string = '';
		for (var k = 0; k < biblStringArray.length; k++) {
			string += '<li class="biblRef">' + biblStringArray[k] + '</li>';
		}
		
		string = '<ul>' + string + '</ul>';

		parsedData.updateProjectInfoContent(string, 'bibliography');
        console.log('## parseBiblInfo ##', harvestedBiblContainer);
    };
	
	
	parser.extractInfo = function(element) {
		var newBiblElement = {
			id: '',
			author: [],
			titleAnalytic: '',
			titleMonogr: '',
			editionMonogr: '',
			date: '',
			publisher: '',
			pubPlace: '',
			biblScope: {},
			note: {},
			idno: {}
		};
		
		var currentDocument = angular.element(element);
		
		newBiblElement.id = currentDocument.attr('xml:id') ? currentDocument.attr('xml:id') : '';
        
        var analyticElem 			 = currentDocument.find(analyticDef.replace(/[<>]/g, '')+ ' title');
        newBiblElement.titleAnalytic = analyticElem && analyticElem.length > 0 ? analyticElem[0].textContent : '';
		
		angular.forEach(currentDocument.find('author surname'), function(el) {
			newBiblElement.author.push(el.textContent);
		});

		var monographElem = currentDocument.find(monographDef.replace(/[<>]/g, ''));
		//entriamo nel tag monogr
		if (monographElem) {
			monographElem = angular.element(monographElem);
			
			var monographTitles        = monographElem.find('title');
			newBiblElement.titleMonogr = monographTitles && monographTitles.length > 0 ? monographTitles[0].textContent : '';
			
			var monographEditions = monographElem.find('edition');
			newBiblElement.editionMonogr = monographEditions && monographEditions.length > 0 ? monographEditions[0].textContent : '';
			
			//entriamo dentro imprint che è dentro monogr
			var monographImprints = angular.element(monographElem.find(imprintDef.replace(/[<>]/g, '')));
			if (monographImprints && monographImprints.length > 0) {
				var monographImprint = angular.element(monographImprints[0]);
				//dentro imprint salviamo i biblScope
				angular.forEach(monographImprint.find(biblScopeDef.replace(/[<>]/g, '')), function(el){
					//prendere attributo type
					newBiblElement.biblScope[el.getAttribute('type')] = el.textContent;
				});
				
				//salviamo la data dentro monogr
				var imprintsDates   = monographImprints.find('date');
				newBiblElement.date = imprintsDates && imprintsDates.length > 0 ? imprintsDates[0].textContent : '';
				
				var imprintsPublishers   = monographImprints.find('publisher');
				newBiblElement.publisher = imprintsPublishers && imprintsPublishers.length > 0 ? imprintsPublishers[0].textContent : '';
				
				var imprintsPubPlaces   = monographImprints.find('pubPlace');
				newBiblElement.pubPlace = imprintsPubPlaces && imprintsPubPlaces.length > 0 ? imprintsPubPlaces[0].textContent : '';				
				
				angular.forEach(monographImprints.find('note'), function(el){
					//salviamo le note dentro imprint che è dentro monogr
					newBiblElement.note[el.getAttribute('type')] = el.textContent;
				});
			}
		}

		angular.forEach(currentDocument.find(idnoDef.replace(/[<>]/g, '')), function(el){
			//prendere attributo type
			newBiblElement.idno[el.getAttribute('type')] = el;
		});

		return newBiblElement;
	}
	
	parser.formatResult = function(styleCode, newBiblElement) {
		var string = '';
		if (newBiblElement) {
			//presentiamo i risultati estratti, in teoria in base a un codice scegliamo l'otput desiderato
			if (styleCode === 0) {
				//tutti i dati raccolti sono presentati
				angular.forEach(newBiblElement.author, function(el){
					string += '<span class="author">' + el + ', </span>'; 
				});
				if (newBiblElement.date !== '') {
					string += '<span class="date">' + newBiblElement.date + ', </span>';
				}
				if (newBiblElement.publisher !== '') {
					string += '<span class="publisher">' + newBiblElement.publisher + ', </span>';
				}
				if (newBiblElement.pubPlace !== '') {
					string += '<span class="pubPlace">' + newBiblElement.pubPlace + ', </span>';
				}
				if (newBiblElement.titleMonogr !== '') {
					string += '<span class="titleMonogr">' + newBiblElement.titleMonogr + ', </span>';
				}
				if (newBiblElement.titleAnalytic !== '') {
					string += '<span class="titleAnalytic">' + newBiblElement.titleAnalytic + ', </span>';
				}
				if (newBiblElement.editionMonogr !== '') {
					string += '<span class="editionMonogr">' + newBiblElement.titleMonogr + ', </span>';
				}

				angular.forEach(newBiblElement.biblScope, function(el){
					string += '<span class="biblScope">' + el + ', </span>';
				});

				if (typeof newBiblElement.note !== 'undefined') {
					if (typeof newBiblElement.note.pp !== 'undefined') {
						string += '<span class="pp">' + newBiblElement.note.pp + '</span>';
					}
					if (typeof newBiblElement.note.vol !== 'undefined') {
						string += '<span class="vol">' + newBiblElement.note.vol + '</span>';
					}
				}
			} else if (styleCode === 1) {
				//autore-data-titolo-titolo_monografia(se presente)-luogo pubblicazione-numero pagina
				angular.forEach(newBiblElement.author, function(el){
					string += '<span class="author">' + el + ', </span>';
				});

				if (newBiblElement.date !== '') {
					string += '<span class="date">' + newBiblElement.date + ', </span>';
				}
				if (newBiblElement.titleAnalytic !== '') {
					string += '<span class="titleAnalytic">' + newBiblElement.titleAnalytic + ', </span>';
				}
				if (newBiblElement.titleMonogr !== '') {
					string += '<span class="titleMonogr">' + newBiblElement.titleMonogr + ', </span>';
				}
				if (newBiblElement.pubPlace !== '') {
					string += '<span class="pubPlace">' + newBiblElement.pubPlace + ', </span>';
				}
				if (typeof newBiblElement.note !== 'undefined') {
					if (typeof newBiblElement.note.pp !== 'undefined') {
						string += '<span class="pp">' + newBiblElement.note.pp + ', </span>';
					}
				}
			}
		}
		// in fondo togliamo la virgola che puo essere di troppo
		if (typeof string !== 'undefined') {
			var n = string.lastIndexOf(',');
			string = string.substr(0, n) + '</span>';
		}
		return string;
	};
	
	return parser;
});