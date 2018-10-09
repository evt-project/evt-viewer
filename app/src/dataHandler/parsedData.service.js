/**
 * @ngdoc service
 * @module evtviewer.dataHandler
 * @name evtviewer.dataHandler.parsedData
 * @description
 * # parsedData
 * Service that is responsible of the storage and retrievement of data parsed from
 * source edition document.
 *
 * @requires $log
 * @requires evtviewer.core.config
 * @requires evtviewer.core.Utils
**/
angular.module('evtviewer.dataHandler')

.service('parsedData', function($log, config, Utils) {
	var parsedData = {};
	var _console = $log.getInstance('dataHandler');

	_console.log('parsedData running');

	 /**
     * @ngdoc property
     * @name evtviewer.dataHandler.parsedData#encodingDetails
     * @propertyOf evtviewer.dataHandler.parsedData
     * @description [Private] Internal property where information about encoding details are stored.
     */
	var encodingDetails = {	};
	/**
     * @ngdoc property
     * @name evtviewer.dataHandler.parsedData#projectInfo
     * @propertyOf evtviewer.dataHandler.parsedData
     * @description [Private] Internal property where information about project information are stored.
     	<pre>
			var projectInfo = {
				fileDescription: '',
				encodingDescription: '',
				textProfile: '',
				outsideMetadata: '',
				revisionHistory: ''
			};
     	</pre>
     */
	var projectInfo = {
		fileDescription: '',
		encodingDescription: '',
		textProfile: '',
		outsideMetadata: '',
		revisionHistory: '',
		msDesc: ''
	};

	/**
     * @ngdoc property
     * @name evtviewer.dataHandler.parsedData#bibliographicRefsCollection
     * @propertyOf evtviewer.dataHandler.parsedData
     * @description [Private] Internal property where information about bibliographic references are stored.
     	<pre>
			var bibliographicRefsCollection = {
				[biblElemId] : {
					id: '',
	                type: '',
	                author: [],
	                titleAnalytic: '',
	                titleMonogr: '',
	                editionMonogr: '',
	                date: '',
	                editor: [],
	                publisher: '',
	                pubPlace: '',
	                biblScope: {},
	                note: {},
	                idno: {},
	                outputs: {},
	                plainText: ''
				},
				_indexes: [biblElemId]
			};
     	</pre>
     */
	var bibliographicRefsCollection = {
		_indexes: []
	};

	// TODO manage unique value for pages, documents and editions
	/**
     * @ngdoc property
     * @name evtviewer.dataHandler.parsedData#pagesCollection
     * @propertyOf evtviewer.dataHandler.parsedData
     * @description [Private] Internal property where information about pages are stored.
    	<pre>
			var pagesCollection = {
				[pageId]: {
					value,
					label,
					title,
					source,
					text: {
						[docId] : {
							[editionLevel]: ''
						}
					},
					docs: []
				},
				length: 1
			};
    	</pre>
     */
	var pagesCollection = {
		length: 0
	};
	/**
     * @ngdoc property
     * @name evtviewer.dataHandler.parsedData#documentsCollection
     * @propertyOf evtviewer.dataHandler.parsedData
     * @description [Private] Internal property where information about documents are stored.
     * The list of document IDs is stored in the property <code>_indexes</code>.
     	<pre>
			var documentsCollection = {
				[docId]: {
					value,
					label,
					title,
					content,
					front,
					pages
				},
				_indexes: [],
				length: 0
			};
     	</pre>
     */
	var documentsCollection = {
		_indexes: [],
		length: 0
	};

	/**
     * @ngdoc property
     * @name evtviewer.dataHandler.parsedData#externalDocsCollection
     * @propertyOf evtviewer.dataHandler.parsedData
     * @description [Private] Internal property where information about external documents are stored.
     	<pre>
			var externalDocsCollection = {
				[extDocId] : {
					value: type,
					content: doc
				},
				length: 1
			}
     	</pre>
     * @author CM
     */
	var externalDocsCollection = {
		length: 0
	};
	/**
     * @ngdoc property
     * @name evtviewer.dataHandler.parsedData#sourcesDocsCollection
     * @propertyOf evtviewer.dataHandler.parsedData
     * @description [Private] Internal property where information about source documents are stored.
     	<pre>
			var sourcesDocsCollection = {
				[sourceDocId] : {
					value: type,
					content: doc
				},
				length: 1
			}
     	</pre>
     * @author CM
     */
	var sourcesDocsCollection = {
		length: 0
	};

	// var pagesCollectionTexts = [];
	/**
     * @ngdoc property
     * @name evtviewer.dataHandler.parsedData#witnessesCollection
     * @propertyOf evtviewer.dataHandler.parsedData
     * @description [Private] Internal property where information about witnesses or group of witnesses are stored.
     	<pre>
			var witnessesCollection = {
				[witId] : {
					id,
	                attributes,
	                description,
	                _group,
	                _type = 'witness'
				},
				[groupId]: {
					id,
		            name,
		            content,
		            _type = 'group',
		            _group,
		            text
				},
				_indexes: {
					witnesses: [],
					groups: [],
					encodingStructure: []
				}
			};
     	</pre>
     */
	var witnessesCollection = {
		_indexes: {
			witnesses: [],
			groups: [],
			encodingStructure: []
		}
	};
	/**
     * @ngdoc property
     * @name evtviewer.dataHandler.parsedData#genericColors
     * @propertyOf evtviewer.dataHandler.parsedData
     * @description [Private] Internal property where information about generic colors to use for filters are stored.
     	<pre>
			var genericColors = [];
     	</pre>
     */
	var genericColors = config.genericColors;

	/**
     * @ngdoc property
     * @name evtviewer.dataHandler.parsedData#criticalAppCollection
     * @propertyOf evtviewer.dataHandler.parsedData
     * @description [Private] Internal property where information about critical apparatus entries are stored.
     	<pre>
			var criticalAppCollection = {
				[entryId]: {
					type: 'app',
					id: '',
					attributes: [],
					lemma: '',
					note: '',
					content: {
						// READINGS
						// GROUPS
						// SUBAPP
					},
					_indexes: {
						encodingStructure: [],
						readings: {
							_indexes: [],
							_significant: []
						},
						groups: [],
						subApps: [],
						witMap: {}
					},
					_subApp: false | true,
					_xmlSource: ''
				},
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
     	</pre>
     */
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
	/**
     * @ngdoc property
     * @name evtviewer.dataHandler.parsedData#criticalTexts
     * @propertyOf evtviewer.dataHandler.parsedData
     * @description [Private] Internal property where information about critical texts are stored.
     	<pre>
			var criticalTexts = {
				[docId]: ''
			};
     	</pre>
     */
	var criticalTexts = {};
	/**
     * @ngdoc property
     * @name evtviewer.dataHandler.parsedData#editionLevels
     * @propertyOf evtviewer.dataHandler.parsedData
     * @description [Private] Internal property where information about edition levels are stored.
     	<pre>
			var editionLevels = [{
				value,
				label,
				title,
				visible
			}];
     	</pre>
     */
	var editionLevels = [];

	/**
     * @ngdoc property
     * @name evtviewer.dataHandler.parsedData#versionAppCollection
     * @propertyOf evtviewer.dataHandler.parsedData
     * @description [Private] Internal property where information about versions readings are stored.
     	<pre>
			var versionAppCollection = {
				[entryId] : {
					type: 'recensioApp',
					id: '',
					attributes: [],
					lemma: '',
					content: {
						//GROUPS
						//lem
						//rdg*
					},
					_indexes: {
						witMap: {},
					},
					_xmlSource: ''
				},
				_indexes: {
					encodingStructure : [],
					versionWitMap : {},
					versionId : {
						_name: {}
					}
				}
			};
     	</pre>
     * @author CM
     */
	var versionAppCollection = {
		_indexes: {
			encodingStructure : [],
			versionWitMap : {},
			versionId : {
				_name: {}
			}
		}
	};

	/**
     * @ngdoc property
     * @name evtviewer.dataHandler.parsedData#versionTexts
     * @propertyOf evtviewer.dataHandler.parsedData
     * @description [Private] Internal property where information about versions texts are stored.
     	<pre>
			var versionTexts = {
				[docId]: {
					[verId]: ''
				}
			};
     	</pre>
     * @author CM
     */
	var versionTexts = {};
	/**
     * @ngdoc property
     * @name evtviewer.dataHandler.parsedData#criticalEdition
     * @propertyOf evtviewer.dataHandler.parsedData
     * @description [Private] Internal property where information about availability of critical edition level for the current parsed edition is stored.
     	<pre>
			var criticalEdition = false | true
     	</pre>
     */
	var criticalEdition = false;
	/**
     * @ngdoc property
     * @name evtviewer.dataHandler.parsedData#glyphsCollection
     * @propertyOf evtviewer.dataHandler.parsedData
     * @description [Private] Internal property where information about glyphs are stored.
     	<pre>
			var glyphsCollection = {
				[glyphId] : {
					id,
					xmlCode,
					mapping: {
						[typeOfMapping] : {
							element,
							content,
							attributes: []
						}
					},
					parsedXml
				},
				_indexes: []
			};
     	</pre>
     */
	var glyphsCollection = {
		_indexes: []
	};
	/**
     * @ngdoc property
     * @name evtviewer.dataHandler.parsedData#glyphsCollection
     * @propertyOf evtviewer.dataHandler.parsedData
     * @description [Private] Internal property where information about zones are stored.
     	<pre>
			var zonesCollection = {
				[zoneId] : {
					page,
					id,
					[attribName]: ''
				},
				_indexes: [zoneId]
			};
     	</pre>
     */
	var zonesCollection = {
		_indexes: []
	};
	/**
     * @ngdoc property
     * @name evtviewer.dataHandler.parsedData#namedEntities
     * @propertyOf evtviewer.dataHandler.parsedData
     * @description [Private] Internal property where information about named entities are stored.
     	<pre>
			var namedEntities = {
				_collections: {
					[collectionId]: {
						[listKey] = {
							[namedEntityId] : {
								id,
								label,
								content: {
									_indexes: []
								},
								_listPos,
								_xmlSource
							},
							_indexes: []
						},
						_indexes: [],
						_listKeys: [],
						_title,
						_type,
						_icon
					},
					_indexes: []
				},
				_indexes: []
			};
     	</pre>
     */
	var namedEntities = {
		_collections: {
			_indexes: []
		},
		_indexes: []
	};
	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#getEncodingDetail
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Get a particular detail about the encoding of source edition document.
     * @param {string} detailName Name of detail to retrieve
     * @returns {string} value of detail retrieved
     */
	parsedData.getEncodingDetail = function(detailName) {
		return encodingDetails[detailName];
	};

	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#setEncodingDetail
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Store a particular detail about the encoding of source edition document.
     * @param {string} detailName Name of detail to store
     * @param {string} value Value of detail to store
     */
	parsedData.setEncodingDetail = function(detailName, value) {
		encodingDetails[detailName] = value;
	};

	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#getNamedEntityTypeIcon
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Get the icon connected to a particular named entity type
     * @param {string} type Type of named entity to handle
     * @returns {string} name of icon connected to the particular type of named entity
     * @todo Move in Utils provider (?)
     */
	parsedData.getNamedEntityTypeIcon = function(type) {
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

	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#addNamedEntitiesCollection
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Add a new collection of named entities
     * @param {Object} collection Collection of named entities to add to stored ones.
     * It is structure as follows:
     <pre>
		var collection = {
			id,
			type,
			title
		};
     </pre>
     */
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

	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#addNamedEntityInCollection
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Add a named entity in a given collection. If the collection has not yet been stored,
     * it will be added to stored ones. The named entity is both added to the list of entities in the collection
     * and the general list where only information about <code>collectionId</code> and <code>listKey</code> will be saved.
     * @param {Object} collection Collection to be handled. It is structure as follows:
	     <pre>
			var collection = {
				id,
				type,
				title
			};
	     </pre>
	 * @param {Object} namedEntity Named entity to be added. It is structure as follow:
	 	<pre>
			var namedEntity = {
				id,
				label,
				content: {
					_indexes: []
				},
				_listPos,
				_xmlSource
			};
	 	</pre>
	 * @param {string} listKey Ordering key of named entity to be added.
     */
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

	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#getNamedEntitiesCollection
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Retrieve all the collections of named entities.
     * @returns {Object} List of collection of all named entities parsed.
     * The list of all indexes is stored in the property <code>_indexes</code>.
     */
	parsedData.getNamedEntitiesCollection = function() {
		return namedEntities._collections;
	};

	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#getNamedEntitiesCollectionByName
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Retrieve the object representing a named entities' collection by its name
     * (that is used as unique identifier).
     * @param {string} collectionId Identifier (Name) of collection to retrieve
     * @returns {Object} Object representing the named entities collection with
     * that particular <code>collectionId</code>. It is structure as follows:
     	<pre>
			var collection = {
				[listKey] = {
					[namedEntityId] : {
						id,
						label,
						content: {
							_indexes: []
						},
						_listPos,
						_xmlSource
					},
					_indexes: []
				},
				_indexes: [],
				_listKeys: [],
				_title,
				_type,
				_icon
			};
     	</pre>
     */
	parsedData.getNamedEntitiesCollectionByName = function(collectionId) {
		return namedEntities._collections[collectionId];
	};

	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#getNamedEntitiesCollectionByNameAndPos
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Get the list of a named entities in a particular collection that are indexed by a particular key.
     * @param {string} collectionId Id of collection to be handled
     * @param {string} listKey Id of indexing key to be used
     * @returns {Object} Object representing the list of named entities contained in the collection
     * with <code>id = collectionId</code> that have been indexed within given <code>listKey</code>.
     * The list of all the entities' ids is stored in the property <code>_indexes</code>.
     */
	parsedData.getNamedEntitiesCollectionByNameAndPos = function(collectionId, listKey) {
		return namedEntities._collections[collectionId][listKey];
	};

	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#getNamedEntity
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Get the object representing a particular named entity.
     * @param {string} namedEntityId Unique identifier of named entity to be retrieved
     * @returns {Object} Object representing the named entity with <code>id = namedEntityId</code>.
     * It is structured as follows:
     	<pre>
			var namedEntity = {
				id,
				label,
				content: {
					_indexes: []
				},
				_listPos,
				_xmlSource
			};
	 	</pre>
     */
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

	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#getNamedEntityType
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * get the type of a particular named entity.
     * @param {string} namedEntityId Unique identifier of named entity to be retrieved
     * @returns {string} Type of named entity with <code>id = namedEntityId</code>.
     */
	parsedData.getNamedEntityType = function(namedEntityId) {
		var collectionId = namedEntityId && namedEntities[namedEntityId] ? namedEntities[namedEntityId].collectionId : undefined;
		var collectionObj = parsedData.getNamedEntitiesCollectionByName(collectionId);
		return collectionObj ? collectionObj._type : 'generic';
	};

	/////////////////////////////////
	// QUOTES & SOURCES collection //
	/////////////////////////////////
	/**
     * @ngdoc property
     * @name evtviewer.dataHandler.parsedData#quotesCollection
     * @propertyOf evtviewer.dataHandler.parsedData
     * @description [Private] Internal property where information about quotes are stored.
     	<pre>
			var quotesCollection = {
				[quoteId]: {
					type: 'quote',
					id,
					attributes: [],
					content: [],
					_indexes: {
						sourceId: [], // ids of the bibliographic citations that are inside the quote
						sourceRefId: [], // references to bibliographic citations that are outside the quote
						correspId: {}, // ids of the segments inside the source text that correspond to the quote
						subQuotes: [], // ids of quotes nested inside the quote
					},
					_subQuote, // boolean; is the quote nested in another quote?
					_xmlSource
				},
				_indexes: {
					encodingStructure: [],
					sourcesRef: {
						_id: [],
					}
				}
			};
     	</pre>
     * @author CM
     */
	var quotesCollection = {
		_indexes: {
			encodingStructure: [],
			sourcesRef: {
				_id: [],
			}
		}
	};
	/**
     * @ngdoc property
     * @name evtviewer.dataHandler.parsedData#sourcesCollection
     * @propertyOf evtviewer.dataHandler.parsedData
     * @description [Private] Internal property where information about sources are stored.
     	<pre>
			var sourcesCollection = {
				[sourceId]: {
					id,
					abbr: {
						title: [],
						author: [],
						msId: []
					},
					attributes: [],
					quotesEntriesId: [], // ids of the quotes that refer to this source
					bibl: [], // full bibliographic references of the source (which almost always corresponds the content of the source itself)
					quote: [],
					url: [], // links to the full text of the source
					text: {},
					_textAvailable: false,
					_xmlSource
				},
				_indexes: {
					encodingStructure: [],
					quotesRef: {
						_id: [],
					},
					availableTexts : [],
					correspId: {}
				}
			};
     	</pre>
     * @author CM
     */
	var sourcesCollection = {
		_indexes: {
			encodingStructure: [],
			quotesRef: {
				_id: [],
			},
			availableTexts : [],
			correspId: {}
		}
	};
	/**
     * @ngdoc property
     * @name evtviewer.dataHandler.parsedData#sourcesCollection
     * @propertyOf evtviewer.dataHandler.parsedData
     * @description [Private] Internal property where information about analogues are stored.
     	<pre>
			var analoguesCollection = {
				[analogueId]: {
					id,
					type,
					attributes: [],
					content: [],
					sources: [],
					_indexes: {
						sourceId: [],
						sourceRefId: [],
						subAnalogues: []
					},
					_subAnalogue: false | true,
					_xmlSource
				},
				_indexes: {
					encodingStructure: [],
				},
				_refId: {
					_indexes: []
				}
			};
     	</pre>
     * @author CM
     */
	var analoguesCollection = {
		_indexes: {
			encodingStructure: [],
		},
		_refId: {
			_indexes: []
		}
	};

	/* PAGES */
	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#addPage
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Add a page to stored pages collection. If the page has already been added it means that it contains
     * more than one document. In this case the <code>docId</code> will be added to the list
     * of documents contained in the page.
     * The <code>pageId</code> of the new page will be also added to the list of
     * pages of the document with <code>id = docId</code>.
     * @param {Object} page Page to be added. It is structured as:
     	<pre>
			var page = {
				value,
				label,
				title,
				source
			};
     	</pre>
     * @param {string} docId Identifier of document in which the page is contained
     * @todo add attribute for the original xml reference
     */
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
	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#getPages
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Get the list of parsed pages.
     * @returns {Object} Object representing the list of parsed pages.
     */
	parsedData.getPages = function() {
		return pagesCollection;
	};
	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#getPage
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Get the object representing a particular page.
     * @param {stirng} pageId Identifier of the page to retrieve
	 * @returns {Object} Object representing the page with <code>id = pageId</code>.
	 * It is structured as follow:
	 	<pre>
			var page = {
				value,
				label,
				title,
				source,
				text: {
					[docId] : {
						[editionLevel]: ''
					}
				},
				docs: []
			};
	 	</pre>
     */
	parsedData.getPage = function(pageId) {
		return pagesCollection[pageId];
	};

	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#setPageText
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
	 * Set the text in a particular edition level of a page within a particular document.
	 * If we are adding the text for a document not yet listed in the <code>docs</code> property,
	 * it will be added to it.
	 * @param {string} pageId Identifier of the page to be handled
	 * @param {string} docId Identifier of the document to be handled
	 * @param {string} editionLevel Edition level of text to be added
	 * @param {string} HTMLtext String representing the HTML of the page within the particular document at a particular edition level
     */
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

	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#getPageText
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Retrieve the text of a particular page within a particular document at a particular edition level.
     * @param {string} pageId Identifier of the page to be handled
	 * @param {string} docId Identifier of the document to be handled
	 * @param {string} editionLevel Edition level to be handled
	 */
	parsedData.getPageText = function(pageId, docId, editionLevel) {
		var pageObj = pagesCollection[pageId];
		if (pageObj && pageObj.text && pageObj.text[docId]) {
			return pageObj.text[docId][editionLevel];
		}
		return undefined;
	};

	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#getPageImage
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Get the image url of the facsimile related to a particular page.
     * @param {string} pageId Identifier of the page to be handled
     * @returns {Object} Object representing the facsimile connected to the page with <code>id = pageId</code>
     * @todo: Do it again!!
     */
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
	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#addDocument
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Add document to stored collection
     * @param {Object} doc Object representing the document to add.
     * It is structured as follows:
     	<pre>
			var doc = {
				value,
				label,
				title,
				content,
				front,
				pages
			};
     	</pre>
     */
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
	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#getDocuments
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Retrieve collection of parsed documents.
     * @returns {Object} Object representing the collection of parsed documents.
     * It is structured as follows:
     	<pre>
			var documentsCollection = {
				[docId]: {},
				_indexes: [],
				length: 0
			};
     	</pre>
     */
	parsedData.getDocuments = function() {
		return documentsCollection;
	};
	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#getDocument
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Retrieve information about a particular document.
     * @param {string} docId Identifier of document to retrieve
     * @returns {Object} Object representing the document with <code>id = docId</code>.
     * It is structured as follows:
     	<pre>
			var doc = {
				value,
				label,
				title,
				content,
				front,
				pages,
			};
     	</pre>
     */
	parsedData.getDocument = function(docId) {
		return documentsCollection[docId];
	};
	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#getPreviousDocument
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Get the document that preceeds a particular one in the list of parsed ones.
     * @param {string} docId Identifier of document to handle
     * @ returns {Object} Object representing the document that preceeds the one with <code>id = docId</code>.
     * It is structured as follows:
     	<pre>
			var doc = {
				value,
				label,
				title,
				content,
				front,
				pages,
			};
     	</pre>
     */
	parsedData.getPreviousDocument = function(docId) {
		var currentDocIndex = documentsCollection._indexes.indexOf(docId);
		var previousId = documentsCollection._indexes[currentDocIndex - 1];
		return documentsCollection[previousId];
	};

	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#addExternalDocument
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Add an external document in the collection of external files.
	 * @param {Object} extDoc Object representing the document to add.
	 * It is structured as follows:
	 	<pre>
			var extDoc = {
				value: type,
				content: doc
			};
	 	</pre>
	 * @author CM
     */
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

	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#getExternalDocuments
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Get the collection of external documents that have been parsed.
     * @returns {Object} Object representing the collection of parsed external documents.
     * @author CM
     */
	parsedData.getExternalDocuments = function() {
		return externalDocsCollection;
	};

	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#getExternalDocument
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Retrieve information about a particular external document
     * @param {string} extDocId Identifier of external document to retrieve
     * @returns {Object} Object representing the external document with <code>id = extDocId</code>.
	 * It is structured as follows:
	 	<pre>
			var extDoc = {
				value: type,
				content: doc
			};
	 	</pre>
     * @author CM
     */
	parsedData.getExternalDocument = function(extDocId) {
		return externalDocsCollection[extDocId];
	};

	// Method to store sources XML documents
	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#addSourceDocument
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Add sources document, that is connected to a particular document.
     * @param {Object} extDoc Object representing the external source document to add.
     * It is structured as follows:
	 	<pre>
			var extDoc = {
				value: type,
				content: doc
			};
	 	</pre>
	 * @param {string} id Identifier of document connected to the current external source
     * @author CM
     */
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

	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#getSourceDocuments
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Retrieve the collection of external source documents that have been parsed.
     * @returns {Object} Object representing the collection of parsed external source documents
     * @author CM
     */
	parsedData.getSourceDocuments = function() {
		return sourcesDocsCollection;
	};

	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#getSourceDocument
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Retrieve information about a particular external source document
     * @param {string} extDocId Identifier of external source document to retrieve
     * @returns {Object} Object representing the external source document retrieved.
	 * It is structured as follows:
	 	<pre>
			var extDoc = {
				value: type,
				content: doc
			};
	 	</pre>
     * @author CM
     */
	parsedData.getSourceDocument = function(extDocId) {
		return sourcesDocsCollection[extDocId];
	};

	/* EDITION */
	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#setCriticalEditionAvailability
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Set availability of critical edition level for the current parsed edition.
     * This method is used during parsing phase and will set the availability based on
     * the presence of particular elements and information in the original document.
     * @param {boolean} isAvailable Whether the critical edition level is available or not
     */
	parsedData.setCriticalEditionAvailability = function(isAvailable) {
		criticalEdition = isAvailable;
	};

	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#isCriticalEditionAvailable
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Check whether the critical edition level is available or not for current parsed edition.
     * @returns {boolean} Whether the critical edition level is available or not
     */
	parsedData.isCriticalEditionAvailable = function() {
		return criticalEdition;
	};

    /**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#setEditions
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Set the edition levels informations.
     * Edition level informations are retrieved from configuration file.
     * @param {Object} editions Object representing the edition levels information.
     * It is an array of edition data, each one structured as follows:
     	<pre>
			var edition = {
				value,
				label,
				title,
				visible
			};
     	</pre>
     */
    parsedData.setEditions = function(editions) {
        editionLevels = editions;
    };

	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#addEdition
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Add the information about a particular edition level to stored ones.
     * Edition level informations are retrieved from configuration file.
     * @param {Object} edition Object representing the information about one edition level.
     * It is structured as follows:
     	<pre>
			var edition = {
				value,
				label,
				title,
				visible
			};
     	</pre>
     */
	parsedData.addEdition = function(edition) {
		editionLevels.push(edition);
	};

	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#getEditions
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Retrieve the information about the parsed edition levels.
     * Edition level informations are retrieved from configuration file.
     * @returns {array} List of information about edition level.
     * Each object within this array is structured as follows:
     	<pre>
			var edition = {
				value,
				label,
				title,
				visible
			};
     	</pre>
     */
	parsedData.getEditions = function() {
		return editionLevels;
	};

	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#getEdition
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Get information about a particular edition level (useful to retrieve availability or label).
     * @param {string} editionId Identifier of edition level to retrieve
     * @returns {Object} Object representing the edition level with <code>value = editionId</code>.
     * It is structured as follows:
     	<pre>
			var edition = {
				value,
				label,
				title,
				visible
			};
     	</pre>
     * @todo Do it again... better!
     */
	parsedData.getEdition = function(editionId) {
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
	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#addElementInWitnessCollection
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Add element in witness collection. The element could be an object representing a witness
     * or an object representing a group of witness.
     * @param {Object} element Object representing a witness or a group of witness.
     * It could be structured as follows:
     	<pre>
			var elementWitness = {
				id,
                attributes,
                description,
                _group,
                _type = 'witness'
			};
			var elementGroup = {
				id,
	            name,
	            content,
	            _type = 'group',
	            _group,
	            text
			};
     	</pre>
     */
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

	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#addWitnessText
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Add text of a particular witness for a particular document.
     * The text will be added only if there is already a reference of the witness
     * in the collection of parsed ones!
     * @param {string} witId Identifier of witness to handle
     * @param {string} docId Identifier of document to handle
     * @param {string} content HTML string representing the content of the witness for the indicated document
     */
	parsedData.addWitnessText = function(witId, docId, content) {
		if (witnessesCollection[witId] !== undefined) {
			if (witnessesCollection[witId].text === undefined) {
				witnessesCollection[witId].text = {};
			}
			witnessesCollection[witId].text[docId] = content;
		}
	};
	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#getWitnessText
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Retrieve the text of a witness for a particular document
     * @param {string} witId Identifier of witness to handle
     * @param {string} docId Identifier of document to handle
     * @returns {string} HTML string representing the content of the witness for the indicated document
     */
	parsedData.getWitnessText = function(witId, docId) {
		if (witnessesCollection[witId] !== undefined) {
			if (witnessesCollection[witId].text !== undefined && witnessesCollection[witId].text[docId] !== undefined) {
				return witnessesCollection[witId].text[docId];
			}
		}
	};
	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#getWitnessesList
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Retrieve the list of parsed witnesses
     * @returns {array} List of IDs of witnesses that have been parsed
     */
	parsedData.getWitnessesList = function() {
		return witnessesCollection._indexes.witnesses;
	};
	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#getWitnesses
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Retrieve the collection of parsed witness
     * @returns {Object} Object contaning all the information about the witnesses and group of witnesses that have been parsed
     */
	parsedData.getWitnesses = function() {
		return witnessesCollection;
	};
	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#getWitness
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Retrieve the information about a particular witness
     * @param {string} witId Identifier representing the witness to retrieve
     * @returns {Object} Object contaning all the parsed information about the witness with <code>id = witId</code>.
     * It is structured as follows:
     	<pre>
			var witness = {
				id,
                attributes,
                description,
                _group,
                _type = 'witness'
			};
     	</pre>
     */
	parsedData.getWitness = function(witId) {
		return witnessesCollection[witId];
	};
	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#getWitnessPages
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Retrieve the list of pages within a particular witness.
	 * @param {string} witId Identifier of witness to handle
	 * @returns {Object} Object representing the list of pages within the witness with <code>id = witId</code>
     */
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
	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#isWitnessesGroup
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Check whether a sigla represent a single witness or a group of witnesses.
     * @param {string} sigla Sigla to be checked
     * @returns {boolean} whether the sigla represent a single witness or a group of witnesses
     */
	parsedData.isWitnessesGroup = function(sigla) {
		return witnessesCollection[sigla] !== undefined && witnessesCollection[sigla]._type === 'group';
	};
	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#getWitnessesInGroup
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Retrieve the list of witnesses within a particular group.
     * @param {string} groupId Identifier of group to handle
     * @returns {array} list of IDs of witnesses contained in the group with <code>id = groupId</code>
     */
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

	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#getWitnessesListFormatted
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Retrieve the list of witnesses properly formatted and ready to be compiled in the HTML.
     * @returns {string} HTML string representing the formatted list of witnesses
     * @todo: Find another way of doing this!
     */
	parsedData.getWitnessesListFormatted = function() {
		var structure = witnessesCollection._indexes.encodingStructure;
		var content;
		content = '<ul>';
		for (var i = 0; i < structure.length; i++) {
			var element = witnessesCollection[structure[i]];
			content += formatWitnessesListElement(element);
		}
		content += '</ul>';
		return content;
	};
	var formatWitnessesListElement = function(element) {
		var content = '';
		var sigla = '';
		if (element._type === 'witness') {
			content += '<li><div>';
			if (element.attributes && element.attributes.n) {
				sigla = element.attributes.n;
			} else if (element.sigla && element.sigla !== '') {
				sigla = element.sigla;
			}
			content += '<strong>' + sigla + '</strong>';

			if (element.description) {
				if (element.description.nodeType === 3) {
					if (element.description.textContent !== '' && sigla !== '') {
						content += ': ';
					}
					content += element.description.textContent;
				} else {
					if (element.description.innerHTML !== '' && sigla !== '') {
						content += ': ';
					}
					content += element.description.innerHTML;
				}
			}
			content += '</div></li>';
		} else {
			content += '<li><div>';
			if (element.attributes && element.attributes.n) {
				sigla = element.attributes.n;
			} else if (element.sigla && element.sigla !== '') {
				sigla = element.sigla;
			}
			content += '<strong>' + sigla + '</strong>';
			if (sigla !== '' && element.name !== '') {
				content += ': ';
			}
			content += element.name;
			content += '</div><ul>';
            var elementContentLength = element.content ? element.content.length : 0;
			for (var j = 0; j < elementContentLength; j++) {
				var subElement = witnessesCollection[element.content[j]];
				content += formatWitnessesListElement(subElement);
			}
			content += '</ul>';
			content += '</li>';
		}
		return content;
	};

	// //////////////// //
	// CRITICAL ENTRIES //
	// //////////////// //
	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#getCriticalTextsCollection
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Retrieve the collection of critical texts that have been parsed.
     * @returns {Object} Object representing the collection of critical texts parsed from source data
     */
	parsedData.getCriticalTextsCollection = function() {
		return criticalTexts;
	};
	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#addCriticalText
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Add the critical text for a particular document.
     * @param {string} text HTML string representing the parsed critical text
     * @param {string} docId Identifier of document to handle
     */
	parsedData.addCriticalText = function(text, docId) {
		criticalTexts[docId] = text;
	};

	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#getCriticalText
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Retrieve the critical text of a particular document.
	 * @param {string} docId Identifier of document to handle
	 * @returns {string} HTML string representing the parsed critical text
     */
	parsedData.getCriticalText = function(docId) {
		return criticalTexts[docId];
	};

	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#resetCriticalEntries
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Reset the collection of parsed critical entries. Since the collection has a
     * quite complex structure this reset function was necessary!
     */
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

	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#generateAlphabeticExponent
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * [PRIVATE] Generate an alphanumeric exponent based on already retrieve critical apparatus entries.
     * @returns {string} Alphanumeric exponent generated
     */
	var generateAlphabeticExponent = function() {
		var number = criticalAppCollection._indexes.appEntries.length,
			exponent;
		var firstExp, lastExp;
        if (number > 26) {
            firstExp = (Math.floor(number/26))+96;
            if (number%26 === 0) {
                exponent = '&#'+(firstExp-1)+';z';
            } else {
            lastExp = (number%26)+96;
            exponent='&#'+firstExp+';&#'+lastExp+';'; }
        } else {
            exponent = '&#'+(number+96)+';';
        }
        return exponent;
	};

	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#addCriticalEntry
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Add a critical apparatus entry to the collection of parsed ones.
     * Before the addition an alphanumeric exponent will be generated and associated to the new entry,
     * depending on previous parsed entries.
     * After the addition the maximal variance for the critical apparatus entries
     * will be eventually updated with the new entry variance value.
     * @param {Object} entry Object representing a critical apparatus entry.
     * It is structured as follows:
     	<pre>
			var entry = {
				type: 'app',
				id: '',
				attributes: [],
				lemma: '',
				note: '',
				content: {
					// READINGS
					// GROUPS
					// SUBAPP
				},
				_indexes: {
					encodingStructure: [],
					readings: {
						_indexes: [],
						_significant: []
					},
					groups: [],
					subApps: [],
					witMap: {}
				},
				_subApp: false | true,
				_xmlSource: ''
			};
     	</pre>
     */
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

	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#setCriticalEntriesLoaded
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Set a flag that will allow a quick check about the critical apparatus entries loading status.
     * @param {boolean} status Whether the critical apparatus entries have been all loaded or not
     */
	parsedData.setCriticalEntriesLoaded = function(status) {
		criticalAppCollection.__allLoaded = status;
	};

	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#getCriticalEntries
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Retrieve the collection of all critical apparatus entries that have been parsed.
     * @returns {Object} Object representing the parsed critical apparatus entries. It is structured as follows:
     	<pre>
			var criticalAppCollection = {
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
     	</pre>
     */
	parsedData.getCriticalEntries = function() {
		return criticalAppCollection;
	};

	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#getCriticalEntryById
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Retrieve the information about a particular critical apparatus entry.
     * @param {string} entryId Identifier of critical apparatus entry to handle
     * @returns {Object} Object representing the critical apparatus entry with <code>id = entryId</code>.
     * It is structured as follows:
     	<pre>
			var entry = {
				type: 'app',
				id: '',
				attributes: [],
				lemma: '',
				note: '',
				content: {
					// READINGS
					// GROUPS
					// SUBAPP
				},
				_indexes: {
					encodingStructure: [],
					readings: {
						_indexes: [],
						_significant: []
					},
					groups: [],
					subApps: [],
					witMap: {}
				},
				_subApp: false | true,
				_xmlSource: ''
			};
     	</pre>
     */
	parsedData.getCriticalEntryById = function(entryId) {
		return criticalAppCollection[entryId];
	};

	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#getCriticalEntryExponent
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Retrieve the exponent of a particular critical apparatus entry.
     * @param {string} entryId Identifier of critical apparatus entry to handle
     * @returns {string} Alphanumeric exponent associated to the critical apparatus entry with <code>id = entryId</code>
     */
	parsedData.getCriticalEntryExponent = function(entryId) {
		var entry = parsedData.getCriticalEntryById(entryId);
		return (entry ? entry.exponent : '');
	};

	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#getCriticalEntriesMaxVariance
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Retrieve the maximal variance registered for the critical apparatus entries.
     * @returns {number} maximal variance registered
     */
	parsedData.getCriticalEntriesMaxVariance = function() {
		return criticalAppCollection._maxVariance;
	};

	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#getReadingAttributes
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Retrieve the attributes associated to a particular reading within a particular critical apparatus entry.
     * @param {string} readingId Identifier of reading to handle
     * @param {string} appId Identifier of critical apparatus entry to handle
	 * @returns {array} List of attributes (pair of label/value) registered for the particular
	 * reading within a particular critical apparatus entry.
     */
	parsedData.getReadingAttributes = function(readingId, appId) {
		var attributes = [];
		if (criticalAppCollection[appId].content[readingId] !== undefined) {
			attributes = criticalAppCollection[appId].attributes;
			var readingAttributes = criticalAppCollection[appId].content[readingId].attributes;
			for (var key in readingAttributes) {
				attributes[key] = readingAttributes[key];
			}
		}
		return attributes;
	};

	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#isSubApp
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Check if a critical apparatus entry is a "Sub apparatus", or rather it is nested in another critical apparatus entry.
     * @param {string} appId Identifier of critical apparatus entry to check.
     * @returns {boolean} whether a critical apparatus entry is a "Sub apparatus" or not
     */
	parsedData.isSubApp = function(appId) {
		return criticalAppCollection[appId]._subApp;
	};

	/* CRITICAL ENTRIES FILTERS */
	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#getGenericColorForAppEntry
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Retrieve a generic color to be associated to a critical apparatus entry filter.
     * First of all the system will try to get the color from a given list of colors
     * (that's why we need to pass the <code>index</code> of the filter handled); if no colors
     * available, it will generate a new random color, being aware that it has not been used yet.
     * @param {string} index Index of current filter handled.
     * @returns {string} Hex or RGB string representing the color to be associated to the filter handled
     */
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

	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#addCriticalEntryFilter
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Add a new critical apparatus entry filter to filters collection.
     * The filters collection is structured in a way that for each "filter name"
     * there could be more values; each value is an <code>Object</code> in which
     * are defined both the <code>value</code> and the <code>color</code>
     * (the color is assigned automatically depending on a given list of color or on a random generation).
     * Each filter will be also restricted to a particular type of reading (either variant or lemma or both).
     * @param {string} name Name of filter to be added
     * @param {string} value Value of filter to be added
     */
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

	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#getCriticalEntriesFiltersCollection
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Retrieve the stored collection of critical apparatus entries filters.
     * @returns {Object} Critical apparatus entries filters collection. It is structured as follows:
     	<pre>
			var filtersCollection = {
				filters: {},
				length: 0,
				forLemmas: 0,
				forVariants: 0,
				colors: []
			};
     	</pre>
     */
	parsedData.getCriticalEntriesFiltersCollection = function() {
		return criticalAppCollection.filtersCollection;
	};

	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#getCriticalEntriesFilters
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Retrieve the list of saved critical apparatus entries filters.
     * @returns {Object} List of saved critical apparatus entries filters. It is structured as follows:
     	<pre>
			var filters = {
				[nameOfFilter] : {
					name,
					possibleFor: {
						lemma: true | false,
						variant: true | false
					},
					values: {
						[value] = {
							name,
							color
						}
					}
				}
			};
     	</pre>
     */
	parsedData.getCriticalEntriesFilters = function() {
		return criticalAppCollection.filtersCollection.filters;
	};

	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#getCriticalEntriesFilterValues
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Retrieve the information about a particular critical apparatus entries filter.
     * @param {string} filter Name of filter to retrieve
     * @returns {Object} Object representing the information about a particular critical apparatus entries filter.
     * It is structured as follows:
     	<pre>
			var filter = {
				name,
				possibleFor: {
					lemma: true | false,
					variant: true | false
				},
				values: {
					[value] = {
						name,
						color
					}
				}
			};
     	</pre>
     */
	parsedData.getCriticalEntriesFilterValues = function(filter) {
		return criticalAppCollection.filtersCollection.filters[filter];
	};

	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#getCriticalEntriesFilterColor
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Retrieve the color associated to a particular value of a particular critical apparatus entries filter.
     * @param {string} filter Name of filter to handle
     * @param {string} value Value to handle
     * @returns {string} Hex or RGB string representing the color code associated to the particular value
     * of the particular critical apparatus entries filter requested.
     */
	parsedData.getCriticalEntriesFilterColor = function(filter, value) {
		return criticalAppCollection.filtersCollection.filters[filter].values[value].color;
	};

	// ////////////////// //
	// BIBLIOGRAPHIC REFs //
	// ////////////////// //
	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#addBibliographicRef
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Add a bibliographic reference to the collection of parsed ones.
     * @param {Object} biblElement Object representing the bibliographic reference to add. it is structured as follows:
     	<pre>
			var biblElement = {
				id: '',
                type: '',
                author: [],
                titleAnalytic: '',
                titleMonogr: '',
                editionMonogr: '',
                date: '',
                editor: [],
                publisher: '',
                pubPlace: '',
                biblScope: {},
                note: {},
                idno: {},
                outputs: {},
                plainText: ''
			};
     	</pre>
     * @author MR
     * @todo: reorganize in EVT general style JSON model
     */
	parsedData.addBibliographicRef = function(biblElement) {
		if (bibliographicRefsCollection[biblElement.id] === undefined) {
			bibliographicRefsCollection[biblElement.id] = biblElement;
			bibliographicRefsCollection._indexes.push(biblElement.id);
		}
	};

	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#getBibliographicRefsCollection
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Retrieve the collection of bibliographic references parsed from main source text.
     * @returns {Object} Object representing the bibliographic references collection.
     * It is structured as follows:
     	<pre>
			var bibliographicRefsCollection = {
				[biblElemId] : {
					id: '',
	                type: '',
	                author: [],
	                titleAnalytic: '',
	                titleMonogr: '',
	                editionMonogr: '',
	                date: '',
	                editor: [],
	                publisher: '',
	                pubPlace: '',
	                biblScope: {},
	                note: {},
	                idno: {},
	                outputs: {},
	                plainText: ''
				},
				_indexes: [biblElemId]
			};
     	</pre>
     * @author MR
     * @todo: reorganize in EVT general style JSON model
     */
	parsedData.getBibliographicRefsCollection = function() {
		return bibliographicRefsCollection;
	};

	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#getBibliographicRefById
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Retrieve the all the stored information about a particular bibliographic reference.
     * @param {string} refId Identifier of bibliographic reference to handle
     * @returns {Object} Object representing the parsed information about the bibliographic reference with <code>id = refId</code>.
     * It is structured as follows:
     	<pre>
			var biblElem = {
				id: '',
                type: '',
                author: [],
                titleAnalytic: '',
                titleMonogr: '',
                editionMonogr: '',
                date: '',
                editor: [],
                publisher: '',
                pubPlace: '',
                biblScope: {},
                note: {},
                idno: {},
                outputs: {},
                plainText: ''
			};
     	</pre>
     * @author MR
     * @todo: reorganize in EVT general style JSON model
     */
	parsedData.getBibliographicRefById = function(refId) {
		return bibliographicRefsCollection[refId];
	};

	// /////////////// //
	// VERSION ENTRIES //
	// /////////////// //

	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#addVersionEntry
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Add A version apparatus entry to collection of parsed ones.
     * @param {object} entry Object representing the version apparatus entry to add.
     * It is structured as follows:
     	<pre>
			var entry = {
				type: 'recensioApp',
				id: '',
				attributes: [],
				lemma: '',
				content: {
					//GROUPS
					//lem
					//rdg*
				},
				_indexes: {
					witMap: {},
				},
				_xmlSource: ''
			};
     	</pre>
     * @author CM
     */
	parsedData.addVersionEntry = function(entry) {
		if (versionAppCollection[entry.id] === undefined) {
			versionAppCollection._indexes.encodingStructure.push(entry.id);
			versionAppCollection[entry.id] = entry;
		}
	};

	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#getVersionEntries
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Retrieve the collection of all version apparatus entries.
     * @returns {Object} Object representing the collection of all version apparatus entries.
     * It is structured as follows:
     	<pre>
			var versionAppCollection = {
				[entryId] : {
					type: 'recensioApp',
					id: '',
					attributes: [],
					lemma: '',
					content: {
						//GROUPS
						//lem
						//rdg*
					},
					_indexes: {
						witMap: {},
					},
					_xmlSource: ''
				},
				_indexes: {
					encodingStructure : [],
					versionWitMap : {},
					versionId : {
						_name: {}
					}
				}
			};
     	</pre>
     * @author CM
     */
	parsedData.getVersionEntries = function() {
		return versionAppCollection;
	};

	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#getVersionEntry
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Retrieve all the information about a particular version apparatus entry.
     * @param {string} entryId Identifier of the version apparatus entry to retrieve
     * @returns {Object} Object representing the parsed entry. It is structured as follows:
     	<pre>
			var entry = {
				type: 'recensioApp',
				id: '',
				attributes: [],
				lemma: '',
				content: {
					//GROUPS
					//lem
					//rdg*
				},
				_indexes: {
					witMap: {},
				},
				_xmlSource: ''
			};
     	</pre>
     * @author CM
     */
	parsedData.getVersionEntry = function(entryId) {
		return versionAppCollection[entryId];
	};

	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#addVersionWitness
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Add a witness for a particular version of text.
     * @param {string} ver Identifier of version to handle
     * @param {string} wit Identifier of witness to handle
     * @author CM
     */
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

	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#addVersionText
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Add the parsed text of a particular version of text.
     * @param {string} text HTML string representing the parsed text to add
     * @param {string} docId Identifier of document to handle
     * @param {string} ver Identifier of version to handle
     * @author CM
     */
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

	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#getVersionText
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Retrieve the parsed text of a particular version of text.
     * @param {string} ver Identifier of version to handle
     * @param {string} docId Identifier of document to handle
     * @returns {string} HTML string representing the parsed text of the given version of the given document
     * @author CM
     */
	parsedData.getVersionText = function(ver, docId) {
		return versionTexts[docId][ver];
	};

	// //////////// //
	// PROJECT INFO //
	// //////////// //
	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#updateProjectInfoContent
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Update a particular project information.
     * @param {string} newContent HTML string representing the new value of the data for the particular project information
     * @param {string} type Label of the project information to update
     */
	parsedData.updateProjectInfoContent = function(newContent, type) {
		projectInfo[type] = newContent;
	};
   
	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#getProjectInfo
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Retrieve all project information.
     * @returns {Object} Object representing all the parsed project information. It is structured as follows:
     	<pre>
			var projectInfo = {
				fileDescription: '',
				encodingDescription: '',
				textProfile: '',
				outsideMetadata: '',
				revisionHistory: ''
			};
     	</pre>
     * @todo: Generalize more the JSON object!!
     */
	parsedData.getProjectInfo = function() {
		return projectInfo;
	};

	// ////// //
	// GLYPHS //
	// ////// //
	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#addGlyph
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Add a glyph to the collection of stored ones.
     * @param {Object} glyph Object representing the glyph to add. It is structured as follows:
     	<pre>
			var glyph = {
				id,
				xmlCode,
				mapping: {
					[typeOfMapping] : {
						element,
						content,
						attributes: []
					}
				},
				parsedXml
			};
     	</pre>
     */
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

	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#getGlyphs
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Retrieve all the parsed collection of glyphs.
     * @returns {Object} Object representing the collection of parsed glyphs. It is structured as follows:
		<pre>
			var glyphsCollection = {
				[glyphId] : {
					id,
					xmlCode,
					mapping: {
						[typeOfMapping] : {
							element,
							content,
							attributes: []
						}
					},
					parsedXml
				},
				_indexes: []
			};
		</pre>
     */
	parsedData.getGlyphs = function() {
		return glyphsCollection;
	};

	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#getGlyph
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Retrieve all the information about a particular glyph
     * @param {string} glyphId Identifier of glyph to retrieve
     * @returns {Object} Object representing the glyph to retrieve. It is structured as follows:
     	<pre>
			var glyph = {
				id,
				xmlCode,
				mapping: {
					[typeOfMapping] : {
						element,
						content,
						attributes: []
					}
				},
				parsedXml
			};
     	</pre>
     */
	parsedData.getGlyph = function(glyphId) {
		return glyphsCollection[glyphId];
	};

	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#getGlyphMappingForEdition
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Get the mapping of a particular glyph for a particular edition level
     * @param {string} glyphId Identifier of glyph to handle
     * @param {string} editionLevel Edition label to handle
     * @returns {Object} Object representing all the mapping information of a given glyph for the given edition level.
     * It is structured as follows:
     	<pre>
			var mapping = {
				element,
				content,
				attributes: []
			};
     	</pre>
     */
	parsedData.getGlyphMappingForEdition = function(glyphId, editionLevel) {
		return glyphsCollection[glyphId] ? glyphsCollection[glyphId].mapping[editionLevel] : undefined;
	};

	// ///////////////// //
	// DIGITAL FACSIMILE //
	// ///////////////// //
	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#addZone
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Add a zone to the collection of parsed ones.
     * @param {Object} zone Object representing the zone to add. It ist structured as follows:
     	<pre>
			var zone = {
				page,
				id,
				[attribName]: ''
			};
     	</pre>
     */
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

	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#getZones
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Retrieve the collection of parsed zones.
     * @returns {Object} Object representing the collection of parsed zones
     */
	parsedData.getZones = function() {
		return zonesCollection;
	};

	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#getZone
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Retrieve all the information of a particular zone.
     * @param {string} zoneId Identifier of zone to retrieve
     * @returns {Object} Object representing the zone to add. It ist structured as follows:
     	<pre>
			var zone = {
				page,
				id,
				[attribName]: ''
			};
     	</pre>
     */
	parsedData.getZone = function(zoneId) {
		return zonesCollection[zoneId];
	};

	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#isITLAvailable
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Check whether the Image-Text Linking tool is available or not, depending on configuration preferences and parsed information.
     * @returns {boolean} Whether the Image-Text Linking tool is available or not
     */
	parsedData.isITLAvailable = function() {
		return config.toolImageTextLinking && zonesCollection._indexes.length > 0;
	};

	// ///////////////// //
	// SOURCES APPARATUS //
	// ///////////////// //
	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#addQuote
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Add a quote to the collection of parsed ones.
     * @param {Object} entry Object representing a quote to add. It is structured as follows:
     	<pre>
     		var entry = {
     			type: 'quote',
				id,
				attributes: [],
				content: [],
				_indexes: {
					// bibliographic citations inside the quote
					sourceId: [],
					// bibliographic citations outside the quote
					sourceRefId: [],
					// segments inside the source text that correspond to the quote
					correspId: {},
					// quotes nested inside the quote
					subQuotes: [],
				},
				_subQuote, // boolean; is the quote nested in another quote?
				_xmlSource
     		};
		</pre>
     * @author CM
     */
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

	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#getQuotes
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Retrieve the collection of parsed quotes.
     * @returns {Object} Object representing the collection of parsed quotes. It is structured as follows:
     	<pre>
			var quotesCollection = {
				[quoteId] : {
					type: 'quote',
					id,
					attributes: [],
					content: [],
					_indexes: {
						sourceId: [], // ids of the bibliographic citations that are inside the quote
						sourceRefId: [], // references to bibliographic citations that are outside the quote
						correspId: {}, // ids of the segments inside the source text that correspond to the quote
						subQuotes: [], // ids of quotes nested inside the quote
					},
					_subQuote, // boolean; is the quote nested in another quote?
					_xmlSource
				},
				_indexes: {
					encodingStructure: [],
					sourcesRef: {
						_id: [],
					}
				}
			};
     	</pre>
     * @author CM
     */
	parsedData.getQuotes = function() {
		return quotesCollection;
	};

	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#getQuote
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Retrieve the information about a particular quote.
     * @param {string} entryId Identifier of quote to retrieve
     * @returns {Object} Object representing the quote with <code>id = entryId</code>. It is structured as follows:
     	<pre>
			var quote = {
				type: 'quote',
				id,
				attributes: [],
				content: [],
				_indexes: {
					sourceId: [], // ids of the bibliographic citations that are inside the quote
					sourceRefId: [], // references to bibliographic citations that are outside the quote
					correspId: {}, // ids of the segments inside the source text that correspond to the quote
					subQuotes: [], // ids of quotes nested inside the quote
				},
				_subQuote, // boolean; is the quote nested in another quote?
				_xmlSource
			};
     	</pre>
     * @author CM
     */
	parsedData.getQuote = function(entryId) {
		return quotesCollection[entryId];
	};

	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#addSource
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Add a source to the collection of parsed ones.
     * @param {Object} entry Object representing the source to add. It is structured as follows:
		<pre>
			var entry = {
				id,
				abbr: {
					title: [],
					author: [],
					msId: []
				},
				attributes: [],
				quotesEntriesId: [], // ids of the quotes that refer to this source
				bibl: [], // full bibliographic references of the source (which almost always corresponds the content of the source itself)
				quote: [],
				url: [], // links to the full text of the source
				text: {},
				_textAvailable: false,
				_xmlSource
			};
		</pre>
     * @author CM
     */
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

	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#getSources
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Retrieve the collection of parsed sources.
     * @returns {Object} Object representing the collection of parsed sources. It is structured as follows:
     	<pre>
			var sourcesCollection = {
				[sourceId]: {
					id,
					abbr: {
						title: [],
						author: [],
						msId: []
					},
					attributes: [],
					quotesEntriesId: [], // ids of the quotes that refer to this source
					bibl: [], // full bibliographic references of the source (which almost always corresponds the content of the source itself)
					quote: [],
					url: [], // links to the full text of the source
					text: {},
					_textAvailable: false,
					_xmlSource
				},
				_indexes: {
					encodingStructure: [],
					quotesRef: {
						_id: [],
					},
					availableTexts : [],
					correspId: {}
				}
			};
     	</pre>
     * @author CM
     */
	parsedData.getSources = function() {
		return sourcesCollection;
	};

	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#getSource
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Retrieve all the information about a particular source.
     * @param {string} entryId Identifier of source to retrieve
     * @returns {Object} Object representing the source. It is structured as follows:
		<pre>
			var entry = {
				id,
				abbr: {
					title: [],
					author: [],
					msId: []
				},
				attributes: [],
				quotesEntriesId: [], // ids of the quotes that refer to this source
				bibl: [], // full bibliographic references of the source (which almost always corresponds the content of the source itself)
				quote: [],
				url: [], // links to the full text of the source
				text: {},
				_textAvailable: false,
				_xmlSource
			};
		</pre>
     * @author CM
     */
	parsedData.getSource = function(entryId) {
		return sourcesCollection[entryId];
	};

	// ///////// //
	// ANALOGUES //
	// ///////// //

	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#getAnalogue
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Retrieve the information about a particular analogue.
     * @param {string} analogueId Identifier of analogue to retrieve
     * @returns {Object} Object representing the analogue. It is structured as follows:
     	<pre>
			var analogue = {
				id,
				type,
				attributes: [],
				content: [],
				sources: [],
				_indexes: {
					sourceId: [],
					sourceRefId: [],
					subAnalogues: []
				},
				_subAnalogue: false | true,
				_xmlSource
			};
     	</pre>
     * @author CM
     */
	parsedData.getAnalogue = function(analogueId) {
		return analoguesCollection[analogueId];
	};

	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#getAnalogues
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Retrieve the collection of parsed analogues.
     * @returns {Object} Object representing the collection of parsed analogues. It is structured as follows:
     	<pre>
			var analoguesCollection = {
				[analogueId]: {
					id,
					type,
					attributes: [],
					content: [],
					sources: [],
					_indexes: {
						sourceId: [],
						sourceRefId: [],
						subAnalogues: []
					},
					_subAnalogue: false | true,
					_xmlSource
				},
				_indexes: {
					encodingStructure: [],
				},
				_refId: {
					_indexes: []
				}
			};
     	</pre>
     * @author CM
     */
	parsedData.getAnalogues = function() {
		return analoguesCollection;
	};

	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.parsedData#addAnalogue
     * @methodOf evtviewer.dataHandler.parsedData
     *
     * @description
     * Add an analogue to the collection of parsed ones.
     * @param {Object} entry Object representing the analogue to add. It is structured as follows:
     	<pre>
			var analogue = {
				id,
				type,
				attributes: [],
				content: [],
				sources: [],
				_indexes: {
					sourceId: [],
					sourceRefId: [],
					subAnalogues: []
				},
				_subAnalogue: false | true,
				_xmlSource
			};
     	</pre>
     * @author CM
     */
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
