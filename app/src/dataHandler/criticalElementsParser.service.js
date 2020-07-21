/**
 * @ngdoc service
 * @module evtviewer.dataHandler
 * @name evtviewer.dataHandler.evtCriticalElementsParser
 * @description
 * # evtCriticalElementsParser
 * Service containing methods to parse data regarding critical apparatuses (critical entries, sources, analogues).
 *
 * @requires xmlParser
 * @requires evtviewer.dataHandler.evtParser
 * @requires evtviewer.dataHandler.parsedData
 * @requires evtviewer.core.config
 **/
angular.module('evtviewer.dataHandler')

.service('evtCriticalElementsParser', ['evtParser', 'parsedData', 'config', 'xmlParser', function(evtParser, parsedData, config, xmlParser) {
	var parser = {};

	var apparatusEntryDef = '<app>',
		lemmaDef = '<lem>',
		readingDef = lemmaDef + ', <rdg>',
		readingGroupDef = '<rdgGrp>',
		quoteDef = config.quoteDef || '<quote>',
		analogueDef = config.analogueDef || '<seg>,<ref[type=parallelPassage]>',
		analogueRegExpr = evtParser.createRegExpr(analogueDef);

	// /////////////// //
	// CRITICAL ENTRIES//
	// /////////////// //

	/**
     * @ngdoc function
     * @name evtviewer.dataHandler.evtCriticalElementsParser#parseGenericElement
     * @methodOf evtviewer.dataHandler.evtCriticalElementsParser
     *
     * @description
     * [PRIVATE] This function will parse a generic XML element inside the apparatus reading.
     *
     * @param {element} elem XML element to be parsed
     *
     * @returns {Object} JSON object representing the generic element
     	<pre>
			var genericElement = {
				tagName: '',
				type: 'genericElement',
				attributes: [],
				content: []
			}
     	</pre>
     * @author CDP
     */
	var parseGenericElement = function(elem) {
		if (config.lacunaMilestone.indexOf('<' + elem.tagName + '>') < 0 && config.fragmentMilestone.indexOf('<' + elem.tagName + '>') < 0) {
			var genericElement = {
				tagName: elem.tagName,
				type: 'genericElement',
				attributes: [],
				content: []
			};

			if (elem.attributes) {
				for (var i = 0; i < elem.attributes.length; i++) {
					var attrib = elem.attributes[i];
					if (attrib.specified) {
						genericElement.attributes[attrib.name] = attrib.value;
					}
				}
			}

			angular.forEach(elem.childNodes, function(child) {
				if (child.nodeType === 3) {
					if (child.textContent.trim() !== '') {
						genericElement.content.push(child.textContent.trim());
					}
				} else {
					if ('<' + child.tagName + '>' === apparatusEntryDef) {
						// Sub apparatus
						var entryApp = parser.handleAppEntry(child);
						genericElement.content.push({
							id: entryApp.id,
							type: 'subApp'
						});
					} else {
						var subst = angular.element(child)['0'].innerHTML.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, '');
						var childXml = angular.element(child)['0'].outerHTML.replace(subst, '');
						if (config.fragmentMilestone.indexOf(child.tagName) >= 0 && child.getAttribute('wit') === null) {
							var fragmentSigla = elem.getAttribute('wit');
							child.setAttribute('wit', fragmentSigla);
						}
						if (config.lacunaMilestone.indexOf(child.tagName) >= 0 && child.getAttribute('wit') === null) {
							var lacunaSigla = elem.getAttribute('wit');
							child.setAttribute('wit', lacunaSigla);
						}
						if (quoteDef.indexOf('<' + child.tagName + '>') >= 0) {
							genericElement.content.push(parser.parseQuote(child));
						}
						if (analogueRegExpr.test(childXml)) {
							genericElement.content.push(parser.parseAnalogue(child));
						}
						if (angular.element(child).find(apparatusEntryDef.replace(/[<>]/g, ''))) {
							genericElement.content.push(parseGenericElement(child));
						} else {
							genericElement.content.push(child.cloneNode(true));
						}
					}
				}
			});
			return genericElement;
		} else {
			return elem;
		}

	};
	/**
     * @ngdoc function
     * @name evtviewer.dataHandler.evtCriticalElementsParser#parseAppReading
     * @methodOf evtviewer.dataHandler.evtCriticalElementsParser
     *
     * @description
     * [PRIVATE] This function will parse the XML element representing an apparatus reading
     * (<code>lem</code> or <code>rdg</code> in XML-TEI P5).
     *
     * @param {Object} entry JSON object representing the critical entry to which the reading belongs
     * @param {element} elem XML element to be parsed
     *
     * @returns {Object} JSON object representing the apparatus reading
     	<pre>
			var reading = {
				id: '',
				attributes: [],
				content: [
					//text
					//node
					//subapp { id, type='subApp'}
				],
				note: '',
				_significant: true,
				_group: '',
				_xmlTagName: '',
				_xmlSource: ''
			};
     	</pre>
     * @author CDP
     */
	var parseAppReading = function(entry, elem) {
		var reading = {
			id: '',
			attributes: [],
			content: [
				//text
				//node
				//subapp { id, type='subApp'}
			],
			note: '',
			_significant: true,
			_group: undefined,
			_xmlTagName: elem.tagName,
			_xmlSource: elem.outerHTML
		};

		var id;
		if (elem.getAttribute('xml:id')) {
			id = 'rdg_' + elem.getAttribute('xml:id');
		} else {
			id = evtParser.xpath(elem).substr(1);
		}
		reading.id = id;

		for (var i = 0; i < elem.attributes.length; i++) {
			var attrib = elem.attributes[i];
			if (attrib.specified) {
				reading.attributes[attrib.name] = attrib.value;

				if (attrib.name === 'wit' || attrib.name === 'source') {
					var wits = attrib.value.split('#').filter(function(el) {
						return el.length !== 0;
					});
					reading.wits = [];
					for (var s in wits) {
						var sigla = wits[s].replace(' ', '');
						if (parsedData.getWitness(sigla) !== undefined) { //exclude siglas without reference
							if (parsedData.isWitnessesGroup(sigla)) {
								var witsInGroup = parsedData.getWitnessesInGroup(sigla);
								reading.wits.push.apply(reading.wits, witsInGroup);
								for (var wit in witsInGroup) {
									if (entry._indexes.witMap[witsInGroup[wit]] === undefined) {
										entry._indexes.witMap[witsInGroup[wit]] = id;
									}
								}
							} else {
								reading.wits.push(sigla);
								if (entry._indexes.witMap[sigla] === undefined) {
									entry._indexes.witMap[sigla] = id;
								}
							}
						}
					}
				}
				if (reading._significant) {
					if (config.notSignificantVariant.indexOf('[' + attrib.name + '=' + attrib.value + ']') >= 0) {
						reading._significant = false;
					}
				}
				parsedData.addCriticalEntryFilter(attrib.name, attrib.value);
			}
		}

		angular.forEach(elem.childNodes, function(child) {
			if (child.nodeType === 3) {
				if (child.textContent.trim() !== '') {
					reading.content.push(child.textContent.trim());
				}
			} else if (child.nodeType === 1) {
				if (child.tagName === 'note') {
					reading.note = child.innerHTML;
				} else if (apparatusEntryDef.indexOf('<' + child.tagName + '>') >= 0) {
					// Sub apparatus
					var entryApp = parser.handleAppEntry(child, entry.id);
					// Check if the app is inside a recensioApp or not (@author: CM)
					if (entry.type === 'recensioApp' && elem.parentNode.tagName === 'rdgGrp') {
						var entryAppInRecensio = parser.handleAppEntry(child, elem);
						reading.content.push(entryAppInRecensio);
					} else {
						reading.content.push({
							id: entryApp.id,
							type: 'subApp'
						});
						entry._indexes.subApps.push(entryApp.id);
					}
				} else {
					var subst = '',
						childXml = '';
					if (angular.element(child)['0'].innerHTML !== undefined) {
						subst = angular.element(child)['0'].innerHTML.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, '');
						childXml = angular.element(child)['0'].outerHTML.replace(subst, '');
					}

					if (reading._significant) {
						if (config.notSignificantVariant.indexOf('<' + child.tagName + '>') >= 0) {
							reading._significant = false;
						}
					}
					if (config.fragmentMilestone.indexOf(child.tagName) >= 0 && child.getAttribute('wit') === null) {
						var fragmentSigla = elem.getAttribute('wit');
						child.setAttribute('wit', fragmentSigla);
					}

					if (config.lacunaMilestone.indexOf(child.tagName) >= 0 && child.getAttribute('wit') === null) {
						var lacunaSigla = elem.getAttribute('wit');
						child.setAttribute('wit', lacunaSigla);
					}

					if (quoteDef.indexOf('<' + child.tagName + '>') >= 0) {
						reading.content.push(parser.parseQuote(child));
					} else if (analogueRegExpr.test(childXml)) {
						reading.content.push(parser.parseAnalogue(child));
					} else if (angular.element(child).find(apparatusEntryDef.replace(/[<>]/g, ''))) {
						reading.content.push(parseGenericElement(child));
					} else {
						reading.content.push(child.cloneNode(true));
					}
				}
			}
		});

		return reading;
	};
	/**
     * @ngdoc function
     * @name evtviewer.dataHandler.evtCriticalElementsParser#parseGroupReading
     * @methodOf evtviewer.dataHandler.evtCriticalElementsParser
     *
     * @description
     * [PRIVATE] This function will parse the XML element representing an apparatus reading group
     * (<code>rdgGrp</code> in XML-TEI P5).
     * For each reading contained in the group it will call the function
     * {@link evtviewer.dataHandler.evtCriticalApparatusParser#parseAppReading parseAppReading}
     *
     * @param {Object} entry JSON object representing the critical entry to which the reading belongs
     * @param {element} elem XML element to be parsed
     *
     * @author CDP
     */
    var parseGroupReading = function(entry, elem) {
		var groupObj = {
			attributes: [],
			content: []
		};

		var id;
		if (elem.getAttribute('xml:id')) {
			id = 'rdg_' + elem.getAttribute('xml:id');
		} else {
			id = evtParser.xpath(elem).substr(1);
		}
		groupObj.id = id;

		angular.forEach(elem.childNodes, function(child) {
			if (readingDef.indexOf('<' + child.tagName + '>') >= 0) {
				var readingObj = parseAppReading(entry, child);
				readingObj._group = groupObj.id;
				groupObj.content.push(readingObj.id);

				for (var i = 0; i < elem.attributes.length; i++) {
					var attrib = elem.attributes[i];
					if (attrib.specified) {
						groupObj.attributes[attrib.name] = attrib.value;
						if (readingObj.attributes[attrib.name] === undefined) {
							readingObj.attributes[attrib.name] = attrib.value;
							if (readingObj._significant) {
								if (config.notSignificantVariant.indexOf('[' + attrib.name + '=' + attrib.value + ']') >= 0) {
									readingObj._significant = false;
								}
							}
						}
						parsedData.addCriticalEntryFilter(attrib.name, attrib.value);
					}
				}

				entry._indexes.readings._indexes.push(readingObj.id);
				entry.content[readingObj.id] = readingObj;

				if (readingObj._significant || child.tagName === 'lem') {
					entry._indexes.readings._significant.push(readingObj.id);
				}
			} else if (readingGroupDef.indexOf('<' + child.tagName + '>') >= 0) {
				//TODO
			}
		});
		entry._indexes.groups.push(groupObj.id);
		entry.content[groupObj.id] = groupObj;
		entry._indexes.encodingStructure.push(groupObj.id);
	};
	/**
     * @ngdoc function
     * @name evtviewer.dataHandler.evtCriticalElementsParser#parseAppEntry
     * @methodOf evtviewer.dataHandler.evtCriticalElementsParser
     *
     * @description
     * [PRIVATE] This function will parse the XML element representing an apparatus entry or a group
     * (<code>app</code> or <code>rdgGrp</code> in XML-TEI P5).
     * For each reading contained in the group it will call the function
     * {@link evtviewer.dataHandler.evtCriticalApparatusParser#parseAppReading parseAppReading}
     *
     * @param {element} app XML element representing the apparatus entry or group to be parsed
     *
     * @returns {Object} JSON object representing the apparatus entry parsed
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
				_subApp: false,
				_xmlSource: ''
			};
     	</pre>
     *
     * @author CDP
     */
    var parseAppEntry = function(app) {
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
			_subApp: false,
			_xmlSource: app.outerHTML || ''
		};

		var id;
		if (app.getAttribute('xml:id')) {
			id = 'app_' + app.getAttribute('xml:id');
		} else {
			id = evtParser.xpath(app).substr(1);
		}
		entry.id = id;

		if (app.attributes) {
			for (var i = 0; i < app.attributes.length; i++) {
				var attrib = app.attributes[i];
				if (attrib.specified) {
					entry.attributes[attrib.name] = attrib.value;
					parsedData.addCriticalEntryFilter(attrib.name, attrib.value);
				}
			}
		}

		// Check if the app is nested in an app of type recensio.
		// If not, it is not considered as a subApp, but as a standard app (@author -> CM)
		if (app.parentNode.parentNode.parentNode.tagName === 'app' && app.parentNode.parentNode.parentNode.getAttribute('type') === 'recensio') {
			entry._subApp = false;
		} else {
			entry._subApp = evtParser.isNestedInElem(app, apparatusEntryDef.replace(/[<>]/g, ''));
		}

		// Check if the app is in the main version of the text
		if (config.versions.length > 0) {
			entry._isInMainVersion = evtParser.isInMainVersion(app);
		}

		angular.forEach(app.childNodes, function(child) {
			if (child.nodeType === 1) {
				if (readingDef.indexOf('<' + child.tagName + '>') >= 0) {
					var reading = parseAppReading(entry, child);

					if (lemmaDef.indexOf('<' + child.tagName + '>') >= 0) {
						entry.lemma = reading.id;
					} else {
						entry._indexes.readings._indexes.push(reading.id);
						if (reading._significant &&
							entry._indexes.readings._significant.indexOf(reading.id) < 0) {
							entry._indexes.readings._significant.push(reading.id);
						}
					}

					entry.content[reading.id] = reading;
					entry._indexes.encodingStructure.push(reading.id);
				} else if (readingGroupDef.indexOf('<' + child.tagName + '>') >= 0) {
					parseGroupReading(entry, child);
				} else if (apparatusEntryDef.indexOf('<' + child.tagName + '>') >= 0) {
					var entryObj = parser.handleAppEntry(child, id);
					var subApp = {
						id: entryObj.id,
						type: 'subApp'
					};
					entry.content[entryObj.id] = subApp;
					entry._indexes.encodingStructure.push(entryObj.id);
					entry._indexes.subApp.push(entryObj.id);
				} else if (child.tagName === 'note') {
					entry.note = child.innerHTML;
				}
			}
		});

		return entry;
	};

	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.evtCriticalElementsParser#handleAppEntry
     * @methodOf evtviewer.dataHandler.evtCriticalElementsParser
     *
     * @description
     * This method will handle (nested) apparatus entry. It will call the private function
     * {@link evtviewer.dataHandler.evtCriticalApparatusParser#parseAppEntry parseAppEntry()}
     * and then perform a check on missing witnesses, calculates (and save) variance for the entry depending on different significant reading registered
     * and store it in parsed data using the function {@link evtviewer.dataHandler.parsedData#addCriticalEntry addCriticalEntry()}.
     *
     * @param {element} app XML element representing the apparatus entry or group to be parsed
     * @param {string=} parentEntryId id of the parent apparatus entry in which the current one is nested
     *
     * @returns {Object} JSON object representing the apparatus entry parsed
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
				_subApp: false,
				_xmlSource: ''
			};
     	</pre>
     *
     * @author CDP
     */
    parser.handleAppEntry = function(app, parentEntryId) {
		// if (!app.getAttribute('type') || app.getAttribute('type') !== 'note' || app.getAttribute('type') !== 'recensio') {
		var entry = parseAppEntry(app) || undefined;

		// controllo testimoni mancanti

		if (app.querySelectorAll('rdg lacunaStart').length > 0 || app.querySelectorAll('rdg lacunaEnd').length > 0) {
			entry._lacuna = true;
		}
		if (app.querySelectorAll('rdg witStart').length > 0 || app.querySelectorAll('rdg witEnd').length > 0) {
			entry._fragment = true;
		}

		// Save variance
		var significantReadings = entry._indexes.readings._significant,
			significantReadingsTot = significantReadings.length;
		if (entry.lemma !== '' && significantReadings.indexOf(entry.lemma) >= 0) {
			significantReadingsTot -= 1; //escludo lemma
		}
		var totWits = parsedData.getWitnessesList();

		var variance = significantReadingsTot / totWits.length;
		entry._variance = variance;

		//Find witnesses not encoded in app
		var encodedWits = Object.keys(entry._indexes.witMap),
			missingWits = [];

		if (encodedWits.length < totWits.length) {
			for (var i in totWits) {
				if (encodedWits.indexOf(totWits[i]) < 0) {
					missingWits.push(totWits[i]);
				}
			}
		}
		entry._indexes.missingWits = missingWits;

		var entryLemmaObj = entry.content[entry.lemma];
		if (entryLemmaObj) {
			if (!entryLemmaObj.wits || entryLemmaObj.wits.length === 0) {
				entryLemmaObj.autoWits = missingWits;
			}
		}

		if (parentEntryId) {
			entry._indexes._parentEntry = parentEntryId;
		}
		parsedData.addCriticalEntry(entry);
		return entry;
		// }
	};

	/**
     * @ngdoc function
     * @name evtviewer.dataHandler.evtCriticalElementsParser#parseVersionGroup
     * @methodOf evtviewer.dataHandler.evtCriticalElementsParser
     *
     * @description
     * [PRIVATE] This function will parse the reading group inside of version app.
     *
     * @param {Object} entry JSON object representing the critical entry to which the reading belongs
     * @param {element} group XML element representing the reading group to parse
     *
     * @returns {Object} JSON object representing the reading group inside of version app
     	<pre>
			var groupObj = {
				id: '',
				versionId: '',
				attributes: [],
				content: {},
				lemma: ''
			};
     	</pre>
     *
     * @author CM
     */
    var parseVersionGroup = function(entry, group) {
		var groupObj = {
				id: '',
				versionId: '',
				attributes: [],
				content: {},
				lemma: ''
			},
			id = '';

		if (group.attributes) {
			for (var i = 0; i < group.attributes.length; i++) {
				var attrib = group.attributes[i];
				if (attrib.specified) {
					groupObj.attributes[attrib.name] = attrib.value;
					groupObj.attributes.length++;
					if (attrib.name === 'ana') {
						id = attrib.value.replace('#', '');
						groupObj.id = id;
						var index = config.versions.indexOf(id);
						if (index >= 0) {
							groupObj.versionId = 'Version &#' + (index + 65) + ';';
						}
					}
				}
			}
		}

		angular.forEach(group.childNodes, function(child) {
			if (child.nodeType === 1) {
				var rdg = parseAppReading(entry, child);
				if (rdg.wits === undefined) {
					var witnesses = parsedData.getVersionEntries()._indexes.versionWitMap[id];
					if (witnesses !== undefined && witnesses.length > 0) {
						rdg.wits = [];
						for (var j = 0; j < witnesses.length; j++) {
							rdg.wits.push(witnesses[j]);
						}
					}
				}
				if (child.tagName === 'lem') {
					groupObj.lemma = rdg.id;
				}
				groupObj.content[rdg.id] = rdg;
			}
		});

		entry.content[id] = groupObj;

		return groupObj;
	};
	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.evtCriticalElementsParser#handleVersionEntry
     * @methodOf evtviewer.dataHandler.evtCriticalElementsParser
     *
     * @description
     * This method will parse an app element that encodes the differences between two or more
     * versions of the text in a certain passage.
     *
     * @param {element} app XML element containing the info about the variants between versions
     *
     * @returns {Object} JSON object representing the entry parsed
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
     *
     * @author CM
     */
    parser.handleVersionEntry = function(app) {
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
			_xmlSource: app.outerHTML || ''
		};

		if (app.hasAttribute('xml:id')) {
			entry.id = app.getAttribute('xml:id');
		} else {
			entry.id = evtParser.xpath(app).substr(1);
		}

		if (app.attributes) {
			for (var i = 0; i < app.attributes.length; i++) {
				var attrib = app.attributes[i];
				if (attrib.specified) {
					entry.attributes[attrib.name] = attrib.value;
					entry.attributes.length++;
				}
			}
		}

		angular.forEach(app.childNodes, function(child) {
			if (child.nodeType === 1) {
				if (child.tagName === 'note') {
					entry.note = child.innerHTML;
				} else if (readingGroupDef.indexOf('<' + child.tagName + '>') >= 0) {
					var ver = parseVersionGroup(entry, child);
					var bo = ver.lemma !== '';
					if (ver.id === config.versions[0] && ver.lemma !== '') {
						entry.lemma = ver.lemma;
					}
				}
			}
		});

		parsedData.addVersionEntry(entry);
		return entry;
	};
	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.evtCriticalElementsParser#getEntryWitnessReadingText
     * @methodOf evtviewer.dataHandler.evtCriticalElementsParser
     *
     * @description
     * This method will get the text of the reading for a particular witness in a specific critical apparatus entry.
     *
     * @param {Object} entry JSON object representing the critical entry to handle
     * @param {string} wit id of witness to handle
     *
     * @returns {element} <code>evt-reading</code> element representing the reading of the given witness for the given critical apparatus entry
     *
     * @author CDP
     */
    parser.getEntryWitnessReadingText = function(entry, wit) {
		var spanElement;
		if (entry !== null) {
			var entryReadings = entry._indexes.readings._indexes;
			spanElement = document.createElement('evt-reading');

			if (entry.lemma !== '' && !entry._lacuna && entryReadings.length === 1) {
				var entryWits = entry.content[entryReadings[0]].wits || [];
				if (entryWits.length === parsedData.getWitnessesList().length) {
					spanElement = document.createElement('span');
					spanElement.className = entry.content[entryReadings[0]]._xmlTagName;
				}
			}
			spanElement.setAttribute('data-app-id', entry.id);
			/*
			    IMPORTANT: data-app-id should be the first attribute added to the element
			    otherwise the parser for fragmentary witnesses will not work.
			*/
			spanElement.setAttribute('data-scope-wit', wit);
			var readingId = entry._indexes.witMap[wit];
			if (readingId !== undefined && readingId !== '') {
				spanElement.setAttribute('data-reading-id', readingId);
				var readingContent = entry.content[readingId].content;
				if (readingContent.length > 0) {
					for (var i in readingContent) {
						if (typeof(readingContent[i]) === 'string') {
							spanElement.appendChild(document.createTextNode(readingContent[i]));
						} else {
							if (readingContent[i].type === 'subApp') {
								var subEntry = parsedData.getCriticalEntryById(readingContent[i].id);
								var subEntryElem = parser.getEntryWitnessReadingText(subEntry, wit);
								var subReadingId = subEntry._indexes.witMap[wit] || '';
								subEntryElem.setAttribute('data-reading-id', subReadingId);
								if (subEntryElem !== null) {
									spanElement.appendChild(subEntryElem);
								}
							} else if (readingContent[i].type === 'quote') {
								var quoteElement = parser.getQuoteText(readingContent[i], wit);
								spanElement.appendChild(quoteElement);
							} else if (readingContent[i].type === 'analogue') {
								var analogueElement = parser.getAnalogueText(readingContent[i], wit);
								spanElement.appendChild(analogueElement);
							} else if (readingContent[i].type === 'genericElement') {
								var genericElement = getGenericElementText(readingContent[i], wit);
								spanElement.appendChild(genericElement);
							} else {
								spanElement.appendChild(readingContent[i]);
							}
						}
					}
				} else if (!entry._lacuna) {
					var omitElement = document.createElement('span');
					omitElement.className = 'omission';
					spanElement.appendChild(omitElement);
				} else {
					var lacunaElement = document.createElement('span');
					lacunaElement.className = 'lacunaApp evt_note';
					spanElement.appendChild(lacunaElement);
				}

				// var attribKeys = Object.keys(entry.content[readingId].attributes);
				// for (var key in attribKeys) {
				//     var attrib = attribKeys[key];
				//     var value  = entry.content[readingId].attributes[attrib];
				//     if (attrib !== 'xml:id') {
				//         spanElement.setAttribute('data-entry-attr-'+attrib, value);
				//     }
				// }

			} else if (entry.lemma && entry.lemma.indexOf('depa-lem') < 0) {
				spanElement = parser.getEntryLemmaText(entry, wit);
			} else if (parsedData.getEncodingDetail('variantEncodingMethod') !== 'double-end-point') {
				var noRdgElement = document.createElement('span');
				noRdgElement.className = 'empty';
				noRdgElement.setAttribute('title', 'noRdg');
				spanElement.appendChild(noRdgElement);
			}
		} else {
			var errorElement = document.createElement('span');
			errorElement.className = 'encodingError';
			errorElement.setAttribute('title', 'General error');
			spanElement.appendChild(errorElement);
		}
		spanElement.setAttribute('data-type', 'variant');
		if (spanElement.childNodes.length <= 0) {
			spanElement.innerHTML = '<span class="emptyText"></span>';
		}
		return spanElement;
	};
	/**
     * @ngdoc function
     * @name evtviewer.dataHandler.evtCriticalElementsParser#getGenericElementText
     * @methodOf evtviewer.dataHandler.evtCriticalElementsParser
     *
     * @description
     * [PRIVATE] This function will get the text of a generic element in a specific critical apparatus entry.
     *
     * @param {element} element XML element to be parsed
     * @param {string=} wit id of witness to handle
     *
     * @returns {element} <code>span</code> element representing the text of the given element belonging to given
     *
     * @author CM
     */
	var getGenericElementText = function(element, wit) {
		var spanElement = document.createElement('span');
		spanElement.className = element.tagName;

		var attribKeys = Object.keys(element.attributes);
		for (var key in attribKeys) {
			var attrib = attribKeys[key];
			var value = element.attributes[attrib];
			if (attrib !== 'xml:id') {
				spanElement.setAttribute('data-' + attrib.replace(':', '-'), value);
			}
		}

		var elementContent = element.content;
		for (var i in elementContent) {
			if (typeof(elementContent[i]) === 'string') {
				spanElement.appendChild(document.createTextNode(elementContent[i]));
			} else {
				if (elementContent[i].type === 'subApp') {
					var subEntry = parsedData.getCriticalEntryById(elementContent[i].id);
					var subEntryElem = wit === '' ? parser.getEntryLemmaText(subEntry, wit) : parser.getEntryWitnessReadingText(subEntry, wit);
					var subReadingId = subEntry._indexes.witMap[wit] || '';
					subEntryElem.setAttribute('data-reading-id', subReadingId);
					if (subEntryElem !== null) {
						spanElement.appendChild(subEntryElem);
					}
				} else if (elementContent[i].type === 'quote') {
					var quoteElement = parser.getQuoteText(elementContent[i], wit);
					spanElement.appendChild(quoteElement);
				} else if (elementContent[i].type === 'analogue') {
					var analogueElement = parser.getAnalogueText(elementContent[i], wit);
					spanElement.appendChild(analogueElement);
				} else if (elementContent[i].type === 'genericElement') {
					var genericElement = getGenericElementText(elementContent[i], wit);
					spanElement.appendChild(genericElement);
				}
			}
		}

		return spanElement;
	};
	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.evtCriticalElementsParser#getVersionEntryReadingText
     * @methodOf evtviewer.dataHandler.evtCriticalElementsParser
     *
     * @description
     * This method will get the text of a reading inside of a version entry.
     *
     * @param {Object} entry JSON object representing the version entry to handle
     * @param {string=} wit id of witness to handle
     *
     * @returns {element} <code>evt-version-reading</code> element representing the reading of the given witness for the given version entry
     *
     * @author CM
     */
    parser.getVersionEntryReadingText = function(entry, wit) {
		var spanElement,
			rdgId = '',
			rdgContent = [];
		var i, j, k; //indexes used in this function
		var errorElement;
		if (entry !== null) {
			spanElement = document.createElement('evt-version-reading');
			spanElement.setAttribute('data-app-id', entry.id);
			// If there is a variant that belongs to wit in the entry witMap,
			// it adds the content of the variant to the text
			var iconElement = document.createElement('i');
			iconElement.className = 'iconbis-evt_fork';
			iconElement.setAttribute('title', 'There are alternative versions of this part of text'); //TODO: Add translation
			spanElement.appendChild(iconElement);

			var quoteElement, analogueElement, genericElement;
			if (Object.keys(entry._indexes.witMap).length !== 0) {
				rdgId = entry._indexes.witMap[wit];
				if (rdgId !== '') {
					for (i in entry.content) {
						for (j in entry.content[i].content) {
							if (j === rdgId) {
								rdgContent = entry.content[i].content[j].content;
							}
						}
					}
					if (rdgContent !== undefined && rdgContent.length > 0) {
						for (k in rdgContent) {
							if (typeof(rdgContent[k]) === 'string') {
								spanElement.appendChild(document.createTextNode(rdgContent[k]));
							} else {
								if (rdgContent[k].type === 'app') {
									var appEntry = parsedData.getCriticalEntryById(rdgContent[k].id);
									var appEntryElem = parser.getEntryWitnessReadingText(appEntry, wit);
									if (appEntryElem !== null) {
										spanElement.appendChild(appEntryElem);
									}
								} else if (rdgContent[k].type === 'quote') {
									quoteElement = parser.getQuoteText(rdgContent[k], wit);
									spanElement.appendChild(quoteElement);
								} else if (rdgContent[k].type === 'analogue') {
									analogueElement = parser.getAnalogueText(rdgContent[k], wit);
									spanElement.appendChild(analogueElement);
								} else if (rdgContent[k].type === 'genericElement') {
									genericElement = getGenericElementText(rdgContent[k], wit);
									spanElement.appendChild(genericElement);
								} else if (rdgContent[k].type === 'recensioApp') {
									var versionAppElem = parser.getVersionEntryReadingText(rdgContent[k], wit);
									spanElement.appendChild(versionAppElem);
								} else {
									spanElement.appendChild(rdgContent[k]);
								}
							}
						}
					}
				}
				// If there isn't a variant in the witMap, the text is generated from the lem of the
				// corresponding version, if defined
			} else {
				var ver,
					verWitMap = parsedData.getVersionEntries()._indexes.versionWitMap,
					verEntry;
				for (i in verWitMap) {
					if (verWitMap[i].indexOf(wit) >= 0) {
						ver = i;
					}
				}
				// Check if the witness refers to a particular version
				if (ver !== undefined) {
					spanElement.setAttribute('data-scope-version', ver);
					// if the entry contains a lem for the version the witness belongs to...
					if (entry.content[ver] !== undefined) {
						var verLemma = entry.content[ver].lemma;
						var verRdgIndex = Object.keys(entry.content[ver].content)[0],
							verRdg = entry.content[ver].content[verRdgIndex];
						if (verLemma !== undefined && verLemma !== '') {
							var lemmaContent = entry.content[ver].content[verLemma].content;
							// it adds the content of the lem to the spanElement
							for (j in lemmaContent) {
								if (typeof(lemmaContent[j]) === 'string') {
									spanElement.appendChild(document.createTextNode(lemmaContent[j]));
								} else {
									if (lemmaContent[j].type === 'subApp' || lemmaContent[j].type === 'app') {
										var subEntry = parsedData.getCriticalEntryById(lemmaContent[j].id);
										var subEntryElem = wit === '' ? parser.getEntryLemmaText(subEntry, wit) : parser.getEntryWitnessReadingText(subEntry, wit);
										var subReadingId = subEntry._indexes.witMap[wit] || '';
										subEntryElem.setAttribute('data-reading-id', subReadingId);
										if (subEntryElem !== null) {
											spanElement.appendChild(subEntryElem);
										}
									} else if (lemmaContent[j].type === 'quote') {
										quoteElement = parser.getQuoteText(lemmaContent[j], wit);
										spanElement.appendChild(quoteElement);
									} else if (lemmaContent[j].type === 'analogue') {
										analogueElement = parser.getAnalogueText(lemmaContent[j], wit);
										spanElement.appendChild(analogueElement);
									} else if (lemmaContent[j].type === 'genericElement') {
										genericElement = getGenericElementText(lemmaContent[j], wit);
										spanElement.appendChild(genericElement);
									}
								}
							}
							rdgId = verLemma;
						}
						// otherwise it returns null and no node is attached to the witness text
						else if (verRdg !== undefined && verRdg !== '') {
							var rdgContent = verRdg.content;
							// it adds the content of the lem to the spanElement
							for (j in rdgContent) {
								if (typeof(rdgContent[j]) === 'string') {
									spanElement.appendChild(document.createTextNode(rdgContent[j]));
								} else {
									if (rdgContent[j].type === 'subApp' || rdgContent[j].type === 'app') {
										var subEntry = parsedData.getCriticalEntryById(rdgContent[j].id);
										var subEntryElem = wit === '' ? parser.getEntryWitnessReadingText(subEntry, wit) : parser.getEntryWitnessReadingText(subEntry, wit);
										var subReadingId = subEntry._indexes.witMap[wit] || '';
										subEntryElem.setAttribute('data-reading-id', subReadingId);
										if (subEntryElem !== null) {
											spanElement.appendChild(subEntryElem);
										}
									} else if (rdgContent[j].type === 'quote') {
										quoteElement = parser.getQuoteText(rdgContent[j], wit);
										spanElement.appendChild(quoteElement);
									} else if (rdgContent[j].type === 'analogue') {
										analogueElement = parser.getAnalogueText(rdgContent[j], wit);
										spanElement.appendChild(analogueElement);
									} else if (rdgContent[j].type === 'genericElement') {
										genericElement = getGenericElementText(rdgContent[j], wit);
										spanElement.appendChild(genericElement);
									}
								}
							}
							rdgId = verLemma;
						}
					} else {
						return null;
					}
					// If the witness doesn't refer to a particular version, it creates a specific error message
				} else {
					var warningMsg = document.createTextNode('Warning: no version has been defined for the current witness. Please check your encoded file.'); //TODO: Add translation
					errorElement = document.createElement('span');
					errorElement.className = 'encodingError';
					errorElement.appendChild(warningMsg);
					spanElement.appendChild(errorElement);
				}
			}

			spanElement.setAttribute('data-reading-id', rdgId);
			spanElement.setAttribute('data-scope-wit', wit);
		} else {
			errorElement = document.createElement('span');
			errorElement.className = 'encodingError';
			errorElement.setAttribute('title', 'General error');
			spanElement.appendChild(errorElement);
		}
		spanElement.setAttribute('data-type', 'versionVariant');
		return spanElement;
	};

	// ///////////// //
	// CRITICAL TEXT //
	// ///////////// //
	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.evtCriticalElementsParser#getEntryLemmaText
     * @methodOf evtviewer.dataHandler.evtCriticalElementsParser
     *
     * @description
     * This method will get the text of the lemma in a specific critical apparatus entry.
     *
     * @param {Object} entry JSON object representing the critical apparatus entry to handle
     * @param {string=} wit id of witness to handle that will be used as the scope witness for the <code>evt-reading</code> returned.
     *
     * @returns {element} <code>evt-reading</code> element representing the lemma of the given critical apparatus entry
     *
     * @author CDP
     */
    parser.getEntryLemmaText = function(entry, wit) {
		var spanElement,
			errorElement;

		if (entry !== null) {
			spanElement = document.createElement('evt-reading');
			spanElement.setAttribute('data-app-id', entry.id);
			// IMPORTANT: data-app-id should be the first attribute added to the element
			// otherwise the parser for fragmentary witnesses will not work.
			spanElement.setAttribute('data-scope-wit', wit);
			spanElement.setAttribute('data-type', 'lemma');
			if (entry._lacuna) {
				var lacunaElement = document.createElement('span');
				lacunaElement.className = 'lacunaApp evt_note'; // TODO: DA ELIMINARE QUI IL PALLINO
				spanElement.appendChild(lacunaElement);
			} else if (entry.lemma && entry.lemma.indexOf('depa-lem') < 0) {
				spanElement.setAttribute('data-reading-id', entry.lemma);
				var lemmaContent = entry.content[entry.lemma].content;
				for (var i in lemmaContent) {
					if (typeof(lemmaContent[i]) === 'string') {
						spanElement.appendChild(document.createTextNode(lemmaContent[i]));
					} else {
						if (lemmaContent[i].type === 'subApp') {
							var subEntry = parsedData.getCriticalEntryById(lemmaContent[i].id);
							var subEntryElem = wit === '' ? parser.getEntryLemmaText(subEntry, wit) : parser.getEntryWitnessReadingText(subEntry, wit);
							var subReadingId = subEntry._indexes.witMap[wit] || '';
							subEntryElem.setAttribute('data-reading-id', subReadingId);
							if (subEntryElem !== null) {
								spanElement.appendChild(subEntryElem);
							}
						} else if (lemmaContent[i].type === 'quote') {
							var quoteElement = parser.getQuoteText(lemmaContent[i], wit);
							spanElement.appendChild(quoteElement);
						} else if (lemmaContent[i].type === 'analogue') {
							var analogueElement = parser.getAnalogueText(lemmaContent[i], wit);
							spanElement.appendChild(analogueElement);
						} else if (lemmaContent[i].type === 'genericElement') {
							var genericElement = getGenericElementText(lemmaContent[i], wit);
							spanElement.appendChild(genericElement);
						}
					}
				}
			} else {
				if (config.preferredWitness !== '') {
					spanElement = parser.getEntryWitnessReadingText(entry, config.preferredWitness);
					if (spanElement !== null) {
						spanElement.className = 'autoLemma';
					}
				} else if (parsedData.getEncodingDetail('variantEncodingMethod') !== 'double-end-point') {
					errorElement = document.createElement('span');
					errorElement.className = 'encodingError';
					errorElement.setAttribute('title', 'General error');
					spanElement.appendChild(errorElement);
				}
			}
			if (spanElement !== null) {
				var attribKeys = Object.keys(entry.attributes);
				for (var key in attribKeys) {
					var attrib = attribKeys[key];
					var value = entry.attributes[attrib];
					if (attrib !== 'xml:id') {
						spanElement.setAttribute('data-' + attrib.replace(':', '-'), value);
					}
				}

				if (entry._variance !== undefined) {
					spanElement.setAttribute('data-variance', entry._variance);
					// TODO: da pesare sulla varianza massima
				}
			}
		} else {
			errorElement = document.createElement('span');
			errorElement.className = 'encodingError';
			errorElement.setAttribute('title', 'General error');
			spanElement.appendChild(errorElement);
		}

		if (spanElement.childNodes.length <= 0) {
			spanElement.innerHTML = '<span class="emptyText"></span>';
		}
		return spanElement;
	};
	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.evtCriticalElementsParser#getVersionEntryLemma
     * @methodOf evtviewer.dataHandler.evtCriticalElementsParser
     *
     * @description
     * This method will get the text of the lemma of a specific version encoded in a version.
     *
     * @param {Object} entry JSON object representing the version apparatus entry to handle
     * @param {string} wit id of witness to handle that will be used as the scope witness for the <code>evt-reading</code> returned.
     * @param {string} scopeVersion id of the version to display
     *
     * @returns {element} <code>evt-version-reading</code> element representing the lemma of the given version apparatus entry
     *
     * @author CM
     */
    parser.getVersionEntryLemma = function(entry, wit, scopeVersion) {
		var spanElement,
			errorElement;
		if (entry !== null) {
			spanElement = document.createElement('evt-version-reading');
			spanElement.setAttribute('data-app-id', entry.id);
			spanElement.setAttribute('data-type', 'versionLemma');
			spanElement.setAttribute('data-scope-version', scopeVersion);

			var iconElement = document.createElement('i');
			iconElement.className = 'iconbis-evt_fork';
			iconElement.setAttribute('title', 'There are alternative versions of this part of text');//TODO: add translation
			spanElement.appendChild(iconElement);

			if (entry.content[scopeVersion] !== undefined) {
				var scopeVerLem = entry.content[scopeVersion].lemma;
				var verRdgIndex = Object.keys(entry.content[scopeVersion].content)[0],
							verRdg = entry.content[scopeVersion].content[verRdgIndex];
				if (scopeVerLem !== undefined && scopeVerLem !== '') {
					spanElement.setAttribute('data-reading-id', scopeVerLem);
					var lemmaContent = entry.content[scopeVersion].content[entry.content[scopeVersion].lemma].content;
					for (var i in lemmaContent) {
						if (typeof(lemmaContent[i]) === 'string') {
							spanElement.appendChild(document.createTextNode(lemmaContent[i]));
						} else {
							if (lemmaContent[i].type === 'app') {
								var appEntry = parsedData.getCriticalEntryById(lemmaContent[i].id);
								var appEntryElem = parser.getEntryLemmaText(appEntry, '');
								if (appEntryElem !== null) {
									spanElement.appendChild(appEntryElem);
								}
							} else if (lemmaContent[i].type === 'quote') {
								var quoteElement = parser.getQuoteText(lemmaContent[i], wit);
								spanElement.appendChild(quoteElement);
							} else if (lemmaContent[i].type === 'analogue') {
								var analogueElement = parser.getAnalogueText(lemmaContent[i], wit);
								spanElement.appendChild(analogueElement);
							} else if (lemmaContent[i].type === 'recensioApp') {
								var versionAppElem = parser.getVersionEntryLemma(lemmaContent[i], wit, scopeVersion);
								spanElement.appendChild(versionAppElem);
							}
						}
					}
				} else if (verRdg !== undefined && verRdg !== '') {
					spanElement.setAttribute('data-reading-id', verRdgIndex);
					var rdgContent = verRdg.content;
					for (var i in rdgContent) {
						if (typeof(rdgContent[i]) === 'string') {
							spanElement.appendChild(document.createTextNode(rdgContent[i]));
						} else {
							if (rdgContent[i].type === 'app') {
								var appEntry = parsedData.getCriticalEntryById(rdgContent[i].id);
								var appEntryElem = parser.getEntryWitnessReadingText(appEntry, '');
								if (appEntryElem !== null) {
									spanElement.appendChild(appEntryElem);
								}
							} else if (rdgContent[i].type === 'quote') {
								var quoteElement = parser.getQuoteText(rdgContent[i], wit);
								spanElement.appendChild(quoteElement);
							} else if (rdgContent[i].type === 'analogue') {
								var analogueElement = parser.getAnalogueText(rdgContent[i], wit);
								spanElement.appendChild(analogueElement);
							} else if (rdgContent[i].type === 'recensioApp') {
								var versionAppElem = parser.getVersionEntryLemma(rdgContent[i], wit, scopeVersion);
								spanElement.appendChild(versionAppElem);
							}
						}
					}
				} else {
					errorElement = document.createElement('span');
					errorElement.className = 'encodingError';
					errorElement.setAttribute('title', 'lem missing inside of the version rdgGrp');//TODO: add translation
					spanElement.appendChild(errorElement);
				}
			} else {
				errorElement = document.createElement('span');
				errorElement.className = 'encodingError';
				errorElement.setAttribute('title', 'Wrong version id');//TODO: add translation
				spanElement.appendChild(errorElement);
			}
			if (spanElement !== null) {
				var attribKeys = Object.keys(entry.attributes);
				for (var key in attribKeys) {
					var attrib = attribKeys[key];
					var value = entry.attributes[attrib];
					if (attrib !== 'xml:id') {
						spanElement.setAttribute('data-' + attrib.replace(':', '-'), value);
					}
				}
			}
		} else {
			errorElement = document.createElement('span');
			errorElement.className = 'encodingError';
			errorElement.setAttribute('title', 'General error');//TODO: add translation
			spanElement.appendChild(errorElement);
		}

		return spanElement;
	};

	// //////////////// //
	// QUOTES & SOURCES //
	// //////////////// //

	/**
     * @ngdoc function
     * @name evtviewer.dataHandler.evtCriticalElementsParser#parseQuoteContent
     * @methodOf evtviewer.dataHandler.evtCriticalElementsParser
     *
     * @description
     * [PRIVATE] This is a supporting function that parses the content of a quotation inside the critical
	 * text or the text of a witness. If it finds a nested quote, an analogue, a note
	 * or a critical apparatus entry, it calls the corresponding functions. If the
	 * parsed element has children, the function calls itself recursively, otherwise
	 * the parseXMLElement function is called and the result added to the content.
     *
     * @param {element} elem XML element to be parsed
     *
     * @returns {Object} JSON object representing the quote content parsed
	     <pre>
			var contentEl = {
				tagName: '',
				type: 'quoteContent',
				attributes: [],
				content: [],
				_xmlSource: ''
			};
	     </pre>
     *
     * @author CM
     */
	var parseQuoteContent = function(elem) {
		var contentEl = {
			tagName: elem.tagName,
			type: 'quoteContent',
			attributes: [],
			content: [],
			_xmlSource: elem.outerHTML
		};

		if (elem.attributes) {
			for (var i = 0; i < elem.attributes.length; i++) {
				var attrib = elem.attributes[i];
				if (attrib.specified) {
					contentEl.attributes[attrib.name] = attrib.value;
				}
			}
		}

		angular.forEach(elem.childNodes, function(child) {
			if (child.nodeType === 3) {
				if (child.textContent.trim() !== '') {
					contentEl.content.push(child.textContent.trim());
				}
			} else if (child.nodeType === 1) {
				var subst = angular.element(child)['0'].innerHTML.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, '');
				var childXml = angular.element(child)['0'].outerHTML.replace(subst, '');

				if (quoteDef.indexOf('<' + child.tagName + '>') >= 0) {
					contentEl.content.push(parser.parseQuote(child));
				} else if (apparatusEntryDef.indexOf('<' + child.tagName + '>') >= 0) {
					contentEl.content.push(parser.handleAppEntry(child));
				} else if (analogueRegExpr.test(childXml)) {
					contentEl.content.push(parser.parseAnalogue(child));
				}
				/*else if (child.tagName === 'witDetail') {
				                   contentEl.content.push(parser.parseWitDetail(child));
				               }*/
				else if (child.tagName === 'note') {
					contentEl.content.push(evtParser.parseNote(child));
				} else if (child.children.length > 0) {
					for (var i = 0; i < child.children.length; i++) {
						contentEl.content.push(child.children[i].cloneNode(true));
						parseQuoteContent(child.children[i]);
					}
				} else {
					contentEl.content.push(parseQuoteContent(child));
				}
			}
		});
		return contentEl;
	};
	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.evtCriticalElementsParser#parseQuote
     * @methodOf evtviewer.dataHandler.evtCriticalElementsParser
     *
     * @description
     * This method will parse the content and the attributes of a single entry
	 * of the sources apparatus inside of the critical text and save it
	* in {@link evtviewer.dataHandler.parsedData parsedData}.
     *
     * @param {element} entry XML element to be parsed
     *
     * @returns {Object} JSON object representing the quote element parsed
	     <pre>
			var quote = {
				type: 'quote',
				id: '',
				attributes: [],
				content: [],
				_indexes: {
					sourceId: [], //bibliographic citations inside the quote
					sourceRefId: [], //references to bibliographic citations outside the quote
					correspId: {}, //segments inside the source text that correspond to the quote
					subQuotes: [], //quotes nested inside the quote
				},
				_subQuote: false,
				_xmlSource: ''
			};
	     </pre>
     *
     * @author CM
     */
    parser.parseQuote = function(entry) {
		var quote = {
			type: 'quote',
			id: '',
			attributes: [],
			content: [],
			_indexes: {
				sourceId: [], //saves the id of the bibliographic citations that are inside the quote
				sourceRefId: [], //saves the references to bibliographic citations that are outside the quote
				correspId: {}, //saves the id of the segments inside the source text that correspond to the quote
				subQuotes: [], //saves the id of quotes nested inside the quote
			},
			_subQuote: false, //boolean is the quote nested in another quote
			_xmlSource: entry.outerHTML
		};

		var i, j; // Indexes used in this function
		//Parsing the id or creating it with the evtParser.xpath method
		var id;
		if (entry.getAttribute('xml:id')) {
			id = entry.getAttribute('xml:id');
		} else {
			id = evtParser.xpath(entry).substr(1);
		}
		quote.id = id;

		// Check if is in the main version
		if (config.versions.length > 0) {
			quote._isInMainVersion = evtParser.isInMainVersion(entry);
		}

		//Parsing the attributes
		if (entry.attributes) {
			for (i = 0; i < entry.attributes.length; i++) {
				var attrib = entry.attributes[i],
					values;
				if (attrib.specified) {
					quote.attributes[attrib.name] = attrib.value;
				}
				//References to the sources elements
				if (attrib.name === 'source') {
					values = attrib.value.replace(/#/g, '').split(' ');
					quote._indexes.sourceRefId = values;
				}
				//TODO: rivedere se è consono usare ref :/
				if (attrib.name === 'ref') {
					values = attrib.value.replace(/#/g, '').split(' ');
					quote._indexes.sourceRefId = values;
				}
				//Adding the references to the corresponding portions of the sources texts
				if (attrib.name === 'corresp') {
					values = attrib.value.replace(/#/g, '').split(' ');
					for (j in values) {
						var slashIndex = values[j].indexOf('/');
						var sourceId = values[j].substring(0, slashIndex);
						if (quote._indexes.correspId[sourceId] === undefined) {
							quote._indexes.correspId[sourceId] = [];
							quote._indexes.correspId[sourceId].push(values[j].substring(slashIndex + 1));
						} else {
							quote._indexes.correspId[sourceId].push(values[j].substring(slashIndex + 1));
						}
					}
				}
			}
		}

		//Check if the quoteDef element is nested in another quoteDef element
		var aQuoteDef = quoteDef.split(',');
		i = 0;
		while (i < aQuoteDef.length && !quote._subQuote) {
			quote._subQuote = evtParser.isNestedInElem(entry, aQuoteDef[i].replace(/[<>]/g, ''));
			i++;
		}

		//Parsing the contents
		angular.forEach(entry.childNodes, function(child) {
			if (child.nodeType === 3) {
				if (child.textContent.trim() !== '') {
					quote.content.push(child.textContent.trim());
				}
			} else if (child.nodeType === 1) {

				var subst = angular.element(child)['0'].innerHTML.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, '');
				var childXml = angular.element(child)['0'].outerHTML.replace(subst, '');

				//Array of TEI-elements for bibliographic references
				var biblEl = ['bibl', 'biblStruct', 'biblFull', 'msDesc'];
				//Array of TEI-elements for pointers
				var linkEl = ['ptr', 'ref', 'link'];

				//Parsing bibliographic references
				//If there is a listBibl...
				if (child.tagName === 'listBibl') {
					//...parse the childNodes that are a link or a ptr
					for (i = 0; i < child.children.length; i++) {
						if (biblEl.indexOf(child.children[i].tagName) >= 0) {
							var bibl = parser.parseSource(child.children[i], entry);
							//...then add their id to the sourceId array.
							quote._indexes.sourceId.push(bibl.id);
							quote.content.push(bibl);
						} else {
							quote.content.push(parseQuoteContent(child.children[i]));
						}
					}
				} // If there is a bibliographic element, parse it as a Source.
				else if (biblEl.indexOf(child.tagName) >= 0) {
					var bib = parser.parseSource(child, entry);
					//Then add its id to the sourceId array.
					quote._indexes.sourceId.push(bib.id);
					quote.content.push(bib);
				} //If there is a link or pointer or ref...
				else if (linkEl.indexOf(child.tagName) >= 0) {
					quote.content.push(parseQuoteContent(child));
					if (child.hasAttribute('target')) {
						var attrib = child.getAttribute('target');
						var values = attrib.replace(/#/g, '').split(' ');
						for (i = 0; i < values.length; i++) {
							//...add its target values to the sourceRefId array.
							quote._indexes.sourceRefId.push(values[i]);
						}
					}
				} //If there is a linkGrp...
				else if (child.tagName === 'linkGrp') {
					//...parse the children...
					for (i = 0; i < child.children.length; i++) {
						if (linkEl.indexOf(child.children[i].tagName) >= 0) {
							quote.content.push(parseQuoteContent(child.children[i]));
							if (child.children[i].hasAttribute('target')) {
								var attr = child.children[i].getAttribute('target');
								var val = attr.replace(/#/g, '').split(' ');
								for (i = 0; i < val.length; i++) {
									//...and add their target values to the SourceRefId array.
									quote._indexes.sourceRefId.push(val[i]);
								}
							}
						}
					}
				} //If there is an apparatus Entry, parse it with handleAppEntry.
				else if (apparatusEntryDef.indexOf('<' + child.tagName + '>') >= 0) {
					quote.content.push(parser.handleAppEntry(child));
				} //If there is a nested quote, parse it recursively.
				else if (quoteDef.indexOf('<' + child.tagName + '>') >= 0) {
					var subQuote = parser.parseQuote(child);
					quote.content.push(subQuote);
					//Then add the id to the subQuotes array.
					quote._indexes.subQuotes.push(subQuote.id);
				} else if (analogueRegExpr.test(childXml)) {
					quote.content.push(parser.parseAnalogue(child));
				}
				/*else if (child.tagName === 'witDetail') {
				                   content.push(evtCriticalApparatusParser.parseWitDetail(child));
				               }*/
				else if (child.tagName === 'note') {
					quote.content.push(evtParser.parseNote(child));
				} else {
					quote.content.push(parseQuoteContent(child));
				}
			}
		});

		parsedData.addQuote(quote);

		return quote;
	};

	// /////// //
	// SOURCES //
	// /////// //
	/**
     * @ngdoc function
     * @name evtviewer.dataHandler.evtCriticalElementsParser#parseSourceContent
     * @methodOf evtviewer.dataHandler.evtCriticalElementsParser
     *
     * @description
     * [PRIVATE] This function will parse an element inside of a source content.
     *
     * @param {element} elem XML element that is inside the source
     * @param {element=} source XML element representing the source
     *
     * @returns {Object} JSON object representing the source content parsed
	     <pre>
			var contentEl = {
				tagName: '',
				type: 'sourceContent',
				attributes: [],
				content: [],
				url: []
			};
	     </pre>
     *
     * @author CM
     */
    var parseSourceContent = function(elem, source) {
		var contentEl = {
			tagName: elem.tagName,
			type: 'sourceContent',
			attributes: [],
			content: [],
			url: []
		};

		if (elem.attributes) {
			for (var i = 0; i < elem.attributes.length; i++) {
				var attrib = elem.attributes[i];
				if (attrib.specified) {
					contentEl.attributes[attrib.name] = attrib.value;
				}
			}
		}

		angular.forEach(elem.childNodes, function(child) {
			if (child.nodeType === 3) {
				if (child.textContent.trim() !== '') {
					contentEl.content.push(child.textContent.trim());
				}
			} else if (child.nodeType === 1) {
				if (child.tagName === 'citedRange') {
					if (child.getAttribute('target') !== null && child.getAttribute('target') !== '') {
						contentEl.url.push(child.getAttribute('target'));
					}
					contentEl.content.push(parseSourceContent(child));
				} else if (child.children.length > 0) {
					for (var i = 0; i < child.children.length; i++) {
						contentEl.content.push(parseSourceContent(child.children[i]));
					}
				} else {
					contentEl.content.push(parseSourceContent(child));
				}
			}
		});

		return contentEl;
	};
	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.evtCriticalElementsParser#parseSource
     * @methodOf evtviewer.dataHandler.evtCriticalElementsParser
     *
     * @description
     * This method will parse a source bibliographic reference, and save
	 * it in {@link evtviewer.dataHandler.parsedData parsedData}.
     *
     * @param {element} entry XML element to parse
     * @param {element=} quote XML element representing the quote that contains the parsed source
     *
     * @returns {Object} JSON object representing the source element parsed
	     <pre>
			var source = {
				id: '',
				abbr: {
					title: [],
					author: [],
					msId: []
				},
				attributes: [],
				quotesEntriesId: [], //quotes that refer to this source
				bibl: [], //full bibliographic reference of the source
				quote: [],
				url: [], //links to the full text of the source
				text: {},
				_textAvailable: false,
				_xmlSource: ''
			};
	     </pre>
     *
     * @author CM
     */
	parser.parseSource = function(entry, quote) {
		var source = {
			id: '',
			abbr: {
				title: [],
				author: [],
				msId: []
			},
			attributes: [],
			quotesEntriesId: [], //Array to save id of the quotes that refer to this source
			bibl: [], //Array that saves the full bibliographic reference of the source (which almost always corresponds the content of the source itself)
			quote: [],
			url: [], //Array that saves the links to the full text of the source
			text: {},
			_textAvailable: false,
			_xmlSource: entry.outerHTML
		};

		var i, j; //Indexes used in this function
		//Parsing the attributes and saving the id
		var id;
		if (entry.attributes) {
			for (i = 0; i < entry.attributes.length; i++) {
				var attrib = entry.attributes[i];
				if (attrib.specified) {
					if (attrib.name === 'xml:id') {
						id = attrib.value;
					}
					if (attrib.name === 'target' || attrib.name === 'source' || attrib.name === 'ref') {
						var values = attrib.value.replace(/#/g, '').split(' ');
						for (j = 0; j < values.length; j++) {
							source.url.push(values[j]);
						}
					}
					source.attributes[attrib.name] = attrib.value;
					source.attributes.length++;
				}
			}
		}
		if (id === undefined) {
			id = evtParser.xpath(entry).substr(1);
		}
		source.id = id;

		//Parsing the quotes that refer to this source.
		if (parsedData.getQuotes()._indexes.sourcesRef[source.id] !== undefined) {
			source.quotesEntriesId = parsedData.getQuotes()._indexes.sourcesRef[source.id];
		} else {
			//If the bibliographic reference of the source is inside a quote,
			//the id of the quote is pushed int he quotesEntriesId array.
			if (quote.hasAttribute('xml:id')) {
				source.quotesEntriesId.push(quote.getAttribute('xml:id'));
			} else {
				source.quotesEntriesId.push(evtParser.xpath(quote).substr(1));
			}
		}

		//Adding info that will form the source abbreviated reference (.abbr)
		var elem = angular.element(entry);
		if (entry.tagName === 'msDesc') {
			angular.forEach(elem.find('idno'), function(el) {
				source.abbr.msId.push(parseSourceContent(el));
			});
		} else {
			angular.forEach(elem.find('author'), function(el) {
				source.abbr.author.push(parseSourceContent(el));
			});
			angular.forEach(elem.find('title'), function(el) {
				source.abbr.title.push(parseSourceContent(el));
			});
		}

		//Parsing the content of the source element
		angular.forEach(entry.childNodes, function(child) {
			if (child.nodeType === 3) {
				if (child.textContent.trim() !== '') {
					source.bibl.push(child.textContent.trim());
				}
			} else if (child.nodeType === 1) {
				//Array of TEI-elements for pointers
				var linkEl = ['ptr', 'ref', 'link'];

				var attrib, val;
				if (entry.tagName === 'cit' && child.tagName === 'quote') {
					var contentEl = parseSourceContent(child);
					source.quote.push(contentEl);
				} else if (linkEl.indexOf(child.tagName) >= 0) {
					if (child.tagName === 'ref') {
						source.bibl.push(parseSourceContent(child));
					} else {
						source.bibl.push(child);
					}
					if (child.hasAttribute('target')) {
						attrib = child.getAttribute('target');
						val = attrib.replace(/#/g, '').split(' ');
						for (i = 0; i < val.length; i++) {
							//...add its target values to the url array.
							source.url.push(val[i]);
						}
					}
				} //If there is a linkGrp...
				else if (child.tagName === 'linkGrp') {
					//...parse the children...
					for (i = 0; i < child.children.length; i++) {
						if (linkEl.indexOf(child.children[i].tagName) >= 0) {
							if (child.tagName === 'ref') {
								source.bibl.push(parseSourceContent(child));
							} else {
								source.bibl.push(child.children[i]);
							}
							if (child.children[i].hasAttribute('target')) {
								attrib = child.children[i].getAttribute('target');
								val = attrib.replace(/#/g, '').split(' ');
								for (j = 0; j < val.length; j++) {
									//...and add their target values to the url array.
									source.url.push(val[j]);
								}
							}
						}
					}
				} else if (child.tagName === 'citedRange') {
					if (child.getAttribute('target') !== null && child.getAttribute('target') !== '') {
						attrib = child.getAttribute('target');
						val = attrib.replace(/#/g, '').split(' ');
						for (i = 0; i < val.length; i++) {
							//...add its target values to the url array.
							source.url.push(val[i]);
						}
					}
					source.bibl.push(parseSourceContent(child));
				} else {
					var childContent = parseSourceContent(child, entry);
					/*if (childContent.tagName === 'author') {
					    source.author.push(childContent.content);
					}
					if (childContent.tagName === 'title') {
					    source.title = childContent.content;
					}*/
					source.bibl.push(childContent);
					for (i = 0; i < childContent.url.length; i++) {
						source.url.push(childContent.url[i]);
					}
				}
			}
		});

		for (i in source.url) {
			if (source.url[i].indexOf('.xml') >= 0) {
				source._textAvailable = true;
			}
		}

		parsedData.addSource(source);

		return source;
	};
	/**
     * @ngdoc function
     * @name evtviewer.dataHandler.evtCriticalElementsParser#getQuoteContentText
     * @methodOf evtviewer.dataHandler.evtCriticalElementsParser
     *
     * @description
     * [PRIVATE] This function will get the textual content of a quote content
     *
     * @param {element} elem XML element to parse
     * @param {string} wit id of scope witness (needed to parse eventual page breaks)
     * @param {string} doc string representing the whole XML source text
     *
     * @returns {element} DOM element representing the textual content of quote content
     *
     * @author CM
     */
	var getQuoteContentText = function(elem, wit, doc) {
		var spanElement;

		if (elem.content !== undefined) {
			if (elem.content.length === 0) {
				var xmlEl = xmlParser.parse(elem._xmlSource.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, ''));
				var el = xmlEl.children[0];
				if (elem.tagName === 'pb') {
					if (wit !== '' && (el.getAttribute('ed').indexOf(wit) >= 0)) {
						var newPbElem = document.createElement('span'),
							id;
						if (el.getAttribute('ed')) {
							id = el.getAttribute('xml:id') || el.getAttribute('ed').replace('#', '') + '-' + el.getAttribute('n'); // || 'page_'+k;
						} else {
							id = el.getAttribute('xml:id'); //|| 'page_'+k;
						}
						newPbElem.className = 'pb';
						newPbElem.setAttribute('data-wit', el.getAttribute('ed'));
						newPbElem.setAttribute('data-id', id);
						newPbElem.setAttribute('id', 'pb_' + id);
						newPbElem.textContent = el.getAttribute('n');
						spanElement = newPbElem;
					}
				} else {
					spanElement = evtParser.parseXMLElement(doc, el, {skip: ''});
				}
			} else if (elem.content.length === 1 && typeof elem.content[0] === 'string') {
				//spanElement = document.createTextNode('FATTO!!!');
				var xmlE = xmlParser.parse(elem._xmlSource.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, ''));
				var e = xmlE.children[0];
				spanElement = evtParser.parseXMLElement(doc, e, {skip: ''});
			} else {
				spanElement = document.createElement('span');
				spanElement.className = elem.tagName;

				var attribKeys = Object.keys(elem.attributes);
				for (var key in attribKeys) {
					var attrib = attribKeys[key];
					var value = elem.attributes[attrib];
					if (attrib !== 'xml:id') {
						spanElement.setAttribute('data-' + attrib.replace(':','-'), value);
					}
				}

				var content = elem.content;
				for (var i in content) {
					var child;
					if (typeof content[i] === 'string') {
						child = document.createElement('span');
						child.setAttribute('class', 'textNode');
						child.appendChild(document.createTextNode(content[i]));
						spanElement.appendChild(child);
					} else {
						if (content[i].type === 'quote') {
							spanElement.appendChild(parser.getQuoteText(content[i]));
						} else if (content[i].tagName === 'EVT-POPOVER') {
							spanElement.appendChild(content[i]);
						} else if (content[i].type === 'app') {
							if (wit === '') {
								spanElement.appendChild(parser.getEntryLemmaText(content[i]));
							} else {
								spanElement.appendChild(parser.getEntryWitnessReadingText(content[i], wit));
							}
						} else if (content[i].type === 'analogue') {
							spanElement.appendChild(parser.getAnalogueText(content[i]));
						} else {
							child = getQuoteContentText(content[i], wit, doc);
							if (child !== undefined) {
								spanElement.appendChild(child);
							}
						}
					}
				}
			}
		}

		return spanElement;
	};
	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.evtCriticalElementsParser#getQuoteText
     * @methodOf evtviewer.dataHandler.evtCriticalElementsParser
     *
     * @description
     * This method will get the textual content of a quote
     *
     * @param {element} elem XML element to parse
     * @param {string} wit id of scope witness (needed to parse eventual page breaks)
     * @param {string} doc string representing the whole XML source text
     *
     * @returns {element} <code>evt-quote</code> element representing the textual content of quote
     *
     * @author CM
     */
	parser.getQuoteText = function(quote, wit, doc) {
		var spanElement,
			errorElement;

		spanElement = document.createElement('evt-quote');
		spanElement.setAttribute('data-quote-id', quote.id);
		if (quote._subQuote) {
			spanElement.setAttribute('data-type', 'subquote');
		} else {
			spanElement.setAttribute('data-type', 'quote');
		}

		if (wit !== '' && wit !== undefined) {
			spanElement.setAttribute('data-scope-wit', wit);
		}
		var quoteContent = quote.content;

		var link = ['link', 'ptr', 'linkGrp'];

		for (var i in quoteContent) {
			var child;
			if (typeof quoteContent[i] === 'string') {
				child = document.createElement('span');
				child.setAttribute('class', 'textNode');
				child.appendChild(document.createTextNode(quoteContent[i]));
				spanElement.appendChild(child);
			} else {
				if (quoteContent[i].tagName === 'EVT-POPOVER') {
					spanElement.appendChild(quoteContent[i]);
				} else if (quoteContent[i].type === 'app') {
					if (wit === '') {
						spanElement.appendChild(parser.getEntryLemmaText(quoteContent[i]));
					} else {
						spanElement.appendChild(parser.getEntryWitnessReadingText(quoteContent[i], wit));
					}
				} else if (quoteContent[i].type === 'quote') {
					spanElement.appendChild(parser.getQuoteText(quoteContent[i], wit, doc));
				} else if (quoteContent[i].type === 'analogue') {
					spanElement.appendChild(parser.getAnalogueText(quoteContent[i], wit, doc));
				} else if (quoteContent[i].type === 'quoteContent' && link.indexOf(quoteContent[i].tagName) < 0) {
					child = getQuoteContentText(quoteContent[i], wit, doc);
					if (child !== undefined) {
						spanElement.appendChild(child);
					}
				}
			}
		}

		//console.log(spanElement);
		return spanElement;
	};

	// ///////// //
	// ANALOGUES //
	// ///////// //
	/**
     * @ngdoc function
     * @name evtviewer.dataHandler.evtCriticalElementsParser#parseAnalogueContent
     * @methodOf evtviewer.dataHandler.evtCriticalElementsParser
     *
     * @description
     * [PRIVATE] This function creates a new object of type 'analogueContent'
     * that is added to the analogue content array
     *
     * @param {element} elem XML element nested in an <code>AnalogueDef</code> that has to be parsed
     *
     * @returns {Object} JSON object representing the analogue content
     	<pre>
			var contentEl = {
				tagName: '',
				type: 'analogueContent',
				attributes: [],
				content: [],
				_xmlSource: ''
			};
     	</pre>
     *
     * @author CM
     */
	var parseAnalogueContent = function(elem) {
		var contentEl = {
			tagName: elem.tagName,
			type: 'analogueContent',
			attributes: [],
			content: [],
			_xmlSource: elem.outerHTML
		};

		if (elem.attributes) {
			for (var i = 0; i < elem.attributes.length; i++) {
				var attrib = elem.attributes[i];
				if (attrib.specified) {
					contentEl.attributes[attrib.name] = attrib.value;
				}
			}
		}

		angular.forEach(elem.childNodes, function(child) {
			if (child.nodeType === 3) {
				if (child.textContent.trim() !== '') {
					contentEl.content.push(child.textContent.trim());
				}
			} else if (child.nodeType === 1) {
				var subst = angular.element(child)['0'].innerHTML.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, '');
				var childXml = angular.element(child)['0'].outerHTML.replace(subst, '');

				if (quoteDef.indexOf('<' + child.tagName + '>') >= 0) {
					contentEl.content.push(parser.parseQuote(child));
				} else if (apparatusEntryDef.indexOf('<' + child.tagName + '>') >= 0) {
					contentEl.content.push(parser.handleAppEntry(child));
				} else if (evtParser.createRegExpr(analogueDef).test(childXml)) {
					contentEl.content.push(parser.parseAnalogue(child));
				}
				/* else if (child.tagName === 'witDetail') {
				                    contentEl.content.push(evtCriticalApparatusParser.parseWitDetail(child));
				                }*/
				else if (child.tagName === 'note') {
					contentEl.content.push(evtParser.parseNote(child));
				} else if (child.children.length > 0) {
					for (var i = 0; i < child.children.length; i++) {
						contentEl.content.push(child.children[i].cloneNode(true));
						parseAnalogueContent(child.children[i]);
					}
				} else {
					contentEl.content.push(parseAnalogueContent(child));
				}
			}
		});

		return contentEl;
	};
	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.evtCriticalElementsParser#parseAnalogue
     * @methodOf evtviewer.dataHandler.evtCriticalElementsParser
     *
     * @description
     * This method will parse an analogue element
     *
     * @param {element} entry XML element to be parsed
     *
     * @returns {Object} JSON object representing the analogue entry
     	<pre>
			var analogue = {
				id: '',
				type: 'analogue',
				attributes: [],
				content: [],
				sources: [],
				_indexes: {
					sourceId: [],
					sourceRefId: [],
					subAnalogues: []
				},
				_subAnalogue: false,
				_xmlSource: ''
			};
     	</pre>
     *
     * @author CM
     */
    parser.parseAnalogue = function(entry) {
		var analogue = {
			id: '',
			type: '',
			attributes: [],
			content: [],
			sources: [],
			_indexes: {
				sourceId: [],
				sourceRefId: [],
				subAnalogues: []
			},
			_subAnalogue: false,
			_xmlSource: entry.outerHTML || ''
		};

		var i, j; //Indexes used in this funciton
		//Parsing the id or creating it with the evtParser.xpath method
		var id = entry.getAttribute('xml:id') || evtParser.xpath(entry).substr(1);
		analogue.id = id;

		// Check if the analogue is in the main version of the text
		if (config.versions.length > 0) {
			analogue._isInMainVersion = evtParser.isInMainVersion(entry);
		}

		//Parsing the attributes
		if (entry.attributes) {
			for (i = 0; i < entry.attributes.length; i++) {
				var attrib = entry.attributes[i],
					values;
				if (attrib.specified) {
					analogue.attributes[attrib.name] = attrib.value;
				}
				/*If there is a source or corresp or ref attribute, its values
				are saved inside the sourceRefId array*/
				if (attrib.name === 'source') {
					values = attrib.value.replace(/#/g, '').split(' ');
					analogue._indexes.sourceRefId = values;
				}
				if (attrib.name === 'corresp') {
					values = attrib.value.replace(/#/g, '').split(' ');
					analogue._indexes.sourceRefId = values;
				}
				if (attrib.name === 'ref') {
					values = attrib.value.replace(/#/g, '').split(' ');
					analogue._indexes.sourceRefId = values;
				}
			}
		}

		//Nesting of the current analogueDef element in another analogueDef element
		//reg expr needed! or other solution :/

		//Parsing the contents
		angular.forEach(entry.childNodes, function(child) {
			if (child.nodeType === 3) {
				if (child.textContent.trim() !== '') {
					analogue.content.push(child.textContent.trim());
				}
			} else if (child.nodeType === 1) {

				var subst = angular.element(child)['0'].innerHTML.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, '');
				var childXml = angular.element(child)['0'].outerHTML.replace(subst, '');
				//Array of TEI-elements for bibliographic references
				var biblEl = ['bibl', 'biblStruct', 'biblFull', 'msDesc'];
				//Array of TEI-elements for pointers
				var linkEl = ['ptr', 'ref', 'link'];

				//Parsing bibliographic references
				//If there is a listBibl...
				if (child.tagName === 'listBibl') {
					//...parse the childNodes that are a link or a ptr
					for (i = 0; i < child.children.length; i++) {
						if (biblEl.indexOf(child.children[i].tagName) >= 0) {
							var bibl = parser.parseAnalogueSource(child.children[i], entry);
							//...then add their id to the sourceId array.
							analogue._indexes.sourceId.push(bibl.id);
							analogue.sources.push(bibl);
							//analogue.content.push(bibl);
						} else {
							analogue.content.push(parseAnalogueContent(child.children[i]));
						}
					}
				} // If there is a bibliographic element, parse it as a Source.
				else if (biblEl.indexOf(child.tagName) >= 0) {
					var bib = parser.parseAnalogueSource(child, entry);
					//Then add its id to the sourceId array.
					analogue._indexes.sourceId.push(bib.id);
					analogue.sources.push(bib);
					//analogue.content.push(bib);
				} //If there is a link or pointer or ref...
				else if (linkEl.indexOf(child.tagName) >= 0) {
					analogue.content.push(parseAnalogueContent(child));
					if (child.hasAttribute('target')) {
						var attrib = child.getAttribute('target');
						var values = attrib.replace(/#/g, '').split(' ');
						for (i = 0; i < values.length; i++) {
							//...add its target values to the sourceRefId array.
							analogue._indexes.sourceRefId.push(values[i]);
						}
					}
				} //If there is a linkGrp...
				else if (child.tagName === 'linkGrp') {
					//...parse the children...
					for (i = 0; i < child.children.length; i++) {
						if (linkEl.indexOf(child.children[i].tagName) >= 0) {
							analogue.content.push(parseAnalogueContent(child.children[i]));
							if (child.children[i].hasAttribute('target')) {
								var attr = child.children[i].getAttribute('target');
								var val = attr.replace(/#/g, '').split(' ');
								for (j = 0; j < val.length; j++) {
									//...and add their target values to the SourceRefId array.
									analogue._indexes.sourceRefId.push(val[j]);
								}
							}
						}
					}
				} //If there is an apparatus Entry, parse it with handleAppEntry.
				else if (apparatusEntryDef.indexOf('<' + child.tagName + '>') >= 0) {
					analogue.content.push(parser.handleAppEntry(child));
				} //If there is a nested quote, parse it recursively.
				else if (quoteDef.indexOf('<' + child.tagName + '>') >= 0) {
					analogue.content.push(parser.parseQuote(child));
				} else if (evtParser.createRegExpr(analogueDef).test(childXml)) {
					analogue.content.push(parser.parseAnalogue(child));
				}
				/*else if (child.tagName === 'witDetail') {
				                    content.push(evtCriticalApparatusParser.parseWitDetail(child));
				                }*/
				else if (child.tagName === 'note') {
					analogue.content.push(evtParser.parseNote(child));
				} else {
					analogue.content.push(parseAnalogueContent(child));
				}
			}
		});

		if (analogue._indexes.sourceId.length !== 0 || analogue._indexes.sourceRefId.length !== 0) {
			analogue.type = 'analogue';
		}

		return analogue;
	};
	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.evtCriticalElementsParser#parseAnalogueSource
     * @methodOf evtviewer.dataHandler.evtCriticalElementsParser
     *
     * @description
     * This method will parse the an analogue element and saves
     *
     * @param {element} entry XML element to be parsed
     *
     * @returns {Object} JSON object representing the analogue source entry
     	<pre>
			var source = {
				id: '',
				abbr: {
					title: [],
					author: [],
					msId: []
				},
				attributes: [],
				bibl: [],
				text: [],
				url: [],
				_xmlSource: ''
			};
     	</pre>
     *
     * @author CM
     */
    parser.parseAnalogueSource = function(entry) {
		var source = {
			id: '',
			abbr: {
				title: [],
				author: [],
				msId: []
			},
			attributes: [],
			bibl: [],
			text: [],
			url: [],
			_xmlSource: entry.outerHTML || ''
		};

		var i, j; //Indexes used in this function
		//Parsing the attributes and creating source.id
		var id;
		if (entry.attributes) {
			for (i = 0; i < entry.attributes.length; i++) {
				var attrib = entry.attributes[i];
				if (attrib.specified) {
					if (attrib.name === 'xml:id') {
						id = attrib.value;
					}
					if (attrib.name === 'target' ||
						attrib.name === 'source' ||
						attrib.name === 'ref') {
						var values = attrib.value.replace(/#/g, '').split(' ');
						for (j = 0; j < values.length; j++) {
							source.url.push(values[j]);
						}
					}
					source.attributes[attrib.name] = attrib.value;
					source.attributes.length++;
				}
			}
		}
		if (id === undefined) {
			id = evtParser.xpath(entry).substr(1);
		}
		source.id = id;

		var elem = angular.element(entry);
		if (entry.tagName === 'msDesc') {
			angular.forEach(elem.find('idno'), function(el) {
				source.abbr.msId.push(parseAnalogueSourceContent(el));
			});
		} else {
			angular.forEach(elem.find('author'), function(el) {
				source.abbr.author.push(parseAnalogueSourceContent(el));
			});
			angular.forEach(elem.find('title'), function(el) {
				source.abbr.title.push(parseAnalogueSourceContent(el));
			});
		}

		angular.forEach(entry.childNodes, function(child) {
			if (child.nodeType === 3) {
				if (child.textContent.trim() !== '') {
					source.bibl.push(child.textContent.trim());
				}
			} else if (child.nodeType === 1) {
				//Array of TEI-elements for pointers
				var linkEl = ['ptr', 'ref', 'link'];
                var attrib, val;
				if (entry.tagName === 'cit' && child.tagName === 'quote') {
					var contentEl = parseAnalogueSourceContent(child);
					source.text.push(contentEl);
				} else if (linkEl.indexOf(child.tagName) >= 0) {
					if (child.tagName === 'ref') {
						source.bibl.push(parseAnalogueSourceContent(child));
					} else {
						source.bibl.push(child);
					}
					if (child.hasAttribute('target')) {
						attrib = child.getAttribute('target');
						val = attrib.replace(/#/g, '').split(' ');
						for (i = 0; i < val.length; i++) {
							//...add its target values to the url array.
							source.url.push(val[i]);
						}
					}
				} //If there is a linkGrp...
				else if (child.tagName === 'linkGrp') {
					//...parse the children...
					for (i = 0; i < child.children.length; i++) {
						if (linkEl.indexOf(child.children[i].tagName) >= 0) {
							if (child.tagName === 'ref') {
								source.bibl.push(parseAnalogueSourceContent(child));
							} else {
								source.bibl.push(child.children[i]);
							}
							if (child.children[i].hasAttribute('target')) {
								attrib = child.children[i].getAttribute('target');
								val = attrib.replace(/#/g, '').split(' ');
								for (j = 0; j < val.length; j++) {
									//...and add their target values to the url array.
									source.url.push(val[j]);
								}
							}
						}
					}
				} else if (child.tagName === 'citedRange') {
					if (child.getAttribute('target') !== null && child.getAttribute('target') !== '') {
						attrib = child.getAttribute('target');
						val = attrib.replace(/#/g, '').split(' ');
						for (i = 0; i < val.length; i++) {
							//...add its target values to the url array.
							source.url.push(val[i]);
						}
					}
					source.bibl.push(parseSourceContent(child));
				} else {
					var childContent = parseAnalogueSourceContent(child, entry);
					/* FIXME if (childContent.tagName === 'author') {
					    source.author.push(childContent.content);
					}
					if (childContent.tagName === 'title') {
					    source.title = childContent.content;
					}*/
					source.bibl.push(childContent);
					for (i = 0; i < childContent.url.length; i++) {
						source.url.push(childContent.url[i]);
					}
				}
			}
		});

		return source;
	};
	/**
     * @ngdoc function
     * @name evtviewer.dataHandler.evtCriticalElementsParser#parseAnalogueSourceContent
     * @methodOf evtviewer.dataHandler.evtCriticalElementsParser
     *
     * @description
     * [PRIVATE] This function will parse the element contained inside a source element.
     *
     * @param {element} elem XML element to be parsed
     *
     * @returns {Object} JSON object representing the analogue source content parsed
     	<pre>
			var contentEl = {
				tagName: elem.tagName,
				type: 'sourceContent',
				attributes: [],
				content: [],
				url: []
			};
     	</pre>
     *
     * @author CM
     */
	var parseAnalogueSourceContent = function(elem) {
		var contentEl = {
			tagName: elem.tagName,
			type: 'sourceContent',
			attributes: [],
			content: [],
			url: []
		};

		if (elem.attributes) {
			for (var i = 0; i < elem.attributes.length; i++) {
				var attrib = elem.attributes[i];
				if (attrib.specified) {
					contentEl.attributes[attrib.name] = attrib.value;
				}
			}
		}

		angular.forEach(elem.childNodes, function(child) {
			if (child.nodeType === 3) {
				if (child.textContent.trim() !== '') {
					contentEl.content.push(child.textContent.trim());
				}
			} else if (child.nodeType === 1) {
				if (child.tagName === 'citedRange') {
					if (child.getAttribute('target') !== null && child.getAttribute('target') !== '') {
						contentEl.url.push(child.getAttribute('target'));
					}
					contentEl.content.push(parseSourceContent(child));
				} else if (child.children.length > 0) {
					for (var i = 0; i < child.children.length; i++) {
						contentEl.content.push(parseAnalogueSourceContent(child.children[i]));
					}
				} else {
					contentEl.content.push(parseAnalogueSourceContent(child));
				}
			}
		});

		return contentEl;
	};
	/**
     * @ngdoc function
     * @name evtviewer.dataHandler.evtCriticalElementsParser#parseAnalogueSourceContent
     * @methodOf evtviewer.dataHandler.evtCriticalElementsParser
     *
     * @description
     * [PRIVATE] This function will parse the text of an analogue content element
     *
     * @param {element} elem XML element to parse
     * @param {string} wit id of scope witness (needed to parse eventual page breaks)
     * @param {string} doc string representing the whole XML source text
     *
     * @returns {element} DOM element representing the analogue content element parsed
     *
     * @author CM
     */
	var getAnalogueContentText = function(elem, wit, doc) {
		var spanElement;

		if (elem.content !== undefined) {
			if (elem.content.length === 0) {
				var xmlEl = xmlParser.parse(elem._xmlSource.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, ''));
				var el = xmlEl.children[0];
				if (elem.tagName === 'pb') {
					if (wit !== '' && (el.getAttribute('ed').indexOf(wit) >= 0)) {
						var newPbElem = document.createElement('span'),
							id;
						if (el.getAttribute('ed')) {
							id = el.getAttribute('xml:id') || el.getAttribute('ed').replace('#', '') + '-' + el.getAttribute('n'); // || 'page_'+k;
						} else {
							id = el.getAttribute('xml:id'); //|| 'page_'+k;
						}
						newPbElem.className = 'pb';
						newPbElem.setAttribute('data-wit', el.getAttribute('ed'));
						newPbElem.setAttribute('data-id', id);
						newPbElem.setAttribute('id', 'pb_' + id);
						newPbElem.textContent = el.getAttribute('n');
						spanElement = newPbElem;
					}
				} else {
					spanElement = evtParser.parseXMLElement(doc, el, {skip: ''});
				}
			} else if (elem.content.length === 1 && typeof elem.content[0] === 'string') {
				var xmlE = xmlParser.parse(elem._xmlSource.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, ''));
				var e = xmlE.children[0];
				spanElement = evtParser.parseXMLElement(doc, e, {skip: ''});
			} else {
				spanElement = document.createElement('span');
				spanElement.className = elem.tagName;

				var attribKeys = Object.keys(elem.attributes);
				for (var key in attribKeys) {
					var attrib = attribKeys[key];
					var value = elem.attributes[attrib];
					if (attrib !== 'xml:id') {
						spanElement.setAttribute('data-' + attrib.replace(':','-'), value);
					}
				}

				var content = elem.content;
				for (var i in content) {
					if (typeof content[i] === 'string') {
						spanElement.appendChild(document.createTextNode(content[i]));
					} else {
						if (content[i].type === 'quote') {
							spanElement.appendChild(parser.getQuoteText(content[i]));
						} else if (content[i].tagName === 'EVT-POPOVER') {
							spanElement.appendChild(content[i]);
						} else if (content[i].type === 'app') {
							if (wit === '') {
								spanElement.appendChild(parser.getEntryLemmaText(content[i]));
							} else {
								spanElement.appendChild(parser.getEntryWitnessReadingText(content[i], wit));
							}
						} else if (content[i].type === 'analogue') {
							spanElement.appendChild(parser.getAnalogueText(content[i]));
						} else {
							var child = getAnalogueContentText(content[i], wit, doc);
							if (child !== undefined) {
								spanElement.appendChild(child);
							}
						}
					}
				}
			}
		}

		return spanElement;
	};
	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.evtCriticalElementsParser#getAnalogueText
     * @methodOf evtviewer.dataHandler.evtCriticalElementsParser
     *
     * @description
     * This method will parse the text of an analogue element
     *
     * @param {element} analogue XML element to parse
     * @param {string} wit id of scope witness (needed to parse eventual page breaks)
     * @param {string} doc string representing the whole XML source text
     *
     * @returns {element} <code>evt-analogue</code> element representing the analogue element parsed
     *
     * @author CM
     */
    parser.getAnalogueText = function(analogue, wit, doc) {
		var spanElement,
			errorElement; //TO DO: implementare gestione errore

		spanElement = document.createElement('evt-analogue');
		spanElement.setAttribute('data-analogue-id', analogue.id);
		spanElement.setAttribute('data-type', 'analogue');
		if (wit !== '' && wit !== undefined) {
			spanElement.setAttribute('data-scope-wit', wit);
		}
		var analogueContent = analogue.content;

		var link = ['link', 'ptr', 'linkGrp'];

		for (var i in analogueContent) {
            var child;
			if (typeof analogueContent[i] === 'string') {
				child = document.createElement('span');
				child.setAttribute('class', 'textNode');
				child.appendChild(document.createTextNode(analogueContent[i]));
				spanElement.appendChild(child);
			} else {
				if (analogueContent[i].tagName === 'EVT-POPOVER') {
					spanElement.appendChild(analogueContent[i]);
				} else if (analogueContent[i].type === 'app') {
					if (wit === '') {
						spanElement.appendChild(parser.getEntryLemmaText(analogueContent[i]));
					} else {
						spanElement.appendChild(parser.getEntryWitnessReadingText(analogueContent[i], wit));
					}
				} else if (analogueContent[i].type === 'quote') {
					spanElement.appendChild(parser.getQuoteText(analogueContent[i], wit, doc));
				} else if (analogueContent[i].type === 'analogue') {
					spanElement.appendChild(parser.getAnalogueText(analogueContent[i]));
				} else if (analogueContent[i].type === 'analogueContent' && link.indexOf(analogueContent[i].tagName) < 0) {
					child = getAnalogueContentText(analogueContent[i], wit, doc);
					if (child !== undefined) {
						spanElement.appendChild(child);
					}
				} else {
					if (analogueContent[i].content !== undefined && analogueContent[i].content.length !== 0) {
						child = getAnalogueContentText(analogueContent[i], wit, doc);
						if (child !== undefined) {
							spanElement.appendChild(child);
						}
					}
				}
			}
		}

		//console.log(spanElement);
		return spanElement;
	};

	return parser;
}]);
