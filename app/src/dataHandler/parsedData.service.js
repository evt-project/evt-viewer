/**
 * @ngdoc service
 * @module evtviewer.dataHandler
 * @name evtviewer.dataHandler.parsedData
 * @description 
 * # parsedData
 * TODO: Add description and comments for every method
**/
angular.module('evtviewer.dataHandler')

.service('parsedData', function($log, config, Utils) {
	var parsedData = {};
	var _console = $log.getInstance('dataHandler');

	_console.log('parsedData running');

	var encodingDetails = {	};

	var projectInfo = {
		fileDescription: '',
		encodingDescription: '',
		textProfile: '',
		outsideMetadata: '',
		revisionHistory: ''
	};


	var bibliographicRefsCollection = {
		_indexes: []
	};

	// TODO manage unique value for pages, documents and editions
	var pagesCollection = {
		length: 0
	};
	var documentsCollection = {
		_indexes: [],
		length: 0
	};

	//Collezione aggiunta da CM
	var externalDocsCollection = {
		length: 0
	};

	var sourcesDocsCollection = {
		length: 0
	};

	// var pagesCollectionTexts = []; 

	var witnessesCollection = {
		_indexes: {
			witnesses: [],
			groups: [],
			encodingStructure: []
		}
	};

	var genericColors = config.genericColors;

	var criticalAppCollection = {
		filtersCollection: {
			filters: {},
			length: 0,
			forLemmas: 0,
			forVariants: 0,
			colors: []

			// colors : ['rgb(215,48,39)','rgb(244,109,67)','rgb(253,174,97)','rgb(254,224,139)','rgb(217,239,139)','rgb(166,217,106)','rgb(102,189,99)','rgb(26,152,80)'],
			// colors : ['rgb(51,102,204)', 'rgb(16,150,24)', 'rgb(255,153,0)', 
			//           'rgb(221,68,119)', 'rgb(34,170,153)', 
			//           'rgb(153,0,153)', 'rgb(220,57,18', 'rgb(0,153,198)', 'rgb(102,170,0)',
			//           'rgb(184,46,46)', 'rgb(49,99,149)', 'rgb(153,68,153)'],
		},
		__allLoaded: false,
		_maxVariance: 0,
		_indexes: {
			encodingStructure: [],
			appEntries: [],
			exponents: [],
		}
	};

	var criticalTexts = {};

	var editionLevels = [];
	// Object to save the versions readings (@author --> CM)
	var versionAppCollection = {
		_indexes: {
			encodingStructure : [],
			versionWitMap : {},
			versionId : {
				_name: {}
			}
		}
	};

	var versionTexts = {};

	var criticalEdition = false;

	var glyphsCollection = {
		_indexes: []
	};

	var zonesCollection = {
		_indexes: []
	};

	var namedEntities = {
		_collections: {
			_indexes: []	
		},
		_indexes: []
	};

	parsedData.getEncodingDetail = function(detailName) {
		return encodingDetails[detailName];
	};

	parsedData.setEncodingDetail = function(detailName, value) {
		encodingDetails[detailName] = value;
	};

	parsedData.getNamedEntityTypeIcon = function(type) { //TODO: Move in Utils provider (?)
		var icon;
		switch(type) {
            case 'place':
            case 'placeName':
                icon = 'fa-map-marker';
                break;
            case 'person':
            case 'pers':
            case 'persName':
                icon = 'fa-user';
                break;
            case 'org':
            case 'orgName':
                icon = 'fa-users';
                break;
            case 'relation':
            	icon = 'fa-share-alt';
            	break;
            default:
                icon = 'fa-list-ul';
                break;
        }
        return icon;
	};

	parsedData.addNamedEntitiesCollection = function(collection) {
		var collectionId = collection.id;
		if (namedEntities._collections[collectionId] === undefined) {
			var listType = collection && collection.type ? collection.type : 'generic',
				listIcon = parsedData.getNamedEntityTypeIcon(listType);

			namedEntities._collections[collectionId] = {
				_indexes: [],
				_listKeys: [],
				_title : collection && collection.title ? collection.title : '',
				_type : listType,
				_icon : listIcon 
			};


			namedEntities._collections._indexes.push(collectionId);
		}
	};

	parsedData.addNamedEntityInCollection = function(collection, namedEntity, listKey) {
		var collectionId = collection.id;
		if (namedEntities._collections[collectionId] === undefined) {
			this.addNamedEntitiesCollection(collection);
		}
		if (namedEntities._collections[collectionId][listKey] === undefined) {
			namedEntities._collections[collectionId][listKey] = {
				_indexes: []
			};
			namedEntities._collections[collectionId]._listKeys.push(listKey);
		}
		var entityId = namedEntity.id;
		namedEntities._collections[collectionId][listKey][entityId] = namedEntity;
		namedEntities[entityId] = {
			collectionId : collectionId,
			listKey: listKey
		};
		namedEntities._indexes.push(entityId);
		namedEntities._collections[collectionId]._indexes.push(entityId);
		namedEntities._collections[collectionId][listKey]._indexes.push(entityId);
	};

	parsedData.getNamedEntitiesCollection = function() {
		return namedEntities._collections;
	};

	parsedData.getNamedEntitiesCollectionByName = function(collectionId) {
		return namedEntities._collections[collectionId];
	};

	parsedData.getNamedEntitiesCollectionByNameAndPos = function(collectionId, listKey) {
		return namedEntities._collections[collectionId][listKey];
	};

	parsedData.getNamedEntity = function(namedEntityId) {
		var namedEntity;
		if (namedEntityId) {
			var namedEntityRefs = namedEntities[namedEntityId];
			if (namedEntityRefs !== undefined && namedEntityRefs.collectionId !== undefined && 
				namedEntityRefs.listKey !== undefined && 
				namedEntities._collections[namedEntityRefs.collectionId] !== undefined && 
				namedEntities._collections[namedEntityRefs.collectionId][namedEntityRefs.listKey] !== undefined) {
				namedEntity = namedEntities._collections[namedEntityRefs.collectionId][namedEntityRefs.listKey][namedEntityId];
			}
		}
		return namedEntity;
	};

	parsedData.getNamedEntityType = function(namedEntityId) {
		var collectionId = namedEntityId && namedEntities[namedEntityId] ? namedEntities[namedEntityId].collectionId : undefined;
		var collectionObj = parsedData.getNamedEntitiesCollectionByName(collectionId);
		return collectionObj ? collectionObj._type : 'generic';
	};

	/*****************************/
	/*QUOTES & SOURCES collection*/
	/*(@author --> CM)           */
	/*****************************/

	var quotesCollection = {
		_indexes: {
			encodingStructure: [],
			sourcesRef: {
				_id: [],
			}
		},
	};

	var sourcesCollection = {
		_indexes: {
			encodingStructure: [],
			quotesRef: {
				_id: [],
			},
			availableTexts : [],
			correspId: {}
		},
	};

	var analoguesCollection = {
		_indexes: {
			encodingStructure: [],
		},
		_refId: {
			_indexes: []
		}
	};

	/* PAGES */
	// TODO: add attribute for the original xml reference
	parsedData.addPage = function(page, docId) {
		var pageId = page.value;
		if (pagesCollection.length === undefined) {
			pagesCollection.length = 0;
		}

		if (page.value === '') {
			pageId = page.value = 'page_' + (pagesCollection.length + 1);
		}
		if (pagesCollection[pageId] === undefined) {
			page.docs = [docId];
			pagesCollection[pagesCollection.length] = pageId;
			pagesCollection[pageId] = page;
			pagesCollection.length++;
			// _console.log('parsedData - addPage ', page);
		} else {
			var parsedPage = pagesCollection[pageId];
			if (parsedPage.docs && parsedPage.docs.indexOf(docId) < 0) {
				parsedPage.docs.push(docId);
			}
		}

		if (docId && docId !== '' && documentsCollection[docId] !== undefined) {
			documentsCollection[docId].pages.push(pageId);
		}
	};
	parsedData.getPages = function() {
		return pagesCollection;
	};
	parsedData.getPage = function(pageId) {
		return pagesCollection[pageId];
	};

	parsedData.setPageText = function(pageId, docId, editionLevel, HTMLtext) {
		var pageObj = pagesCollection[pageId];
		if (pageObj) {
			if (!pageObj.text) {
				pageObj.text = {};
			}
			var pageDocObj = pageObj.text[docId];
			if (pageDocObj !== undefined && pageDocObj[editionLevel] !== undefined) {
				pageDocObj[editionLevel] += HTMLtext;
			} else if (pageDocObj !== undefined) {
				pageDocObj[editionLevel] = HTMLtext;
			} else {
				pageObj.text[docId] = {};
				pageObj.text[docId][editionLevel] = HTMLtext;
			}
			if (pageObj.docs && pageObj.docs.indexOf(docId) < 0) {
				pageObj.docs.push(docId);
			}
		}
	};

	parsedData.getPageText = function(pageId, docId, editionLevel) {
		var pageObj = pagesCollection[pageId];
		if (pageObj && pageObj.text && pageObj.text[docId]) {
			return pageObj.text[docId][editionLevel];
		}
		return undefined;
	};

	parsedData.getPageImage = function(pageId) {
		var images = [];

		var i = 0;
		while (i < images.length && images[i].page !== pageId) {
			i++;
		}
		// return images[i];
		return {};
	};

	/* DOCUMENTS */
	parsedData.addDocument = function(doc) {
		var docId = doc.value;
		if (doc.value === '') {
			docId = doc.value = 'doc_' + (documentsCollection._indexes.length + 1);
		}
		if (documentsCollection[docId] === undefined) {
			documentsCollection._indexes.push(docId);
			documentsCollection[docId] = doc;
			// _console.log('parsedData - addDocument ', doc);
		}
	};
	parsedData.getDocuments = function() {
		return documentsCollection;
	};
	parsedData.getDocument = function(docId) {
		return documentsCollection[docId];
	};
	parsedData.getPreviousDocument = function(docId) {
		var currentDocIndex = documentsCollection._indexes.indexOf(docId);
		var previousId = documentsCollection._indexes[currentDocIndex - 1];
		return documentsCollection[previousId];
	};

	/*******************************************************************/
	/*Methods added to handle and save external files (@author --> CM) */
	/*******************************************************************/

	parsedData.addExternalDocument = function(extDoc) {
		var docId = extDoc.value;
		if (externalDocsCollection.length === undefined) {
			externalDocsCollection.length = 0;
		}
		if (extDoc.value === '') {
			docId = extDoc.value = 'extDoc_' + (externalDocsCollection.length + 1);
		}
		if (externalDocsCollection[docId] === undefined) {
			externalDocsCollection[externalDocsCollection.length] = docId;
			externalDocsCollection[docId] = extDoc;
			externalDocsCollection.length++;
		}
	};

	parsedData.getExternalDocuments = function() {
		return externalDocsCollection;
	};

	parsedData.getExternalDocument = function(extDocId) {
		return externalDocsCollection[extDocId];
	};

	// Method to store sources XML documents
	parsedData.addSourceDocument = function(extDoc, id) {
		var docId = extDoc.value;
		if (sourcesDocsCollection.length === undefined) {
			sourcesDocsCollection.length = 0;
		}
		if (extDoc.value === '') {
			docId = extDoc.value = id;
		}
		if (sourcesDocsCollection[docId] === undefined) {
			sourcesDocsCollection[sourcesDocsCollection.length] = docId;
			sourcesDocsCollection[docId] = extDoc;
			sourcesDocsCollection.length++;
		}
	};

	parsedData.getSourceDocuments = function() {
		return sourcesDocsCollection;
	};

	parsedData.getSourceDocument = function(extDocId) {
		return sourcesDocsCollection[extDocId];
	};

	/**** End of methods for external files ****/

	/* EDITION */
	parsedData.setCriticalEditionAvailability = function(isAvailable) {
		criticalEdition = isAvailable;
	};

	parsedData.isCriticalEditionAvailable = function() {
		return criticalEdition;
	};

    parsedData.setEditions = function(editions) {
        editionLevels = editions;
    };

	parsedData.addEdition = function(edition) {
		editionLevels.push(edition);
	};
	
	parsedData.getEditions = function() {
		return editionLevels;
	};

	parsedData.getEdition = function(editionId) {
		//TODO: Rifare
		var i = 0,
			edition;
		while (i < editionLevels.length && edition === undefined) {
			if (editionLevels[i].value === editionId) {
				edition = editionLevels[i];
			}
			i++;
		}
		return edition;
	};

	/* WITNESSES */
	parsedData.addElementInWitnessCollection = function(element) {
		var skipWitnesses = config.skipWitnesses.split(',').filter(function(el) {
			return el.length !== 0;
		});
		if (element && element.id && skipWitnesses.indexOf(element.id) < 0) {
			if (witnessesCollection[element.id] === undefined) {
				witnessesCollection[element.id] = element;

				if (element._type === 'group') {
					witnessesCollection._indexes.groups.push(element.id);
				} else {
					witnessesCollection._indexes.witnesses.push(element.id);
				}

				if (element._group === undefined) {
					witnessesCollection._indexes.encodingStructure.push(element.id);
				}
			}
		}
	};

	parsedData.addWitnessText = function(witId, docId, content) {
		if (witnessesCollection[witId] !== undefined) {
			if (witnessesCollection[witId].text === undefined) {
				witnessesCollection[witId].text = {};
			}
			witnessesCollection[witId].text[docId] = content;
		}
	};
	parsedData.getWitnessText = function(witId, docId) {
		if (witnessesCollection[witId] !== undefined) {
			if (witnessesCollection[witId].text !== undefined && witnessesCollection[witId].text[docId] !== undefined) {
				return witnessesCollection[witId].text[docId];
			}
		}
	};
	parsedData.getWitnessesList = function() {
		return witnessesCollection._indexes.witnesses;
	};
	parsedData.getWitnesses = function() {
		return witnessesCollection;
	};
	parsedData.getWitness = function(witId) {
		return witnessesCollection[witId];
	};
	parsedData.getWitnessPages = function(witId) {
		if (witnessesCollection[witId] !== undefined) {
			if (witnessesCollection[witId].pages === undefined) {
				var pages = {
					length: 0
				};
				for (var i = 0; i < pagesCollection.length; i++) {
					var page = pagesCollection[pagesCollection[i]];
					if (page.ed === '#' + witId) {
						pages[pages.length] = pagesCollection[i];
						pages[pagesCollection[i]] = page;
						pages.length++;
					}
				}
				witnessesCollection[witId].pages = pages;
			}
			return witnessesCollection[witId].pages;
		}
	};
	parsedData.isWitnessesGroup = function(sigla) {
		return witnessesCollection[sigla] !== undefined && witnessesCollection[sigla]._type === 'group';
	};
	parsedData.getWitnessesInGroup = function(groupId) {
		var wits = [];
		if (witnessesCollection[groupId] !== undefined && witnessesCollection[groupId]._type === 'group') {
			var groupContent = witnessesCollection[groupId].content;
			for (var wit in groupContent) {
				var sigla = groupContent[wit];
				if (parsedData.isWitnessesGroup(sigla)) {
					wits.push.apply(wits, parsedData.getWitnessesInGroup(sigla));
				} else {
					wits.push(sigla);
				}
			}
		}
		return wits;
	};

	//temp
	parsedData.getWitnessesListFormatted = function() {
		var structure = witnessesCollection._indexes.encodingStructure;
		var content;
		content = '<ul>';
		for (var i = 0; i < structure.length; i++) {
			var element = witnessesCollection[structure[i]];
			if (element._type === 'witness') {
				content += '<li>';
				if (element.attributes && element.attributes.n) {
					content += '<strong>' + element.attributes.n + '</strong>';
				} else {
					content += '<strong>#' + element.id + '</strong>';
				}
				content += '<br /><div>' + element.description.innerHTML + '</div>';	
				content += '</li>';
			} else {
				content += '<li>';
				if (element.attributes && element.attributes.n) {
					content += '<strong>' + element.attributes.n + '</strong>';
				} else {
					content += '<strong>#' + element.id + '</strong>';
				}
				content += '<br /><div>' + element.name + '</div>';
				content += '<ul>';
                var elementContentLength = element.content ? element.content.length : 0;
				for (var j = 0; j < elementContentLength; j++) {
					var subElement = witnessesCollection[element.content[j]];
					if (subElement && subElement._type === 'witness') {
						content += '<li>';
						if (subElement.attributes && subElement.attributes.n) {
							content += '<strong>' + subElement.attributes.n + '</strong>';
						} else {
							content += '<strong>#' + subElement.id + '</strong>';
						}
						content += '<br /><div>' + subElement.description.innerHTML + '</div>';
						content += '</li>';
					}
					//TO DO RICORSIVA!!!            
				}
				content += '</ul>';
				content += '</li>';
			}
		}
		content += '</ul>';
		return content;
	};

	/* **************** */
	/* CRITICAL ENTRIES */
	/* **************** */
	parsedData.getCriticalTextsCollection = function() {
		return criticalTexts;
	};
	parsedData.addCriticalText = function(text, docId) {
		criticalTexts[docId] = text;
	};

	parsedData.getCriticalText = function(docId) {
		return criticalTexts[docId];
	};

	parsedData.resetCriticalEntries = function() {
		criticalAppCollection = {
			filtersCollection: {
				filters: {},
				length: 0,
				forLemmas: 0,
				forVariants: 0,
				colors: []
			},
			__allLoaded: false,
			_maxVariance: 0,
			_indexes: {
				encodingStructure: [],
				appEntries: [],
				exponents: [],
			}
		};
	};

	var generateAlphabeticExponent = function() {
		var number = criticalAppCollection._indexes.appEntries.length,
			exponent;
		var firstExp, lastExp;
        if (number > 26) {
            firstExp = (Math.floor(number/26))+96;
            if (number%26 === 0) {
                exponent = '&#'+(firstExp-1)+'; z';
            } else {
            lastExp = (number%26)+96;
            exponent='&#'+firstExp+'; &#'+lastExp+';'; }
        } else {
            exponent = '&#'+(number+96)+';';
        }
        return exponent;
	};

	parsedData.addCriticalEntry = function(entry) {
		if (criticalAppCollection[entry.id] === undefined) {
			criticalAppCollection[entry.id] = entry;
			criticalAppCollection._indexes.appEntries.push(entry.id);
			if (!entry._subApp) {
				criticalAppCollection._indexes.encodingStructure.push(entry.id);
			}
        	var exponent = generateAlphabeticExponent();
        	criticalAppCollection._indexes.exponents.push({appId: entry.id, exponent: exponent});
        	criticalAppCollection[entry.id].exponent = exponent;
		}
		if (entry._variance > criticalAppCollection._maxVariance) {
			criticalAppCollection._maxVariance = entry._variance;
		}
	};

	parsedData.setCriticalEntriesLoaded = function(status) {
		criticalAppCollection.__allLoaded = status;
	};

	parsedData.getCriticalEntries = function() {
		return criticalAppCollection;
	};

	parsedData.getCriticalEntryById = function(entryId) {
		return criticalAppCollection[entryId];
	};

	parsedData.getCriticalEntryExponent = function(entryId) {
		var entry = parsedData.getCriticalEntryById(entryId);
		return (entry ? entry.exponent : '');
	};

	parsedData.getCriticalEntriesMaxVariance = function() {
		return criticalAppCollection._maxVariance;
	};

	parsedData.getReadingAttributes = function(readingId, appId) {
		var attributes = [];
		if (criticalAppCollection[appId].content[readingId] !== undefined) {
			attributes = criticalAppCollection[appId].content[readingId].attributes;
		}
		return attributes;
	};

	parsedData.isSubApp = function(appId) {
		return criticalAppCollection[appId]._subApp;
	};

	/* CRITICAL ENTRIES FILTERS */
	parsedData.getGenericColorForAppEntry = function(index) {
		var filtersCollection = criticalAppCollection.filtersCollection,
			color = genericColors[index];
		if (filtersCollection.colors === undefined ||
			filtersCollection.colors.indexOf(color) < 0) {
			// If color has not been used yet 
			color = genericColors[index];
			genericColors.splice(index, 1);
		} else {
			// If color has already been used, I try to get the following 
			if (index >= filtersCollection.colors.length - 1) {
				var newRandomColor = Utils.getRandomColor('rgb');
				while (filtersCollection.colors.indexOf(newRandomColor) >= 0) {
					newRandomColor = Utils.getRandomColor('rgb');
				}
				filtersCollection.colors.push(newRandomColor);
			}
			color = parsedData.getGenericColorForAppEntry(index + 1);
		}
		return color;
	};

	parsedData.addCriticalEntryFilter = function(name, value) {
		var possibleVariantFilters = config.possibleVariantFilters,
			possibleLemmaFilters = config.possibleLemmaFilters,
			filtersCollection = criticalAppCollection.filtersCollection;
		// Add filter to collection
		// if it can be a filter
		if (possibleVariantFilters.indexOf(name) >= 0 || possibleLemmaFilters.indexOf(name) >= 0) {
			// create group for filter if not exist
			if (filtersCollection.filters[name] === undefined) {
				filtersCollection.filters[name] = {
					name: name,
					possibleFor: {
						lemma: possibleLemmaFilters.indexOf(name) >= 0,
						variant: possibleVariantFilters.indexOf(name) >= 0
					},
					values: {}
				};
			}
			// add value if not already added
			if (filtersCollection.filters[name].values[value] === undefined) {
				// assign color
				var color;
				if (config.variantColors[name] !== undefined &&
					config.variantColors[name][value] !== undefined && config.variantColors[name][value] !== '') {
					color = config.variantColors[name][value];
					if (genericColors.indexOf(color) >= 0) {
						genericColors.splice(genericColors.indexOf(color), 1);
					}
				} else {
					color = parsedData.getGenericColorForAppEntry(0);
				}
				if (color) {
                    filtersCollection.colors.push(color);
                }
                
				var valueObj = {
					name: value,
					color: color
				};
				filtersCollection.filters[name].values[value] = valueObj;
				filtersCollection.length++;
				if (possibleVariantFilters.indexOf(name) >= 0) {
					filtersCollection.forVariants++;
				}
				if (possibleLemmaFilters.indexOf(name) >= 0) {
					filtersCollection.forLemmas++;
				}
			}
		}
	};

	parsedData.getCriticalEntriesFiltersCollection = function() {
		return criticalAppCollection.filtersCollection;
	};

	parsedData.getCriticalEntriesFilters = function() {
		return criticalAppCollection.filtersCollection.filters;
	};

	parsedData.getCriticalEntriesFilterValues = function(filter) {
		return criticalAppCollection.filtersCollection.filters[filter];
	};

	parsedData.getCriticalEntriesFilterColor = function(filter, value) {
		return criticalAppCollection.filtersCollection.filters[filter].values[value].color;
	};

	/* ****************** */
	/* BIBLIOGRAPHIC REFs */
	/* ****************** */
	/* TODO: reorganize in EVT general style JSON model */
	parsedData.addBibliographicRef = function(biblElement) {
		if (bibliographicRefsCollection[biblElement.id] === undefined) {
			bibliographicRefsCollection[biblElement.id] = biblElement;
			bibliographicRefsCollection._indexes.push(biblElement.id);
		}
	};

	parsedData.getBibliographicRefsCollection = function() {
		return bibliographicRefsCollection;
	};

	parsedData.getBibliographicRefById = function(refId) {
		return bibliographicRefsCollection[refId];
	};

	/*******************/
	/* VERSION ENTRIES */
	/*******************/

	parsedData.addVersionEntry = function(entry) {
		if (versionAppCollection[entry.id] === undefined) {
			versionAppCollection._indexes.encodingStructure.push(entry.id);
			versionAppCollection[entry.id] = entry;
		}
	};

	parsedData.getVersionEntries = function() {
		return versionAppCollection;
	};

	// @entryId --> id of the version app entry | returns the parsed entry or undefined
	parsedData.getVersionEntry = function(entryId) {
		return versionAppCollection[entryId];
	};

	parsedData.addVersionWitness = function(ver, wit) {
		var witMap = versionAppCollection._indexes.versionWitMap;
		if (witMap[ver] === undefined) {
			witMap[ver] = [];
			witMap[ver].push(wit);
		} else {
			if (witMap[ver].indexOf(wit) < 0) {
				witMap[ver].push(wit);
			}			
		}

		var versionId = versionAppCollection._indexes.versionId,
			name = versionAppCollection._indexes.versionId._name;
		if (versionId[ver] === undefined) {
			var index = config.versions.indexOf(ver); 
			var v = 'Version &#'+(65+index)+';';
			versionId[ver] = v;
			name[v] = ver;
		}
	};

	// Adds the parsed text of a version
	// @text --> parsed text | @docId --> id of the current document | @ver --> id of the version
	// @author --> CM
	parsedData.addVersionText = function(text, docId, ver) {
		if (versionTexts[docId] === undefined) {
			versionTexts[docId] = {};
			versionTexts[docId][ver] = text;
		} else {
			if (versionTexts[docId][ver] === undefined) {
				versionTexts[docId][ver] = text;
			}
		}
	};

	// @ver --> id of the version | @docId --> id of the currentDocument
	// Returns the parsed text of the version. | @author --> CM
	parsedData.getVersionText = function(ver, docId) {
		return versionTexts[docId][ver];
	};

	/* ************ */
	/* PROJECT INFO */
	/* ************ */
	parsedData.updateProjectInfoContent = function(newContent, type) {
		projectInfo[type] = newContent;
	};

	parsedData.getProjectInfo = function() {
		return projectInfo;
	};


	/* ****** */
	/* GLYPHS */
	/* ****** */
	parsedData.addGlyph = function(glyph) {
		var glyphId,
			glyphIndexes = glyphsCollection._indexes;

		if (glyph && glyph.id !== '') {
			glyphId = glyph.id;
		} else {
			glyphId = glyph.id = 'glyph_' + (glyphIndexes + 1);
		}
		if (glyphsCollection[glyphId] === undefined) {
			glyphIndexes[glyphIndexes.length] = glyphId;
			glyphsCollection[glyphId] = glyph;
			glyphIndexes.length++;
			// _console.log('parsedData - addGlyph ', glyph);
		}
	};

	parsedData.getGlyphs = function() {
		return glyphsCollection;
	};

	parsedData.getGlyph = function(glyphId) {
		return glyphsCollection[glyphId];
	};

	parsedData.getGlyphMappingForEdition = function(glyphId, editionLevel) {
		return glyphsCollection[glyphId].mapping[editionLevel] || undefined;
	};

	/* ***************** */
	/* DIGITAL FACSIMILE */
	/* ***************** */
	parsedData.addZone = function(zone) {
		var zoneId,
			zoneIndexes = zonesCollection._indexes;

		if (zone && zone.id !== '') {
			zoneId = zone.id;
		} else {
			zoneId = zone.id = 'zone_' + (zoneIndexes + 1);
		}
		if (zonesCollection[zoneId] === undefined) {
			zoneIndexes[zoneIndexes.length] = zoneId;
			zonesCollection[zoneId] = zone;
			zoneIndexes.length++;
			// _console.log('parsedData - addZone ', zone);
		}
	};

	parsedData.getZones = function() {
		return zonesCollection;
	};

	parsedData.getZone = function(zoneId) {
		return zonesCollection[zoneId];
	};

	parsedData.isITLAvailable = function() {
		return config.toolImageTextLinking && zonesCollection._indexes.length > 0;
	};

	/*******************/
	/*SOURCES APPARATUS*/
	/*******************/
	parsedData.addQuote = function(entry) {
		//Adding the quote object to the collection...
		if (quotesCollection[entry.id] === undefined) {
			quotesCollection[entry.id] = entry;
			//and its id to the encoding structure
			//if (quotesCollection._indexes.encodingStructure.indexOf(entry.id) < 0) {
			quotesCollection._indexes.encodingStructure.push(entry.id);
			//}
		}

		var entryRef = entry._indexes.sourceRefId;
		var entrySource = entry._indexes.sourceId;
		var quotesRef = parsedData.getQuotes()._indexes.sourcesRef;

		if (entryRef.length > 0) {
			for (var i = 0; i < entryRef.length; i++) {
				//If the array of quotes id for that source hasn't been created yet, create a new one...
				if (quotesRef[entryRef[i]] === undefined && quotesRef._id.indexOf(entryRef[i]) < 0) {
					quotesRef[entryRef[i]] = [];
					//and add the entry id to it.
					quotesRef[entryRef[i]].push(entry.id);
						//Then add the id of the source to the general ids array.
					quotesRef._id.push(entryRef[i]);
				} else if (quotesRef[entryRef[i]].indexOf(entry.id) < 0) {
					//If an array for that source already exists, just add the quote id to the array of the source
					quotesRef[entryRef[i]].push(entry.id);
				}
			}
		}

		//Adding the correspId object to the SourcesCollection
		var entryCorresp = entry._indexes.correspId;
		var sourcesCorresp = sourcesCollection._indexes.correspId;

		if (Object.keys(entryCorresp).length > 0) {
			for (var k = 0; k < Object.keys(entryCorresp).length; k++) {
				var newSource = Object.keys(entryCorresp)[k];
				for (var j = 0; j < entryCorresp[newSource].length; j++) {
					if (sourcesCorresp[newSource] === undefined) {
						sourcesCorresp[newSource] = {};
						sourcesCorresp[newSource][entryCorresp[newSource][j]] = [entry.id];
					} else {
						if (sourcesCorresp[newSource][entryCorresp[newSource][j]] === undefined) {
							sourcesCorresp[newSource][entryCorresp[newSource][j]] = [entry.id];
						} else if (sourcesCorresp[newSource][entryCorresp[newSource][j]].indexOf(entry.id) < 0) {
							sourcesCorresp[newSource][entryCorresp[newSource][j]].push(entry.id);
						}
					}
				}
			}
		}
	};

	parsedData.getQuotes = function() {
		return quotesCollection;
	};

	parsedData.getQuote = function(entryId) {
		return quotesCollection[entryId];
	};

	parsedData.addSource = function(entry) {
		if (sourcesCollection[entry.id] === undefined) {
			sourcesCollection[entry.id] = entry;
			sourcesCollection._indexes.encodingStructure.push(entry.id);
		}

		var entryRef = entry.quotesEntriesId;
		var sourcesRef = parsedData.getSources()._indexes.quotesRef;

		if (entryRef.length > 0) {
			for (var i = 0; i < entryRef.length; i++) {
				//If the array of quotes id for that source hasn't been created yet, create a new one...
				if (sourcesRef[entryRef[i]] === undefined && sourcesRef._id.indexOf(entryRef[i]) < 0) {
					sourcesRef[entryRef[i]] = [];
					//and add the entry id to it.
					sourcesRef[entryRef[i]].push(entry.id);
						//Then add the id of the source to the general ids array.
					sourcesRef._id.push(entryRef[i]);
				} else if (sourcesRef[entryRef[i]].indexOf(entry.id) < 0) {
					//If an array for that source already exists, just add the quote id to the array of the source
					sourcesRef[entryRef[i]].push(entry.id);
				}
			}
		}

		if (entry._textAvailable) {
			sourcesCollection._indexes.availableTexts.push({id: entry.id, abbr: entry.abbr});
		}
	};

	parsedData.getSources = function() {
		return sourcesCollection;
	};

	parsedData.getSource = function(entryId) {
		return sourcesCollection[entryId];
	};

	/***********/
	/*ANALOGUES*/
	/***********/

	parsedData.getAnalogue = function(analogueId) {
		return analoguesCollection[analogueId];
	};

	parsedData.getAnalogues = function() {
		return analoguesCollection;
	};

	parsedData.addAnalogue = function(entry) {
		if (analoguesCollection[entry.id] === undefined) {
			analoguesCollection[entry.id] = entry;
			analoguesCollection._indexes.encodingStructure.push(entry.id);

			//Adding the entry sourceRef array to the refId array of the collection
			var entryRef = entry._indexes.sourceRefId,
				collectionRef = analoguesCollection._refId;
			for (var i = 0; i < entryRef.length; i++) {
				if (collectionRef._indexes.indexOf(entryRef[i]) < 0) {
					collectionRef._indexes.push(entryRef[i]);
					collectionRef[entryRef[i]] = [];
					collectionRef[entryRef[i]].push(entry.id);
				} else {
					if (collectionRef[entryRef[i]].indexOf(entry.id) < 0) {
						collectionRef[entryRef[i]].push(entry.id);
					}
				}
			}
		}
	};

	return parsedData;
});