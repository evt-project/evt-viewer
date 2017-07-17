/**
 * @ngdoc service
 * @module evtviewer.bibliography
 * @name evtviewer.bibliography.evtHighlightService
 * @description 
 * # evtHighlightService
 * TODO: Add description and comments for every method
**/
angular.module('evtviewer.bibliography')

.service('evtHighlight', function() {
	var evtHighlight = {},
		highlighted = '';

	evtHighlight.setHighlighted = function(id) {
		highlighted = id;
	};

	evtHighlight.getHighlighted = function() {
		return highlighted;
	};

	return evtHighlight;
});