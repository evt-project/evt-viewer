/**
 * @ngdoc service
 * @module evtviewer.dataHandler
 * @name evtviewer.dataHandler.evtRunesParser
 * @description
 * # evtRunesParser
 * Service containing methods to parse data regarding runes.
 *
 * @requires $q
 * @requires xmlParser
 * @requires evtviewer.dataHandler.evtParser
 * @requires evtviewer.dataHandler.parsedData
 * @requires evtviewer.dataHandler.evtCriticalElementsParser
 * @requires evtviewer.core.config
 *
 * @author FS
**/
angular.module('evtviewer.dataHandler')

.service('evtRunesParser', function($q, evtParser, parsedData, evtCriticalElementsParser, config, xmlParser) {
	//TODO
	//Forse dovrai spostare tutti i parser degli elementi critici in un unico file :(
	var parser = {};

	var runesUrl = config.runesUrl || '';

	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.evtRunesParser#parseRunes
     * @methodOf evtviewer.dataHandler.evtRunesParser
     *
     * @description
     * This method will parse all runes contained in source encoded text.
     * - It looks for all the passages in the critical text that may have an <code>runeDef</code> inside or outside of them.
     * - It calls {@link evtviewer.dataHandler.evtCriticalElementsParser#parseRune parseRune()} for every rune element found.
	 * - Then, if there is no external document for runes, it calls {@link evtviewer.dataHandler.evtRunesParser#handleRune handleRune()},
	 * otherwise it calls {@link evtviewer.dataHandler.evtRunesParser#parseExternalRunes parseExternalRunes()} to handle the external document for the runes.
	 * - Finally it calls {@link evtviewer.dataHandler.evtRunesParser#updateRunes updateRunes()} to remove runes
	 * that aren't correctly linked to a source.
	 *
	 * @param {string} doc string representing the XML document to be parsed
	 * @param {element=} extDoc external XML document that contains the runes
	 *
	 * @returns {promise} promise that the parser will end
	 *
	 * @author FS
     */
	parser.parseRunes = function(doc, extDoc) {
		var deferred = $q.defer(),
			currentDocument = angular.element(doc);

		if (parsedData.getRunes()._refId._indexes.length > 0) {
			if (extDoc !== undefined) {
				parser.parseExternalRunes(extDoc);
			}
		}

		console.log('## Runes ##', parsedData.getRunes());

		deferred.resolve('success');
		return deferred;
	};
	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.evtRunesParser#updateRunes
     * @methodOf evtviewer.dataHandler.evtRunesParser
     *
     * @description
     * This method deletes all the runes that have an empty sources array.
     * It retrieve the parsed runes from {@link evtviewer.dataHandler.parsedData parsedData} service.
	 *
	 * @author FS*/

	parser.updateRunes = function() {
		var runes = parsedData.getRunes();
		var index = parsedData.getRunes()._indexes.encodingStructure;
		for (var i = 0; i < index.length; i++) {
			var rune = parsedData.getRune(index[i]);
			if (rune.runes.length <= 0) {
				delete runes[index[i]];
				index.splice(index.indexOf(rune.id), 1);
			}
		}
	};
	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.evtRunesParser#parseExternalRunes
     * @methodOf evtviewer.dataHandler.evtRunesParser
     *
     * @description
     * This method parses the external runes document, by calling on each child node
     * the function {@link evtviewer.dataHandler.evtRunesParser#handleAnalogue handleAnalogue()}
	 *
	 * @param {element} doc external XML document that contains the runes
	 *
	 * @author FS*/

	parser.parseExternalRunes = function(doc) {
		var deferred = $q.defer();
		for (var i = 0; i < doc.childNodes.length; i++) {
			parser.handleRune(doc.childNodes[i]);
		}
		console.log('## External Runes Received ##', parsedData.getRunes());

		parser.updateRunes();

		deferred.resolve('success');
		return deferred;
	};

   return parser;

});
