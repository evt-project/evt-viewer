/**
 * @ngdoc service
 * @module evtviewer.dataHandler
 * @name evtviewer.dataHandler.evtSourcesApparatus
 * @description
 * # evtSourcesApparatus
 * Service containing methods to handle the contents of sources entries.
 *
 * @requires evtviewer.core.config
 * @requires evtviewer.dataHandler.parsedData
 * @requires evtviewer.dataHandler.evtParser
 * @requires evtviewer.dataHandler.evtSourcesParser
 * @requires evtviewer.dataHandler.evtCriticalApparatus
 * @requires evtviewer.dataHandler.evtCriticalApparatusParser
**/
angular.module('evtviewer.dataHandler')

.service('evtSourcesApparatus', function(parsedData, evtParser, config, evtSourcesParser, evtCriticalApparatus, evtCriticalApparatusParser) {
	var apparatus = {};

	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.evtSourcesApparatus#getContent
     * @methodOf evtviewer.dataHandler.evtSourcesApparatus
     *
     * @description
     * Retrieve the information about a particular quote.
     *
     * @param {element} quote XML element to parse
     * @param {string} scopeWit id of witness to consider
     *
     * @returns {objecy} JSON object representing the content of the quote, that is structured as follows:
        <pre>
            var appContent = {
				attributes: {
					values: {},
					_keys: []
				},
				sources: [],
				quote: '',
				abbrQuote: {
					begin: '',
					end: ''
				},
				quoteCorresp: '',
				_xmlSource: ''
			};
        </pre>
     * @author CM
     */
	apparatus.getContent = function(quote, scopeWit) {
		// console.log('getContent', quote);
		var appContent = {
			attributes: {
				values: quote.attributes || {},
				_keys: Object.keys(quote.attributes) || []
			},
			sources: [], //Elenco delle fonti, ognuna con tutte le info necessarie
			quote: '', //Intestazione dell'entrata d'apparato, che corrisponde alla citazione
			abbrQuote: {
				begin: '',
				end: ''
			},
			quoteCorresp: quote._indexes.correspId,
			//_sourceXml: [],
			_xmlSource: quote._xmlSource.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, '') //Xml della citazione, cui si aggiungerà anche l'xml della source selezionata
		};

		var sourceId = quote._indexes.sourceId || [],
			sourceRefId = quote._indexes.sourceRefId || [],
			source,
			entry;
		for (var i = 0; i < sourceId.length; i++) {
			source = parsedData.getSource(sourceId[i]);
			entry = apparatus.getSource(source);
			if (entry) {
				appContent.sources.push(entry);
			}
		}
		for (var j = 0; j < sourceRefId.length; j++) {
			source = parsedData.getSource(sourceRefId[j]);
			entry = apparatus.getSource(source);
			if (entry) {
				appContent.sources.push(entry);
			}
		}

		appContent.quote = apparatus.getQuote(quote, scopeWit);

		//TODO : abbreviated quote for sourceSeg panel and collapse mechanism
		if (appContent.quote.length >= 140) {
			var space = appContent.quote.indexOf(' ', 20);
			var lastSpace = appContent.quote.lastIndexOf(' ');
			appContent.abbrQuote.begin = '<span class="beginQuote">' + appContent.quote.substring(0, space) + '</span>';
			appContent.abbrQuote.end = '<span class="endQuote">' + appContent.quote.substring(lastSpace) + '</span>';

		}

		return appContent;
	};
	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.evtSourcesApparatus#getSource
     * @methodOf evtviewer.dataHandler.evtSourcesApparatus
     *
     * @description
     * Retrieve the information about a particular source entry.
     *
     * @param {Object} entry JSON object representing the source
     *
     * @returns {objecy} JSON object representing the source, that is structured as follows:
        <pre>
            var source = {
				id: '',
				abbr: '',
				text: '',
				bibl: '',
				url: '',
				_xmlSource: ''
			};
        </pre>
     * @author CM
     */
	apparatus.getSource = function(entry) {
		if (!entry) {
			return undefined;
		}
		var source = {
			id: entry.id,
			abbr: '',
			text: '',
			bibl: '',
			url: '',
			_xmlSource: entry._xmlSource.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, ''),
		};

		//Creates the abbreviated reference of the source with ms identifier...
		if (entry.abbr.msId.length > 0) {
			for (var i = 0; i < entry.abbr.msId.length; i++) {
				source.abbr += '<span class="msId inSource">' + apparatus.getText(entry.abbr.msId[i]) + '</span>';
			}
		} else {
			//...or author and title.
			if (entry.abbr.author.length > 0) {
				source.abbr += '<span class="author inSource">' + apparatus.getText(entry.abbr.author[0]) + '</span>';
				if (entry.abbr.author.length > 1) {
					source.abbr += 'et al., ';
				} else {
					source.abbr += ', ';
				}
			}
			if (entry.abbr.title.length > 0) {
				source.abbr += '<span class="title inSource">' + apparatus.getText(entry.abbr.title[0]) + '</span>';
			}
		}
		//If there is no author nor title, it uses the xml:id
		if (source.abbr === '') {
			source.abbr = entry.id;
		}

		var bibref = entry.bibl;
		for (var j = 0; j < bibref.length; j++) {
			source.bibl += apparatus.getText(bibref[j]);
		}

		//Get the text cited
		var text = '';
		if (entry.quote.length > 0) {
			for (var k = 0; k < entry.quote.length; k++) {
				text += apparatus.getText(entry.quote[k]);
			}
			if (text !== '') {
				source.text = text;
			}
		}

		//Prepares the links to the source text (online or in the source view)
		for (var z = 0; z < entry.url.length; z++) {
			if (entry.url[z].indexOf('http') >= 0) {
				source.url += '<span class="linkLabel">{{ \'CRITICAL_APPARATUS.SEE_FULL_SOURCE_WEB\' | translate }}</span><a target="_blank" href="' + entry.url[z] + '">' + entry.url[z] + '</a><br/>';
			} else if (entry.url[z].indexOf(entry.id) >= 0) {
				source.url += '<span class="linkLabel"><evt-source-ref data-source-id="' + entry.id + '">{{ \'CRITICAL_APPARATUS.SEE_FULL_SOURCE\' | translate }}</evt-source-ref></span>';
			}
		}

		return source;
	};
	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.evtSourcesApparatus#getSourceAbbr
     * @methodOf evtviewer.dataHandler.evtSourcesApparatus
     *
     * @description
     * Retrieve the abbreviated form of the output content of a particular source text.
     *
     * @param {Object} entry JSON object representing the source
     *
     * @returns {string} generated abbreviation of the source
     *
     * @author CM
     */
	apparatus.getSourceAbbr = function(entry) {
		var abbr = '';
		if (entry.abbr) {
			if (entry.abbr.msId && entry.abbr.msId.length > 0) {
				for (var i = 0; i < entry.abbr.msId.length; i++) {
					abbr += apparatus.getText(entry.abbr.msId[i]) + ' ';
				}
			} else {
				//...or author and title.
				if (entry.abbr.author && entry.abbr.author.length > 0) {
					abbr += apparatus.getText(entry.abbr.author[0]);
					if (entry.abbr.author.length > 1) {
						abbr += 'et al., ';
					} else {
						abbr += ', ';
					}
				}
				if (entry.abbr.title && entry.abbr.title.length > 0) {
					abbr += apparatus.getText(entry.abbr.title[0]);
				}
			}
		}
		//If there is no author nor title, it uses the xml:id
		if (abbr === '') {
			abbr = entry.id;
		}
		return abbr;
	};
	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.evtSourcesApparatus#getQuote
     * @methodOf evtviewer.dataHandler.evtSourcesApparatus
     *
     * @description
     * Retrieve the textual output of a particular quote.
     * The function will handle also sub quotes, which will be displayed between "((" and "))".
     *
     * @param {Object} quote JSON object representing the quote
     * @param {string} scopeWit id of witness to consider
     *
     * @returns {string} the text of the quote
     *
     * @author CM
     */
	apparatus.getQuote = function(quote, scopeWit) {
		var content = quote.content || [];
		var result = '';
		for (var i in content) {
			if (typeof content[i] === 'string') {
				result += ' ' + content[i];
			} else {
				var skip = ['EVT-POPOVER', 'lb', 'ptr', 'link', 'linkGrp', 'pb'];
				if (skip.indexOf(content[i].tagName) >= 0) {
					result += '';
				} else if (content[i].type === 'app') {
					result += apparatus.getAppText(content[i], scopeWit);
				} else if (content[i].type === 'analogue') {
					result += evtCriticalApparatus.getCriticalElementContent(content[i], scopeWit);
				} else if (content[i].type === 'quote') {
					result += ' ((' + apparatus.getQuote(content[i], scopeWit) + '))';
				} else if (content[i].content !== undefined) {
					result += apparatus.getText(content[i]);
				} else {
					result += apparatus.getQuote(content[i]);
				}
			}
		}
		return result;
	};
	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.evtSourcesApparatus#getText
     * @methodOf evtviewer.dataHandler.evtSourcesApparatus
     *
     * @description
     * Retrieve the text of a particular source entry.
     * The basic text of the entry is already available into <code>content</code> array property;
     * thus the function will just concatenate the items in it.
     *
     * @param {Object} entry JSON object representing the entry to handle
     *
     * @returns {string} the text of the entry
     *
     * @author CM
	 * @todo Eventualmente aggiungere parametro stringa per il valore della class di span (tipo 'author' o 'textNode')
     */
	apparatus.getText = function(entry) {
		var result = '';
		var content = entry.content;
		if (content !== undefined) {
			for (var i = 0; i < content.length; i++) {
				if (typeof content[i] === 'string') {
					result += ' ' + content[i];
				} else if (content[i].content !== undefined) {
					result += apparatus.getText(content[i]);
				}
			}
		}
		return result;
	};
	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.evtSourcesApparatus#getAppText
     * @methodOf evtviewer.dataHandler.evtSourcesApparatus
     *
     * @description
     * etrieve the text of a particular source entry for a particular scope witness.
     *
     * @param {Object} entry JSON object representing the entry to handle
     * @param {string} scopeWit id of witness to consider
     *
     * @returns {string} the text of the entry
     *
     * @author CM
     */
	apparatus.getAppText = function(entry, scopeWit) {
		var result = '';
		if (scopeWit === '' || scopeWit === undefined || entry._indexes.witMap[scopeWit] === undefined) {
			var lem = entry.lemma;
			result += apparatus.getText(entry.content[lem]);
		} else {
			var rdg = entry._indexes.witMap[scopeWit];
			result += apparatus.getText(entry.content[rdg]);
		}
		return result;
	};

	return apparatus;
});
