angular.module('evtviewer.dataHandler')

.service('evtNamedEntitiesParserOLD', function(parsedData, evtParser, config) {
	/*/
	In questo singleton sono definite 2 cose importanti: helper e listManager.
	Gli helper servono a fare il parsing dei dati, a interrogarli/formattarli per l'output. Gli helper sono oggetti dentro un singleton, se ne possono richiedere
	quanti se ne vuole.
	ListManager è il gestore delle liste, questo gestore è stato scritto e pensato per garantire la massima flessibilità possibile
	(vedi studio del modello dei dati su asana), si possono richiedere più manager invocando la funzione getListManagerIstance(), oppure visto che siamo in un singleton,
	è possibile condividere lo stesso manager con altri componenti invocando la funzione getListManagerMainIstance().
	listManager può anche essere modificato molto facilmente.
	
	nb: questa implementazione non fa uso di alberi binari di ricerca, potrà essere facilmente inserita in seguito,
	potrebbe non essere poi più cosi tanto generale come soluzione nel caso fossero usati
	/*/
	var parser = {};
	var listManagerMainIstance;
	//funzioni generali
	var extractNote = function(whereToFind, whereToPutInfoArray) {
		//whereToFind = angular.element(whereToFind);
		var c = 1;
		//angular.forEach(whereToFind.find('note'), function(el) {
			//salviamo le note dentro imprint che è dentro monogr
			var type = whereToFind.getAttribute('type');
			if (type === null || type === undefined) {
				//se il tag note non ha specificato l'attributo type allora la chiave è note + <numero-nota>
				type = 'note-' + c;
				while (type in whereToPutInfoArray.notes) {
					type = 'note' + (++c);
				}
			}
			var noteElement = document.createElement('span');
			noteElement.className = 'namedEntityNote';
			noteElement.innerHTML = whereToFind.innerHTML;
			var parsedNote = evtParser.parseXMLElement(noteElement, noteElement, {skip: ''});
			whereToPutInfoArray.notes.push({
				type: type,
				content:  parsedNote ? parsedNote.innerHTML : ''
			});
		//});
	};
	/*/HELPER   /*/
	//questo oggetto ritorna o dei dati estratti oppure espone dei metodi accessori per 
	//interrogare dei dati estratti in precedenza. Di questi oggetti helper dovrebbero esserne dichiarati tanti quante 
	//sono le named entity interessate
	parser.listPlaceHelper = function() {
		this.parseInfo = function(element) {
			//per ogni helper sono dichiarati tutti gli elementi da cui estrarre le info, 
			//da questi elementi vengono presi anche tutti gli attributi, sono array in genere nel caso ce ne possano essere più di uno nel documento
			var listPlace = {
				'id': '',
				'country': [],
				'region': [],
				'placeName': [],
				'district': [],
				'notes': [],
				'settlement': [],
				'geogName': [],
				'ref': [],
				'plainText': '',
				'output': ''
			};

			var currentElement = angular.element(element);
			listPlace.id = currentElement.attr('xml:id') ? currentElement.attr('xml:id') : evtParser.xpath(element);
			if (currentElement.children().length > 0) {
				angular.forEach(currentElement.find('placeName'), function(el) {
					//se ha 0 tag dentro lo prendiamo, altrimenti scartiamo il testo che tanto lo recuperiamo dopo
					if (el.children && el.children.length === 0) {
						var currentPlaceName = {};
						var attributes = extractAttributesFromElement(el);
						if (attributes) {
							currentPlaceName.attributes = attributes;
						}
						currentPlaceName.textContent = el.textContent;
						listPlace.placeName.push(currentPlaceName);
					}
				});

				angular.forEach(currentElement.find('district'), function(el) {
					var currentDistrict = {};
					var attributes = extractAttributesFromElement(el);
					if (attributes) {
						currentDistrict.attributes = attributes;
					}
					currentDistrict.textContent = el.textContent;
					listPlace.district.push(currentDistrict);
				});

				angular.forEach(currentElement.find('note'), function(el) {
					extractNote(el, listPlace);
				});

				angular.forEach(currentElement.find('settlement'), function(el) {
					var currentSettlement = {};
					var attributes = extractAttributesFromElement(el);
					if (attributes) {
						currentSettlement.attributes = attributes;
					}
					currentSettlement.textContent = el.textContent;
					listPlace.settlement.push(currentSettlement);
				});

				angular.forEach(currentElement.find('country'), function(el) {
					var currentCountry = {};
					var attributes = extractAttributesFromElement(el);
					if (attributes) {
						currentCountry.attributes = attributes;
					}
					currentCountry.textContent = el.textContent;
					listPlace.country.push(currentCountry);
				});

				angular.forEach(currentElement.find('region'), function(el) {
					var currentRegion = {};
					var attributes = extractAttributesFromElement(el);
					if (attributes) {
						currentRegion.attributes = attributes;
					}
					currentRegion.textContent = el.textContent;
					listPlace.country.push(currentRegion);
				});

				angular.forEach(currentElement.find('geogName'), function(el) {
					var currentGeogName = {};
					var attributes = extractAttributesFromElement(el);
					if (attributes) {
						currentGeogName.attributes = attributes;
					}
					el = angular.element(el);
					currentGeogName.geogFeat = el.find('geogFeat')[0].text();
					currentGeogName.name = $(el).find('geogFeat + name')[0].text();
					listPlace.geogName.push(currentGeogName);
				});

				angular.forEach(currentElement.find('ref'), function(el) {
					var currentRef = {};
					var attributes = extractAttributesFromElement(el);
					if (attributes) {
						currentRef.attributes = attributes;
					}
					currentRef.textContent = el.textContent;
					listPlace.ref.push(currentRef);
				});
			} else {
				listPlace.plainText = currentElement.text();
			}
			//genera una stringa html sui dati estratti
			removeEndingPointTrim(listPlace, true, true);
			this.toFormattedString(listPlace);
			return listPlace;
		};
		//la classe espone dei getters per interrogare i dati precedentemente estratti
		this.getID = function(listPlaceEl) {
			if (typeof listPlaceEl.id !== 'undefined') {
				return listPlaceEl.id;
			}
		};
		this.getPlaceName = function(listPlaceEl) {
			if (typeof listPlaceEl.placeName !== 'undefined' && listPlaceEl.placeName.length > 0) {
				return listPlaceEl.placeName;
			}
		};
		this.getSettlement = function(listPlaceEl) {
			if (typeof listPlaceEl.settlement !== 'undefined' && listPlaceEl.settlement.length > 0) {
				return listPlaceEl.settlement;
			}
		};
		this.getDistrict = function(listPlaceEl) {
			if (typeof listPlaceEl.district !== 'undefined') {
				if (typeof listPlaceEl.district.textContent !== 'undefined' && listPlaceEl.district.length > 0) {
					return listPlaceEl.district.textContent;
				}
			}
		};
		this.getCountry = function(listPlaceEl) {
			if (typeof listPlaceEl.country !== 'undefined' && listPlaceEl.country.length > 0) {
				return listPlaceEl.country;
			}
		};
		this.getGeogName = function(listPlaceEl) {
			if (typeof listPlaceEl.geogName !== 'undefined' && listPlaceEl.geogName.length > 0) {
				return listPlaceEl.geogName;
			}
		};
		this.getNote = function(listPlaceEl) {
			if (typeof listPlaceEl.note !== 'undefined' && Object.keys(listPlaceEl.note).length > 0) {
				return listPlaceEl.note;
			}
		};
		this.getRefs = function(listPlaceEl) {
			if (typeof listPlaceEl.ref !== 'undefined' && listPlaceEl.ref.length > 0) {
				return listPlaceEl.ref;
			}
		};
		this.getRegion = function(listPlaceEl) {
			if (typeof listPlaceEl.region !== 'undefined' && listPlaceEl.region.length > 0) {
				return listPlaceEl.region;
			}
		};
		this.getPlainText = function(listPlaceEl) {
			if (typeof listPlaceEl.plainText !== 'undefined' && listPlaceEl.plainText !== '') {
				return listPlaceEl.plainText;
			}
		};
		this.getAttributeFromElement = function(specificElement, tagName) {
			if (typeof specificElement.attributes !== 'undefined') {
				if (typeof specificElement.attributes[tagName] !== 'undefined') {
					return specificElement.attributes[tagName];
				}
			}
		};

		//sulla base dei risultati già estratti, ritorna una stringa html da visualizzare a schermo poi
		this.toFormattedString = function(listPlaceEl) {
			if (listPlaceEl.output !== '') {
				return listPlaceEl.output;
			} else {
				var string = '';
				if (this.getPlainText(listPlaceEl)) {
					string += '<span class="placeElPlainText">' + this.getPlainText(listPlaceEl) + '</span>';
				} else {
					string += '<span class="placeEl">';
					if (this.getSettlement(listPlaceEl)) {
						var settlement = this.getSettlement(listPlaceEl)[0];
						string += '<span class="settlement">';
						string += '<span class="settlement textContent">' + settlement.textContent + '</span>';
						if (this.getAttributeFromElement(settlement, 'type')) {
							string += '<span class="settlement type">' + this.getAttributeFromElement(settlement, 'type') + '</span>';
						}
						string += '</span>';
					}
					if (this.getPlaceName(listPlaceEl)) {
						var placeName = this.getPlaceName(listPlaceEl)[0];
						string += this.getAttributeFromElement(placeName, 'type') ? '<span class="placeName new"></span>' : '';
					}
					if (this.getDistrict(listPlaceEl)) {
						var district = this.getDistrict(listPlaceEl)[0];
						if (this.getAttributeFromElement(district, 'type')) {
							string += '<span class="district type">' + this.getAttributeFromElement(district, 'type') + '</span>';
						}
						string += '<span class="district textContent">' + district.textContent + '</span>';
					}
					string += '</span>';
				}
				listPlaceEl.output = string;
				return string;
			}
		};
	};

	parser.listOrgHelper = function() {
		this.parseInfo = function(element) {
			var listOrg = {
				'id': '',
				'orgName': [],
				'desc': [],
				'ref': [],
				'notes': [],
				'plainText': '',
				'output': ''
			};

			var currentElement = angular.element(element);
			listOrg.id = currentElement.attr('xml:id') ? currentElement.attr('xml:id') : evtParser.xpath(element);
			if (currentElement.children().length > 0) {
				angular.forEach(currentElement.find('note'), function(el) {
					extractNote(el, listOrg);
				});

				angular.forEach(currentElement.find('orgName'), function(el) {
					var currentOrgNameEl = {};
					var attributes = extractAttributesFromElement(el);
					if (attributes) {
						currentOrgNameEl.attributes = attributes;
					}
					currentOrgNameEl.textContent = el.textContent;
					listOrg.orgName.push(currentOrgNameEl);
				});

				angular.forEach(currentElement.find('desc'), function(el) {
					var currentDescEl = {};
					var attributes = extractAttributesFromElement(el);
					if (attributes) {
						currentDescEl.attributes = attributes;
					}
					var parsedDesc = evtParser.parseXMLElement(el, el, {skip: ''});
					currentDescEl.content = parsedDesc ? parsedDesc.innerHTML : ''; 
					listOrg.desc.push(currentDescEl);
				});

				angular.forEach(currentElement.find('ref'), function(el) {
					var currentRef = {};
					var attributes = extractAttributesFromElement(el);
					if (attributes) {
						currentRef.attributes = attributes;
					}
					currentRef.textContent = el.textContent;
					listOrg.ref.push(currentRef);
				});
			} else {
				listOrg.plainText = currentElement.text();
			}
			//genera una stringa html sui dati estratti
			removeEndingPointTrim(listOrg, true, true);
			this.toFormattedString(listOrg);
			return listOrg;
		};

		this.getID = function(listOrgEl) {
			if (typeof listOrgEl.id !== 'undefined') {
				return listOrgEl.id;
			}
		};

		this.getNote = function(listOrgEl) {
			if (typeof listOrgEl.note !== 'undefined' && Object.keys(listOrgEl.note).length > 0) {
				return listOrgEl.note;
			}
		};
		this.getOrgName = function(listOrgEl) {
			if (typeof listOrgEl.orgName !== 'undefined' && listOrgEl.orgName.length > 0) {
				return listOrgEl.orgName;
			}
		};
		this.getRefs = function(listOrgEl) {
			if (typeof listOrgEl.ref !== 'undefined' && listOrgEl.ref.length > 0) {
				return listOrgEl.ref;
			}
		};
		this.getPlainText = function(listOrgEl) {
			if (typeof listOrgEl.plainText !== 'undefined' && listOrgEl.plainText !== '') {
				return listOrgEl.plainText;
			}
		};
		this.getAttributeFromElement = function(specificElement, tagName) {
			if (typeof specificElement.attributes !== 'undefined') {
				if (typeof specificElement.attributes[tagName] !== 'undefined') {
					return specificElement.attributes[tagName];
				}
			}
		};
		//sulla base dei risultati già estratti, ritorna una stringa html da visualizzare a schermo poi
		this.toFormattedString = function(listOrgEl) {
			if (listOrgEl.output !== '') {
				return listOrgEl.output;
			} else {
				var string = '';
				if (this.getPlainText(listOrgEl)) {
					string += '<span class="placeElPlainText">' + this.getPlainText(listOrgEl) + '</span>';
				} else {
					if (this.getOrgName(listOrgEl)) {
						var orgName = this.getOrgName(listOrgEl)[0];
						string += '<span class="orgEl">';
						string += '<span class="orgName textContent">' + orgName.textContent + '</span>';
						if (this.getAttributeFromElement(orgName, 'type')) {
							string += '<span class="orgName type">' + this.getAttributeFromElement(orgName, 'type') + '</span>';
						}
						string += '</span>';
					}
				}
				listOrgEl.output = string;
				return string;
			}
		};
	};

	var parsePersonInfo = function(whereToPutInfoArray, elemento, lastRelevantParent, attributes) {
		if (elemento.nodeType === 3) {
			var text = elemento.textContent.trim();
			if (lastRelevantParent) {
				switch (lastRelevantParent.tagName) {
					case 'name':
						if (whereToPutInfoArray.name.textContent) {
							whereToPutInfoArray.name.textContent += text + ' ';
						} else {
							whereToPutInfoArray.name.textContent = text + ' ';
						}
						whereToPutInfoArray.name.attributes = attributes;
						break;
					case 'surname':
						if (whereToPutInfoArray.surname.textContent) {
							whereToPutInfoArray.surname.textContent += text + ' ';
						} else {
							whereToPutInfoArray.surname.textContent = text + ' ';
						}
						whereToPutInfoArray.surname.attributes = attributes;
						break;
					case 'forename':
						if (whereToPutInfoArray.forename.textContent) {
							whereToPutInfoArray.forename.textContent += text + ' ';
						} else {
							whereToPutInfoArray.forename.textContent = text + ' ';
						}
						whereToPutInfoArray.forename.attributes = attributes;
						break;
					case 'sex':
						whereToPutInfoArray.sex.textContent = text;
						whereToPutInfoArray.sex.attributes = attributes;
				}
			}
		}
		angular.forEach(elemento.childNodes, function(el) {
			switch (el.tagName) {
				case 'name':
				case 'surname':
				case 'forename':
				case 'sex':
					var attributi = extractAttributesFromElement(el);
					parsePersonInfo(whereToPutInfoArray, el, el, attributi);
					break;
				default:
					parsePersonInfo(whereToPutInfoArray, el, lastRelevantParent, attributes);
			}
		});
	};

	var extractAttributesFromElement = function(element) {
		var attributes = {};
		var attrs = element.attributes ? element.attributes : 0;
		for (var c = 0; c < attrs.length; c++) {
			attributes[attrs[c].nodeName] = attrs[c].nodeValue.replace(/_+/g, ' ').replace(/-+/g, '/');
		}
		if (Object.keys(attributes).length > 0) {
			return attributes;
		}
	};


	parser.listPersonHelper = function() {
		this.parseInfo = function(element) {
			var listPerson = {
				'id': '',
				'name': {},
				'surname': {},
				'forename': {},
				'sex': '',
				'occupation': [],
				'notes': [],
				'ref': [],
				'plainText': '',
				'output': ''
			};

			var currentElement = angular.element(element);
			listPerson.id = currentElement.attr('xml:id') ? currentElement.attr('xml:id') : evtParser.xpath(element);
			if (currentElement.children().length > 0) {
				angular.forEach(currentElement.find('note'), function(el) {
					extractNote(el, listPerson);
				});

				angular.forEach(currentElement.find('occupation'), function(el) {
					var currentOccupationEl = {};
					var attributes = extractAttributesFromElement(el);
					if (attributes) {
						currentOccupationEl.attributes = attributes;
					}
					currentOccupationEl.textContent = el.textContent;
					listPerson.occupation.push(currentOccupationEl);
				});

				angular.forEach(currentElement.find('ref'), function(el) {
					var currentRef = {};
					var attributes = extractAttributesFromElement(el);
					if (attributes) {
						currentRef.attributes = attributes;
					}
					currentRef.textContent = el.textContent;
					listPerson.ref.push(currentRef);
				});

				parsePersonInfo(listPerson, currentElement[0], currentElement, {});
			} else {
				listPerson.plainText = currentElement.text();
			}
			//genera una stringa html sui dati estratti
			removeEndingPointTrim(listPerson, true, true);
			this.toFormattedString(listPerson);
			return listPerson;
		};

		this.getID = function(listPersonEl) {
			if (typeof listPersonEl.id !== 'undefined') {
				return listPersonEl.id;
			}
		};

		this.getName = function(listPersonEl) {
			if (typeof listPersonEl.name !== 'undefined' && Object.keys(listPersonEl.name).length > 0) {
				return listPersonEl.name;
			}
		};
		this.getSurname = function(listPersonEl) {
			if (typeof listPersonEl.surname !== 'undefined' && Object.keys(listPersonEl.surname).length > 0) {
				return listPersonEl.surname;
			}
		};
		this.getForename = function(listPersonEl) {
			if (typeof listPersonEl.forename !== 'undefined' && Object.keys(listPersonEl.forename).length > 0) {
				return listPersonEl.forename;
			}
		};
		this.getOccupation = function(listPersonEl) {
			if (typeof listPersonEl.occupation !== 'undefined' && listPersonEl.occupation.length > 0) {
				return listPersonEl.occupation;
			}
		};
		this.getNote = function(listPersonEl) {
			if (typeof listPersonEl.note !== 'undefined' && Object.keys(listPersonEl.note).length > 0) {
				return listPersonEl.note;
			}
		};
		this.getRefs = function(listPersonEl) {
			if (typeof listPersonEl.ref !== 'undefined' && listPersonEl.ref.length > 0) {
				return listPersonEl.ref;
			}
		};
		this.getPlainText = function(listPersonEl) {
			if (typeof listPersonEl.plainText !== 'undefined' && listPersonEl.plainText !== '') {
				return listPersonEl.plainText;
			}
		};
		this.getAttributeFromElement = function(specificElement, tagName) {
			if (typeof specificElement.attributes !== 'undefined') {
				if (typeof specificElement.attributes[tagName] !== 'undefined') {
					return specificElement.attributes[tagName];
				}
			}
		};
		//sulla base dei risultati già estratti, ritorna una stringa html da visualizzare a schermo poi
		this.toFormattedString = function(listPersonEl) {
			if (listPersonEl.output !== '') {
				return listPersonEl.output;
			} else {
				var string = '';
				if (this.getPlainText(listPersonEl)) {
					string += '<span class="placeElPlainText">' + this.getPlainText(listPersonEl) + '</span>';
				} else {
					string += '<span class="personEl"';

					if (this.getForename(listPersonEl)) {
						var forename = this.getForename(listPersonEl);
						string += '<span class="forename textContent">' + forename.textContent + '</span>';
					}
					if (this.getSurname(listPersonEl)) {
						var surname = this.getSurname(listPersonEl);
						string += '<span class="surname textContent">' + surname.textContent + '</span>';
					}

					if (this.getOccupation(listPersonEl)) {
						var occupation = this.getOccupation(listPersonEl)[0];
						string += '<span class="occupation textContent">' + occupation.textContent + '</span>';
					}
					string += '</span>';
				}
				listPersonEl.output = string;
				return string;
			}
		};
	};


	/*/LIST MANAGER
	oggetto generico volto a raccogliere delle liste generiche, è pensato per essere il più generale e riutilizzabile possibile,
	la lista offre le comuni operazioni che si possono fare su una normale lista. I metodi per creare le sotto-liste sono esplicitamente
	dichiarati come funzioni per rendere più facile un'eventuale modifica.
	/*/
	parser.listManager = function() {
		this.lists = {};
	};

	//_buildSpecifKeyEntryInList inizia con underscore, perchè non deve essere esposta all'utente questa!!
	//crea un'entrata in una lista generale. l'entrata raccoglierà un gruppo di elementi
	//con proprietà affini
	parser.listManager.prototype._buildSpecifKeyEntryInList = function(listName, listKey) {
			if (typeof this.lists[listName] !== 'undefined') {
				this.lists[listName][listKey] = []; //potrebbe essere un alberio binario di ricerca
			}
		};
		//crea una lista generale
	parser.listManager.prototype.createList = function(listName) {
		if (typeof this.lists[listName] === 'undefined') {
			this.lists[listName] = {};
		}
	};

	/*/
	Aggiunge un elemento in una lista generale, poichè questo elemento può essere qualsiasi cosa,
	bisogna specificare una chiave per poi ritrovare lo stesso gruppo di elementi.
	Se nessuna chiave viene data, ecco che la lista diventa più generica, e invece di raggruppare oggetti di una stessa lista per
	proprietà si limita a salvarli tutti come un array gigante. 
	l'item che ci aspettiamo è un JSON ritornato da uno degli helper delle singole liste (es: listPlaceHelper.parseInfo),
	ma item può comunque essere qualsiasi cosa.
	Più item possono essere raggruppati insieme in un array specificando la stessa listKey
	/*/
	parser.listManager.prototype.addItemToList = function(listName, listKey, item) {
		if (typeof this.lists[listName] === 'undefined') {
			this.createList(listName);
		}
		//se non esiste la lista, viene creata
		if (!(listKey in this.lists[listName])) {
			this._buildSpecifKeyEntryInList(listName, listKey);
		}
		this.lists[listName][listKey].push(item);
	};

	parser.listManager.prototype.getItemsFromList = function(listName, listKey) {
		if (typeof this.lists[listName] !== 'undefined' && !(listKey in listName)) {
			return this.lists[listName][listKey];
		}
	};
	//restituisce l'elenco delle chiavi di una certa lista (a,b,c...z)
	parser.listManager.prototype.getListKeys = function(listName) {
		if (typeof this.lists[listName] !== 'undefined') {
			return Object.keys(this.lists[listName]);
		}
	};
	//l'utente con esigenze particolare di sorting si prende una delle liste principali come un array,
	//cosi sopra ci può chiamare .sort()
	parser.listManager.prototype.getArrayList = function(listName) {
		if (typeof this.lists[listName] !== 'undefined') {
			return $.makeArray(this.lists[listName]);
		}
	};

	parser.listManager.prototype.getAllLists = function() {
		//cloniamo, non passiamo per reference!! In quanto non possiamo mai sapere cosa l'utente ci farà
		return $.extend(true, {}, this.lists);
	};

	parser.listManager.prototype.getListByName = function(listName) {
		//cloniamo, non passiamo per reference!! In quanto non possiamo mai sapere cosa l'utente ci farà
		if (typeof this.lists[listName] !== 'undefined') {
			return $.extend(true, {}, this.lists[listName]);
		}
	};

	parser.listManager.prototype.saveToParsedData = function() {
		//parsedData.updateNamedEntity(this.lists);
	};

	parser.getListManagerMainIstance = function() {
		return listManagerMainIstance;
	};

	parser.getNewListManagerIstance = function() {
		return new parser.listManager();
	};

	//TEMP
	var parseCollectionData = function(el, collection) {
		if (el.previousElementSibling && el.previousElementSibling.tagName === 'head') {
			collection.id = el.previousElementSibling.textContent.trim().replace(/\s/g, '');
			collection.title = el.previousElementSibling.textContent.trim();
		} else {
			var parentNode = el.parentNode,
				listId;
			if (parentNode && parentNode.getAttribute('xml:id')) {
				listId = parentNode.getAttribute('xml:id').trim().replace(/\s/g, '');
				collection.id = listId;
				collection.title = listId;
			}
			if (parentNode && parentNode.getAttribute('type')) {
				var listTitle = parentNode.getAttribute('type').trim();
				if (!listId || listId === undefined) {
					collection.id = listTitle;
				}
				listTitle = camelToSpace(listTitle);
				collection.title = (listTitle.substr(0, 1).toUpperCase() + listTitle.substr(1));
			}
		}
	};
	//TEMP 
	var camelToSpace = function(str) {
		return str.replace(/\W+/g, ' ')
					.replace(/([a-z\d])([A-Z])/g, '$1 $2');
	};

	var getPageIdFromHTMLString = function(HTMLstring) {
		var matchPbIdAttr = 'xml:id=".*"',
			sRegExPbIdAttr = new RegExp(matchPbIdAttr, 'ig'),
			pbHTMLString = HTMLstring.match(sRegExPbIdAttr);
		sRegExPbIdAttr = new RegExp('xml:id=(?:"[^"]*"|^[^"]*$)', 'ig');
		var idAttr = pbHTMLString ? pbHTMLString[0].match(sRegExPbIdAttr) : undefined,
			pageId = idAttr ? idAttr[0].replace(/xml:id/, '').replace(/(=|\"|\')/ig, '') : '';
		return pageId;
	};

	parser.parseEntitiesOccurrences = function(docObj, refId) {
		var doc = docObj && docObj.content ? docObj.content : undefined,
			docHTML = doc ? doc.outerHTML : undefined,
			pages = [];
		if (docHTML && refId && refId !== '') {
			var match = '<pb(.|[\r\n])*?(?!<pb)(?=#' + refId + ')',
				sRegExInput = new RegExp(match, 'ig'),
				matches = docHTML.match(sRegExInput),
				totMatches = matches ? matches.length : 0;
			for (var i = 0; i < totMatches; i++) {
				var pageId = getPageIdFromHTMLString(matches[i]);
				if (pageId) {
					var pageObj = parsedData.getPage(pageId);
					pages.push({ 
						pageId: pageId, 
						pageLabel: pageObj ? pageObj.label : pageId,
						docId: docObj ? docObj.value : '',
						docLabel: docObj ? docObj.label : '' 
					});
				}
			}
		}
		return pages;
	};

	//istanziamo il listManager principale
	listManagerMainIstance = new parser.listManager();

	parser.parseEntities = function(doc, listManager) {
		/*/parseEntities lavora sull'istanza principale di listManager di default, quella che può essere comune a tutti.
		Oppure si può passare noi l'istanza su cui operare
		/*/
		console.log('Named entity Parser service running');
		listManager = listManager ? listManager : parser.getListManagerMainIstance();
		var listPlaceHelper = new parser.listPlaceHelper();
		var listOrgHelper = new parser.listOrgHelper();
		var listPersonHelper = new parser.listPersonHelper();
		var element = angular.element(doc);

		//List place
		var collection = {
			id : 'place',
			type : 'place',
			title : 'List of places'
		};
		var data = $(element).find('sourceDesc > listPlace > place');
		angular.forEach(data, function(el) {
			parseCollectionData(el, collection);
			var res = listPlaceHelper.parseInfo(el);
			//parseOccurrences(doc, el, res.id);
			res._xmlSource = el.outerHTML.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, '');
			parsedData.addNamedEntityInCollection(collection, res, res.id.substr(0, 1).toLowerCase());
		});

		//List org
		collection = {
			id : 'org',
			type : 'org',
			title : 'List of organizations'
		};
		data = $(element).find('sourceDesc > listOrg > org');
		angular.forEach(data, function(el) {
			parseCollectionData(el, collection);
			var res = listOrgHelper.parseInfo(el);
			// parseOccurrences(doc, el, res.id);
			res._xmlSource = el.outerHTML.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, '');
			parsedData.addNamedEntityInCollection(collection, res, res.id.substr(0, 1).toLowerCase());
		});

		//List name
		collection = {
			id : 'person',
			type : 'person',
			title : 'List of persons'
		};
		data = $(element).find('sourceDesc > listPerson > person');
		angular.forEach(data, function(el) {
			parseCollectionData(el, collection);
		 	var res = listPersonHelper.parseInfo(el);
			// parseOccurrences(doc, el, res.id);
			res._xmlSource = el.outerHTML.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, '');
		 	parsedData.addNamedEntityInCollection(collection, res, res.id.substr(0, 1).toLowerCase());
		});

		collection = {
			id : 'list',
			type : 'generic',
			title : 'Lista generica'
		};
		data = $(element).find('sourceDesc > list > item');
		angular.forEach(data, function(el) {
			parseCollectionData(el, collection);
		 	var itemId = el.getAttribute('xml:id') || evtParser.xpath(element),
		 		parsedItem = evtParser.parseXMLElement(el, el, {skip: ''});
		 	var res = {
		 		id: itemId,
		 		label: el.getAttribute('n') || camelToSpace(itemId.replace(/_/g, ' ')),
		 		details: parsedItem ? parsedItem.innerHTML : undefined,
		 		_xmlSource: el.outerHTML.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, '')
		 	};
			// parseOccurrences(doc, el, res.id);
		 	parsedData.addNamedEntityInCollection(collection, res, res.id.substr(0, 1).toLowerCase());
		});

		//console.log('## parseEntities ##', listManager.getAllLists());
		console.log('## parseEntities ##', parsedData.getNamedEntitiesCollection());
	};
	
	var isObject = function(obj) {
		return obj && ((typeof obj).toLowerCase() === 'object');
	};

	var isArray = function(obj) {
		return isObject(obj) && (obj instanceof Array);
	};

	var isString = function(obj) {
		return (typeof obj).toLowerCase() === 'string';
	};

	/* 	toglie i punti finali dal testo raccolto e rimuove anche gli spazi iniziali/finali per 
	garantire maggiore omogeneità una volta su schermo */
	var removeEndingPointTrim = function(arr, removeEndingPoint, trim) {
		if (typeof arr === 'string') {

			if (removeEndingPoint) {
				//cerca un punto prima di un fine riga
				arr = arr.replace(/\.$/, '');
			}
			if (trim) {
				arr = arr.trim();
				arr = arr.replace(/\s+/g, ' ');
			}
			return arr;

		} else {
			if (isArray(arr)) {
				for (var c = 0, l = arr.length; c < l; c++) {
					removeEndingPointTrim(arr[c], true, true);
				}
			} else if (isObject(arr)) {
				for (var key in arr) {
					var res;
					if (key !== 'author') {
						res = removeEndingPointTrim(arr[key], true, true);
					} else {
						res = removeEndingPointTrim(arr[key], false, true);
					}
					if (typeof res !== 'undefined') {
						arr[key] = res;
					}
				}
			}
		}
	};

	return parser;
});