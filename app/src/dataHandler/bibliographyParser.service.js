angular.module('evtviewer.dataHandler')

.service('evtBibliographyParser', function($q, parsedData, evtParser, xmlParser, config) {
	console.log('Bibliography Parser service running');
	const CHICAGO_STYLE = 'Chicago', APA_STYLE = 'APA', MLA_STYLE ='MLA';
	var STYLE_SELECTED = CHICAGO_STYLE;

	var monographDef = '<monogr>',
	analyticDef = '<analytic>',
	imprintDef = '<imprint>',
	seriesDef  = '<series>',
	biblScopeDef = '<biblScope>',
	editorDef = '<editor>',
	dateDef = '<date>',
	noteDef = '<note>',
	idnoDef = '<idno>';

	// Tags in cui cercare info bibliografiche
	var bibliographyDef = ['<biblStruct>', '<bibl'];

	var parser = {};
	var harvestedBiblContainer = [];

	parser.parseBiblInfo = function(doc) {
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
		type: '',
		author: [],
		titleAnalytic: '',
		titleLevel: '',
		titleMonogr: '',
		editionMonogr: '',
		date: '',
		editor: [],
		publisher: '',
		pubPlace: '',
		biblScope: {},
		note: {},
		idno: {},
		outputs: {}
				};
		var currentDocument = angular.element(element);

		newBiblElement.id = currentDocument.attr('xml:id') ? currentDocument.attr('xml:id') : '';
		newBiblElement.type = currentDocument.attr('type') ? currentDocument.attr('type') : '';

		var analyticElem = currentDocument.find(analyticDef.replace(/[<>]/g, '') + ' title');
		newBiblElement.titleAnalytic = analyticElem && analyticElem.length > 0 ? analyticElem[0].textContent : '';
		
		for(var c=0; newBiblElement.type === '' && analyticElem && c<analyticElem.length; c++){
			newBiblElement.type = analyticElem[0].getAttribute('level') ? analyticElem[0].getAttribute('level') : '';
		}
		angular.forEach(currentDocument.find('author'), function(el) {
			var newAuthorElement = {
				name: '',
				surname: '',
				forename: ''
			};

			var el = angular.element(el);
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
			if (authorName.length === 0 && authorForename.length === 0 && authorSurname.length === 0) {
				newAuthorElement.name = el[0].textContent;
			}
			newBiblElement.author.push(newAuthorElement);
		});

		angular.forEach(currentDocument.find(editorDef.replace(/[<>]/g, '')), function(el) {
			var newAuthorElement = {
				name: '',
				surname: '',
				forename: ''
			};

			var el = angular.element(el);
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
			if (authorName.length === 0 && authorForename.length === 0 && authorSurname.length === 0) {
				newAuthorElement.name = el[0].textContent;
			}
			newBiblElement.editor.push(newAuthorElement);
		});		
		//cerchiamo la data dentro <bibl> o <biblStruct>, poi verrà cercata anche dentro <imprint>
		angular.forEach(currentDocument.children(), function(el) {
			if (el.tagName === 'date') {
				newBiblElement.date = el.innerHTML;
			}
		});

		var monographElem = currentDocument.find(monographDef.replace(/[<>]/g, ''));
		//entriamo nel tag monogr
		if (monographElem) {
			monographElem = angular.element(monographElem);

			var monographTitles = monographElem.find('title');
			if (monographTitles && monographTitles.length > 0) {
				newBiblElement.titleMonogr = monographTitles[0].textContent;
				var titleLevel = monographTitles[0].getAttribute("level");
				//recuperiamo il tipo di pubblicazione
				if (titleLevel !== null){
					newBiblElement.titleLevel = titleLevel.substring(0, 1);
				}
				for(var c=0; c<monographTitles.length && newBiblElement.type === '';c++){
					var titleLevel = monographTitles[0].getAttribute("level");
					//recuperiamo il tipo di pubblicazione
					if (titleLevel !== null){
						newBiblElement.type = analyticElem.length == 0 && newBiblElement.type === '' ? titleLevel.substring(0, 1) : '';
					}					
				}
			}

			var monographEditor = monographElem.find(editorDef.replace(/[<>]/g, ''));
			var monographEditions = monographElem.find('edition');
			newBiblElement.editionMonogr = monographEditions && monographEditions.length > 0 ? monographEditions[0].firstChild.textContent : '';
			var date = monographEditions.find("date");
			//magari la data è già stata presa dentro <bibl>
			if (newBiblElement.date === ''){
				newBiblElement.date = date && date.length > 0 ? date[0].textContent : '';
			}
			//biblscope può stare dentro monogr ma anche dentro imprint
			angular.forEach(monographElem.find(biblScopeDef.replace(/[<>]/g, '')), function(el) {
				//prendere attributo type o unit di ogni biblScope trovato
				angular.forEach(['type', 'unit'], function(attr) {
					var attrValue = el.getAttribute(attr);
					if (attrValue !== null) {
						newBiblElement.biblScope[attrValue] = el.textContent;
					}
				});
			});

			//entriamo dentro imprint che è dentro monogr
			var monographImprints = angular.element(monographElem.find(imprintDef.replace(/[<>]/g, '')));
			if (monographImprints && monographImprints.length > 0) {
				var monographImprint = angular.element(monographImprints[0]);
				//dentro imprint salviamo i biblScope
				angular.forEach(monographImprint.find(biblScopeDef.replace(/[<>]/g, '')), function(el) {
					//prendere attributo type
					newBiblElement.biblScope[el.getAttribute('type')] = el.textContent;
				});

				//salviamo la data dentro monogr
				var imprintsDates = monographImprints.find('date');
				/*/qua newBiblElement.date contiene già o la data estratta dentro <edition> (che può contenere <date>
				oppure contiene '', possiamo quindi riassegnare newBiblElement.date a se stesso senza problemi.
				Se è disponibile una data dentro <imprint> prendiamo quella altrimenti la prendiamo dentro <edition> o dentro <monogr>.
				Magari la troviamo anche subito dentro <bibl>/*/
				if (newBiblElement.date === ''){
					newBiblElement.date = imprintsDates && imprintsDates.length > 0 ? imprintsDates[0].textContent : '';
				}
				
				var imprintsPublishers = monographImprints.find('publisher');
				if (newBiblElement.publisher === ''){
					newBiblElement.publisher = imprintsPublishers && imprintsPublishers.length > 0 ? imprintsPublishers[0].textContent : '';
				}
				var imprintsPubPlaces = monographImprints.find('pubPlace');
				if (newBiblElement.pubPlace === ''){
					newBiblElement.pubPlace = imprintsPubPlaces && imprintsPubPlaces.length > 0 ? imprintsPubPlaces[0].textContent : '';
				}
				angular.forEach(monographImprints.find('note'), function(el) {
					//salviamo le note dentro imprint che è dentro monogr
					newBiblElement.note[el.getAttribute('type')] = el.textContent;
				});
			}
		}
		
		var seriesElem = angular.element(currentDocument.find(seriesDef.replace(/[<>]/g, '')));
		if (seriesElem && seriesElem.length > 0) {
			
			var seriesTitles = seriesElem.find('title');
			if (seriesTitles && seriesTitles.length > 0) {
				newBiblElement.titleMonogr = seriesTitles[0].textContent;
			}
			//salviamo la data dentro monogr
			var dates = seriesElem.find('date');
			/*/qua newBiblElement.date contiene già o la data estratta dentro <edition> (che può contenere <date>
			oppure contiene '', possiamo quindi riassegnare newBiblElement.date a se stesso senza problemi.
			Se è disponibile una data dentro <imprint> prendiamo quella altrimenti la prendiamo dentro <edition> o dentro <monogr>.
			Magari la troviamo anche subito dentro <bibl>/*/
			if (newBiblElement.date === ''){
				newBiblElement.date = date && date.length > 0 ? date[0].textContent : '';
			}
			//magari è gia stato preso dentro <monogr>, quindi non vogliamo rischiare di sovrascriverlo
			var publishers = seriesElem.find('publisher');
			if (newBiblElement.publisher === ''){
				newBiblElement.publisher = publishers && publishers.length > 0 ? publishers[0].textContent : '';
			}
			//magari è gia stato preso dentro <monogr>, quindi non vogliamo rischiare di sovrascriverlo
			var pubPlaces = seriesElem.find('pubPlace');
			if (newBiblElement.pubPlace === ''){
				newBiblElement.pubPlace = pubPlaces && pubPlaces.length > 0 ? pubPlaces[0].textContent :  '';
			}
			angular.forEach(seriesElem.find('note'), function(el) {
				//salviamo le note dentro imprint che è dentro monogr
				newBiblElement.note[el.getAttribute('type')] = el.textContent;
			});
			//dentro series ci sono anche i biblScope
			angular.forEach(monographElem.find(biblScopeDef.replace(/[<>]/g, '')), function(el) {
				//prendere attributo type o unit di ogni biblScope trovato
				angular.forEach(['type', 'unit'], function(attr) {
					var attrValue = el.getAttribute(attr);
					if (attrValue !== null) {
						newBiblElement.biblScope[attrValue] = el.textContent;
					}
				});
			});			   
		}

		
		angular.forEach(currentDocument.find(idnoDef.replace(/[<>]/g, '')), function(el) {
			//prendere attributo type
			newBiblElement.idno[el.getAttribute('type')] = el;
		});

		return newBiblElement;
	}

	parser.formatResult = function(styleCode, newBiblElement) {
		if (!newBiblElement.outputs[styleCode]) {
			var string = '';
			//presentiamo i risultati estratti, in teoria in base a un codice scegliamo l'otput desiderato
			if (styleCode === CHICAGO_STYLE) {
				//autore-data-titolo-titolo_monografia(se presente)- edizione-luogo pubblicazione-data-numero pagina-idno(se dati)
				//il primo autore deve essere citato con cognome-nome
				if (newBiblElement.author && newBiblElement.author.length > 0) {
					var firstAuthor = newBiblElement.author[0];
					//il nome lo prendiamo per mezzo del tag name o forename
					var firstName = firstAuthor.name !== '' ? firstAuthor.name : firstAuthor.forename;
					var firstSurname = firstAuthor.surname;
					string += '<span data-style="chicago" class="author">';
					if (firstName !== '') {
						string += '<span data-style="chicago" class="name">' + firstName + '</span>';
					}
					if (firstSurname !== '') {
						string += '<span data-style="chicago" class="surname">' + firstSurname + '</span>';
					}
				}
				string += '</span>';
				//se c'è più di un autore gli altri sono citati con nome-cognome
				angular.forEach(newBiblElement.author, function(authorElement, key) {
					//il primo autore lo abbiamo già sistemato prima, adesso (se ci sono) aggiungiamo gli altri
					if (key > 0) {
						var name = authorElement.name !== '' ? authorElement.name : authorElement.forename;
						var surname = authorElement.surname;
						string += '<span data-style="chicago" class="author">';
						if (name !== '') {
							string += '<span data-style="chicago" class="name">' + name + '</span>';
						}
						if (surname !== '') {
							string += '<span data-style="chicago" class="surname">' + surname + '</span>';
						}
						string += '</span>';
					}
				});
				if (getPubblicationType(newBiblElement) && getPubblicationType(newBiblElement).toLowerCase().substr(0,1) !== 'm') {
					if (getDate(newBiblElement)) {
						string += '<span data-style="chicago" class="date">' + getDate(newBiblElement) + '</span>';
					}
					
					if (getTitleAnalytic(newBiblElement)) {
						string += '<span data-style="chicago" class="titleAnalytic">' + getTitleAnalytic(newBiblElement) + '</span>';
					}
					
					if (getTitleMonogr(newBiblElement)) {
						string += '<span data-style="chicago" class="titleMonogr">' + getTitleMonogr(newBiblElement) + '</span>';
					}
					//editore
					string += '<span data-style="chicago" class="editor">';
					angular.forEach(newBiblElement.editor, function(editorElement, key) {
						var name = editorElement.name !== '' ? editorElement.name : editorElement.forename;
						var surname = editorElement.surname;
						
						if (name !== '') {
							string += '<span data-style="chicago" class="name">' + name + '</span>';
						}
						if (surname !== '') {
							string += '<span data-style="chicago" class="surname">' + surname + '</span>';
						}
					});
					string+="</span>";
					if (getPubPlace(newBiblElement)) {
						string += '<span data-style="chicago" class="pubPlace">' + getPubPlace(newBiblElement) + '</span>';
					}
					if (getPublisher(newBiblElement)) {
						string += '<span data-style="chicago" class="publisher">' + getPublisher(newBiblElement) + '</span>';
					}
					
					if (getVolumes(newBiblElement)) {
						string += '<span data-style="chicago" class="vol">' + getVolumes(newBiblElement) + '</span>';
					}
					if (getIssue(newBiblElement)) {
						string += '<span data-style="chicago" class="issue">' + getIssue(newBiblElement) + '</span>'; 
					}
					if (getPages(newBiblElement)) {
						string += '<span data-style="chicago" class="pp">' + getPages(newBiblElement) + '</span>';
					}
					angular.forEach(newBiblElement.idno, function(el, key) {
						if (key === 'DOI') {
							string += '<span data-style="chicago" class="idno" data-type="' + key + '">' + el.textContent + '</span>';
						}
					});
				} else {
					//else if(getPubblicationType(newBiblElement) && getPubblicationType(newBiblElement).toLowerCase().substr(0,1) === 'm' ){
					if (getDate(newBiblElement)) {
						string += '<span data-style="chicago" class="date">' + getDate(newBiblElement) + '</span>';
					}	  
					if (getTitleAnalytic(newBiblElement)) {
						string += '<span data-style="chicago" data-attr="titolo" class="titleAnalytic">' + getTitleAnalytic(newBiblElement) + '</span>';
					}
					if (getTitleMonogr(newBiblElement)) {
						string += '<span data-style="chicago" data-attr="titolo" class="titleMonogr">' + getTitleMonogr(newBiblElement) + '</span>';
					}
					if (getEditionMonogr(newBiblElement)) {
						string += '<span data-style="chicago" data-attr="titolo" class="edition">' + getEditionMonogr(newBiblElement) + '</span>';
					}				  
					if (getVolumes(newBiblElement)) {
						string += '<span data-style="chicago" class="vol">' + getVolumes(newBiblElement) + '</span>';
					}
					if (getPubPlace(newBiblElement)) {
						string += '<span data-style="chicago" class="pubPlace">' + getPubPlace(newBiblElement) + '</span>';
					}
					if (getPublisher(newBiblElement)) {
						string += '<span data-style="chicago" class="publisher">' + getPublisher(newBiblElement) + '</span>';
					}
					if (getUrl(newBiblElement)) {
						string += '<span data-style="chicago" class="url">' + getUrl(newBiblElement) + '</span>';
					}
					angular.forEach(newBiblElement.idno, function(el, key) {
						if (key === 'ISSN') {
							string += '<span data-style="chicago" class="idno" data-type="' + key + '">' + el.textContent + '</span>';
						}
					});
				}
			}

			/*/
			Altro stile
			/*/
			else if (styleCode === APA_STYLE) {
				if (getPubblicationType(newBiblElement) && getPubblicationType(newBiblElement).toLowerCase().substr(0,1) !== 'm') {
					if (newBiblElement.author && newBiblElement.author.length > 0) {
						var firstAuthor = newBiblElement.author[0];
						var firstName = firstAuthor.name !== '' ? firstAuthor.name : firstAuthor.forename;
						var firstSurname = firstAuthor.surname;
						string += '<span data-style="apa" class="author">';
						//del primo autore prima si deve mettere il cognome
						if (firstSurname !== '') {
							string += '<span data-style="apa" class="surname">' + firstSurname + '</span>';
						}
						if (firstName !== '' && firstSurname !== '') {
							string += '<span data-style="apa" class="name">' + getInitials(firstName) + '</span>';
						}
						//se non sappiamo il cognome allora mettiamo il nome tutto per intero, non possiamo prendere le iniziali se non conosciamo il cognome
						if (firstName !== '' && firstSurname === '') {
							string += '<span data-style="apa" class="name">' + firstName + '</span>';
						}					
						string += '</span>';
						angular.forEach(newBiblElement.author, function(authorElement, key) {
							//il primo autore lo abbiamo già sistemato prima, adesso (se ci sono) aggiungiamo gli altri
							if (key > 0) {
								var name = authorElement.name !== '' ? authorElement.name : firstAuthor.forename;
								var surname = authorElement.surname !== '' ? authorElement.surname : '';
								string += '<span data-style="apa" class="author">';
								if (surname !== '') {
									string += '<span data-style="apa" class="surname">' + surname + '</span>';
								}
								if (name !== '' && surname !== '') {
									string += '<span data-style="apa" class="name">' + getInitials(name) + '</span>';
								}
								if (name !== '' && surname === '') {
									string += '<span data-style="apa" class="name">' + name + '</span>';
								}							
								string += '</span>';
							}
						});
					}
					if (getDate(newBiblElement)) {
						string += '<span data-style="apa" class="date">' + getDate(newBiblElement) + '</span>';
					}

					if (getTitleAnalytic(newBiblElement)) {
						string += '<span data-style="apa" data-attr="titolo" class="titleAnalytic">' + getTitleAnalytic(newBiblElement) + '</span>';
					}
					
					if (getTitleMonogr(newBiblElement)) {
						string += '<span data-style="apa" data-attr="titolo" class="titleMonogr">' + getTitleMonogr(newBiblElement) + '</span>';
					}

					if (getVolumes(newBiblElement)) {
						var vol = getVolumes(newBiblElement);
						if (getIssue(newBiblElement)) {
							var issue = getIssue(newBiblElement);
							string += '<span data-style="apa" class="vol">' + vol + '(' + issue + ')</span>';
						} else {
							string += '<span data-style="apa" class="vol">' + vol + '</span>';
						}
					}

					if (getPages(newBiblElement)) {
						string += '<span data-style="apa" class="pp">' + getPages(newBiblElement) + '</span>';
					}
				}
				else {
					if (newBiblElement.author && newBiblElement.author.length > 0) {
						var firstAuthor = newBiblElement.author[0];
						var firstName = firstAuthor.name !== '' ? firstAuthor.name : firstAuthor.forename;
						var firstSurname = firstAuthor.surname;
						string += '<span data-style="apa" class="author">';
						//del primo autore prima si deve mettere il cognome
						if (firstSurname !== '') {
							string += '<span data-style="apa" class="surname">' + firstSurname + '</span>';
						}
						if (firstName !== '' && firstSurname !== '') {
							string += '<span data-style="apa" class="name">' + getInitials(firstName) + '</span>';
						}
						//se non sappiamo il cognome allora mettiamo il nome tutto per intero, non possiamo prendere le iniziali se non conosciamo il cognome
						if (firstName !== '' && firstSurname === '') {
							string += '<span data-style="apa" class="name">' + firstName + '</span>';
						}					
						string += '</span>';
						angular.forEach(newBiblElement.author, function(authorElement, key) {
							//il primo autore lo abbiamo già sistemato prima, adesso (se ci sono) aggiungiamo gli altri
							if (key > 0) {
								var name = authorElement.name !== '' ? authorElement.name : firstAuthor.forename;
								var surname = authorElement.surname !== '' ? authorElement.surname : '';
								string += '<span data-style="apa" class="author">';
								if (surname !== '') {
									string += '<span data-style="apa" class="surname">' + surname + '</span>';
								}
								if (name !== '' && surname !== '') {
									string += '<span data-style="apa" class="name">' + getInitials(name) + '</span>';
								}
								if (name !== '' && surname === '') {
									string += '<span data-style="apa" class="name">' + name + '</span>';
								}							
								string += '</span>';
							}
						});
					}
					if (getDate(newBiblElement)) {
						string += '<span data-style="apa" class="date">' + getDate(newBiblElement) + '</span>';
					}

					if (getTitleMonogr(newBiblElement)) {
						string += '<span data-style="apa" data-attr="titolo" class="titleMonogr">' + getTitleMonogr(newBiblElement) + '</span>';
					}
					if (getPages(newBiblElement)) {
						string += '<span data-style="apa" class="pp">' + getPages(newBiblElement) + '</span>';
					}					
					if (getPubPlace(newBiblElement)) {
						string += '<span data-style="apa" class="pubPlace">' + getPubPlace(newBiblElement) + '</span>';
					}
					if (getPublisher(newBiblElement)) {
						string += '<span data-style="apa" class="publisher">' + getPublisher(newBiblElement) + '</span>';
					}
					
				}
			}
			
						/*/
			Altro stile
			/*/
			else if (styleCode === MLA_STYLE) {
				if (getPubblicationType(newBiblElement) && getPubblicationType(newBiblElement).toLowerCase().substr(0,1) !== 'm') {
					if (newBiblElement.author && newBiblElement.author.length > 0) {
						var firstAuthor = newBiblElement.author[0];
						var firstName = firstAuthor.name !== '' ? firstAuthor.name : firstAuthor.forename;
						var firstSurname = firstAuthor.surname;
						string += '<span data-style="mla" class="author">';
						//del primo autore prima si deve mettere il cognome
						if (firstSurname !== '') {
							string += '<span data-style="mla" class="surname">' + firstSurname + '</span>';
						}
						if (firstName !== ''){
							string += '<span data-style="mla" class="name">' + firstName + '</span>';						
						}
						string += '</span>';
					}
					if (getTitleAnalytic(newBiblElement)) {
						string += '<span data-style="mla" data-attr="titolo" class="titleAnalytic">' + getTitleAnalytic(newBiblElement) + '</span>';
					}
					if (getVolumes(newBiblElement)) {
							string += '<span data-style="mla" class="vol">' + getVolumes(newBiblElement) + '</span>';
					}
					if (getIssue(newBiblElement)) {
						string += '<span data-style="mla" class="issue">' + getIssue(newBiblElement) + '</span>';
					}
					if (getDate(newBiblElement)) {
						string += '<span data-style="mla" class="date">' + getDate(newBiblElement) + '</span>';
					}
					if (getPages(newBiblElement)) {
						string += '<span data-style="mla" class="pp">' + getPages(newBiblElement) + '</span>';
					}
					if (getTitleMonogr(newBiblElement)) {
						string += '<span data-style="mla" data-attr="titolo" class="titleMonogr">' + getTitleMonogr(newBiblElement) + '</span>';
					}
				}
				else{
					if (newBiblElement.author && newBiblElement.author.length > 0) {
						var firstAuthor = newBiblElement.author[0];
						var firstName = firstAuthor.name !== '' ? firstAuthor.name : firstAuthor.forename;
						var firstSurname = firstAuthor.surname;
						string += '<span data-style="mla" class="author">';
						//del primo autore prima si deve mettere il cognome
						if (firstSurname !== '') {
							string += '<span data-style="mla" class="surname">' + firstSurname + '</span>';
						}
						if (firstName !== ''){
							string += '<span data-style="mla" class="name">' + firstName + '</span>';						
						}
						string += '</span>';
					}
					if (getTitleAnalytic(newBiblElement)) {
						string += '<span data-style="mla" data-attr="titolo" class="titleAnalytic">' + getTitleAnalytic(newBiblElement) + '</span>';
					}
					if (getVolumes(newBiblElement)) {
							string += '<span data-style="mla" class="vol">' + getVolumes(newBiblElement) + '</span>';
					}
					if (getIssue(newBiblElement)) {
						string += '<span data-style="mla" class="issue">' + getIssue(newBiblElement) + '</span>';
					}
					if (getDate(newBiblElement)) {
						string += '<span data-style="mla" class="date">' + getDate(newBiblElement) + '</span>';
					}
					if (getPages(newBiblElement)) {
						string += '<span data-style="mla" class="pp">' + getPages(newBiblElement) + '</span>';
					}
					if (getTitleMonogr(newBiblElement)) {
						string += '<span data-style="mla" data-attr="titolo" class="titleMonogr">' + getTitleMonogr(newBiblElement) + '</span>';
					}					
				}


















				
			}
			newBiblElement.outputs[styleCode] = string;
		}
	}

	
	function getInitials(string){
		var resultString='';
		for(var c=0;c<string.length;c++){
			if((c===0 || string[c-1]===' ') && string[c] === string[c].toUpperCase()){
				resultString+= '';
				resultString+= string[c];
				resultString+= '.';
			}
		}
		return resultString;
	}
	
	/*/
		Getters, ritornano o il valore richiesto relativo a una entrata bibliografica estratta o undefined.
	/*/
	parser.getType=function(newBiblElement){
		if (newBiblElement.type !== ''){
			return newBiblElement.type;
		}
	}	
	
	function getID(newBiblElement) {
		if (newBiblElement.id !== '') {
			return newBiblElement.id;
		}
	}

	function getTitleAnalytic(newBiblElement) {
		if (newBiblElement.titleAnalytic !== '') {
			return newBiblElement.titleAnalytic;
		}
	}

	function getTitleMonogr(newBiblElement) {
		if (newBiblElement.titleMonogr !== '') {
			return newBiblElement.titleMonogr;
		}
	}

	function getEditionMonogr(newBiblElement) {
		if (newBiblElement.editionMonogr !== '') {
			return newBiblElement.editionMonogr;
		}
	}

	function getPubPlace(newBiblElement) {
		if (newBiblElement.pubPlace !== '') {
			return newBiblElement.pubPlace;
		}
	}

	function getDate(newBiblElement) {
		if (newBiblElement.date !== '') {
			return newBiblElement.date;
		}
	}

	function getPages(newBiblElement) {
		var pages;
		if (typeof newBiblElement.note !== 'undefined') {
			if (typeof newBiblElement.note.pp !== 'undefined') {
				pages = newBiblElement.note.pp;
			}
			//magari si chiama pages
			else if (typeof newBiblElement.note.pages !== 'undefined') {
				pages = newBiblElement.note.pages;
			}
		}
		if (typeof newBiblElement.biblScope.pages !== 'undefined'){
			pages = newBiblElement.biblScope.pages;
		}
		else if (typeof newBiblElement.biblScope.pp !== 'undefined'){
			pages = newBiblElement.biblScope.pp;
		}
		return pages;
	}


	function getAccessed(newBiblElement) {
		if (typeof newBiblElement.note.accessed !== 'undefined') {
			return newBiblElement.note.accessed;
		}
	}

	function getUrl(newBiblElement) {
		if (typeof newBiblElement.note.url !== 'undefined') {
			return newBiblElement.note.url;
		}
	}

	function getVolumes(newBiblElement) {
		if (typeof newBiblElement.biblScope.vol !== 'undefined') {
			return newBiblElement.biblScope.vol;
		}
	}

	function getIssue(newBiblElement) {
		if (typeof newBiblElement.biblScope.issue !== 'undefined') {
			return newBiblElement.biblScope.issue;
		}
	}

	function getPubblicationType(newBiblElement) {
		if (newBiblElement.type !== '') {
			return newBiblElement.type;
		}
	}

	function getPublisher(newBiblElement) {
		if (newBiblElement.publisher !== '') {
			return newBiblElement.publisher;
		}
	}
	
	function getEditor(newBiblElement) {
		if (newBiblElement.editor) {
			return newBiblElement.editor;
		}
	}

	return parser;
});
