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