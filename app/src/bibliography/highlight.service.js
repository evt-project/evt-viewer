/**
 * @ngdoc service
 * @module evtviewer.bibliography
 * @name evtviewer.bibliography.evtHighlightService
 * @description 
 * # evtHighlightService
 * Service that will store information abotu the bibliographic entry that should be highlighted
 * once the user as followed an internal link to that entry.
 *
 * @author MR
 **/
angular.module('evtviewer.bibliography')

.service('evtHighlight', function() {
	var evtHighlight = {},
		highlighted = '';
	/**
	 * @ngdoc method
	 * @name evtviewer.bibliography.evtHighlightService#setHighlighted
	 * @methodOf evtviewer.bibliography.evtHighlightService
	 *
	 * @description
	 * Set the highlighted entry.
	 *
	 * @param {string} id id of entry to be highlighted
	 *
	 * @author MR
	 */
	evtHighlight.setHighlighted = function(id) {
		highlighted = id;
	};
	/**
	 * @ngdoc method
	 * @name evtviewer.bibliography.evtHighlightService#getHighlighted
	 * @methodOf evtviewer.bibliography.evtHighlightService
	 *
	 * @description
	 * Return the highlighted entry.
	 *
	 * @returns {string} id of highlighted entry
	 *
	 * @author MR
	 */
	evtHighlight.getHighlighted = function() {
		return highlighted;
	};

	return evtHighlight;
});