angular.module('evtviewer.dataHandler')

.service('evtBibliographyParser', function($q, parsedData, evtParser, xmlParser) {
	console.log('Bibliography Parser service running');
	var chicagoStyle=1;
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
					biblStringArray.push(parser.formatResult(chicagoStyle, newBiblElement));
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
			titleLevel:"",
			titleMonogr: '',
			editionMonogr: '',
			date: '',
			publisher: '',
			pubPlace: '',
			biblScope: {},
			note: {},
			idno: {}
		};
		var newAuthorElement = {
			name: '',
			surname : '',
			forename : ''
		};
		var currentDocument = angular.element(element);
		
		newBiblElement.id = currentDocument.attr('xml:id') ? currentDocument.attr('xml:id') : '';
        
        var analyticElem 			 = currentDocument.find(analyticDef.replace(/[<>]/g, '')+ ' title');
        newBiblElement.titleAnalytic = analyticElem && analyticElem.length > 0 ? analyticElem[0].textContent : '';

		angular.forEach(currentDocument.find('author'), function(el) {
			//gli autori possono avere più name/surname/forename
			var el=angular.element(el);
			var authorName = el.find('name');
			angular.forEach(authorName, function(el) {
				newAuthorElement.name = el.textContent;
			});

			var authorSurname = el.find('surname');
			angular.forEach(authorSurname, function(el) {
				newAuthorElement.surname = el.textContent;
			});
			
			var authorForename = el.find('forename');
			angular.forEach(authorForename, function(el) {
				newAuthorElement.forename = el.textContent;
			});
		newBiblElement.author.push(newAuthorElement);	
		});
		
		var monographElem = currentDocument.find(monographDef.replace(/[<>]/g, ''));
		//entriamo nel tag monogr
		if (monographElem) {
			monographElem = angular.element(monographElem);
			
			var monographTitles = monographElem.find('title');
			if(monographTitles && monographTitles.length > 0){
				newBiblElement.titleMonogr=monographTitles[0].textContent;
				var titleLevel = monographTitles[0].getAttribute("level");
				//recuperiamo il tipo di pubblicazione
				if(titleLevel != null)
					newBiblElement.titleLevel = titleLevel.substring(0,1);
			}

			var monographEditions = monographElem.find('edition');
			newBiblElement.editionMonogr = monographEditions && monographEditions.length > 0 ? monographEditions[0].textContent : '';
			
			//biblscope può stare dentro monogr ma anche dentro imprint
			angular.forEach(monographElem.find(biblScopeDef.replace(/[<>]/g, '')), function(el){
				//prendere attributo type o unit di ogni biblScope trovato
				angular.forEach(['type','unit'],function(attr){
					var attrValue = el.getAttribute(attr);
					if(attrValue != null){
						newBiblElement.biblScope[attrValue] = el.textContent;					
					}
				});	
			});
				
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
			if (styleCode === chicagoStyle) {
				//autore-data-titolo-titolo_monografia(se presente)-luogo pubblicazione-numero pagina
				//il primo autore deve essere citato con cognome-nome
				var firstAuthor = newBiblElement.author[0];
				//il nome lo prendiamo per mezzo del tag name o forename
				var firstName = firstAuthor.name != '' ? firstAuthor.name : firstAuthor.forename;
				var firstSurname = firstAuthor.surname;
				string += '<span class="author">' + firstSurname + '</span>';
				string += '<span class="author">' + firstName + '</span>';
			
				//se c'è più di un autore gli altri sono citati con nome-cognome	
				angular.forEach(newBiblElement.author, function(authorElement,key){
					//il primo autore lo abbiamo già sistemato prima, adesso (se ci sono) aggiungiamo gli altri
					if(key>0){
						var name = authorElement.name != '' ? authorElement.name : authorElement.forename;
						var surname = authorElement.surname;
						string += '<span class="author">' + name + '</span>';
						string += '<span class="author">' + surname + '</span>';
					}
				});
				
				if (newBiblElement.titleAnalytic !== '') {
					string += '<span class="titleAnalytic">' + newBiblElement.titleAnalytic + '</span>';
				}
				if (newBiblElement.titleMonogr !== '') {
					string += '<span class="titleMonogr">' + newBiblElement.titleMonogr + '</span>';
				}
				//se non è la prima edizione la segnaliamo
				if(newBiblElement.editionMonogr>1){
					string += '<span class="edition">' + newBiblElement.editionMonogr + '</span>';
				}			
				if (newBiblElement.pubPlace !== '') {
					string += '<span class="pubPlace">' + newBiblElement.pubPlace + '</span>';
				}
				if (newBiblElement.date !== '') {
					string += '<span class="date">' + newBiblElement.date + '</span>';
				}
				if (typeof newBiblElement.note !== 'undefined') {
					if (typeof newBiblElement.note.pp !== 'undefined') {
						string += '<span class="pp">' + newBiblElement.note.pp + '</span>';
					}
					//magari si chiama pages
					else if (typeof newBiblElement.note.pages !== 'undefined') {
						string += '<span class="pages">' + newBiblElement.note.pp + '</span>';
					}
				}
			}
		}
		return string;
	};
	
	return parser;
});