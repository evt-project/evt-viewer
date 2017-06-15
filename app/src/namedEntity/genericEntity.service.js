angular.module('evtviewer.namedEntity')

.service('evtGenericEntity', function() {
	var genericEntity = {};

	var activeEntities = {
	};

	genericEntity.addActiveType = function(newType, color) {
		if (activeEntities[newType] === undefined) {
			genericEntity.highlightElementsByType(newType, color);
			activeEntities[newType] = {
				type: newType,
				color: color
			};
		}
	};
	
	genericEntity.removeActiveType = function(typeToRemove, color) {
		if (activeEntities[typeToRemove] !== undefined) {
			genericEntity.deEmphasizeElementsByType(typeToRemove, color);
			activeEntities[typeToRemove] = undefined;
		}
    };

	genericEntity.highlightElementsByType = function(type, color) {
		var elementsToHighlight = document.getElementsByClassName(type);
        angular.forEach(elementsToHighlight, function(element) {
            toggleHighlightElement(element, color, true);
        });
	};

	genericEntity.deEmphasizeElementsByType = function(type, color) {
		var elementsToHighlight = document.getElementsByClassName(type);
        angular.forEach(elementsToHighlight, function(element) {
            toggleHighlightElement(element, color, false);
        });
	}

	genericEntity.highlightActiveTypes = function() {
		for (var key in activeEntities) {
			var entity = activeEntities[key];
			if (entity) {
				genericEntity.highlightElementsByType(entity.type, entity.color);
			}
		}
	};

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