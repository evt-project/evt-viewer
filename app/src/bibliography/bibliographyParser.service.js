angular.module('evtviewer.dataHandler')

.service('evtBibliographyParser', function($q, parsedData, evtParser, xmlParser,config) {
	console.log('Bibliography Parser service running');
	const CHICAGO_STYLE=1,APA_STYLE=2;
	var STYLE_SELECTED=1;

	
	
    var monographDef = '<monogr>',
		analyticDef  = '<analytic>',
		imprintDef 	 = '<imprint>',
		biblScopeDef = '<biblScope>',
		editorDef    = '<editor>',
		dateDef 	 = '<date>',
		noteDef 	 = '<note>',
		idnoDef 	 = '<idno>';
	
	// Tags in cui cercare info bibliografiche
    var bibliographyDef = ['<biblStruct>', '<bibl'];

	var parser = {};
	var harvestedBiblContainer = [];
    parser.parseBiblInfo = function(doc){
		var currentDocument = angular.element(doc);

		for (var c = 0; c < bibliographyDef.length; c++) {
			angular.forEach(currentDocument.find(bibliographyDef[c].replace(/[<>]/g, '')), 
				function(element) {
					var newBiblElement = parser.extractInfo(element);
					var currentID = getID(newBiblElement);
					harvestedBiblContainer.push(newBiblElement);
			});
		}

		parsedData.setBibliographicRefsCollection(harvestedBiblContainer);
        console.log('## parseBiblInfo ##', harvestedBiblContainer);
    };
	
	// Bibliographic data container
	parser.extractInfo = function(element) {
		var newBiblElement = {
			id: '',
			type : '',
			author: [],
			titleAnalytic: '',
			titleLevel:"",
			titleMonogr: '',
			editionMonogr: '',
			date: '',
			editor: '',
			publisher: '',
			pubPlace: '',
			biblScope: {},
			note: {},
			idno: {}
		};

		var currentDocument = angular.element(element);
		
		newBiblElement.id = currentDocument.attr('xml:id') ? currentDocument.attr('xml:id') : '';
        newBiblElement.type = currentDocument.attr('type') ? currentDocument.attr('type') : '';
		//cerchiamo l'editore dentro bibl/bilStruct
		var editorElem 			 = currentDocument.find(editorDef.replace(/[<>]/g, ''));
        newBiblElement.editor = editorElem && editorElem.length > 0 ? editorElem[0].textContent : '';
        var analyticElem 			 = currentDocument.find(analyticDef.replace(/[<>]/g, '')+ ' title');
        newBiblElement.titleAnalytic = analyticElem && analyticElem.length > 0 ? analyticElem[0].textContent : '';

		angular.forEach(currentDocument.find('author'), function(el) {
			var newAuthorElement = {
			name: '',
			surname : '',
			forename : ''
			};
		
			var el=angular.element(el);
			var authorName = el.find('name');
			angular.forEach(authorName, function(element) {
				newAuthorElement.name = element.textContent;
			});

			var authorSurname = el.find('surname');
			angular.forEach(authorSurname, function(element) {
				newAuthorElement.surname = element.textContent;
			});
			
			var authorForename = el.find('forename');
			angular.forEach(authorForename, function(element) {
				newAuthorElement.forename = element.textContent;
			});
			//nel caso il nome sia dentro <author> o nel caso dentro <author> ci sia un <persName> con solo testo
			if (authorName.length == 0 && authorForename.length == 0 && authorSurname.length == 0){
				newAuthorElement.name = el[0].textContent;
			}
		newBiblElement.author.push(newAuthorElement);	
		});
		//cerchiamo la data dentro <bibl> o <biblStruct>, poi verrà cercata anche dentro <imprint>
		angular.forEach(currentDocument.children(),function(el){
			if (el.tagName == 'date'){
				newBiblElement.date = el.innerHTML;
			}
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
			
			var monographEditor = monographElem.find(editorDef.replace(/[<>]/g, ''));
			//magari l'editore lo abbiamo già estratto dento bibl/biblStruct, se no lo prendiamo dentro <monogr>
			if(newBiblElement.editor != ''){
				newBiblElement.editor = monographEditions && monographEditions.length > 0 ? monographEditions[0].textContent : '';
			}
			var monographEditions = monographElem.find('edition');
			newBiblElement.editionMonogr = monographEditions && monographEditions.length > 0 ? monographEditions[0].firstChild.textContent : '';
			var date = monographEditions.find("date");
			newBiblElement.date = date && date.length > 0 ? date[0].textContent : newBiblElement.date;
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
				/*/qua newBiblElement.date contiene già o la data estratta dentro <edition> (che può contenere <date>
				oppure contiene '', possiamo quindi riassegnare newBiblElement.date a se stesso senza problemi.
				Se è disponibile una data dentro <imprint> prendiamo quella altrimenti la prendiamo dentro <edition>.
				Magari la troviamo anche subito dentro <bibl>/*/
				newBiblElement.date = imprintsDates && imprintsDates.length > 0 ? imprintsDates[0].textContent : newBiblElement.date;
				
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

	
	
/*/	
	/*/
	//Format result
	/*/
	parser.formatResult = function(styleCode, newBiblElement) {
		var string = '';
		if (newBiblElement) {
			//presentiamo i risultati estratti, in teoria in base a un codice scegliamo l'otput desiderato
			if (styleCode === CHICAGO_STYLE) {
				//autore-data-titolo-titolo_monografia(se presente)- edizione-luogo pubblicazione-data-numero pagina-idno(se dati)
				//il primo autore deve essere citato con cognome-nome
				if(newBiblElement.author && newBiblElement.author.length > 0){
					var firstAuthor = newBiblElement.author[0];
					//il nome lo prendiamo per mezzo del tag name o forename
					var firstName = firstAuthor.name != '' ? firstAuthor.name : firstAuthor.forename;
					var firstSurname = firstAuthor.surname;
					string += '<span data-style="chicago" class="author">';
					if (firstName != ''){
						string += '<span data-style="chicago" class="name">' + firstName + '</span>';
					}
					if(firstSurname != ''){
						string += '<span data-style="chicago" class="surname">' + firstSurname + '</span>';	
					}						
				}
					string += '</span>';
					//se c'è più di un autore gli altri sono citati con nome-cognome	
					angular.forEach(newBiblElement.author, function(authorElement,key){
						//il primo autore lo abbiamo già sistemato prima, adesso (se ci sono) aggiungiamo gli altri
						if(key>0){
							var name = authorElement.name != '' ? authorElement.name : authorElement.forename;
							var surname = authorElement.surname;
							string += '<span data-style="chicago" class="author">';
							if (name != ''){
								string += '<span data-style="chicago" class="name">' + name + '</span>';
							}
							if(surname != ''){
								string += '<span data-style="chicago" class="surname">' + surname + '</span>';
							}
							string += '</span>';
						}
					});		
				if(getPubblicationType(newBiblElement).toLowerCase() == 'journalarticle' ){
					if (getTitleAnalytic(newBiblElement)) {
						string += '<span data-style="chicago" class="titleAnalytic">' + getTitleAnalytic(newBiblElement) + '</span>';
					}
					if (getTitleMonogr(newBiblElement)) {
						if (getTitleAnalytic(newBiblElement)) {
							string += '<span class data-style="chicago">in</span><span data-style="chicago" class="titleMonogr">' + getTitleMonogr(newBiblElement) + '</span>';
						}
						else {
							string += '<span data-style="chicago" class="titleMonogr">' + getTitleMonogr(newBiblElement) + '</span>';
						}
					}	
					if (getVolumes(newBiblElement)){
						string += '<span data-style="chicago" class="vol">' + getVolumes(newBiblElement) + '</span>';	
					}				
					if (getDate(newBiblElement)) {
						string += '<span data-style="chicago" class="date">' + getDate(newBiblElement) + '</span>';
					}
					if (getPages(newBiblElement)) {
						string += '<span data-style="chicago" class="pp">' + getPages(newBiblElement) + '</span>';
					}	
					angular.forEach(newBiblElement.idno,function(el,key){
						if(key === 'DOI'){
							string += '<span data-style="chicago" class="idno" data-type="'+key+'">' + el.textContent + '</span>';
						}
					});
				}
				else{
				//else if(getPubblicationType(newBiblElement).toLowerCase() == 'monograph' ){
					if (getTitleAnalytic(newBiblElement)) {
						string += '<span data-style="chicago" data-attr="titolo" class="titleAnalytic">' + getTitleAnalytic(newBiblElement) + '.</span>';
					}
					if (getTitleMonogr(newBiblElement)) {
						string += '<span data-style="chicago" data-attr="titolo" class="titleMonogr">' + getTitleMonogr(newBiblElement) + '.</span>';
					}
					if (getVolumes(newBiblElement)){
						string += '<span data-style="chicago" class="vol">' + getVolumes(newBiblElement) + '</span>';	
					}	
					if (getPubPlace(newBiblElement)){
						string += '<span data-style="chicago" class="pubPlace">' + getPubPlace(newBiblElement) + '</span>';	
					}	
					if (getEditor(newBiblElement)) {
						string += '<span data-style="chicago" class="editor">' + getEditor(newBiblElement) + '</span>';
					}
					if (getUrl(newBiblElement)){
						string += '<span data-style="chicago" class="url">' + getUrl(newBiblElement) + '</span>';	
					}						
					angular.forEach(newBiblElement.idno,function(el,key){
						if(key == 'ISSN'){
							string += '<span data-style="chicago" class="idno" data-type="'+key+'">' + el.textContent + '</span>';
						}
					});
				}
			}	
				
			/*/
			//Altro stile
			/*/
			else if(styleCode == APA_STYLE){
				if(newBiblElement.author && newBiblElement.author.length > 0){
					var firstAuthor = newBiblElement.author[0];
					var firstName = firstAuthor.name != '' ? firstAuthor.name : firstAuthor.forename;
					var firstSurname = firstAuthor.surname;
					string += '<span data-style="apa" class="author">';
					if (firstSurname != ''){
						string += '<span data-style="apa" class="surname">' + firstSurname + '</span>';
					}
					if(firstName != ''){
						string += '<span data-style="apa" class="name">' + firstName + '</span>';		
					}
					string += '</span>';
					angular.forEach(newBiblElement.author, function(authorElement,key){
						//il primo autore lo abbiamo già sistemato prima, adesso (se ci sono) aggiungiamo gli altri
						if(key>0){
							var surname = authorElement.surname != '' ? authorElement.surname : authorElement.name;
							if (surname != ''){
								string += '<span data-style="apa" class="author">' + surname + '</span>';
							}							
						}
					});		
				}
				if (getDate(newBiblElement)) {
					string += '<span data-style="apa" class="date">' + getDate(newBiblElement) + '</span>';
				}	
				
				if (getTitleAnalytic(newBiblElement)) {
					string += '<span data-style="apa" data-attr="titolo" class="titleAnalytic">' + getTitleAnalytic(newBiblElement) + '</span>';
				}
				//se non c'è il titolo dentro analytic allora prendiamo quello dentro monogr, entrambi no
				if (getTitleMonogr(newBiblElement) && !getTitleAnalytic(newBiblElement)) {
					string += '<span data-style="apa" data-attr="titolo" class="titleMonogr">' + getTitleMonogr(newBiblElement) + '</span>';
				}
				
				if(getVolumes(newBiblElement)){
					var vol=getVolumes(newBiblElement);
					if(getIssue(newBiblElement)){
						var issue=getVolumes(newBiblElement);
						string+='<span data-style="apa" class="vol">'+vol+'('+issue+')</span>';
					}
					else{
						string+='<span data-style="apa" class="vol">'+vol+'</span>'
					}
				}
				
				if (getPages(newBiblElement)) {
					string += '<span data-style="apa" class="pp">' + getPages(newBiblElement) + '</span>';
				}
				
				if (getAccessed(newBiblElement)){
					string += '<span data-style="apa" class="accessed">' + getAccessed(newBiblElement) + '</span>';
				}
				
				if (getUrl(newBiblElement)){
					string += '<span data-style="apa" class="url">' + getUrl(newBiblElement) + '</span>';
				}
			}				
		}	
	return string;
	}/*/
return parser;
});