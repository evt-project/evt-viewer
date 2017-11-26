/**
 * @ngdoc service
 * @module evtviewer.analogue
 * @name evtviewer.analogue.evtAnalogue
 * @description 
 * # evtAnalogue
 * This provider expands the scope of the
 * {@link evtviewer.analogue.directive:evtAnalogue evtAnalogue} directive 
 * and stores its reference untill the directive remains instantiated.
 *
 * @requires evtviewer.dataHandler.parsedData
 * @requires evtviewer.interface.evtInterface
 **/
angular.module('evtviewer.analogue')

.provider('evtAnalogue', function() {

	var defaults = this.defaults;

	this.setDefaults = function(_defaults) {
		defaults = _defaults;
	};

	var currentAnaloguesEntry = '';
	/**
         * @ngdoc method
         * @name evtviewer.analogue.evtAnalogue#build
         * @methodOf evtviewer.analogue.evtAnalogue
         *
         * @description
         * <p>This method will extend the scope of {@link evtviewer.analogue.directive:evtAnalogue evtAnalogue} directive 
         * according to selected configurations.</p>
         *
         * @param {Object} scope initial scope of the directive
         *
         * @returns {Object} extended scope:
            <pre>
                var scopeHelper = {
                    uid,
					scopeWit,
					analogueId,
					scopeViewMode,

					over,
					selected,
					apparatus: {
						opened,
						content,
						_loaded,
						inline
					},
					openTriggerEvent,
					defaults
                };
            </pre>
         */
	this.$get = function(parsedData, evtInterface) {
		var analogue = {},
			collection = {},
			list = [],
			idx = 0;

		// Analogue builder
		analogue.build = function(scope) {
			var currentId = idx++,
				entryId = scope.analogueId || undefined;

			if (collection[currentId] !== undefined) {
				return;
			}

			var scopeHelper = {
				uid: currentId,
				scopeWit: scope.scopeWit || '',
				analogueId: entryId,
				scopeViewMode: evtInterface.getState('currentViewMode'),

				over: false,
				selected: entryId === analogue.getCurrentAnaloguesEntry(),
				apparatus: {
					opened: false,
					content: {},
					_loaded: false,
					inline: scope.inlineApparatus
				},
				openTriggerEvent: angular.copy(defaults.openTriggerEvent),
				defaults: angular.copy(defaults)
			};

			collection[currentId] = angular.extend(scope.vm, scopeHelper);
			list.push({
				id: currentId
			});
			return collection[currentId];
		};
		/**
         * @ngdoc method
         * @name evtviewer.analogue.evtAnalogue#getById
         * @methodOf evtviewer.analogue.evtAnalogue
         *
         * @description
         * Get the references of the instances of <code>&lt;evt-analogue&gt;</code> connected 
         * to a particular analogues apparatus entry.
         * 
         * @param {string} currentId id of analogues apparatus entry to handle
         *
         * @returns {array} array of references of <code>&lt;evt-analogue&gt;</code>s connected 
         * to given analogues apparatus entry 
         */
		analogue.getById = function(currentId) {
			if (collection[currentId] !== undefined) {
				return collection[currentId];
			}
		};
		/**
         * @ngdoc method
         * @name evtviewer.analogue.evtAnalogue#getList
         * @methodOf evtviewer.analogue.evtAnalogue
         *
         * @description
         * Get the list of all the instance of <code>&lt;evt-analogue&gt;</code>.
         *
         * @returns {array} array of ids of all the instance of <code>&lt;evt-analogue&gt;</code>.
         */
		analogue.getList = function() {
			return list;
		};
		/**
         * @ngdoc method
         * @name evtviewer.analogue.evtAnalogue#setCurrentAnaloguesEntry
         * @methodOf evtviewer.analogue.evtAnalogue
         *
         * @description
         * Set current analogues apparatus entry.
         * @param {string} analogueId id of analogues apparatus entry to be set as current one
         */
		analogue.setCurrentAnaloguesEntry = function(analogueId) {
			if (evtInterface.getState('currentAnalogue')  !== analogueId) {
				evtInterface.updateState('currentAnalogue', analogueId);
			}
			currentAnaloguesEntry = analogueId;
		};
		/**
         * @ngdoc method
         * @name evtviewer.analogue.evtAnalogue#getCurrentAnaloguesEntry
         * @methodOf evtviewer.analogue.evtAnalogue
         *
         * @description
         * Retrieve current analogues apparatus entry.
         * @returns {string} id of current analogues apparatus entry
         */
		analogue.getCurrentAnaloguesEntry = function() {
			return currentAnaloguesEntry;
		};
		/**
         * @ngdoc method
         * @name evtviewer.analogue.evtAnalogue#mouseOutAll
         * @methodOf evtviewer.analogue.evtAnalogue
         *
         * @description
         * Simulate a "*mouseout*" event on all instances of <code>&lt;evt-analogue&gt;</code>
         */
		analogue.mouseOutAll = function() {
			angular.forEach(collection, function(currentAnalogue) {
				currentAnalogue.mouseOut();
			});
		};
		/**
         * @ngdoc method
         * @name evtviewer.analogue.evtAnalogue#mouseOverByAnalogueId
         * @methodOf evtviewer.analogue.evtAnalogue
         *
         * @description
         * Simulate a "*mouseover*" event on all instances of <code>&lt;evt-analogue&gt;</code> 
         * connected to a given analogues apparatus entry
         * @param {string} analogueId id of analogues apparatus entry to handle
         */
		analogue.mouseOverByAnalogueId = function(analogueId) {
			angular.forEach(collection, function(currentAnalogue) {
				if (currentAnalogue.analogueId === analogueId) {
					currentAnalogue.mouseOver();
				} else {
					currentAnalogue.mouseOut();
				}
			});
		};
		/**
         * @ngdoc method
         * @name evtviewer.analogue.evtAnalogue#unselectAll
         * @methodOf evtviewer.analogue.evtAnalogue
         *
         * @description
         * Unselect all instances of <code>&lt;evt-analogue&gt;</code>
         */
		analogue.unselectAll = function() {
			angular.forEach(collection, function(currentAnalogue) {
				currentAnalogue.unselect();
			});
			evtInterface.updateState('currentAnalogue', '');
		};
		/**
         * @ngdoc method
         * @name evtviewer.analogue.evtAnalogue#closeAllApparatus
         * @methodOf evtviewer.analogue.evtAnalogue
         *
         * @description
         * <p>Close analogues apparatus for all <code>&lt;evt-analogue&gt;</code>s.</p>
         * <p>If a <code>skipId</code> is given, do not peform this action on
         * <code>&lt;evt-analogue&gt;</code> with given id</p>
         * @param {string=} skipId id of analogue to be skipped
         */
		analogue.closeAllApparatus = function(skipId) {
			angular.forEach(collection, function(currentAnalogue) {
				if (skipId === undefined) {
					currentAnalogue.closeApparatus();
				} else if (currentAnalogue.uid !== skipId) {
					currentAnalogue.closeApparatus();
				}
			});
		};
		/**
         * @ngdoc method
         * @name evtviewer.analogue.evtAnalogue#selectById
         * @methodOf evtviewer.analogue.evtAnalogue
         *
         * @description
         * <p>Select all <code>&lt;evt-analogue&gt;</code>s connected to a given analogues apparatus entry.</p>
         * <p>Set given <code>analogueId</code> as current one 
         * ({@link evtviewer.analogue.evtAnalogue#setCurrentAppEntry setCurrentAppEntry()}).</p>
         * @param {string} analogueId id of analogues apparatus entry to handle
         */
		analogue.selectById = function(analogueId) {
			angular.forEach(collection, function(currentAnalogue) {
				if (currentAnalogue.analogueId === analogueId) {
					currentAnalogue.setSelected();
				} else {
					currentAnalogue.unselect();
				}
			});
			evtInterface.updateState('currentAnalogue', analogueId);
			analogue.setCurrentAnaloguesEntry(analogueId);
		};
		/**
         * @ngdoc method
         * @name evtviewer.analogue.evtAnalogue#destroy
         * @methodOf evtviewer.analogue.evtAnalogue
         *
         * @description
         * Delete the reference of the instance of a particular <code>&lt;evt-analogue&gt;</code>.
         * 
         * @param {string} tempId id of <code>&lt;evt-analogue&gt;</code> to destroy
         */
		analogue.destroy = function(tempId) {
			delete collection[tempId];
		};

		return analogue;
	};
});