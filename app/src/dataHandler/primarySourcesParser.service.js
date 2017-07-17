/**
 * @ngdoc service
 * @module evtviewer.dataHandler
 * @name evtviewer.dataHandler.evtPrimarySourcesParser
 * @description 
 * # evtPrimarySourcesParser
 * TODO: Add description and comments for every method
**/
angular.module('evtviewer.dataHandler')

.service('evtPrimarySourcesParser', function($q, xmlParser, evtParser, parsedData, config) {
	var parser = { };

	var defSurfaceElement = 'surface',
		defZoneElement = 'zone';

	parser.parseZones = function(facsimile) {
		var currentFacsimile = angular.element(facsimile);
		angular.forEach(currentFacsimile.find(defSurfaceElement), 
			function(surfaceElement) {
				var surfaceId = surfaceElement.getAttribute('xml:id'),
					surfaceCorresp = surfaceElement.getAttribute('corresp');
				surfaceCorresp = surfaceCorresp ? surfaceCorresp.replace('#', '') : surfaceCorresp;
				//TODO: decide if it's better to save facsimile infos in page object model	
				angular.forEach(surfaceElement.childNodes, function(child){
					if (child.tagName === defZoneElement) {
						var newZone = {};

						if (child.attributes) {
							for (var i = 0; i < child.attributes.length; i++) {
								var attrib = child.attributes[i];
								if (attrib.specified) {
									var attrName = attrib.name === 'xml:id' ? 'id' : attrib.name.replace(':', '-');
									newZone[attrName] = attrib.value;
								}
							}
						}
						newZone.page = surfaceCorresp;
						parsedData.addZone(newZone);
						
					}
				});
		});
		console.log('## ZONES ##', parsedData.getZones());
	};

	return parser;
});