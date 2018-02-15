/**
 * @ngdoc service
 * @module evtviewer.criticalApparatusEntry
 * @name evtviewer.criticalApparatusEntry.evtCriticalApparatusEntry
 * @description 
 * # evtCriticalApparatusEntry
 * This provider expands the scope of the
 * {@link evtviewer.criticalApparatusEntry.directive:evtCriticalApparatusEntry evtCriticalApparatusEntry} 
 * directive and stores its reference untill the directive remains instantiated.
 *
 * @requires evtviewer.core.config
 * @requires evtviewer.dataHandler.parsedData
 * @requires evtviewer.dataHandler.baseData
 * @requires evtviewer.dataHandler.evtCriticalApparatusParser
 * @requires evtviewer.criticalApparatus.evtCriticalApparatus
 * @requires evtviewer.UItools.evtPinnedElements
**/
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
		/**
         * @ngdoc method
         * @name evtviewer.criticalApparatusEntry.evtCriticalApparatusEntry#build
         * @methodOf evtviewer.criticalApparatusEntry.evtCriticalApparatusEntry
         *
         * @description
         * <p>This method will extend the scope of 
         * {@link evtviewer.criticalApparatusEntry.directive:evtCriticalApparatusEntry evtCriticalApparatusEntry} directive 
         * according to selected configurations and parsed data.</p>
         * <p>In particular it will decide which sub content tabs have to be shown and which have to hidden.</p>
         *
         * @param {string} id string representing the id of scope critical apparatus entry
         * @param {Object} scope initial scope of the directive
         *
         * @returns {Object} extended scope:
            <pre>
                var scopeHelper = {
                    // expansion
                    uid,
                    scopeWit,
                    appId,
                    parentAppId,
                    readingId,
                    content,
                    type,
                    _subContentOpened,
                    over,
                    selected,
                    tabs,
                    exponent,
                    showExponent,
                    witnessesGroups,
                    currentViewMode
                };
            </pre>
         */
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
						label: 'CRITICAL_APPARATUS.TABS.CRITICAL_NOTE'
					};
				}
				if (content.notSignificantReadings.length > 0) {
					tabs._indexes.push('notSignificantReadings');
					tabs.notSignificantReadings = {
						label: 'CRITICAL_APPARATUS.TABS.ORTHOGRAPHIC_VARIANTS'
					};
				}
				// if (content.attributes._keys.length > 0 ){
				tabs._indexes.push('moreInfo');
				tabs.moreInfo = {
					label: 'CRITICAL_APPARATUS.TABS.MORE_INFO'
				};
				// }
				if (criticalEntry._xmlSource !== '') {
					tabs._indexes.push('xmlSource');
					tabs.xmlSource = {
						label: 'CRITICAL_APPARATUS.TABS.XML'
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

			var exponent = scope.exponent === undefined ? parsedData.getCriticalEntryExponent(scope.appId) : scope.exponent;

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
		/**
         * @ngdoc method
         * @name evtviewer.criticalApparatusEntry.evtCriticalApparatusEntry#getById
         * @methodOf evtviewer.criticalApparatusEntry.evtCriticalApparatusEntry
         *
         * @description
         * Get the reference to <code>&lt;evt-critical-apparatus-entry&gt;</code>
         * with given id.
         * 
         * @param {string} currentId id of critical apparatus entry to handle
         *
         * @returns {Object} object representing the reference to <code>&lt;evt-critical-apparatus-entry&gt;</code>
         * with given id
         */
		appEntry.getById = function(currentId) {
			if (collection[currentId] !== 'undefined') {
				return collection[currentId];
			}
		};
		/**
         * @ngdoc method
         * @name evtviewer.criticalApparatusEntry.evtCriticalApparatusEntry#getList
         * @methodOf evtviewer.criticalApparatusEntry.evtCriticalApparatusEntry
         *
         * @description
         * Get the list of all the instance of <code>&lt;evt-critical-apparatus-entry&gt;</code>.
         *
         * @returns {array} array of ids of all the instance of <code>&lt;evt-critical-apparatus-entry&gt;</code>.
         */
		appEntry.getList = function() {
			return list;
		};
		/**
         * @ngdoc method
         * @name evtviewer.criticalApparatusEntry.evtCriticalApparatusEntry#destroy
         * @methodOf evtviewer.criticalApparatusEntry.evtCriticalApparatusEntry
         *
         * @description
         * Delete the reference of the instance of a particular <code>&lt;evt-critical-apparatus-entry&gt;</code>
         * 
         * @param {string} tempId id of <code>&lt;evt-critical-apparatus-entry&gt;</code> to destroy
         */
		appEntry.destroy = function(tempId) {
			delete collection[tempId];
		};
		/**
         * @ngdoc method
         * @name evtviewer.criticalApparatusEntry.evtCriticalApparatusEntry#getPinned
         * @methodOf evtviewer.criticalApparatusEntry.evtCriticalApparatusEntry
         *
         * @description
         * Get the list of critical apparatus entries that are pinned.
         *
         * @returns {array} array of ids of all the pinned critical apparatus entries
         */
		appEntry.getPinned = function() {
			return evtPinnedElements.getPinnedByType('criticalApparatusEntry');
		};
		/**
         * @ngdoc method
         * @name evtviewer.criticalApparatusEntry.evtCriticalApparatusEntry#setCurrentAppEntry
         * @methodOf evtviewer.criticalApparatusEntry.evtCriticalApparatusEntry
         *
         * @description
         * Set current critical apparatus entry.
         * @param {string} appId id of critical apparatus entry to be set as current one
         */
		appEntry.setCurrentAppEntry = function(appId) {
			if (currentAppEntry !== appId) {
				currentAppEntry = appId;
			}
		};
		/**
         * @ngdoc method
         * @name evtviewer.criticalApparatusEntry.evtCriticalApparatusEntry#getCurrentAppEntry
         * @methodOf evtviewer.criticalApparatusEntry.evtCriticalApparatusEntry
         *
         * @description
         * Retrieve current critical apparatus entry.
         * @returns {string} id of current critical apparatus entry
         */
		appEntry.getCurrentAppEntry = function() {
			return currentAppEntry;
		};
		/**
         * @ngdoc method
         * @name evtviewer.criticalApparatusEntry.evtCriticalApparatusEntry#mouseOutAll
         * @methodOf evtviewer.criticalApparatusEntry.evtCriticalApparatusEntry
         *
         * @description
         * Simulate a "*mouseout*" event on all instances of <code>&lt;evt-critical-apparatus-entry&gt;</code>
         */
		appEntry.mouseOutAll = function() {
			angular.forEach(collection, function(currentEntry) {
				currentEntry.mouseOut();
			});
		};
		/**
         * @ngdoc method
         * @name evtviewer.criticalApparatusEntry.evtCriticalApparatusEntry#mouseOutAll
         * @methodOf evtviewer.criticalApparatusEntry.evtCriticalApparatusEntry
         *
         * @description
         * Simulate a "*mouseover*" event on all instances of <code>&lt;evt-critical-apparatus-entry&gt;</code> 
         * with given entry id 
         * @param {string} appId id of critical apparatus entry to handle
         */
		appEntry.mouseOverByAppId = function(appId) {
			angular.forEach(collection, function(currentEntry) {
				if (currentEntry.appId === appId) {
					currentEntry.mouseOver();
				} else {
					currentEntry.mouseOut();
				}
			});
		};
		/**
         * @ngdoc method
         * @name evtviewer.criticalApparatusEntry.evtCriticalApparatusEntry#unselectAll
         * @methodOf evtviewer.criticalApparatusEntry.evtCriticalApparatusEntry
         *
         * @description
         * Unselect all instances of <code>&lt;evt-critical-apparatus-entry&gt;</code>
         */
		appEntry.unselectAll = function() {
			angular.forEach(collection, function(currentEntry) {
				currentEntry.unselect();
			});
			appEntry.setCurrentAppEntry('');
		};
		/**
         * @ngdoc method
         * @name evtviewer.criticalApparatusEntry.evtCriticalApparatusEntry#unselectAll
         * @methodOf evtviewer.criticalApparatusEntry.evtCriticalApparatusEntry
         *
         * @description
         * <p>Select all <code>&lt;evt-critical-apparatus-entry&gt;</code>s connected to a given critical entry.</p>
         * <p>Set given <code>appId</code> as current one.</p>
         * @param {string} appId id of critical apparatus entry to handle
         */
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