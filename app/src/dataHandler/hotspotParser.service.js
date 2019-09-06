/**
 * @ngdoc service
 * @module evtviewer.dataHandler
 * @name evtviewer.dataHandler.evtPrimarySourcesParser
 * @description 
 * # evtPrimarySourcesParser
 * Service containing methods to parse data regarding primary source information
 *
 * @requires $q
 * @requires xmlParser
 * @requires evtviewer.core.config
 * @requires evtviewer.dataHandler.evtParser
 * @requires evtviewer.dataHandler.parsedData
**/
angular.module('evtviewer.dataHandler')

.service('evtHotSpotParser', function($q, xmlParser, evtParser, parsedData, config) {
	var parser = { };

	var defBackElement = 'back',
		defHotSpotDivType = 'hotspot';
	/**
     * TODO: add documentation
    */
	parser.parseHotSpots = function(back) {
        var currentBackElement = angular.element(back);
		angular.forEach(currentBackElement.find("div[type='hotspot']"),
			function(HotSpotDivGroup) {
				//var surfaceId = surfaceElement.getAttribute('xml:id'),
				//	surfaceCorresp = surfaceElement.getAttribute('corresp');
				//surfaceCorresp = surfaceCorresp ? surfaceCorresp.replace('#', '') : surfaceCorresp;
				//TODO: decide if it's better to save facsimile infos in page object model	
				angular.forEach(HotSpotDivGroup.childNodes, function(child){
					if (child.tagName === 'div') {
						var newHotSpot = {};

						if (child.attributes) {
							for (var i = 0; i < child.attributes.length; i++) {
								var attrib = child.attributes[i];
								if (attrib.specified) {
									var attrName = attrib.name === 'xml:id' ? 'id' : attrib.name.replace(':', '-');
									newHotSpot[attrName] = attrib.value;
								}
							}
						}
                        newHotSpot.content = angular.element(child).text();
                        newHotSpot.images = angular.element(child).find('graphic');
						parsedData.addHotSpot(newHotSpot);
						
					}
				});
		});
		console.log('## HOTSPOTS ##', parsedData.getHotSpots());
	};

	return parser;
});