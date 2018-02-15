/**
 * @ngdoc service
 * @module evtviewer.namedEntity
 * @name evtviewer.namedEntity.evtGenericEntity
 * @description 
 * # evtGenericEntity
 * In this service are defined and exposed methods to handle the highlighting of "generic" elements
 * that should behave as named entities.
**/
angular.module('evtviewer.namedEntity')

.service('evtGenericEntity', function() {
	var genericEntity = {};

	var activeEntities = {
	};
	/**
     * @ngdoc method
     * @name evtviewer.namedEntity.evtGenericEntity#addActiveType
     * @methodOf evtviewer.namedEntity.evtGenericEntity
     *
     * @description
     * Add a type to list of active types
     * @param {string} newType Name of type to add
     * @param {string} color Hex or RGB color that is connected to <code>newType</code>
     */
	genericEntity.addActiveType = function(newType, color) {
		if (activeEntities[newType] === undefined) {
			genericEntity.highlightElementsByType(newType, color);
			activeEntities[newType] = {
				type: newType,
				color: color
			};
		}
	};
	/**
     * @ngdoc method
     * @name evtviewer.namedEntity.evtGenericEntity#removeActiveType
     * @methodOf evtviewer.namedEntity.evtGenericEntity
     * 
     * @description
     * Remove a type from list of active types
     * @param {string} typeToRemove Name of type to remove
     * @param {string} color Hex or RGB color that is connected to <code>typeToRemove</code>
     */
	genericEntity.removeActiveType = function(typeToRemove, color) {
		if (activeEntities[typeToRemove] !== undefined) {
			genericEntity.deEmphasizeElementsByType(typeToRemove, color);
			activeEntities[typeToRemove] = undefined;
		}
    };
    /**
     * @ngdoc method
     * @name evtviewer.namedEntity.evtGenericEntity#highlightElementsByType
     * @methodOf evtviewer.namedEntity.evtGenericEntity
     *
     * @description
     * Highlight elements of a particular type with a particular color
     * @param {string} type Name of type to highlight
     * @param {string} color Hex or RGB color that should be used as highlighting color
     */
	genericEntity.highlightElementsByType = function(type, color) {
		var elementsToHighlight = document.getElementsByClassName(type);
        angular.forEach(elementsToHighlight, function(element) {
            toggleHighlightElement(element, color, true);
        });
	};
	/**
     * @ngdoc method
     * @name evtviewer.namedEntity.evtGenericEntity#deEmphasizeElementsByType
     * @methodOf evtviewer.namedEntity.evtGenericEntity
     *
     * @description
     * Remove highlight (de-emphasize) from elements of a particular type
     * @param {string} type Name of type to de-emphasize
     * @param {string} color Hex or RGB color that has been used as highlighting color
     */
	genericEntity.deEmphasizeElementsByType = function(type, color) {
		var elementsToHighlight = document.getElementsByClassName(type);
        angular.forEach(elementsToHighlight, function(element) {
            toggleHighlightElement(element, color, false);
        });
	};
	/**
     * @ngdoc method
     * @name evtviewer.namedEntity.evtGenericEntity#highlightActiveTypes
     * @methodOf evtviewer.namedEntity.evtGenericEntity
     *
     * @description
     * Highlight elements of whose type is one of the active ones
     */
	genericEntity.highlightActiveTypes = function() {
		for (var key in activeEntities) {
			var entity = activeEntities[key];
			if (entity) {
				genericEntity.highlightElementsByType(entity.type, entity.color);
			}
		}
	};
	/**
     * @ngdoc method
     * @name evtviewer.namedEntity.evtGenericEntity#toggleHighlightElement
     * @methodOf evtviewer.namedEntity.evtGenericEntity
     *
     * @description
     * [PRIVATE] Toggle highlighting class and background color from a particular element
     * @param {element} element DOM element to handle
     * @param {string} color Hex or RGB color that has been used as highlighting color
     * @param {boolean} highlighted Whether the element should be highlighted or not
     */
	var toggleHighlightElement = function(element, color, highlighted) {
        if (highlighted) {
            if (color) {
                angular.element(element).css('background', color);
            } else {
                angular.element(element).addClass('highlighted');
            }
            angular.element(element).addClass('entityHighlighted');
        } else {
            if (color) {
                angular.element(element).css('background', '');
            } else {
                angular.element(element).removeClass('highlighted');
            }
            angular.element(element).removeClass('entityHighlighted');
        }
    };

	return genericEntity;
});