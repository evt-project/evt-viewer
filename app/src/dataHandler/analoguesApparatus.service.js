angular.module('evtviewer.dataHandler')

.service('evtAnaloguesApparatus', function(parsedData, evtParser, config, evtSourcesParser, evtCriticalApparatusParser, evtAnaloguesParser, evtSourcesApparatus) {
	var apparatus = {};

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
			appContent.sources.push(source);
		}

		appContent.header = apparatus.getHeader(analogue, scopeWit);

		return appContent;
	};

	apparatus.getSource = function(entry) {
		var source = {
			id: entry.id,
			abbr: '',
			text: '',
			bibl: '',
			url: entry.url,
			_xmlSource: entry._xmlSource.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, ''),
		};

		if (entry.abbr.msId.length > 0) {
			for (var i = 0; i < entry.abbr.msId.length; i++) {
				source.abbr += '<span class="msId inSource">' + apparatus.getText(entry.abbr.msId[i]) + '</span>';
			}
		} else {
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

	//Eventualmente aggiungere parametro stringa per il valore della class di span (tipo 'author' o 'textNode')
	apparatus.getText = function(entry) {
		var result = '',
			content = entry.content;
		if (content !== undefined) {
			for (var i = 0; i < content.length; i++) {
				if (typeof content[i] === 'string') {
					result += content[i];
				} else if (content[i].content !== undefined) {
					result += apparatus.getText(content[i]);
				}
			}
		}
		return result;
	};

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