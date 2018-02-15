/**
 * @ngdoc service
 * @module evtviewer.dataHandler
 * @name evtviewer.dataHandler.evtAnaloguesApparatus
 * @description
 * # evtAnaloguesApparatus
 * Service containing methods to handle the contents of analogue entries.
 *
 * @requires evtviewer.core.config
 * @requires evtviewer.dataHandler.parsedData
 * @requires evtviewer.dataHandler.evtParser
 * @requires evtviewer.dataHandler.evtSourcesParser
 * @requires evtviewer.dataHandler.evtCriticalApparatusParser
 * @requires evtviewer.dataHandler.evtAnaloguesParser
 * @requires evtviewer.dataHandler.evtSourcesApparatus
 *
 * @author CM
**/
angular.module('evtviewer.dataHandler')

.service('evtAnaloguesApparatus', function(parsedData, evtParser, config, evtSourcesParser, evtCriticalApparatusParser, evtAnaloguesParser, evtSourcesApparatus) {
	var apparatus = {};
	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.evtAnaloguesApparatus#getContent
     * @methodOf evtviewer.dataHandler.evtAnaloguesApparatus
     *
     * @description
     * Retrieve the information about a particular analogue apparatus.
     *
     * @param {Object} analogue JSON object representing the analogue to handle
     * @param {string} scopeWit id of witness to handle
     *
     * @returns {Object} JSON object representing the content of the analogue apparatus, that is structured as follows:
        <pre>
            var appContent = {
				attributes: {
					values: {},
					_keys: []
				},
				sources: [],
				header: '',
				_xmlSource:''
			};
        </pre>
     */
	apparatus.getContent = function(analogue, scopeWit) {
		// console.log('getContent', analogue);
		var appContent = {
			attributes: {
				values: analogue.attributes || {},
				_keys: Object.keys(analogue.attributes) || []
			},
			sources: [], //Elenco delle fonti, ognuna con tutte le info necessarie
			//text: '', //Testo
			header: '', //Intestazione dell'entrata d'apparato
			//_sourceXml: [],
			_xmlSource: analogue._xmlSource.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, '') //Xml della citazione, cui si aggiungerà anche l'xml della source selezionata
		};

		for (var i = 0; i < analogue.sources.length; i++) {
			var source = apparatus.getSource(analogue.sources[i]);
			if (source) {appContent.sources.push(source);}
		}

		appContent.header = apparatus.getHeader(analogue, scopeWit);

		return appContent;
	};
	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.evtAnaloguesApparatus#getSource
     * @methodOf evtviewer.dataHandler.evtAnaloguesApparatus
     *
     * @description
     * Retrieve the information about a particular source entry.
     * After retrieving the eventual manuscript, author and title information,
     * the function will transform the bibliographic reference into strings and
     * retrieve the cited text.
     *
     * @param {Object} entry JSON object representing the entry to handle
     *
     * @returns {Object} JSON object representing the content of the source, that is structured as follows:
        <pre>
            var source = {
				id: '',
				abbr: '',
				text: '',
				bibl: '',
				url: '',
				_xmlSource: '',
			};
        </pre>
     */
	apparatus.getSource = function(entry) {
		var source = {
			id: entry.id,
			abbr: '',
			text: '',
			bibl: '',
			url: entry.url,
			_xmlSource: entry._xmlSource.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, ''),
		};

		if (entry.abbr) {
			if (entry.abbr.msId && entry.abbr.msId.length > 0) {
				for (var i = 0; i < entry.abbr.msId.length; i++) {
					source.abbr += '<span class="msId inSource">' + apparatus.getText(entry.abbr.msId[i]) + '</span>';
				}
			} else {
				if (entry.abbr.author && entry.abbr.author.length > 0) {
					source.abbr += '<span class="author inSource">' + apparatus.getText(entry.abbr.author[0]) + '</span>';
					if (entry.abbr.author.length > 1) {
						source.abbr += 'et al., ';
					} else {
						source.abbr += ', ';
					}
				}
				if (entry.abbr.title && entry.abbr.title.length > 0) {
					source.abbr += '<span class="title inSource">' + apparatus.getText(entry.abbr.title[0]) + '</span>';
				}
			}
		}
		if (source.abbr === '') {
			source.abbr = entry.id;
		}

		//Transform the bibliographic reference into strings
		var bibref = entry.bibl;
		for (var j = 0; j < bibref.length; j++) {
			source.bibl += apparatus.getText(bibref[j]);
		}

		//Get the text cited
		var text = '';
		if (entry.text.length > 0) {
			for (var k = 0; k < entry.text.length; k++) {
				text += apparatus.getText(entry.text[k]);
			}
			if (text !== '') {
				source.text = text;
			}
		}
		return source;
	};
	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.evtAnaloguesApparatus#getHeader
     * @methodOf evtviewer.dataHandler.evtAnaloguesApparatus
     *
     * @description
     * Retrieve the content of the header of a particular analogue entry.
     * Please note: The header is the main text to be shown in the inline box representing the analogue entry.
     *
     * @param {Object} analogue JSON object representing the analogue to handle
     * @param {string} scopeWit id of witness to handle
     *
     * @returns {string} string representing the HTML of the transformed analogue header content
     */
	apparatus.getHeader = function(analogue, scopeWit) {
		var content = analogue.content || [];
		var result = '<span class="analogue-header">';
		for (var i in content) {
			if (typeof content[i] === 'string') {
				result += '<span class="textNode inAnalogueHeader">' + content[i] + '</span>';
			} else {
				var skip = ['EVT-POPOVER', 'lb', 'ptr', 'link', 'linkGrp', 'pb'];
				if (skip.indexOf(content[i].tagName) >= 0) {
					result += '';
				} else if (content[i].type === 'app') {
					var t = apparatus.getAppText(content[i], scopeWit);
					result += '<span class="app inAnalogueHeader">' + t + '</span>';
				} else if (content[i].type === 'analogue') {
					result += '<span class="subAnalogue inAnalogueHeader">((' + apparatus.getHeader(content[i], scopeWit) + '))</span>';
				} else if (content[i].type === 'quote') {
					result += '<span class="quote inAnalogueHeader">' + evtSourcesApparatus.getQuote(content[i], scopeWit) + '</span>';
				} else if (content[i].type === 'analogueContent') {
					result += apparatus.getHeader(content[i], scopeWit);
				} else if (content[i].content !== undefined) {
					result += '<span class="textNode inAnalogueHeader">' + apparatus.getText(content[i]) + '</span>';
				}
			}
		}
		result += '</span>';
		return result;
	};
	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.evtAnaloguesApparatus#getText
     * @methodOf evtviewer.dataHandler.evtAnaloguesApparatus
     *
     * @description
     * Retrieve the text of a particular analogue entry.
     * The basic text of the entry is already available into <code>content</code> array property;
     * thus the function will just concatenate the items in it.
     *
     * @param {Object} entry JSON object representing the entry to handle
     *
     * @returns {string} string representing the HTML of the retrieved entry text
     * @todo Eventualmente aggiungere parametro stringa per il valore della class di span (tipo 'author' o 'textNode')
     */
	apparatus.getText = function(entry) {
		var result = '',
			content = entry.content;
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
     * @name evtviewer.dataHandler.evtAnaloguesApparatus#getAppText
     * @methodOf evtviewer.dataHandler.evtAnaloguesApparatus
     *
     * @description
     * Retrieve the text of a particular analogue entry for a particular scope witness.
     *
     * @param {Object} entry JSON object representing the entry to handle
     * @param {string} scopeWit id of witness to handle
     *
     * @returns {string} string representing the HTML of the retrieved apparatus entry text
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
