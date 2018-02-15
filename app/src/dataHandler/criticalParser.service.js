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

.service('evtCriticalParser', function($q, parsedData, evtParser, evtCriticalApparatusParser, evtSourcesParser, evtAnaloguesParser, evtCriticalElementsParser, xmlParser, config) {
	var parser = {};

	var apparatusEntryDef = '<app>',
		lemmaDef = '<lem>',
		readingDef = lemmaDef + ', <rdg>',
		readingGroupDef = '<rdgGrp>',
		quoteDef = config.quoteDef || '<quote>',
		analogueDef = config.analogueDef || '<seg>,<ref[type=parallelPassage]>',
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
	parser.parseWitnessText = function(doc, docId, wit) {
		var deferred = $q.defer();
		var witnessText;
		if (doc !== undefined) {
			doc = doc.cloneNode(true);
			var docDOM = doc.getElementsByTagName('body')[0],
				witObj = parsedData.getWitness(wit);

			var apps = docDOM.getElementsByTagName(apparatusEntryDef.replace(/[<>]/g, '')),
				j = apps.length - 1;
			while (j < apps.length && j >= 0) {
				var appNode = apps[j];
				if (!evtParser.isNestedInElem(appNode, apparatusEntryDef.replace(/[<>]/g, ''))) {
					var id;
					if (appNode.getAttribute('xml:id')) {
						id = 'app_' + appNode.getAttribute('xml:id');
					} else {
						id = evtParser.xpath(appNode).substr(1);
					}
					var spanElement, entry;

					if (appNode.hasAttribute('type') && (appNode.getAttribute('type') === 'recensio')) {
						entry = parsedData.getVersionEntry(id);
					} else {
						entry = parsedData.getCriticalEntryById(id);
					}
					// If I've already parsed all critical entries,
					// or I've already parsed the current entry...
					// ...I can simply access the model to get the right output
					// ... otherwise I parse the DOM and save the entry in the model
					if (!config.loadCriticalEntriesImmediately && entry === undefined) {
						// Check if the app is of type recensio
						if (appNode.hasAttribute('type') && (appNode.getAttribute('type') === 'recensio')) {
							evtCriticalElementsParser.handleVersionEntry(appNode);
							entry = parsedData.getVersionEntry(id);
						} else {
							evtCriticalElementsParser.handleAppEntry(appNode);
							var subApps = appNode.getElementsByTagName(apparatusEntryDef.replace(/[<>]/g, ''));
							if (subApps.length > 0) {
								for (var z = 0; z < subApps.length; z++) {
									evtCriticalElementsParser.handleAppEntry(subApps[z]);
								}
							}
							entry = parsedData.getCriticalEntryById(id);
						}
					}
					if (entry !== undefined) {
						// If the app is of type "recensio" it is transformed into the evt-recensio-reading directive
						if (entry.type === 'recensioApp') {
							spanElement = evtCriticalElementsParser.getVersionEntryReadingText(entry, wit);
							// Otherwise it is transformed in a evt-reading directive 
						} else {
							spanElement = evtCriticalElementsParser.getEntryWitnessReadingText(entry, wit);
						}
					} else {
						spanElement = document.createElement('span');
						spanElement.className = 'encodingError';
					}
					if (spanElement !== null) {
						appNode.parentNode.replaceChild(spanElement, appNode);
					}
				}
				j--;
			}
			//docDOM.innerHTML = docDOM.innerHTML.replace(/>[\s\r\n]*?</g,'><');

			//docDOM.getElementsByTagName(quoteDef.replace(/[<>]/g, ''))
			var quotes = [];
			if (quoteDef.lastIndexOf('<') !== 0) {
				var tags = quoteDef.split(',');
				for (var i = 0; i < tags.length; i++) {
					var q = docDOM.getElementsByTagName(tags[i].replace(/[<>]/g, ''));
					for (var x = 0; x < q.length; x++) {
						quotes.push(q[x]);
					}
				}
			} else {
				var quo = docDOM.getElementsByTagName(quoteDef.replace(/[<>]/g, ''));
				for (var f = 0; f < quo.length; f++) {
					quotes.push(quo[f]);
				}
			}
			var k = quotes.length - 1,
                c = 0;
			while (k < quotes.length && k >= 0) {
				var quoteElem = quotes[k];
				var quoteId;
				if (quoteElem.getAttribute('xml:id')) {
					quoteId = quoteElem.getAttribute('xml:id');
				} else {
					quoteId = evtParser.xpath(quoteElem).substr(1);
				}
				var quote = parsedData.getQuote(quoteId);
				if (quote !== undefined) {
					var quoteText = evtCriticalElementsParser.getQuoteText(quote, wit, doc);
					quoteElem.parentNode.replaceChild(quoteText, quoteElem);
				}
				k--;
			}

			//ANALOGUES
			var analogues = [],
				//TO DO: trovare alternativa meno dispendiosa di memoria
				allEl = docDOM.getElementsByTagName('*');
			for (var s = 0; s < allEl.length; s++) {
				var inner = allEl[s].innerHTML.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, '');
				var el = allEl[s].outerHTML.replace(inner, '');
				if (analogueRegExpr.test(el)) {
					analogues.push(allEl[s]);
				}
			}

			var h = analogues.length - 1;
			while (h < analogues.length && h >= 0) {
				var analogueElem = analogues[h];
				var analogueId;
				if (analogueElem.getAttribute('xml:id')) {
					analogueId = analogueElem.getAttribute('xml:id');
				} else {
					analogueId = evtParser.xpath(analogueElem).substr(1);
				}
				var analogue = parsedData.getAnalogue(analogueId);
				if (analogue !== undefined) {
					var analogueText = evtCriticalElementsParser.getAnalogueText(analogue, wit, doc);
					analogueElem.parentNode.replaceChild(analogueText, analogueElem);
				}
				h--;
			}

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
    parser.parseCriticalText = function(doc, docId, scopeVersion) {
		// console.log('parseCriticalText');
		var deferred = $q.defer();
		var criticalText;
		if (doc !== undefined) {
			doc = doc.cloneNode(true);
			var docDOM = doc.getElementsByTagName('body')[0];
			// lemmas = docDOM.getElementsByTagName(lemmaDef.replace(/[<>]/g, ''));
			// if (lemmas.length > 0 || 
			//     (parsedData.getWitness(config.preferredWitness) !== undefined &&
			//      parsedData.getWitness(config.preferredWitness) !== '') ) {

			//READINGS
			var apps = docDOM.getElementsByTagName(apparatusEntryDef.replace(/[<>]/g, '')) || [],
				j = apps.length - 1,
				count = 0;

			while (j < apps.length && j >= 0) {
				var appNode = apps[j];
				if (!evtParser.isNestedInElem(appNode, apparatusEntryDef.replace(/[<>]/g, ''))) {
					// var id: appNode.getAttribute('xml:id') || evtParser.xpath(appNode).substr(1),
					var id;
					if (appNode.getAttribute('xml:id')) {
						id = 'app_' + appNode.getAttribute('xml:id');
					} else {
						id = evtParser.xpath(appNode).substr(1);
					}
					var spanElement, entry;

					if (appNode.hasAttribute('type') && (appNode.getAttribute('type') === 'recensio')) {
						entry = parsedData.getVersionEntry(id);
					} else {
						entry = parsedData.getCriticalEntryById(id);
					}

					// If I've already parsed all critical entries,
					// or I've already parsed the current entry...
					// ...I can simply access the model to get the right output
					// ... otherwise I parse the DOM and save the entry in the model
					if (!config.loadCriticalEntriesImmediately || entry === undefined) {
						if (appNode.hasAttribute('type') && (appNode.getAttribute('type') === 'recensio')) {
							evtCriticalElementsParser.handleVersionEntry(appNode);
							entry = parsedData.getVersionEntry(id);
						} else {
							evtCriticalElementsParser.handleAppEntry(appNode);
							var subApps = appNode.getElementsByTagName(apparatusEntryDef.replace(/[<>]/g, ''));
							if (subApps.length > 0) {
								for (var z = 0; z < subApps.length; z++) {
									evtCriticalElementsParser.handleAppEntry(subApps[z]);
								}
							}
							entry = parsedData.getCriticalEntryById(id);
						}
					}
					if (entry !== undefined) {
						if (entry.type === 'recensioApp') {
							spanElement = evtCriticalElementsParser.getVersionEntryLemma(entry, '', scopeVersion);
						} else {
							spanElement = evtCriticalElementsParser.getEntryLemmaText(entry, '');
						}
					} else {
						spanElement = document.createElement('span');
						spanElement.className = 'errorMsg';
						spanElement.textContent = 'ERROR';//TODO: Add translation
					}
					if (spanElement !== null) {
						appNode.parentNode.replaceChild(spanElement, appNode);
					}
					count++;
				}
				j--;
			}

			//QUOTES
			var quotes = [];
			if (quoteDef.lastIndexOf('<') !== 0) {
				var tags = quoteDef.split(',');
				for (var i = 0; i < tags.length; i++) {
					var q = docDOM.getElementsByTagName(tags[i].replace(/[<>]/g, ''));
					for (var x = 0; x < q.length; x++) {
						quotes.push(q[x]);
					}
				}
			} else {
				var quo = docDOM.getElementsByTagName(quoteDef.replace(/[<>]/g, ''));
				for (var f = 0; f < quo.length; f++) {
					quotes.push(quo[f]);
				}
			}
			var k = quotes.length - 1,
				c = 0;

			while (k < quotes.length && k >= 0) {
				var quoteElem = quotes[k];
				var quoteId;
				if (quoteElem.getAttribute('xml:id')) {
					quoteId = quoteElem.getAttribute('xml:id');
				} else {
					quoteId = evtParser.xpath(quoteElem).substr(1);
				}
				var quote = parsedData.getQuote(quoteId);
				if (quote !== undefined) {
					var quoteText = evtCriticalElementsParser.getQuoteText(quote, '', doc);
					quoteElem.parentNode.replaceChild(quoteText, quoteElem);
				}
				k--;
			}

			//ANALOGUES
			var analogues = [],
				//TO DO: trovare alternativa meno dispendiosa di memoria
				allEl = docDOM.getElementsByTagName('*');
			for (var w = 0; w < allEl.length; w++) {
				var inner = allEl[w].innerHTML.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, '');
				var el = allEl[w].outerHTML.replace(inner, '');
				if (analogueRegExpr.test(el)) {
					analogues.push(allEl[w]);
				}
			}

			var h = analogues.length - 1;
			while (h < quotes.length && h >= 0) {
				var analogueElem = analogues[h];
				var analogueId;
				if (analogueElem.getAttribute('xml:id')) {
					analogueId = analogueElem.getAttribute('xml:id');
				} else {
					analogueId = evtParser.xpath(analogueElem).substr(1);
				}
				var analogue = parsedData.getAnalogue(analogueId);

				if (analogue !== undefined) {
					var analogueText = evtCriticalElementsParser.getAnalogueText(analogue, '', doc);
					analogueElem.parentNode.replaceChild(analogueText, analogueElem);
				}
				h--;
			}


			//remove <pb>
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
	parser.parseSourceText = function(doc, sourceId) {
		var deferred = $q.defer();
		var sourceText,
			currentDoc = angular.element(doc);

		if (doc !== undefined) {
			doc = doc.cloneNode(true);
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