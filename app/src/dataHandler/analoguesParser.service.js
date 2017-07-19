/**
 * @ngdoc service
 * @module evtviewer.dataHandler
 * @name evtviewer.dataHandler.evtAnaloguesParser
 * @description 
 * # evtAnaloguesParser
 * TODO: Add description and comments for every method
 *
 * @author Chiara Martignano
**/
angular.module('evtviewer.dataHandler')

.service('evtAnaloguesParser', function($q, evtParser, parsedData, evtCriticalElementsParser, config, xmlParser) {
	//TODO
	//Forse dovrai spostare tutti i parser degli elementi critici in un unico file :(
	var parser = {};

	var apparatusEntryDef = '<app>',
		quoteDef = '<quote>',
		analoguesUrl = config.analoguesUrl || '',
		analogueDef = '<seg>,<ref[type=parallelPassage]>';


	/*********************/
	/*parseAnalogues(doc)*/
	/***********************************************************************************/
	/*Looks for all the passages in the critical text that may have an analogueDef     */
	/*inside of them or outside. Calls parseAnalogue for every analogue element found. */
	/*Then, if there is no external document for the analogue, it calls handleAnalogue.*/
	/*Finally it calls updateAnalogues() to remove analogues that aren't correctly     */
	/*linked to a source.                                                              */
	/* @doc --> XML document to be parsed                                              */
	/***********************************************************************************/
	parser.parseAnalogues = function(doc, extDoc) {
		var deferred = $q.defer(),
			currentDocument = angular.element(doc);

		//console.log(match);

		angular.forEach(currentDocument.find(analogueDef.replace(/[<>]/g, '')),
			function(element) {
				var isInBody = evtParser.isNestedInElem(element, 'body');
				if (isInBody) {
					var analogue = evtCriticalElementsParser.parseAnalogue(element);
					//Qui aggiungere controllo su sourceId e souceRefId
					//In questo modo non si aggiunge inutilmente analogue senza fonti
					if (analogue._indexes.sourceId.length > 0 ||
						analogue._indexes.sourceRefId.length > 0) {
						parsedData.addAnalogue(analogue);
					}
				}
			});

		if (parsedData.getAnalogues()._refId._indexes.length > 0) {
			if (analoguesUrl === '' || analoguesUrl === undefined) {
				var defDocElement;
                if (currentDocument.find('text group text').length > 0) {
					defDocElement = 'text group text';
				} else if (currentDocument.find('text').length > 0) {
					defDocElement = 'text';
				} else if (currentDocument.find('div[subtype="edition_text"]').length > 0) {
					defDocElement = 'div[subtype="edition_text"]';
				}
				angular.forEach(currentDocument.find(defDocElement),
					function(element) {
						parser.handleAnalogue(element);
					});
				parser.updateAnalogues();
			} else if (extDoc !== undefined) {
				parser.parseExternalAnalogues(extDoc);
			}
		}

		console.log('## Analogues ##', parsedData.getAnalogues());

		deferred.resolve('success');
		return deferred;
	};

	/**********************/
	/*handleAnalogue(elem)*/
	/*******************************************************************************************/
	/*Function that looks for the element (inside the current document or an external document)*/
	/*that has an xml:id attribute corresponding to one of the ids saved in the array of the   */
	/*collection. If so, it parses that element with the function parseSource(source), then    */
	/*pushes the result in the sources array of all the analogue entries that refer to that    */
	/*source.                                                                                  */
	/*@elem --> element to be parsed inside the document                                       */
	/*******************************************************************************************/
	parser.handleAnalogue = function(elem) {
		var ref = parsedData.getAnalogues()._refId;
		var indexes = parsedData.getAnalogues()._refId._indexes;
		//console.log('weila', ref)
		if (elem.nodeType === 3) {
			return;
		} else if (elem.nodeType === 1) {
			if (elem.attributes.length > 0) {
				for (var i = 0; i < elem.attributes.length; i++) {
					if (elem.attributes[i].name === 'xml:id') {
						var attr = elem.attributes[i].value;
						if (indexes.indexOf(attr) >= 0) {
							var source = evtCriticalElementsParser.parseAnalogueSource(elem);
							for (var j = 0; j < ref[attr].length; j++) {
								var analogue = parsedData.getAnalogue(ref[attr][j]);
								analogue.sources.push(source);
							}
						}
					}
				}
			} else if (elem.childNodes.length > 0) {
				for (var k = 0; k < elem.childNodes.length; k++) {
					parser.handleAnalogue(elem.childNodes[k]);
				}
			}
		}
	};

	/*******************/
	/*updateAnalogues()*/
	/*************************************************************/
	/*Deletes all the analogues that have an empty sources array.*/
	/*************************************************************/
	parser.updateAnalogues = function() {
		var analogues = parsedData.getAnalogues();
		var index = parsedData.getAnalogues()._indexes.encodingStructure;
		for (var i = 0; i < index.length; i++) {
			var analogue = parsedData.getAnalogue(index[i]);
			if (analogue.sources.length <= 0) {
				delete analogues[index[i]];
				index.splice(index.indexOf(analogue.id), 1);
			}
		}

	};

	/*************************** */
	/*parseExternalAnalogues(doc)*/
	/******************************************************************/
	/*Function that parses the external analogues document, by calling*/
	/*on each child node handleAnalogue(element)                      */
	/*@doc --> external XML document that contains the analogues      */
	/******************************************************************/
	parser.parseExternalAnalogues = function(doc) {
		var deferred = $q.defer();
		for (var i = 0; i < doc.childNodes.length; i++) {
			parser.handleAnalogue(doc.childNodes[i]);
		}
		console.log('## External Analogues Received ##', parsedData.getAnalogues());

		parser.updateAnalogues();

		deferred.resolve('success');
		return deferred;
	};

	return parser;
});