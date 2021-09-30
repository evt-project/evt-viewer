/**
 * @ngdoc service
 * @module evtviewer.dataHandler
 * @name evtviewer.dataHandler.evtEditionLevelParser
 * @description 
 * # evtEditionLevelParser
 * Service containing methods to parse data regarding primary source information
 *
 * @requires evtviewer.dataHandler.parsedData
 * @requires evtviewer.dataHandler.evtParser
 * @requires evtviewer.dataHandler.xmlParser
**/
angular.module('evtviewer.dataHandler')

	.service('evtEditionLevelParser', ['$q', 'parsedData', 'evtParser', 'xmlParser', 'evtCriticalParser', function ($q, parsedData, evtParser, xmlParser, evtCriticalParser) {
		var parser = {};


		/**
		 * @ngdoc method
		 * @name evtviewer.dataHandler.evtEditionLevelParser#parseTextForEditionLevel
		 * @methodOf evtviewer.dataHandler.evtEditionLevelParser
		 *
		 * @description
		 * This method will parse the text of a given XML document on the basis of the page, document and edition level.
		 * - It balances the given XHTML
		 * - It replaces single spaces between elements into <code>__SPACE__</code>, otherwise they will be ignored from loop on childNode.
		 * - It removes <code>pb</code> and <code>lb</code> elements since they where already handled differently
		 * - It tranforms the <code>g</code> element into the text mapped in the referenced glyph for the specific edition level.
		 * - It parses all <code>childNodes</code> with {@link evtviewer.dataHandler.evtEditionLevelParser#parseXMLElement parseXMLElement()}
		 * - Finally it stores the result into {@link evtviewer.dataHandler.parsedData parsedData} for future retrievements.
		 *
		 * @param {string} pageId id of the page being parsed
		 * @param {string} docId id of the edition document being parsed
		 * @param {string} editionLevel id of the edition level being parsed
		 * @param {string} docHTML string representing the original XML of the edition
		 *
		 * @returns {promise} promise that the parser will end
		 *
		 * @author CDP
		 */
		parser.parseTextForEditionLevel = function (pageId, docId, editionLevel, docHTML) {
			console.log('parseTextForEditionLevel', editionLevel)
			var balancedHTMLString = evtParser.balanceXHTML(docHTML);
			balancedHTMLString = balancedHTMLString.replace(/>\s+</g, '>__SPACE__<');
			var deferred = $q.defer(),
				editionText = balancedHTMLString, //TEMP

				doc = xmlParser.parse('<div id="mainContentToTranform" class="' + editionLevel + '">' + balancedHTMLString + '</div>');
			if (doc !== undefined) {
				var docDOM = doc.getElementById('mainContentToTranform');
				//remove <pb>s
				var pbNode,
					pbs = docDOM.getElementsByTagName('pb'),
					k = 0;
				while (k < pbs.length) {
					pbNode = pbs[k];
					pbNode.parentNode.removeChild(pbNode);
				}

				//remove <lb>s
				var invalidLbsSuffix;
				if (editionLevel === 'diplomatic') {
					invalidLbsSuffix = '_reg';
				} else if (editionLevel === 'interpretative') {
					invalidLbsSuffix = '_orig';
				}
				if (invalidLbsSuffix) {
					var lbs = docDOM.getElementsByTagName('lb');
					k = 0;
					while (k < lbs.length) {
						var lbNode = lbs[k];
						var lbNodeId = lbNode.getAttribute('xml:id');
						if (lbNodeId && lbNodeId !== null && lbNodeId.indexOf(invalidLbsSuffix) >= 0) {
							lbNode.parentNode.removeChild(lbNode);
						} else {
							k++;
						}
					}
				}

				var Gs = docDOM.getElementsByTagName('g');
				k = 0;
				while (k < Gs.length) {
					var gNode = Gs[k],
						ref = gNode.getAttribute('ref'),
						glyphNode = document.createElement('span');
					glyphNode.className = 'glyph';

					if (ref && ref !== '') {
						ref = ref.replace('#', '');
						var edition = editionLevel;
						edition = edition === 'interpretative' ? 'normalized' : edition;
						if (evtParser.isNestedInElem(gNode, 'abbr') || evtParser.isNestedInElem(gNode, 'orig')) {
							edition = 'diplomatic';
						}
						var glyphMappingForEdition = parsedData.getGlyphMappingForEdition(ref, edition);
						if (glyphMappingForEdition) {
							glyphNode.appendChild(angular.element(glyphMappingForEdition.element)[0]);
						}
					}
					if (glyphNode) {
						//TODO Creare direttiva apposita per GLYPHs
						gNode.parentNode.insertBefore(glyphNode, gNode.nextSibling);
					}
					gNode.parentNode.removeChild(gNode);
				}
				docDOM.innerHTML = docDOM.innerHTML.replace(/>[\s\r\n]*?</g, '><');

				evtCriticalParser.parseCriticalElementsInText(docDOM, doc, '');

				angular.forEach(docDOM.children, function (elem) {
					var skip = evtCriticalParser.defs.skipFromBeingParsed + ',<pb>,<g>';
					elem.parentNode.replaceChild(evtParser.parseXMLElement(doc, elem, {
						skip: skip
					}), elem);
				});
				editionText = docDOM.outerHTML;
			} else {
				editionText = '<span> {{ \'TEXT_NOT_AVAILABLE\' | translate }}</span>';
			}

			if (editionText === undefined) {
				var errorMsg = '<span class="alert-msg alert-msg-error">{{\'MESSAGES.ERROR_IN_PARSING_TEXT\' | translate}} <br />{{\'MESSAGES.TRY_DIFFERENT_BROWSER_OR_CONTACT_DEVS\' | translate}}</span>';
				editionText = errorMsg;
			}
			editionText = editionText.replace(/__SPACE__/g, ' ');
			parsedData.setPageText(pageId, docId, editionLevel, editionText);

			deferred.resolve('success');
			return deferred;
		};

		return parser;
	}]);