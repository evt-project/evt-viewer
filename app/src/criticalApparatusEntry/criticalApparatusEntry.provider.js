angular.module('evtviewer.criticalApparatusEntry')

.provider('evtCriticalApparatusEntry', function() {

	var defaults = this.defaults;

	this.setDefaults = function(_defaults) {
		defaults = _defaults;
	};

	var currentAppEntry = '';

	this.$get = function(config, parsedData, baseData, evtCriticalApparatusParser, evtCriticalApparatus, evtPinnedElements) {
		var appEntry = {},
			collection = {},
			list = [],
			idx = 0;

		// 
		// Reading builder
		// 

		appEntry.build = function(id, scope) {
			var currentId = idx++,
				entryId = id || undefined,
				scopeWit = scope.scopeWit || '',
				type = scope.type || 'default',
				showExponent = config.showReadingExponent;

			var scopeHelper = {};

			if (typeof(collection[currentId]) !== 'undefined') {
				return;
			}

			// Get Apparatus Entry content 
			var content,
                witnessesGroups = '',
				firstSubContentOpened = '',
				tabs = {
					_indexes: []
				};
			var criticalEntry = parsedData.getCriticalEntryById(id);
			if (criticalEntry === undefined) {
				var XMLdocument = baseData.getXMLDocuments()[0];
				XMLdocument = XMLdocument.cloneNode(true);
				evtCriticalApparatusParser.findCriticalEntryById(XMLdocument, id);
				// delete XMLdocument;
				criticalEntry = parsedData.getCriticalEntryById(id);
			}

			if (criticalEntry !== undefined) {
				content = evtCriticalApparatus.getContent(criticalEntry, criticalEntry._subApp, scopeWit);
				witnessesGroups = content.witnessesGroups;
				if (content.criticalNote !== '') {
					tabs._indexes.push('criticalNote');
					tabs.criticalNote = {
						label: 'Critical Note'
					};
				}
				if (content.notSignificantReadings.length > 0) {
					tabs._indexes.push('notSignificantReadings');
					tabs.notSignificantReadings = {
						label: 'Orthographic Variants'
					};
				}
				// if (content.attributes._keys.length > 0 ){
				tabs._indexes.push('moreInfo');
				tabs.moreInfo = {
					label: 'More Info'
				};
				// }
				if (criticalEntry._xmlSource !== '') {
					tabs._indexes.push('xmlSource');
					tabs.xmlSource = {
						label: 'XML'
					};
					content.xmlSource = criticalEntry._xmlSource.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, '');
				}
				if (tabs._indexes.length > 0 && defaults.firstSubContentOpened !== '') {
					if (tabs._indexes.indexOf(defaults.firstSubContentOpened) < 0) {
						firstSubContentOpened = tabs._indexes[0];
					} else {
						firstSubContentOpened = defaults.firstSubContentOpened;
					}
				}
			}

			var exponent,
				exps = parsedData.getCriticalEntries()._indexes.exponents;
			if (scope.exponent === undefined) {
				for (var i in exps) {
					if (exps[i].appId === scope.appId) {
						exponent = exps[i].exponent;
					}
				}
			} else {
				exponent = scope.exponent;
			}

			scopeHelper = {
				// expansion
				uid: currentId,
				scopeWit: scopeWit,
				appId: entryId,
				readingId: scope.readingId,
				content: content,
				type: type,
				_subContentOpened: firstSubContentOpened,
				over: false,
				selected: false,
				tabs: tabs,
				exponent: exponent,
				showExponent: showExponent,
				witnessesGroups: witnessesGroups,
				currentViewMode: scope.scopeViewMode
			};

			collection[currentId] = angular.extend(scope.vm, scopeHelper);
			list.push({
				id: currentId
			});

			return collection[currentId];
		};


		//
		// Service function
		// 
		appEntry.getById = function(currentId) {
			if (collection[currentId] !== 'undefined') {
				return collection[currentId];
			}
		};

		appEntry.getList = function() {
			return list;
		};

		appEntry.destroy = function(tempId) {
			delete collection[tempId];
		};

		appEntry.getPinned = function() {
			return evtPinnedElements.getPinnedByType('criticalApparatusEntry');
		};

		appEntry.setCurrentAppEntry = function(appId) {
			if (currentAppEntry !== appId) {
				currentAppEntry = appId;
			}
		};

		appEntry.getCurrentAppEntry = function() {
			return currentAppEntry;
		};

		appEntry.mouseOutAll = function() {
			angular.forEach(collection, function(currentEntry) {
				currentEntry.mouseOut();
			});
		};

		appEntry.mouseOverByAppId = function(appId) {
			angular.forEach(collection, function(currentEntry) {
				if (currentEntry.appId === appId) {
					currentEntry.mouseOver();
				} else {
					currentEntry.mouseOut();
				}
			});
		};

		appEntry.unselectAll = function() {
			angular.forEach(collection, function(currentEntry) {
				currentEntry.unselect();
			});
			appEntry.setCurrentAppEntry('');
		};

		appEntry.selectById = function(appId) {
			angular.forEach(collection, function(currentEntry) {
				if (currentEntry.appId === appId) {
					currentEntry.setSelected();
				} else {
					currentEntry.unselect();
				}
			});
			appEntry.setCurrentAppEntry(appId);
		};

		return appEntry;
	};

});