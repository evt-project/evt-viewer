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
 * @requires evtviewer.core.config
 *
 * @author FS
**/
angular.module('evtviewer.dataHandler')

.service('evtRunesParser', function($q, evtParser, parsedData, config, xmlParser) {

	var parser = {};

   var runesUrl = config.runesUrl || '',
   defsourceDescElement = 'sourceDesc',
   defHotSpotDivType = 'hotspot';


	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.evtRunesParser#parseRunes
     * @methodOf evtviewer.dataHandler.evtRunesParser
     *
     * @description
     * This method will parse all runes contained in external encoded text.
    * @param {string} doc string representing the XML document to be parsed
	 * @param {element=} extDoc external XML document that contains the runes
	 * @returns {promise} promise that the parser will end
	 *
	 * @author FS */
   parser.parseRunes = function() {
      var deferred = $q.defer();
      var values = parsedData.getRuneDocuments().runes.content;
      console.log('## Rune Text parsed ##', values);
		deferred.resolve('success');
		return deferred;
   };

	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.evtCriticalParser#parseRuneText
     * @methodOf evtviewer.dataHandler.evtCriticalParser
     *
     * @description
     * This method will parse the XML a rune and save it into {@link evtviewer.dataHandler.parsedData parsedData} for future retrievements.
     *
     * @param {element} doc XML element representing the document to be parsed
     * @param {string} runeId id of rune to be parsed
     *
     * @returns {promise} promise that the parser will end
     *
     * @author FS
     */
	parser.parseRuneText = function(origDoc, runeId) {
		var deferred = $q.defer();
		var runeText,
			currentDoc = angular.element(doc);

		if (origDoc !== undefined) {
			var doc = parser.getDocToParse(origDoc);
			var docDOM = doc.getElementsByTagName('teiHeader')[0];

			var object = docDOM.getElementsByTagName('object'),
				i = object.length - 1;

			var element,
				id,
				newElement,
				textContent;

			var correspId = parsedData.getRunes()._indexes.correspId[runeId];

			while (i >= 0) {
				element = object[i];
				if (element.hasAttribute('type') &&
					element.getAttribute('type') === 'runeTextLink') {
					if (element.hasAttribute('xml:id')) {
						id = element.getAttribute('xml:id');
					}
					if (correspId[id] !== undefined) {
						newElement = document.createElement('evt-rune-object');
						newElement.setAttribute('data-seg-id', id);
						newElement.setAttribute('data-rune-id', runeId);
						textContent = element.innerHTML;
						newElement.innerHTML = textContent;
						element.parentNode.replaceChild(newElement, element);
					}
				}
				i--;
			}

			angular.forEach(docDOM.children, function(elem) {
				var skip = skipFromBeingParsed + '<evt-rune-object>';
				elem.parentNode.replaceChild(evtParser.parseXMLElement(doc, elem, {skip: skip}), elem);
			});
			runeText = docDOM.outerHTML;
		} else {
			runeText = '<span>Text not available.</span>';
		}

		if (runeText === undefined) {
			var errorMsg = '<span class="alert-msg alert-msg-error">{{\'MESSAGES.ERROR_IN_PARSING_TEXT\' | translate}} <br />{{\'MESSAGES.TRY_DIFFERENT_BROWSER_OR_CONTACT_DEVS\' | translate}}</span>';
			runeText = errorMsg;
		}

		parsedData.getRune(runeId).text = runeText;
		deferred.resolve('success');
		return deferred;
   };
   var handleRune = function(elem){
      //Get the ids saved
      if (elem.nodeType === 3) {
          return;
      }
      else if (elem.nodeType === 1) {
          if (elem.attributes.length > 0) {
              for (var i = 0; i < elem.attributes.length; i++) {
                  if (elem.attributes[i].name === 'xml:id') {
                      var attr = elem.attributes[i].value;
                      if (ref.indexOf(attr) >= 0) {
                          evtRunesParser.parseRune(elem);
                      }
                  }
              }
          }
          else if (elem.childNodes.length > 0) {
              for (var j = 0; j < elem.childNodes.length; j++) {
                  handleRune(elem.childNodes[j]);
              }
          }
      }
   };

  parser.parseRune = function(entry) {
   var rune = {
      id: '',
      attributes: [],
      url: [],
      text: {},
      _textAvailable: false,
      _xmlRune: entry.outerHTML
   };

   var i, j;
   var id;
   if (entry.attributes) {
      for (i = 0; i < entry.attributes.length; i++) {
         var attrib = entry.attributes[i];
         if (attrib.specified) {
            if (attrib.name === 'xml:id') {
               id = attrib.value;
            }
            if (attrib.name === 'type' || attrib.name === 'subtype' || attrib.name === 'ref') {
               var values = attrib.value.replace(/#/g, '').split(' ');
                  for (j = 0; j < values.length; j++) {
                     rune.url.push(values[j]);
                  }
            }
            rune.attributes[attrib.name] = attrib.value;
            rune.attributes.length++;
         }
      }
   }
   if (id === undefined) {
      id = evtParser.xpath(entry).substr(1);
   }
   rune.id = id;

   angular.forEach(entry.childNodes, function(child) {
      if (child.nodeType === 3) {
         if (child.textContent.trim() !== '') {
            rune.bibl.push(child.textContent.trim());
         }
      } else if (child.nodeType === 1) {
            var childContent = parseRuneContent(child, entry);
            if (childContent.tagName === 'title') {
                rune.title = childContent.content;
            }
            rune.bibl.push(childContent);
            for (i = 0; i < childContent.url.length; i++) {
               rune.url.push(childContent.url[i]);
            }
        }
   });

   for (i in rune.url) {
      if (rune.url[i].indexOf('.xml') >= 0) {
         rune._textAvailable = true;
      }
   }

   parsedData.addRune(rune);

   return rune;
};

   parser.getRuneText = function(rune, doc) {
     var spanElement;

     spanElement = document.createElement('evt-rune');
     spanElement.setAttribute('data-rune-id', rune.id);
     spanElement.setAttribute('data-type', 'rune');

     var runeContent = rune.content;

     for (var i in runeContent) {
           var child;
        if (typeof runeContent[i] === 'string') {
           child = document.createElement('span');
           child.setAttribute('class', 'textNode');
           child.appendChild(document.createTextNode(runeContent[i]));
           spanElement.appendChild(child);
           } else if (runeContent[i].type === 'p') {
             spanElement.appendChild(parser.getRuneText(runeContent[i]));
           } else if (runeContent[i].type === 'runeContent' && link.indexOf(runeContent[i].tagName) < 0) {
              child = getRuneContentText(runeContent[i], doc);
              if (child !== undefined) {
                 spanElement.appendChild(child);
              }
           } else {
              if (runeContent[i].content !== undefined && runeContent[i].content.length !== 0) {
                 child = getRuneContentText(runeContent[i], doc);
                 if (child !== undefined) {
                    spanElement.appendChild(child);
                 }
              }
           }
        //}
     }

     console.log(spanElement);
     return spanElement;
  };

   return parser;

});
