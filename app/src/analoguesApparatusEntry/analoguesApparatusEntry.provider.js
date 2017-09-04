/**
 * @ngdoc service
 * @module evtviewer.analoguesApparatusEntry
 * @name evtviewer.analoguesApparatusEntry.evtAnaloguesApparatusEntry
 * @description 
 * # evtAnaloguesApparatusEntry
 *  This provider expands the scope of the
 * {@link evtviewer.analoguesApparatusEntry.directive:evtAnaloguesApparatusEntry evtAnaloguesApparatusEntry} 
 * directive and stores its reference untill the directive remains instantiated.
 *
 * @requires $log
 * @requires evtviewer.dataHandler.parsedData
 * @requires evtviewer.dataHandler.evtAnaloguesApparatus
 * @requires evtviewer.interface.evtInterface
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
		/**
         * @ngdoc method
         * @name evtviewer.analoguesApparatusEntry.evtAnaloguesApparatusEntry#build
         * @methodOf evtviewer.analoguesApparatusEntry.evtAnaloguesApparatusEntry
         *
         * @description
         * <p>This method will extend the scope of 
         * {@link evtviewer.analoguesApparatusEntry.directive:evtAnaloguesApparatusEntry evtAnaloguesApparatusEntry} directive 
         * according to selected configurations and parsed data.</p>
         * <p>In particular it will decide which sub content tabs have to be shown and which have to hidden.</p>
         *
         * @param {string} id string representing the id of scope analogues apparatus entry
         * @param {Object} scope initial scope of the directive
         *
         * @returns {Object} extended scope:
            <pre>
                var scopeHelper = {
                    uid,
					analogueId,
					header,
					xml,
					sources,
					srcList,
					_activeSource,
					_overSource,
					tabs,
					_subContentOpened,
					over,
					selected,
					currentViewMode
                };
            </pre>
         */
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
				currentViewMode: evtInterface.getState('currentViewMode')
			};

			collection[currentId] = angular.extend(scope.vm, scopeHelper);
			list.push({
				id: currentId
			});

			return collection[currentId];
		};
		/**
         * @ngdoc method
         * @name evtviewer.analoguesApparatusEntry.evtAnaloguesApparatusEntry#getById
         * @methodOf evtviewer.analoguesApparatusEntry.evtAnaloguesApparatusEntry
         *
         * @description
         * Get the reference to <code>&lt;evt-analogues-apparatus-entry&gt;</code>
         * with given id.
         * 
         * @param {string} currentId id of analogues apparatus entry to handle
         *
         * @returns {Object} object representing the reference to <code>&lt;evt-analogues-apparatus-entry&gt;</code>
         * with given id
         */
		analoguesAppEntry.getById = function(currentId) {
			if (collection[currentId] !== undefined) {
				return collection[currentId];
			}
		};
		/**
         * @ngdoc method
         * @name evtviewer.analoguesApparatusEntry.evtAnaloguesApparatusEntry#getList
         * @methodOf evtviewer.analoguesApparatusEntry.evtAnaloguesApparatusEntry
         *
         * @description
         * Get the list of all the instance of <code>&lt;evt-analogues-apparatus-entry&gt;</code>.
         *
         * @returns {array} array of ids of all the instance of <code>&lt;evt-analogues-apparatus-entry&gt;</code>.
         */
		analoguesAppEntry.getList = function() {
			return list;
		};
		/**
         * @ngdoc method
         * @name evtviewer.analoguesApparatusEntry.evtAnaloguesApparatusEntry#setCurrentAnaloguesEntry
         * @methodOf evtviewer.analoguesApparatusEntry.evtAnaloguesApparatusEntry
         *
         * @description
         * Set current analogues apparatus entry.
         * @param {string} analogueId Id of analogues apparatus entry to be set as current one
         */
		analoguesAppEntry.setCurrentAnaloguesEntry = function(analogueId) {
			if (evtInterface.getCurrentAnalogue !== analogueId) {
				evtInterface.updateState('currentAnalogue', analogueId);
			}
			currentAnaloguesEntry = analogueId;
		};
		/**
         * @ngdoc method
         * @name evtviewer.analoguesApparatusEntry.evtAnaloguesApparatusEntry#getCurrentAnaloguesEntry
         * @methodOf evtviewer.analoguesApparatusEntry.evtAnaloguesApparatusEntry
         *
         * @description
         * Retrieve current analogues apparatus entry.
         * @returns {string} id of current analogues apparatus entry
         */
		analoguesAppEntry.getCurrentAnaloguesEntry = function() {
			return currentAnaloguesEntry;
		};
		/**
         * @ngdoc method
         * @name evtviewer.analoguesApparatusEntry.evtAnaloguesApparatusEntry#mouseOutAll
         * @methodOf evtviewer.analoguesApparatusEntry.evtAnaloguesApparatusEntry
         *
         * @description
         * Simulate a "*mouseout*" event on all instances of <code>&lt;evt-analogues-apparatus-entry&gt;</code>
         */
		analoguesAppEntry.mouseOutAll = function() {
			angular.forEach(collection, function(currentEntry) {
				currentEntry.mouseOut();
			});
		};
		/**
         * @ngdoc method
         * @name evtviewer.analoguesApparatusEntry.evtAnaloguesApparatusEntry#mouseOverByAnalogueId
         * @methodOf evtviewer.analoguesApparatusEntry.evtAnaloguesApparatusEntry
         *
         * @description
         * Simulate a "*mouseover*" event on all instances of <code>&lt;evt-analogues-apparatus-entry&gt;</code> 
         * with given entry id 
         * @param {string} analogueId Id of analogues apparatus entry to handle
         */
		analoguesAppEntry.mouseOverByAnalogueId = function(analogueId) {
			angular.forEach(collection, function(currentEntry) {
				if (currentEntry.analogueId === analogueId) {
					currentEntry.mouseOver();
				} else {
					currentEntry.mouseOut();
				}
			});
		};
		/**
         * @ngdoc method
         * @name evtviewer.analoguesApparatusEntry.evtAnaloguesApparatusEntry#unselectAll
         * @methodOf evtviewer.analoguesApparatusEntry.evtAnaloguesApparatusEntry
         *
         * @description
         * Unselect all instances of <code>&lt;evt-analogues-apparatus-entry&gt;</code>
         */
		analoguesAppEntry.unselectAll = function() {
			angular.forEach(collection, function(currentEntry) {
				currentEntry.unselect();
			});
		};
		/**
         * @ngdoc method
         * @name evtviewer.analoguesApparatusEntry.evtAnaloguesApparatusEntry#unselectAll
         * @methodOf evtviewer.analoguesApparatusEntry.evtAnaloguesApparatusEntry
         *
         * @description
         * <p>Select all <code>&lt;evt-analogues-apparatus-entry&gt;</code>s connected to a given critical entry.</p>
         * <p>Set given <code>analogueId</code> as current one.</p>
         * @param {string} analogueId Id of analogues apparatus entry to handle
         */
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
		/**
         * @ngdoc method
         * @name evtviewer.analoguesApparatusEntry.evtAnaloguesApparatusEntry#destroy
         * @methodOf evtviewer.analoguesApparatusEntry.evtAnaloguesApparatusEntry
         *
         * @description
         * Delete the the instance of a particular <code>&lt;evt-analogues-apparatus-entry&gt;</code>
         * 
         * @param {string} tempId Id of <code>&lt;evt-analogues-apparatus-entry&gt;</code> to destroy
         */
		analoguesAppEntry.destroy = function(tempId) {
			delete collection[tempId];
		};

		return analoguesAppEntry;
	};

});