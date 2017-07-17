/**
 * @ngdoc service
 * @module evtviewer.analoguesApparatusEntry
 * @name evtviewer.analoguesApparatusEntry.evtAnaloguesApparatusEntry
 * @description 
 * # evtAnaloguesApparatusEntry
 * TODO: Add description and comments for every method
**/
angular.module('evtviewer.analoguesApparatusEntry')

.provider('evtAnaloguesApparatusEntry', function() {

	var defaults = this.defaults;

	this.setDefaults = function(_defaults) {
		defaults = _defaults;
	};

	var currentAnaloguesEntry = '';

	this.$get = function(parsedData, $log, evtAnaloguesApparatus, evtInterface) {
		var analoguesAppEntry = {},
			collection = {},
			list = [],
			idx = 0;

		analoguesAppEntry.build = function(scope) {
			var currentId = idx++,
				entryId = scope.analogueId || undefined,
				scopeWit = scope.scopeWit || '';

			if (collection[currentId] !== undefined) {
				return;
			}

			var content,
				header,
				sources,
				firstSubContentOpened = '',
				_activeSource,
				srcList = {
					_indexes: []
				},
				tabs = {
					_indexes: []
				};

			var analogueEntry = parsedData.getAnalogue(scope.analogueId);
            var xml;
			if (analogueEntry !== undefined) {
				//Content of the apparatus entry
				content = evtAnaloguesApparatus.getContent(analogueEntry, scopeWit);

				//Apparatus header
				header = content.header;

				//Array of sources objects
				sources = content.sources;
				sources.length = content.sources.length;

				//Adding information to the srcList
				for (var i in sources) {
					srcList._indexes.push(sources[i].id);
					srcList[sources[i].id] = sources[i];
					srcList[sources[i].id].tabs = {
						_indexes: []
					};
					if (srcList[sources[i].id].text !== '') {
						srcList[sources[i].id].tabs._indexes.push('text');
						srcList[sources[i].id].tabs.text = {
							label: 'ANALOGUES.TEXT'
						};
					}
					if (srcList[sources[i].id].bibl !== '') {
						srcList[sources[i].id].tabs._indexes.push('biblRef');
						srcList[sources[i].id].tabs.biblRef = {
							label: 'ANALOGUES.BIBLIOGRAPHIC_REFERENCE'
						};
					}
					//TO DO: More Info a partire dagli attributes di quote e di source
					if (srcList[sources[i].id]._xmlSource !== '') {
						srcList[sources[i].id].tabs._indexes.push('xmlSource');
						srcList[sources[i].id].tabs.xmlSource = {
							label: 'ANALOGUES.XML'
						};
					}
				}

				var currentTabs = srcList[sources[0].id].tabs;
				for (var j = 0; j < currentTabs._indexes.length; j++) {
					var value = currentTabs._indexes[j];
					tabs._indexes.push(currentTabs._indexes[j]);
					tabs[value] = currentTabs[value];
				}

				//Adding the xmlSource tab and variable
                if (analogueEntry._xmlSource !== '') {
					xml = content._xmlSource;
				}

				if (tabs._indexes.length > 0 && defaults.firstSubContentOpened !== '') {
					if (tabs._indexes.indexOf(defaults.firstSubContentOpened) < 0) {
						firstSubContentOpened = tabs._indexes[0];
					} else {
						firstSubContentOpened = defaults.firstSubContentOpened;
					}
				}

			}

			if (sources !== undefined && sources[0].id !== undefined) {
				_activeSource = sources[0].id;
			} else {
				_activeSource = undefined;
			}

			var scopeHelper = {
				uid: currentId,
				analogueId: scope.analogueId,
				header: header,
				xml: xml,
				sources: sources,
				srcList: srcList,
				_activeSource: _activeSource,
				_overSource: '',
				tabs: tabs,
				_subContentOpened: firstSubContentOpened,
				over: false,
				selected: false,
				currentViewMode: evtInterface.getCurrentViewMode()
			};

			collection[currentId] = angular.extend(scope.vm, scopeHelper);
			list.push({
				id: currentId
			});

			return collection[currentId];
		};

		analoguesAppEntry.getById = function(currentId) {
			if (collection[currentId] !== undefined) {
				return collection[currentId];
			}
		};

		analoguesAppEntry.getList = function() {
			return list;
		};

		analoguesAppEntry.setCurrentAnaloguesEntry = function(analogueId) {
			if (evtInterface.getCurrentAnalogue !== analogueId) {
				evtInterface.updateCurrentAnalogue(analogueId);
			}
			currentAnaloguesEntry = analogueId;
		};

		analoguesAppEntry.getCurrentAnaloguesEntry = function(analogueId) {
			return currentAnaloguesEntry;
		};

		analoguesAppEntry.mouseOutAll = function() {
			angular.forEach(collection, function(currentEntry) {
				currentEntry.mouseOut();
			});
		};

		analoguesAppEntry.mouseOverByAnalogueId = function(analogueId) {
			angular.forEach(collection, function(currentEntry) {
				if (currentEntry.analogueId === analogueId) {
					currentEntry.mouseOver();
				} else {
					currentEntry.mouseOut();
				}
			});
		};

		analoguesAppEntry.unselectAll = function() {
			angular.forEach(collection, function(currentEntry) {
				currentEntry.unselect();
			});
		};

		analoguesAppEntry.selectById = function(analogueId) {
			angular.forEach(collection, function(currentEntry) {
				if (currentEntry.analogueId === analogueId) {
					currentEntry.setSelected();
				} else {
					currentEntry.unselect();
					currentEntry.closeSubContent();
				}
			});
			analoguesAppEntry.setCurrentAnaloguesEntry(analogueId);
		};

		analoguesAppEntry.destroy = function(tempId) {
			delete collection[tempId];
		};

		return analoguesAppEntry;
	};

});