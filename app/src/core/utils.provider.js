/*jshint -W059 */

angular.module('evtviewer.core')

.provider('Utils', function() {

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

	// DOM utils (TODO: Decide if move to another service)
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

	// Get the innermost element that is an ancestor of two nodes.
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

    var hexC = function() {
        var hex = Math.floor(Math.random() * 256).toString(16);
        return ('0' + String(hex)).substr(-2); // pad with zero 
    };

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

	this.$get = function() {
		return {
			deepExtend: this.deepExtend,
            getRandomColor: this.getRandomColor,
			DOMutils: {
				getElementsBetweenTree: this.getElementsBetweenTree,
				getCommonAncestor: this.getCommonAncestor,
				isNestedInElem : this.isNestedInElem
			}
		};
	};
});