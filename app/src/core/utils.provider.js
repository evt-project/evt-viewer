/**
 * @ngdoc service
 * @module evtviewer.core
 * @name evtviewer.core.Utils
 * @description
 * # Utils
 * <p>Service that exposes useful (DOM/parsing) methods.</p>
 * <p>DOM utils methods are grouped in DOMutils property.</p>
**/
/*jshint -W059 */
angular.module('evtviewer.core')

.provider('Utils', function() {

	/**
    * @ngdoc method
    * @name evtviewer.core.Utils#deepExtend
    * @methodOf evtviewer.core.Utils
    *
    * @description
    * Extend an object with another:
    * - add to destination all properties that only appears in source
    * - overwrite all properties that appears in destination with the corrensponding
    * properties that appear in source.
    *
    * @param {Object} destination JSON object containing an object to extend
    * @param {Object} source JSON object containing the extension to add to destination
    *
    * @returns {Object} extended JSON object
    */
	this.deepExtend = function(destination, source) {
		for (var property in source) {
			if (source[property] && source[property].constructor && source[property].constructor === Object) {
				destination[property] = destination[property] || {};
				arguments.callee(destination[property], source[property]);
			} else {
				destination[property] = angular.copy(source[property]);
			}
		}
		return destination;
	};

	/**
    * @ngdoc method
    * @name evtviewer.core.Utils#deepExtendSkipDefault
    * @methodOf evtviewer.core.Utils
    *
    * @description
    *  Extend an object with another, skipping the undefined values:
    * - add to destination all properties that only appears in source
    * - overwrite all properties that appears in destination with the corrensponding
    * properties that appear in source
    * - skip undefined properties that are undefined in source object
    *
    * @param {Object} destination JSON object containing an object to extend
    * @param {Object} source JSON object containing the extension to add to destination
    *
    * @returns {Object} extended JSON object
    */
	this.deepExtendSkipDefault = function(destination, source) {
		for (var property in source) {
			if (source[property] && source[property].constructor && source[property].constructor === Object) {
				destination[property] = destination[property] || {};
				arguments.callee(destination[property], source[property]);
			} else {
				if (property === 'dataUrl') {
					if (source[property] !== '') {
						destination[property] = angular.copy(source[property]);
					}
				} else {
					if (source[property] === 'NONE' || source[property] === 'NULL') {
						destination[property] = '';
					} else if (source[property] !== '') {
						destination[property] = angular.copy(source[property]);
					}
				}
			}
		}
		return destination;
	};

	/**
    * @ngdoc method
    * @name evtviewer.core.Utils#DOMutils.getElementsBetweenTree
    * @methodOf evtviewer.core.Utils
    *
    * @description
    * Get all DOM elements contained between the node elements
    *
    * @param {element} start starting node
    * @param {element} end ending node
    *
    * @returns {element[]} list of nodes contained between start node and end node
    * @todo Decide if move to another service
    */
	this.getElementsBetweenTree = function(start, end) {
		var ancestor = this.getCommonAncestor(start, end),
			el,
			before = [];
		while (start.parentNode !== ancestor) {
			el = start;
			while (el.nextSibling) {
				before.push(el = el.nextSibling);
			}
			start = start.parentNode;
		}

		var after = [];
		while (end.parentNode !== ancestor) {
			el = end;
			while (el.previousSibling) {
				after.push(el = el.previousSibling);
			}
			end = end.parentNode;
		}
		after.reverse();

		while ((start = start.nextSibling) !== end) {
			before.push(start);
		}
		return before.concat(after);
	};
	/**
    * @ngdoc method
    * @name evtviewer.core.Utils#DOMutils.getCommonAncestor
    * @methodOf evtviewer.core.Utils
    *
    * @description
    * Get the innermost element that is an ancestor of two nodes.
    *
    * @param {element} a first node to handle
    * @param {element} b second node to handle
    *
    * @returns {element} common ancestor node
    * @todo Decide if move to another service
    */
	this.getCommonAncestor = function(a, b) {
		var parents = $(a).parents().andSelf();
		while (b) {
			var ix = parents.index(b);
			if (ix !== -1) {
				return b;
			}
			b = b.parentNode;
		}
		return null;
	};

	/**
    * @ngdoc method
    * @name evtviewer.core.Utils#DOMutils.isNestedInElem
    * @methodOf evtviewer.core.Utils
    *
    * @description
    * Check if a node is nested in a node with given tag name
    *
    * @param {element} element element to check
    * @param {string} parentTagName tag name of element that should be parent
    *
    * @returns {boolean} whether the element is nested in an element with given tag name or not
    * @todo Decide if move to another service
    */
	this.isNestedInElem = function(element, parentTagName) {
		if (element.parentNode !== null && element.parentNode !== undefined && element.parentNode.tagName) {
			if (element.parentNode.tagName === 'text') {
				return false;
			} else if (element.parentNode.tagName.toLowerCase() === parentTagName.toLowerCase()) {
				return true;
			} else {
				return this.isNestedInElem(element.parentNode, parentTagName);
			}
		} else {
			return false;
		}
	};

	/**
    * @ngdoc method
    * @name evtviewer.core.Utils#DOMutils.isNestedInClassElem
    * @methodOf evtviewer.core.Utils
    *
    * @description
    *  Check if a node is nested in a node with given class name
    *
    * @param {element} element element to check
    * @param {string} parentClassName class name of element that should be parent
    *
    * @returns {boolean} whether the element is nested in an element with given class name or not
    * @todo Decide if move to another service
    */
	this.isNestedInClassElem = function(element, parentClassName) {
		if (element.parentNode !== null && element.parentNode !== undefined && element.parentNode.className) {
			if (element.parentNode.className === '') {
				return false;
			} else if (element.parentNode.className.indexOf(parentClassName) >= 0) {
				return true;
			} else {
				return this.isNestedInElem(element.parentNode, parentClassName);
			}
		} else {
			return false;
		}
	};

	var hexC = function() {
		var hex = Math.floor(Math.random() * 256).toString(16);
		return ('0' + String(hex)).substr(-2); // pad with zero
	};
	/**
    * @ngdoc method
    * @name evtviewer.core.Utils#getRandomColor
    * @methodOf evtviewer.core.Utils
    *
    * @description
    * Generate a random (RGB or HEX) color
    *
    * @param {string} type type of color to generate ('*rgb*', or '*hex*')
    *
    * @returns {string} (RGB/HEX) color generated
    */
	this.getRandomColor = function(type) {
		if (type === 'hex') {
			return '#' + hexC() + hexC() + hexC();
		} else if (type === 'rgb') {
			var brightness = 5;
			// Six levels of brightness from 0 to 5, 0 being the darkest
			var rgb = [Math.random() * 256, Math.random() * 256, Math.random() * 256];
			var mix = [brightness * 51, brightness * 51, brightness * 51]; //51 => 255/5
			var mixedrgb = [rgb[0] + mix[0], rgb[1] + mix[1], rgb[2] + mix[2]].map(function(x) {
				return Math.round(x / 2.0);
			});
			return 'rgb(' + mixedrgb.join(',') + ')';
		}
	};
	/**
    * @ngdoc method
    * @name evtviewer.core.Utils#DOMutils.decodeHTMLEntities
    * @methodOf evtviewer.core.Utils
    *
    * @description
    * Decode HTML entities contained in a given string
    *
    * @param {string} str string to handle
    *
    * @returns {string} string where HTML entities are decoded
    */
	this.decodeHTMLEntities = function(str) {
		var element = document.createElement('div');
		if (str && typeof str === 'string') {
			// strip script/html tags
			str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
			str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
			element.innerHTML = str;
			str = element.textContent;
			element.textContent = '';
		}
		element = undefined;
		return str;
	};

   /**
    * @ngdoc method
    * @name evtviewer.core.Utils#cleanText
    * @methodof evtviewer.core.Utils
    *
    * @description
    * Clean string from spaces and some punctuation
    *
    * @param str
    *
    * @returns {string} string cleaned from double spaces and punctuation
    */
	this.cleanText = function(str) {
	   str = this.cleanPunctuation(str);
	   str = this.cleanSpace(str);
	   return str;
   };

   /**
    * @ngdoc method
    * @name evtviewer.core.Utils#cleanSpace
    * @methodof evtviewer.core.Utils
    *
    * @description
    * Clean string from double spaces
    *
    * @param str
    * @returns {string} string cleaned from double spaces
    */
   this.cleanSpace = function(str) {
	   var replace,
          regex = /\s\s/;
	   while(str.match(regex)) {
	      replace = str.replace(regex, ' ');
	      str = replace;
      }
      if(str.charAt(0) === ' ') {
	      str = str.substring(1);
      }
      return str;
   };

   /**
    * @ngdoc method
    * @name evtviewer.core.Utils#cleanPunctuation
    * @methodof evtviewer.core.Utils
    *
    * @description
    * Clean string from some punctuation
    *
    * @param str
    * @returns {string} string cleaned from some punctuation
    */
   this.cleanPunctuation = function(str) {
     var replace,
         regex = /[.,#!$%\^&\*;:{}\[\]\'\"=\-_`~()]/;

     while(str.match(regex)) {
        replace = str.replace(regex, '');
        str = replace;
     }
     return str;
   };
   
   this.replaceStringAt = function(string, token, replace, startPos, endPos) {
      return string.slice(0, startPos) +
         string.slice(startPos, endPos).replace(token, replace) +
         string.slice(endPos);
   };

	this.$get = function() {
		return {
			deepExtend: this.deepExtend,
			deepExtendSkipDefault: this.deepExtendSkipDefault,
			getRandomColor: this.getRandomColor,
         cleanText: this.cleanText,
         cleanSpace: this.cleanSpace,
         cleanPunctuation: this.cleanPunctuation,
         replaceStringAt: this.replaceStringAt,
			DOMutils: {
				getElementsBetweenTree: this.getElementsBetweenTree,
				getCommonAncestor: this.getCommonAncestor,
				isNestedInElem: this.isNestedInElem,
				isNestedInClassElem: this.isNestedInClassElem,
				decodeHTMLEntities: this.decodeHTMLEntities
			}
		};
	};
});
