/**
 * @ngdoc service
 * @module evtviewer.dataHandler
 * @name evtviewer.dataHandler.evtCriticalApparatus
 * @description 
 * # evtCriticalApparatus
 * Service containing methods to handle the contents of critical apparatus entries (lemma, readings, etc.).
 * 
 * @requires evtviewer.core.config
 * @requires evtviewer.dataHandler.parsedData
 * @requires evtviewer.dataHandler.evtParser
**/
angular.module('evtviewer.dataHandler')

.service('evtCriticalApparatus', function(parsedData, evtParser, config) {
	var apparatus = {};

	var skipWitnesses = config.skipWitnesses.split(',').filter(function(el) {
		return el.length !== 0;
	});
	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.evtCriticalApparatus#getContent
     * @methodOf evtviewer.dataHandler.evtCriticalApparatus
     *
     * @description
     * Retrieve the content of a particular critical apparatus entry.
     * The function  will look for the lemma, the significant and not significant readings,
     * the sub critical apparatus and the critical note. For each element it prepare the output,
     * and reorganize it in such a structure that speeds up the future data retrievements.
     *
     * @param {element} entry XML element to parse
     * @param {boolean} subApp whether the entry is a nested one
     * @param {string} scopeWit id of witness to consider
     *
     * @returns {objecy} JSON object representing the content of the entry, that is structured as follows:
        <pre>
            var appContent = {
				attributes: {
					values: {},
					_keys: []
				},
				lemma: {
					content: '',
					attributes: {
						values: {},
						_keys: []
					}
				},
				significantReadings: [],
				notSignificantReadings: [],
				readingGroups: [],
				criticalNote: '',
				witnessesGroups: {}
			};
        </pre>
     */
	apparatus.getContent = function(entry, subApp, scopeWit) {
		// console.log('getContent', entry);
		var appContent = {
			attributes: {
				values: entry.attributes || {},
				_keys: Object.keys(entry.attributes) || []
			},
			lemma: {
				content: '',
				attributes: {
					values: {},
					_keys: []
				}
			},
			significantReadings: [],
			notSignificantReadings: [],
			readingGroups: [],
			criticalNote: '',
			witnessesGroups: JSON.parse(JSON.stringify(config.witnessesGroups)),
		};

		apparatus.getWitnessesGroups(entry, scopeWit, appContent.witnessesGroups);

		//Lemma
		var lemma = entry.content[entry.lemma];
		if (lemma !== undefined) {
			appContent.lemma.content += '<span class="app_lemma_content">' + apparatus.getLemma(lemma, scopeWit) + '</span>';
			appContent.lemma.attributes.values = lemma.attributes || {};
			appContent.lemma.attributes._keys = Object.keys(lemma.attributes) || [];
		}

		//significant

		//Significant Readings
		var readings = entry._indexes.readings;
		var totReadings = readings._indexes;
		for (var i = 0; i < totReadings.length; i++) {
			var reading = entry.content[totReadings[i]];
			if (reading !== undefined) {
				var readingContent = apparatus.getSignificantReading(reading, scopeWit);
				if (readings._significant.indexOf(reading.id) >= 0) {
					appContent.significantReadings.push(readingContent);
				} else {
					appContent.notSignificantReadings.push(readingContent);
				}
			}
		}

		if (!subApp) {
			//Raggruppamenti
			if (entry._indexes.groups.length > 0) {
				for (var j = 0; j < entry._indexes.groups.length; j++) {
					var group = entry.content[entry._indexes.groups[j]];
					if (group !== undefined) {
						var groupHeader = [];
						for (var x in group.attributes) {
							groupHeader.push({
								label: x,
								values: group.attributes[x]
							});
						}

						var groupReadings = [];
						for (var k = 0; k < group.content.length; k++) {
							var groupEntry = entry.content[group.content[k]];
							if (groupEntry !== undefined) {
								groupReadings.push(apparatus.getSignificantReading(groupEntry, scopeWit));
							}
						}
						if (groupReadings.length > 0) {
							appContent.readingGroups.push({
								header: groupHeader,
								readings: groupReadings
							});
						}
					}
				}
			}
		}
		appContent.criticalNote += entry.note;

		return appContent;
	};
	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.evtCriticalApparatus#getWitnessesGroups
     * @methodOf evtviewer.dataHandler.evtCriticalApparatus
     *
     * @description
     * Expand the siglas referenced to a group with the siglas of witnesses contained in that group.
     * Every new information is stored within the <code>entry</code> object.
     * Prepare the output for the visualization of readings of a particular group of witnesses.
     *
     * @param {Object} entry JSON object representing the entry to handle
     * @param {string} scopeWit id of witness to consider
     * @param {array} groups groups to handle
     *
     * @author CM
     */
	apparatus.getWitnessesGroups = function(entry, scopeWit, groups) {
		for (var h in groups) {
			groups[h].wits = [];
			groups[h].significant = {};
			groups[h].significantContent = {};
			groups[h].notSignificant = {};
			groups[h].notSignificantContent = {};
			for (var i in entry._indexes.witMap) {
				if (groups[h].witnesses.indexOf(i) >= 0) {
					groups[h].wits.push(i);
				}
			}
			delete groups[h].witnesses;

			for (var j in groups[h].wits) {
				var readingId = entry._indexes.witMap[groups[h].wits[j]];
				var readingContent = entry.content[readingId];
				if (readingContent._significant) {
					groups[h].significantContent[readingId] = readingContent;
					if (groups[h].significant[readingId] === undefined) {
						groups[h].significant[readingId] = [];
						groups[h].significant[readingId].push(groups[h].wits[j]);
					} else {
						groups[h].significant[readingId].push(groups[h].wits[j]);
					}
				} else {
					groups[h].notSignificantContent[readingId] = readingContent;
					if (groups[h].notSignificant[readingId] === undefined) {
						groups[h].notSignificant[readingId] = [];
						groups[h].notSignificant[readingId].push(groups[h].wits[j]);
					} else {
						groups[h].notSignificant[readingId].push(groups[h].wits[j]);
					}
				}
			}

            var c, s, f; // Indexes used below
            var wit;
			if (Object.keys(groups[h].significant).length === 0) {
				delete groups[h].significant;
				delete groups[h].significantContent;
			} else {
				groups[h].significantText = '';
				for (c in groups[h].significant) {
					s = '<span class="';
					if (c === entry.lemma) {
						s += 'lem inWitGrp">';
					} else {
						s += 'rdg inWitGrp">';
					}
					s += apparatus.getReadingForGroup(groups[h].significantContent[c], scopeWit) + '</span><span class="witnesses">';
					for (f in groups[h].significant[c]) {
						wit = groups[h].significant[c][f];
						s += '<evt-witness-ref witness="' + wit + '" data-scope-wit="' + scopeWit + '"></evt-witness-ref>';
					}
					s += '</span>';
					groups[h].significantText += s;
				}
				delete groups[h].significant;
				delete groups[h].significantContent;
			}

			if (Object.keys(groups[h].notSignificant).length === 0) {
				delete groups[h].notSignificant;
				delete groups[h].notSignificantContent;
			} else {
				groups[h].notSignificantText = '';
				for (c in groups[h].notSignificant) {
					s = '<span class="';
					if (c === entry.lemma) {
						s += 'lem inWitGrp">';
					} else {
						s += 'rdg inWitGrp">';
					}
					s += apparatus.getReadingForGroup(groups[h].notSignificantContent[c], scopeWit) + '</span><span class="witnesses">';
					for (f in groups[h].notSignificant[c]) {
						wit = groups[h].notSignificant[c][f];
						s += '<evt-witness-ref witness="' + wit + '" data-scope-wit="' + scopeWit + '"></evt-witness-ref>';
					}
					s += '</span>';
					groups[h].notSignificantText += s;
				}
				delete groups[h].notSignificant;
				delete groups[h].notSignificantContent;
			}
		}
	};
	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.evtCriticalApparatus#getReadingForGroup
     * @methodOf evtviewer.dataHandler.evtCriticalApparatus
     *
     * @description
     * Retrieve the reading text for a particular group of witnesses.
     *
     * @param {Object} reading JSON object representing the reading to handle
     * @param {string} scopeWit id of witness to consider
     *
     * @returns {string} reading text retrieved
     *
     * @author CM
     */
	apparatus.getReadingForGroup = function(reading, scopeWit) {
		var readingText = '';

		for (var i = 0; i < reading.content.length; i++) {
			if (typeof(reading.content[i]) === 'string') {
				readingText += reading.content[i];
			} else {
				if (reading.content[i].type === 'subApp') {
					readingText += apparatus.getSubApparatus(reading.content[i].id, scopeWit);
				} else if (reading.content[i].type === 'genericElement') {
					readingText += apparatus.getGenericContent(reading.content[i], scopeWit);
					//Added by CM    
				} else if (reading.content[i].type === 'quote' ||
					reading.content[i].type === 'analogue') {
					readingText += apparatus.getCriticalElementContent(reading.content[i], scopeWit);
				} else {
					readingText += reading.content[i].outerHTML;
				}
			}
		}
		if (readingText === '') {
			readingText = ' <i>omit.</i> ';
		}
		readingText = apparatus.transformCriticalEntryLacunaMilestones(readingText);
		readingText = readingText.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, '');
		readingText = apparatus.transformCriticalEntryFragmentMilestones(readingText);

		return readingText;
	};
	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.evtCriticalApparatus#getGenericContent
     * @methodOf evtviewer.dataHandler.evtCriticalApparatus
     *
     * @description
     * Retrieve the content of a particular critical element, that could be a sub apparatus, a generic element 
     * or a simple text string. This function can be used to generate the output of a critical apparatus entry.
     *
     * @param {Object} element JSON object representing the element to handle
     * @param {string} scopeWit id of witness to consider
     *
     * @returns {string} content text retrieved
     */
	apparatus.getGenericContent = function(element, scopeWit) {
		var genericContentText;

		genericContentText = ' <span class="' + element.tagName + ' inApparatus">';
		for (var i = 0; i < element.content.length; i++) {
			if (typeof(element.content[i]) === 'string') {
				genericContentText += element.content[i];
			} else if (element.content[i].type === 'subApp') {
				genericContentText += apparatus.getSubApparatus(element.content[i].id, scopeWit);
			} else if (element.content[i].type === 'genericElement') {
				genericContentText += apparatus.getGenericContent(element.content[i], scopeWit);
			} else {
				genericContentText += element.content[i].outerHTML;
			}
		}
		genericContentText += '</span>';
		return genericContentText;
	};
	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.evtCriticalApparatus#getLemma
     * @methodOf evtviewer.dataHandler.evtCriticalApparatus
     *
     * @description
     * Retrieve the text of the lemma of a particular critical apparatus entry.
     *
     * @param {Object} lemma JSON object representing the lemma to handle
     * @param {string} scopeWit id of witness to consider
     *
     * @returns {string} text of lemma retrieved
     */
	apparatus.getLemma = function(lemma, scopeWit) {
		var lemmaText = '';
		// lemma content
		for (var i = 0; i < lemma.content.length; i++) {
			if (lemma.content[i].type === 'subApp') {
				lemmaText += apparatus.getSubApparatus(lemma.content[i].id, scopeWit);
			} else if (lemma.content[i].type === 'quote' ||
				lemma.content[i].type === 'analogue') {
				lemmaText += apparatus.getCriticalElementContent(lemma.content[i], scopeWit);
			} else if (lemma.content[i].type === 'genericElement') {
				lemmaText += apparatus.getGenericContent(lemma.content[i], scopeWit);
			} else {
				lemmaText += lemma.content[i];
			}
		}

		lemmaText = apparatus.transformCriticalEntryLacunaMilestones(lemmaText);

		if (lemmaText !== '') {
			lemmaText += apparatus.getCriticalEntryWitnesses(lemma, 'lem', scopeWit);
		}

		lemmaText = lemmaText.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, '');
		lemmaText = apparatus.transformCriticalEntryFragmentMilestones(lemmaText);

		return lemmaText;
	};
	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.evtCriticalApparatus#getSubApparatus
     * @methodOf evtviewer.dataHandler.evtCriticalApparatus
     *
     * @description
     * Retrieve the text of nested critical apparatus entries.
     * The nested apparatus will be delimited by "((" and "))" within the lemma or reading text.
     *
     * @param {string} subAppId id of nested apparatus to handle
     * @param {string} scopeWit id of witness to consider
     *
     * @returns {string} text of nested apparatus retrieved
     */
	apparatus.getSubApparatus = function(subAppId, scopeWit) {
		var subAppText = '';
		var subApp = parsedData.getCriticalEntryById(subAppId);
		var subAppContent = apparatus.getContent(subApp, true, scopeWit);

		subAppText += '<span class="sub_app"> ((' + subAppContent.lemma.content + ' ';
		for (var i = 0; i < subAppContent.significantReadings.length; i++) {
			subAppText += subAppContent.significantReadings[i].content;
			if (i < subAppContent.significantReadings.length - 1) {
				subAppText += '; ';
			}
		}
		subAppText += ')) </span>';
		return subAppText;
	};
	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.evtCriticalApparatus#getSignificantReading
     * @methodOf evtviewer.dataHandler.evtCriticalApparatus
     *
     * @description
     * Retrieve the output for the list of significant readings of a particular critical apparatus entry.
     * The function will eventually tranform empty node into omission nodes,
     * will handle lacunas and fragments tags and generate a well formatted output
     * where the reading text is follower by the list of witnesses siglas to which the reading belongs. 
     *
     * @param {Object} reading JSON object representing the reading to handle
     * @param {string} scopeWit id of witness to consider
     *
     * @returns {Object} JSON object representing the content of the significant reading, that is structured as
     	<pre>
			var readingObj = {
				content: '',
				attributes: {
					values: {},
					_keys: []
				}
			};
     	</pre>
     */
	apparatus.getSignificantReading = function(reading, scopeWit) {
		var readingText = '',
			readingObj = {};

		for (var i = 0; i < reading.content.length; i++) {
			if (typeof(reading.content[i]) === 'string') {
				readingText += reading.content[i];
			} else {
				if (reading.content[i].type === 'subApp') {
					readingText += apparatus.getSubApparatus(reading.content[i].id, scopeWit);
				} else if (reading.content[i].type === 'genericElement') {
					readingText += apparatus.getGenericContent(reading.content[i], scopeWit);
					//Added by CM    
				} else if (reading.content[i].type === 'quote' ||
					reading.content[i].type === 'analogue') {
					readingText += apparatus.getCriticalElementContent(reading.content[i], scopeWit);
				} else {
					readingText += reading.content[i].outerHTML;
				}
			}
		}
		if (readingText === '') {
			readingText = ' <i>omit.</i> ';
		}
		readingText = apparatus.transformCriticalEntryLacunaMilestones(readingText);

		var readingWits = apparatus.getCriticalEntryWitnesses(reading, 'rdg', scopeWit);
		if (reading.wits === undefined || readingWits !== '') {
			readingText += readingWits;
			// readingText += apparatus.getCriticalEntryAttributes(reading, 'rdg');
			readingText = readingText.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, '');
			readingText = apparatus.transformCriticalEntryFragmentMilestones(readingText);

			readingObj = {
				content: readingText,
				attributes: {
					values: reading.attributes || {},
					_keys: Object.keys(reading.attributes) || []
				}
			};
		}
		return readingObj;
	};
	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.evtCriticalApparatus#getCriticalElementContent
     * @methodOf evtviewer.dataHandler.evtCriticalApparatus
     *
     * @description
     * Generic function that allows to retrieve the content of a particular element within a critical apparatus entry.
     * This element can be an apparatus, a quote, an analogue or a more generic element.
     * The output will be generated based on the tag name of the element itself.
     *
     * @param {Object} element JSON object representing the critical entry to handle
     * @param {string} scopeWit id of witness to consider
     *
     * @returns {string} string representing the generated HTML for the critical element content
     * 
     * @author CM
     */
	apparatus.getCriticalElementContent = function(element, scopeWit) {
		var content = element.content || [];
		var result = '<span class="' + element.type + ' inApparatus">';
		for (var i in content) {
			if (typeof content[i] === 'string') {
				result += '<span class="textNode">' + content[i] + '</span>';
			} else {
				var skip = ['EVT-POPOVER', 'lb', 'ptr', 'link', 'linkGrp', 'pb'];
				if (skip.indexOf(content[i].tagName) >= 0) {
					result += '';
				} else if (content[i].type === 'app') {
					var t = getAppText(content[i], scopeWit);
					result += t;
				} else if (content[i].type === 'analogue') {
					result += apparatus.getCriticalElementContent(content[i], scopeWit);
				} else if (content[i].type === 'quote') {
					result += apparatus.getCriticalElementContent(content[i], scopeWit);
				} else if (content[i].content !== undefined) {
					result += apparatus.getText(content[i]);
				}
			}
		}

		result += '</span>';
		return result;
	};
	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.evtCriticalApparatus#getText
     * @methodOf evtviewer.dataHandler.evtCriticalApparatus
     *
     * @description
     * Retrieve the text of the critical apparatus entry, included the nested apparatuses.
     * The basic text of the entry is already available into <code>content</code> array property;
     * thus the function will just concatenate the items in it.
     *
     * @param {Object} element JSON object representing the critical entry to handle
     *
     * @returns {string} the text of entry
     * 
     * @author CM
     * @todo: Decide if the transformation of each text node in a span.textNode is still necessary or not.
     */
	apparatus.getText = function(entry) {
		var result = '';
		var content = entry.content;
		if (content !== undefined) {
			for (var i = 0; i < content.length; i++) {
				if (typeof content[i] === 'string') {
					result += '<span class="textNode">' + content[i] + '</span>';
				} else if (content[i].content !== undefined) {
					result += apparatus.getText(content[i]);
				}
			}
		}
		return result;
	};
	/**
     * @ngdoc function
     * @name evtviewer.dataHandler.evtCriticalApparatus#getAppText
     * @methodOf evtviewer.dataHandler.evtCriticalApparatus
     *
     * @description
     * [PRIVATE] Retrieve the text of a particular critical apparatus for a particular scope witness.
     *
     * @param {Object} element JSON object representing the critical entry to handle
     * @param {string} scopeWit id of witness to consider
     *
     * @returns {string} the text of apparatus entry
     * 
     * @author CM
     */
	var getAppText = function(entry, scopeWit) {
		var result = '';
		if (scopeWit === '' ||
			scopeWit === undefined ||
			entry._indexes.witMap[scopeWit] === undefined) {
			var lem = entry.lemma;
			result += apparatus.getText(entry.content[lem]);
		} else {
			var rdg = entry._indexes.witMap[scopeWit];
			result += apparatus.getText(entry.content[rdg]);
		}
		return result;
	};
	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.evtCriticalApparatus#getCriticalEntryWitnesses
     * @methodOf evtviewer.dataHandler.evtCriticalApparatus
     *
     * @description
     * Retrieve the output to show the list of witnesses to which belongs a particular reading
     * within a particular critical apparatus entry. Each sigla will be trasformed into a 
     * <code>&lt;evt-witness-red&gt;</code> element.
     *
     * @param {Object} reading JSON object representing the reading to handle
     * @param {string} elemType type of element that is being handled
     * @param {string} scopeWit id of witness to consider
     *
     * @returns {string} string representing the HTML containing the witnesses of a given critical entry
     */
	apparatus.getCriticalEntryWitnesses = function(reading, elemType, scopeWit) {
		var witnesses = '';
		if (reading.wits !== undefined && reading.wits.length > 0) {
			for (var wit in reading.wits) {
				if (wit && reading.wits[wit] && skipWitnesses.indexOf(wit) < 0) {
					witnesses += '<evt-witness-ref witness="' + reading.wits[wit] + '" data-scope-wit="' + scopeWit + '"></evt-witness-ref>';
				}
			}
		} else if (elemType === 'lem') {
			if (reading.autoWits !== undefined && reading.autoWits.length > 0) {
				for (var autoWit in reading.autoWits) {
					if (autoWit && reading.autoWits[autoWit] && skipWitnesses.indexOf(autoWit) < 0) {
						witnesses += '<evt-witness-ref witness="' + reading.autoWits[autoWit] + '" data-scope-wit="' + scopeWit + '"></evt-witness-ref>';
					}
				}
			}
		}

		if (witnesses !== '') {
			witnesses = '<span class="witnesses witnesses-' + elemType + '">' + witnesses + '</span>';
		}
		return witnesses;
	};
	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.evtCriticalApparatus#getCriticalEntryAttributes
     * @methodOf evtviewer.dataHandler.evtCriticalApparatus
     *
     * @description
     * Retrieve the list of attributes (and their values) connected to a particular reading or lemma
     * of a particular critical apparatus entry.
     *
     * @param {Object} reading JSON object representing the reading to handle
     * @param {string} elemType type of element that is being handled
     *
     * @returns {string} string representing the HTML containing the attributes of a given reading
     */
	apparatus.getCriticalEntryAttributes = function(reading, elemType) {
		var attributes = '';
		if (reading.attributes !== undefined) {
			for (var key in reading.attributes) {
				if (key !== 'wit' && key !== 'xml:id') {
					attributes += '<span class="' + key + '">' + key + ': ' + reading.attributes[key] + '</span>';
				}
			}
		}
		if (attributes !== '') {
			attributes = '<span class="attributes" style="display:none">' + attributes + '</span>';
		}
		return attributes;
	};
	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.evtCriticalApparatus#transformCriticalEntryLacunaMilestones
     * @methodOf evtviewer.dataHandler.evtCriticalApparatus
     *
     * @description
     * This method transform <code>lacunaStart</code> and <code>lacunaEnd</code> elements into 
     * simple element that will inform about the start/end of a lacuna.
     *
     * @param {string} appText text of the apparatus to handle
     *
     * @returns {string} text with <code>lacunaStart</code> and <code>lacunaEnd</code> elements transformed
     */
	apparatus.transformCriticalEntryLacunaMilestones = function(appText) {
		appText = appText.replace(/<lacunaStart(.|[\r\n])*?\/>/ig, '<i> {{ \'CRITICAL_APPARATUS.LACUNA_START\' | translate }} </i>');
		appText = appText.replace(/<lacunaEnd(.|[\r\n])*?\/>/ig, '<i> {{ \'CRITICAL_APPARATUS.LACUNA_END\' | translate }} </i>');
		return appText;
	};
	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.evtCriticalApparatus#transformCriticalEntryFragmentMilestones
     * @methodOf evtviewer.dataHandler.evtCriticalApparatus
     *
     * @description
     * This method transform <code>witStart</code> and <code>witEnd</code> elements into simple element 
     * that will inform about the start/end of a fragment.
     *
     * @param {string} appText text of the apparatus to handle
     *
     * @returns {string} text with <code>lacunaStart</code> and <code>lacunaEnd</code> elements transformed
     */
	apparatus.transformCriticalEntryFragmentMilestones = function(appText) {
		var fragmentsStarts = appText.match(/<witStart(.|[\r\n])*?\/>/ig);
		if (fragmentsStarts !== null) {
			for (var i = 0; i < fragmentsStarts.length; i++) {
				var matchedStart = fragmentsStarts[i];
				var witStart = matchedStart.match(/"#.*"/g);
				if (witStart !== null) {
					witStart = ' of ' + witStart[0].replace(/["#]/g, '');
				} else {
					witStart = '';
				}
				var sRegExInputStart = new RegExp(matchedStart, 'ig');
				appText = appText.replace(sRegExInputStart, '<i> [beginning of fragment' + witStart + '] </i>');
			}
		}

		var fragmentsEnds = appText.match(/<witEnd(.|[\r\n])*?\/>/ig);
		if (fragmentsEnds !== null) {
			for (var j = 0; j < fragmentsEnds.length; j++) {
				var matchedEnd = fragmentsEnds[j];
				var witEnd = matchedEnd.match(/"#.*"/g);
				if (witEnd !== null) {
					witEnd = ' of ' + witEnd[0].replace(/["#]/g, '');
				} else {
					witEnd = '';
				}
				var sRegExInputEnd = new RegExp(matchedEnd, 'ig');
				appText = appText.replace(sRegExInputEnd, '<i> [end of fragment' + witEnd + '] </i>');
			}
		}
		return appText;
	};
	return apparatus;
});