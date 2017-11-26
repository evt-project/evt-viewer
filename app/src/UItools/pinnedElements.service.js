/**
 * @ngdoc service
 * @module evtviewer.UItools
 * @name evtviewer.UItools.evtPinnedElements
 * @description
 * # evtPinnedElements
 * In this service are defined and exposed methods to handle pinned elements.
 * @requires evtviewer.core.Utils
 * @requires evtviewer.dataHandler.parsedData
 **/
angular.module('evtviewer.UItools')

.service('evtPinnedElements', function(Utils, parsedData) {
	var pinnedElements = {};

	var pinned = {
		_indexes: [],
		_indexesByType: {
			_types: []
		}
	};

	var visibleTypes = [];
	/**
     * @ngdoc method
     * @name evtviewer.UItools.evtPinnedElements#getElementsFromCookies
     * @methodOf evtviewer.UItools.evtPinnedElements
     *
     * @description
     * Retrieve list of pinned elements from bowser cookies.
     * Check if elements are contained in current edition and prepare list of pinned elements.
     */
	pinnedElements.getElementsFromCookies = function() {
		var cookies = document.cookie.split(';');
		for (var key in cookies) {
			var cookie = cookies[key].split('=');
			if (cookie[0].trim() === 'pinned') {
				var pinnedCookie = JSON.parse(cookie[1]);

				// Check if pinned elements exists
				for (var i = 0; i < pinnedCookie._indexes.length; i++) {
					var elementId = pinnedCookie._indexes[i],
						pinnedElement = pinnedCookie[elementId],
						exists = false;
					if (pinnedElement) {
						// 'Critical Apparatus Entries' type='criticalApparatusEntry'
						if (pinnedElement.type === 'criticalApparatusEntry') {
							exists = (parsedData.getCriticalEntryById(elementId) !== undefined);
						}
						// 'Named Entities' type='namedEntity'
						else if (pinnedElement.type.indexOf('namedEntity') >= 0) {
							exists = (parsedData.getNamedEntity(elementId) !== undefined);
						}
						if (exists) {
							pinnedElements.addElement(pinnedCookie[elementId]);
						}
					}
				}
			}
		}
	};
	/**
     * @ngdoc method
     * @name evtviewer.UItools.evtPinnedElements#addElement
     * @methodOf evtviewer.UItools.evtPinnedElements
     *
     * @description
     * Add element to pinned elements list, indexing it by type.
     * Update browser cookies.
     *
     * @param {Object} element element to add to pinned elements list; the element is structured as follows
     	<pre>
			var element = {
				id,
				type
			}
     	</pre>
     */
	pinnedElements.addElement = function(element) {
		pinned[element.id] = element;
		pinned._indexes.push(element.id);

		if (pinned._indexesByType[element.type] === undefined) {
			pinned._indexesByType[element.type] = [];
			pinned._indexesByType._types.push(element.type);
		}
		pinned._indexesByType[element.type].push(element.id);
		document.cookie = 'pinned' + '=' + JSON.stringify(pinned) + '; 1'
	};
	/**
     * @ngdoc method
     * @name evtviewer.UItools.evtPinnedElements#removeElement
     * @methodOf evtviewer.UItools.evtPinnedElements
     *
     * @description
     * Remove element from pinned elements list
     * Update browser cookies.
     *
     * @param {Object} element element to remove from pinned elements list; the element is structured as follows
     	<pre>
			var element = {
				id,
				type
			}
     	</pre>
     */
	pinnedElements.removeElement = function(element) {
		var index = pinned._indexes.indexOf(element.id);
		pinned._indexes.splice(index, 1);
		if (pinned._indexesByType[element.type]) {
			var indexInTypes = pinned._indexesByType[element.type].indexOf(element.id);
			pinned._indexesByType[element.type].splice(indexInTypes, 1);

			if (pinned._indexesByType[element.type].length === 0) {
				delete pinned._indexesByType[element.type];
				var typeIndex = pinned._indexesByType._types.indexOf(element.type);
				pinned._indexesByType._types.splice(typeIndex, 1);
			}
		}
		delete pinned[element.id];
		document.cookie = 'pinned' + '=' + JSON.stringify(pinned) + '; 1';
	};
	/**
     * @ngdoc method
     * @name evtviewer.UItools.evtPinnedElements#getPinnedData
     * @methodOf evtviewer.UItools.evtPinnedElements
     *
     * @description
     * Retrieve object representing current pinned elements.
     *
     * @returns {Object} object representing current pinned elements, and is structured as follows:
     	<pre>
			var pinned = {
				el1 : {
					id: "el1",
					type: "type1"
				},
				el2 : {
					id: "el2",
					type: "type2"
				}
				_indexes: ["el1", "el2"],
				_indexesByType: {
					type1: ["el1"],
					type2: ["el2"],
					_types: ["type1", "type2"]}
			};
     	</pre>
     */
	pinnedElements.getPinnedData = function() {
		return pinned;
	};
	/**
     * @ngdoc method
     * @name evtviewer.UItools.evtPinnedElements#getPinned
     * @methodOf evtviewer.UItools.evtPinnedElements
     *
     * @description
     * Retrieve all pinned elements.
     *
     * @returns {array} list of indexes of current pinned elements
     */
	pinnedElements.getPinned = function() {
		return pinned._indexes;
	};
	/**
     * @ngdoc method
     * @name evtviewer.UItools.evtPinnedElements#getAvailablePinnedTypes
     * @methodOf evtviewer.UItools.evtPinnedElements
     *
     * @description
     * Retrieve all types of pinned elements.
     *
     * @returns {array} list of types of current pinned elements
     */
	pinnedElements.getAvailablePinnedTypes = function() {
		return pinned._indexesByType._types;
	};
	/**
     * @ngdoc method
     * @name evtviewer.UItools.evtPinnedElements#getPinnedByType
     * @methodOf evtviewer.UItools.evtPinnedElements
     *
     * @description
     * Retrieve all pinned elements of a particular type.
     *
     * @param {string} type type of elements to retrieve0
     * @returns {array} list of current pinned elements of given type
     */
	pinnedElements.getPinnedByType = function(type) {
		return pinned._indexesByType[type];
	};
	/**
     * @ngdoc method
     * @name evtviewer.UItools.evtPinnedElements#getPinnedElement
     * @methodOf evtviewer.UItools.evtPinnedElements
     *
     * @description
     * Retrieve a specific pinned element.
     *
     * @param {string} elementId id of pinned element to retrieve
     * @returns {Object} pinned element with given id
     */
	pinnedElements.getPinnedElement = function(elementId) {
		return pinned[elementId];
	};
	/**
     * @ngdoc method
     * @name evtviewer.UItools.evtPinnedElements#getPinnedElementType
     * @methodOf evtviewer.UItools.evtPinnedElements
     *
     * @description
     * Retrieve type of a specific pinned element.
     *
     * @param {string} elementId id of pinned element to handle
     * @returns {string} type of pinned element with given id
     */
	pinnedElements.getPinnedElementType = function(elementId) {
		return pinned[elementId].type;
	};
	/**
     * @ngdoc method
     * @name evtviewer.UItools.evtPinnedElements#isPinned
     * @methodOf evtviewer.UItools.evtPinnedElements
     *
     * @description
     * Check whether a particular element is pinned or not
     *
     * @param {string} elementId id of pinned element to handle
     * @returns {boolean} whether the element with given id is pinned or not
     */
	pinnedElements.isPinned = function(elementId) {
		return pinned[elementId] !== undefined;
	};
	/**
     * @ngdoc method
     * @name evtviewer.UItools.evtPinnedElements#addVisibleType
     * @methodOf evtviewer.UItools.evtPinnedElements
     *
     * @description
     * Add type to visibile list of types
     *
     * @param {string} type type to add
     */
	pinnedElements.addVisibleType = function(type) {
		if (visibleTypes.indexOf(type) < 0) {
			visibleTypes.push(type);
		}
	};
	/**
     * @ngdoc method
     * @name evtviewer.UItools.evtPinnedElements#removeVisibleType
     * @methodOf evtviewer.UItools.evtPinnedElements
     *
     * @description
     * Remove type from visibile list of types
     *
     * @param {string} type type to remove
     */
	pinnedElements.removeVisibleType = function(type) {
		var indexType = visibleTypes.indexOf(type);
		if (indexType >= 0) {
			visibleTypes.splice(indexType, 1);
		}
	};
	/**
     * @ngdoc method
     * @name evtviewer.UItools.evtPinnedElements#setAllTypesVisible
     * @methodOf evtviewer.UItools.evtPinnedElements
     *
     * @description
     * Set all pinned elements types visible
     */
	pinnedElements.setAllTypesVisible = function() {
		visibleTypes = pinnedElements.getAvailablePinnedTypes();
	};
	/**
     * @ngdoc method
     * @name evtviewer.UItools.evtPinnedElements#resetVisibleTypes
     * @methodOf evtviewer.UItools.evtPinnedElements
     *
     * @description
     * Empty list of visible types
     */
	pinnedElements.resetVisibleTypes = function() {
		visibleTypes = [];
	};
	/**
     * @ngdoc method
     * @name evtviewer.UItools.evtPinnedElements#getVisibleTypes
     * @methodOf evtviewer.UItools.evtPinnedElements
     *
     * @description
     * Get list of visible types
     *
     * @returns {array} array of types that have to be shown on screen
     */
	pinnedElements.getVisibleTypes = function() {
		return visibleTypes;
	};

	return pinnedElements;
});
