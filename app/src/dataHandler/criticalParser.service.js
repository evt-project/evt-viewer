/**
 * @ngdoc service
 * @module evtviewer.dataHandler
 * @name evtviewer.dataHandler.evtCriticalParser
 * @description 
 * # evtCriticalParser
 * Service containing methods to parse data regarding critical edition (critical text, witness text, etc.).
 *
 * @requires $q
 * @requires xmlParser
 * @requires evtviewer.dataHandler.parsedData
 * @requires evtviewer.dataHandler.evtParser
 * @requires evtviewer.dataHandler.evtCriticalApparatusParser
 * @requires evtviewer.dataHandler.evtSourcesParser
 * @requires evtviewer.dataHandler.evtAnaloguesParser
 * @requires evtviewer.dataHandler.evtCriticalElementsParser
 * @requires evtviewer.core.config
**/
angular.module('evtviewer.dataHandler')

.service('evtCriticalParser', function($q, parsedData, evtParser, evtCriticalApparatusParser, evtSourcesParser, evtAnaloguesParser, evtCriticalElementsParser, xmlParser, config, evtDepaParser) {
	var parser = {};

	var apparatusEntryDef = '<app>',
		lemmaDef = '<lem>',
		readingDef = lemmaDef + ', <rdg>',
		readingGroupDef = '<rdgGrp>',
		quoteDef = config.quoteDef,
		analogueDef = config.analogueDef,
		analogueRegExpr = evtParser.createRegExpr(analogueDef);
	var skipFromBeingParsed = '<evt-reading>,<pb>,' + apparatusEntryDef + ',' + readingDef + ',' + readingGroupDef + ',' + quoteDef + ',' + analogueDef + ',<evt-quote>,<evt-analogue>,<evt-version-reading>',
		skipWitnesses = config.skipWitnesses.split(',').filter(function(el) {
			return el.length !== 0;
		});

	// /////// //
	// WITNESS //
	// /////// //
	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.evtCriticalParser#parseWitnessText
     * @methodOf evtviewer.dataHandler.evtCriticalParser
     *
     * @description
     * This method will parse the XML of the document and generate the text of a specified witness.
     * The extracted text will be then stored into {@link evtviewer.dataHandler.parsedData parsedData} for future retriements. 
     * - It will loop over critical apparatus entries (defined as <code>apparatusEntryDef</code>) and get the reading belonging to given witness.
     * - It will parse quotes and replace quotes elements with quotes text (retrieved with {@link evtviewer.dataHandler.evtCriticalElementsParser#getQuoteText evtCriticalElementsParser.getQuoteText()}).
     * - It will parse analogues and replace analogues elements with analogues text (retrieved with {@link evtviewer.dataHandler.evtCriticalElementsParser#getAnalogueText evtCriticalElementsParser.getAnalogueText()}).
     * - It will parse page breaks ({@link evtviewer.dataHandler.evtCriticalApparatusParser#parseWitnessPageBreaks evtCriticalApparatusParser.parseWitnessPageBreaks()}).
	 * - It will parse page lacunas ({@link evtviewer.dataHandler.evtCriticalApparatusParser#parseWitnessLacunas evtCriticalApparatusParser.parseWitnessLacunas()}).
     * - If it is a fragmentary witness, it will then parse fragmentary text ({@link evtviewer.dataHandler.evtCriticalApparatusParser#parseFragmentaryWitnessText evtCriticalApparatusParser.parseFragmentaryWitnessText()}).
     * - It will balance XHTML generated ({@link evtviewer.dataHandler.evtParser#balanceXHTML balanceXHTML()}).
     * - It finally store generated XHTML into parsed data for future retrievements ({@link evtviewer.dataHandler.parsedData#addWitnessText addWitnessText()}).
     *
     * @param {element} doc XML element representing the document to be parsed
     * @param {string} docID id of current document being parsed
     * @param {string} wit id of the current witness being parsed
     *
     * @returns {promise} promise that the parser will end
     *
     * @author CDP
     * @author CM
     */
	parser.parseWitnessText = function(origDoc, docId, wit) {
		var deferred = $q.defer();
		var witnessText;
		if (origDoc !== undefined) {
			var doc = parser.getDocToParse(origDoc);
			var docDOM = doc.getElementsByTagName('body')[0],
				witObj = parsedData.getWitness(wit);

			parser.parseCriticalElementsInText(docDOM, doc, wit, null);

			docDOM.innerHTML = docDOM.innerHTML.replace(/>[\s\r\n]*?</g, '><');

			angular.forEach(docDOM.querySelectorAll('[exclude]'), function(elem) {
				var excludeAttr = elem.getAttribute('exclude');
				if (excludeAttr && excludeAttr.indexOf('#' + wit) >= 0) {
					elem.parentNode.removeChild(elem);
				}
			});

			angular.forEach(docDOM.children, function(elem) {
				var skip = skipFromBeingParsed + ',' + config.lacunaMilestone + ',' + config.fragmentMilestone;
				elem.parentNode.replaceChild(evtParser.parseXMLElement(doc, elem, {skip: skip}), elem);
			});

			//parse <pb>
			evtCriticalApparatusParser.parseWitnessPageBreaks(docDOM, witObj);

			//parse lacunas
			evtCriticalApparatusParser.parseWitnessLacunas(docDOM, wit);

			if (evtCriticalApparatusParser.isFragmentaryWitness(docDOM, wit)) {
				// DA PROBLEMI [ma serve per parsare i frammenti]
				docDOM.innerHTML = docDOM.innerHTML.replace(/xmlns="http:\/\/www\.w3\.org\/1999\/xhtml"/g, '');
				var fragmentaryText = evtCriticalApparatusParser.parseFragmentaryWitnessText(docDOM, wit);
				witnessText = evtParser.balanceXHTML(fragmentaryText);
			} else {
				witnessText = docDOM.innerHTML;
			}

			witnessText = evtParser.balanceXHTML(witnessText);
			//TODO: Split witness into pages
		} else {
			witnessText = '<span> {{ \'MESSAGES.TEXT_NOT_AVAILABLE\' | translate }}</span>';
		}

		//save witness text
		parsedData.addWitnessText(wit, docId, witnessText);

		deferred.resolve('success');
		return deferred;
	};

	// ///////////// //
	// CRITICAL TEXT //
	// ///////////// //
	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.evtCriticalParser#parseCriticalText
     * @methodOf evtviewer.dataHandler.evtCriticalParser
     *
     * @description
     * This method will parse the XML of the document and generate the critical text.
     * The extracted text will be then stored into {@link evtviewer.dataHandler.parsedData parsedData} for future retriements. 
     * - It will loop over critical apparatus entries (defined as <code>apparatusEntryDef</code>) and get the lemma.
     * - It will parse quotes and replace quotes elements with quotes text (retrieved with {@link evtviewer.dataHandler.evtCriticalElementsParser#getQuoteText evtCriticalElementsParser.getQuoteText()}).
     * - It will parse analogues and replace analogues elements with analogues text (retrieved with {@link evtviewer.dataHandler.evtCriticalElementsParser#getAnalogueText evtCriticalElementsParser.getAnalogueText()}).
     * - It will remove page breaks since they are not needed in a critical text.
     * - It finally store generated XHTML into parsed data for future retrievements 
     * ({@link evtviewer.dataHandler.parsedData#addCriticalText addCriticalText()} and {@link evtviewer.dataHandler.parsedData#addVersionText addVersionText()}).
     *
     * @param {element} doc XML element representing the document to be parsed
     * @param {string} docID id of current document being parsed
     * @param {string} scopeVersion version of the text that has to be parsed 
     *
     * @returns {promise} promise that the parser will end
     *
     * @author CDP
     * @author CM
     */
  parser.parseCriticalText = function(origDoc, docId, scopeVersion) {
		var deferred = $q.defer();
		var criticalText;
		if (origDoc !== undefined) {
			var doc = parser.getDocToParse(origDoc);		
			var docDOM = doc.getElementsByTagName('body')[0];
			// console.log(docDOM.parentNode, docDOM.parentNode.parentNode)
			// lemmas = docDOM.getElementsByTagName(lemmaDef.replace(/[<>]/g, ''));
			// if (lemmas.length > 0 || 
			//     (parsedData.getWitness(config.preferredWitness) !== undefined &&
			//      parsedData.getWitness(config.preferredWitness) !== '') ) {

			parser.parseCriticalElementsInText(docDOM, doc, '', scopeVersion);

			// remove <pb>
			var pbs = docDOM.getElementsByTagName('pb');
			k = 0;
			while (k < pbs.length) {
				var pbNode = pbs[k];
				pbNode.parentNode.removeChild(pbNode);
			}

			angular.forEach(docDOM.children, function(elem) {
				var skip = skipFromBeingParsed + ',' + config.lacunaMilestone + ',' + config.fragmentMilestone;
				elem.parentNode.replaceChild(evtParser.parseXMLElement(doc, elem, {skip: skip}), elem);
			});
			criticalText = docDOM.outerHTML;
			// } else {
			//     criticalText = '<span>Text not available.</span>';
			// }   
		} else {
			criticalText = '<span>Text not available.</span>';
		}

		if (criticalText === undefined) {
			var errorMsg = '<span class="alert-msg alert-msg-error critical-text-error"># Critical Text Error. # <br/>{{\'MESSAGES.ERROR_IN_PARSING_TEXT\' | translate}} <br />{{\'MESSAGES.TRY_DIFFERENT_BROWSER_OR_CONTACT_DEVS\' | translate}}</span>';
			criticalText = errorMsg;
		}

		if (scopeVersion === '' || scopeVersion === undefined || scopeVersion === config.versions[0]) {
			parsedData.addCriticalText(criticalText, docId);
		}

		// If scopeVersion is defined it adds it to VersionTexts in parsedData
		if (scopeVersion !== undefined) {
			parsedData.addVersionText(criticalText, docId, scopeVersion);
		}

		deferred.resolve('success');
		return deferred;
	};

	parser.getDocRoot = function(doc) {
		if (doc.tagName.toLowerCase() === 'tei') {
			return doc;
		} else {
			return parser.getDocRoot(doc.parentNode);
		}
	}

	parser.getDocToParse = function(origDoc) {
		var root = parser.getDocRoot(origDoc),
				copyRoot = root.cloneNode(true),
				doc;
		angular.forEach(angular.element(copyRoot).find(evtParser.parserProperties.defDocElement), function(elem) {
				if (elem.outerHTML.localeCompare(origDoc.outerHTML) === 0) {
					doc = elem;
				}
		});
		return doc ? doc : origDoc;
	}

	parser.parseCriticalElementsInText = function(dom, doc, wit, scopeVersion) {
		// apparatus entries in the text body
		var apps = dom.getElementsByTagName(apparatusEntryDef.replace(/[<>]/g, '')) || [],
				appsIndex = apps.length - 1;
		while (appsIndex < apps.length && appsIndex >= 0) {
			if (!evtParser.isNestedInElem(apps[appsIndex], apparatusEntryDef.replace(/[<>]/g, ''))) {
				parser.appendAppNode(apps[appsIndex], doc, wit, scopeVersion);
			}
			appsIndex--;
		}
		if (parsedData.getEncodingDetail('variantEncodingMethod') === 'double-end-point'
					&& parsedData.getEncodingDetail('variantEncodingLocation') === 'external') {
			var depaAppsStartIds = Object.values(parsedData.getCriticalEntries()._indexes.depa.start),
					anchorsIds = [];
			depaAppsStartIds.map(function(id) {
				if (anchorsIds.indexOf(id) < 0) {
					anchorsIds.push(id)
				}
			});
			var index = anchorsIds.length - 1;
			while (index >= 0) {
				var el = dom.querySelector('[*|id=' + anchorsIds[index] + ']');
				if (el) {
					evtDepaParser.setAppInText(el, wit, dom);
				}
				index--;
			}
		}
		// quotes
		if (config.quoteDef) {
			var quotes = [];
			// Retrieves all quote definitions
			var quoteDefs = quoteDef.split(',');
			angular.forEach(quoteDefs, function(def) {
				var q = dom.getElementsByTagName(def.replace(/[<>]/g, '')) || [];
				quotes = quotes.concat(q);
			});
			var quotesIndex = quotes.length - 1;
			while (quotesIndex < quotes.length && quotesIndex >= 0) {
				parser.appendQuoteNode(quotes[quotesIndex], doc, wit);
				quotesIndex--;
			}
		}
		// analogues
		if (config.analogueDef) {
			var analogues = [],
					defs = analogueDef.split(',') || [];
			angular.forEach(defs, function(def) {
				var an = dom.querySelectorAll(def.replace('<', '').replace('>', ''));
				angular.forEach(an, function(analogue) { analogues.push(analogue); });
			});
			var analoguesIndex = analogues.length - 1;
			while (analoguesIndex < analogues.length && analoguesIndex >= 0) {
				parser.appendAnalogueNode(analogues[analoguesIndex], doc, wit);
				analoguesIndex--;
			}
		}
	};

	parser.appendAnalogueNode = function(analogueNode, doc, wit) {
		var analogueId = parser.getParsedNodeId(analogueNode),
				entry = parsedData.getAnalogue(analogueId),
				spanElement;
		if (entry) {
			spanElement = evtCriticalElementsParser.getAnalogueText(entry, wit, doc);
		}
		if (spanElement) {
			analogueNode.parentNode.replaceChild(spanElement, analogueNode);
		}
	};

	parser.appendQuoteNode = function(quoteNode, doc, wit) {
		var quoteId = parser.getParsedNodeId(quoteNode),
				entry = parsedData.getQuote(quoteId),
				spanElement;
		if (entry) {
			spanElement = evtCriticalElementsParser.getQuoteText(entry, wit, doc);
		}
		if (spanElement) {
			quoteNode.parentNode.replaceChild(spanElement, quoteNode);
		}
	};

	parser.appendAppNode = function(appNode, doc, wit, scopeVersion) {
		// TODO-POLO: gestire app depa nel body
		var appId = parser.getParsedNodeId(appNode),
				entry = appNode.getAttribute('type') === 'recensio' ?
					parsedData.getVersionEntry(appId) : parsedData.getCriticalEntryById(appId),
				spanElement;
		// Parse critical entry if it wasn't parsed before
		if (!config.loadCriticalEntriesImmediately || entry === undefined) {
			if (appNode.getAttribute('type') === 'recensio') {
				evtCriticalElementsParser.handleVersionEntry(appNode);
				entry = parsedData.getVersionEntry(appId);
			} else {
				evtCriticalElementsParser.handleAppEntry(appNode);
				var subApps = appNode.getElementsByTagName(apparatusEntryDef.replace(/[<>]/g, ''));
				angular.forEach(Object.values(subApps), function(sub) {
					evtCriticalElementsParser.handleAppEntry(sub);
				});
				entry = parsedData.getCriticalEntryById(appId);
			}
		}
		// Get text element to append in the dom
		if (entry) {
			switch(wit) {
				case '': {
					if (parsedData.getEncodingDetail('variantEncodingMethod') === 'double-end-point') {
						evtDepaParser.setInternalAppInText(appNode, entry, wit, doc);
					} else if (entry.type === 'recensioApp') {
						spanElement = evtCriticalElementsParser.getVersionEntryLemma(entry, wit, scopeVersion);
					} else {
						spanElement = evtCriticalElementsParser.getEntryLemmaText(entry, wit);
					}
				} break;
				default: {
					// If the app is of type "recensio" it is transformed into the evt-recensio-reading directive
					if (parsedData.getEncodingDetail('variantEncodingMethod') === 'double-end-point') {
						evtDepaParser.setInternalAppInText(appNode, entry, wit, doc);
					} else if (entry.type === 'recensioApp') {
						spanElement = evtCriticalElementsParser.getVersionEntryReadingText(entry, wit);
						// Otherwise it is transformed in a evt-reading directive 
					} else {
						spanElement = evtCriticalElementsParser.getEntryWitnessReadingText(entry, wit);
					}
				}
			}
		} else {
			spanElement = parser.createErrorElement(null, 'encodingError');
		}
		// Replace app node with new text element
		if (spanElement) {
			appNode.parentNode.replaceChild(spanElement, appNode);
		} else if (parsedData.getEncodingDetail('variantEncodingMethod') === 'double-end-point') {
			appNode.parentNode.removeChild(appNode);
		}
	};

	parser.createErrorElement = function(errClass, errMsg) {
		var errorElement = document.createElement('span');
		errorElement.className = errClass || 'errorMsg';
		// TODO: add translation
		errorElement.textContent = errMsg || 'ERROR';
		return errorElement;
	};

	parser.getParsedNodeId = function(node) {
		var nodeId;
		if (node.attributes && node.getAttribute('xml:id')) {
			nodeId = node.getAttribute('xml:id');
			nodeId = node.tagName === 'app'? 'app_' + nodeId : nodeId;
		} else {
			nodeId = evtParser.xpath(node).substr(1);
		}
		return nodeId;
	}

	// /////////// //
	// SOURCE TEXT //
	// /////////// //
	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.evtCriticalParser#parseSourceText
     * @methodOf evtviewer.dataHandler.evtCriticalParser
     *
     * @description
     * This method will parse the XML a source and save it into {@link evtviewer.dataHandler.parsedData parsedData} for future retrievements.
     *
     * @param {element} doc XML element representing the document to be parsed
     * @param {string} sourceId id of source to be parsed
     *
     * @returns {promise} promise that the parser will end
     *
     * @author CM
     */
	parser.parseSourceText = function(origDoc, sourceId) {
		var deferred = $q.defer();
		var sourceText,
			currentDoc = angular.element(doc);

		if (origDoc !== undefined) {
			var doc = parser.getDocToParse(origDoc);
			var docDOM = doc.getElementsByTagName('body')[0];

			var segs = docDOM.getElementsByTagName('seg'),
				i = segs.length - 1;

			var element,
				id,
				newElement,
				textContent;

			var correspId = parsedData.getSources()._indexes.correspId[sourceId];

			while (i >= 0) {
				element = segs[i];
				if (element.hasAttribute('type') &&
					element.getAttribute('type') === 'srcTxtLink') {
					if (element.hasAttribute('xml:id')) {
						id = element.getAttribute('xml:id');
					}
					if (correspId[id] !== undefined) {
						newElement = document.createElement('evt-source-seg');
						newElement.setAttribute('data-seg-id', id);
						newElement.setAttribute('data-source-id', sourceId);
						textContent = element.innerHTML;
						newElement.innerHTML = textContent;
						element.parentNode.replaceChild(newElement, element);
					}
				}
				i--;
			}

			angular.forEach(docDOM.children, function(elem) {
				var skip = skipFromBeingParsed + '<evt-source-seg>';
				elem.parentNode.replaceChild(evtParser.parseXMLElement(doc, elem, {skip: skip}), elem);
			});
			sourceText = docDOM.outerHTML;
		} else {
			sourceText = '<span>Text not available.</span>';
		}

		if (sourceText === undefined) {
			var errorMsg = '<span class="alert-msg alert-msg-error">{{\'MESSAGES.ERROR_IN_PARSING_TEXT\' | translate}} <br />{{\'MESSAGES.TRY_DIFFERENT_BROWSER_OR_CONTACT_DEVS\' | translate}}</span>';
			sourceText = errorMsg;
		}

		parsedData.getSource(sourceId).text = sourceText;
		deferred.resolve('success');
		return deferred;
	};

	return parser;
});