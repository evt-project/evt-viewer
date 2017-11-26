/**
 * @ngdoc service
 * @module evtviewer.reading
 * @name evtviewer.reading.evtReading
 * @description 
 * # evtReading
 * This provider expands the scope of the
 * {@link evtviewer.reading.directive:evtReading evtReading} directive 
 * and stores its reference untill the directive remains instantiated.
 *
 * @requires evtviewer.core.config
 * @requires evtviewer.dataHandler.parsedData
**/
angular.module('evtviewer.reading')

.provider('evtReading', function() {

    var defaults = this.defaults;

    this.setDefaults = function(_defaults) {
        defaults = _defaults;
    };

    var currentAppEntry = '';

    this.$get = function(config, parsedData) {
        var reading    = {},
            collection = {},
            list       = [],
            idx        = 0;
        
        var number = 0;
        // 
        // Reading builder
        // 
        /**
         * @ngdoc method
         * @name evtviewer.reading.evtReading#build
         * @methodOf evtviewer.reading.evtReading
         *
         * @description
         * <p>This method will extend the scope of {@link evtviewer.reading.directive:evtReading evtReading} directive 
         * according to selected configurations.</p>
         *
         * @param {string} id string representing the id of scope reading
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
                    readingType,
                    variance,
                    type,
                    attributes,
                    exponent,
                    showExponent,

                    over,
                    apparatus: {
                        opened,
                        content,
                        _loaded,
                        _subContentOpened,
                        inline
                    },
                    selected,
                    openTriggerEvent,
                    defaults
                };
            </pre>
         */
        reading.build = function(id, scope) {
            var currentId  = idx++,
                entryId    = id || undefined,
                attributes = '',
                parentEntryId,
                showExponent = config.showReadingExponent;
            var scopeHelper = {};
            
            if (typeof(collection[currentId]) !== 'undefined') {
                return;
            }
            
            var exponent = parsedData.getCriticalEntryExponent(scope.appId);

            if (scope.readingId !== undefined){
                var aAttributes = parsedData.getReadingAttributes(scope.readingId, id) || [];
                for (var attr in aAttributes) {
                    if (attr !== 'wit' && attr !== 'xml:id'){
                        attributes += attr.toUpperCase()+': '+aAttributes[attr]+' - ';
                    }
                }
                if (attributes !== '') {
                    attributes = attributes.slice(0, -3);
                }
            }
            var appObj = parsedData.getCriticalEntryById(entryId);
            if (appObj && appObj._subApp) {
                parentEntryId = appObj._indexes._parentEntry || '';
            }

            scopeHelper = {
                // expansion
                uid              : currentId,
                scopeWit         : scope.scopeWit || '',
                appId            : entryId,
                parentAppId      : parentEntryId,
                readingId        : scope.readingId,
                readingType      : scope.readingType,
                variance         : scope.variance,
                type             : scope.type,
                attributes       : attributes,
                exponent         : exponent,
                showExponent     : showExponent,

                over             : false,
                apparatus        : {
                    opened            : false,
                    content           : {},
                    _loaded           : false,
                    _subContentOpened : 'criticalNote',
                    inline            : scope.inlineApparatus
                },
                selected         : entryId === reading.getCurrentAppEntry(),
                openTriggerEvent : angular.copy(defaults.openTriggerEvent),
                defaults         : angular.copy(defaults)
            };

            collection[currentId] = angular.extend(scope.vm, scopeHelper);
            list.push({
                id: currentId,
                entryId: entryId
            });

            return collection[currentId];
        };


        //
        // Service function
        // 
        /**
         * @ngdoc method
         * @name evtviewer.reading.evtReading#getById
         * @methodOf evtviewer.reading.evtReading
         *
         * @description
         * Get the references of the instances of <code>&lt;evt-reading&gt;</code> connected 
         * to a particular critical apparatus entry.
         * 
         * @param {string} appId id of critical apparatus entry to handle
         *
         * @returns {array} array of references of <code>&lt;evt-reading&gt;</code>s connected 
         * to given critical apparatus entry 
         */
        reading.getById = function(appId) {
            var foundReading;
            angular.forEach(collection, function(currentReading) {
                if (currentReading.appId === appId) {
                    foundReading = currentReading;
                }
            });  
            return foundReading;
        };
        /**
         * @ngdoc method
         * @name evtviewer.reading.evtReading#getList
         * @methodOf evtviewer.reading.evtReading
         *
         * @description
         * Get the list of all the instance of <code>&lt;evt-reading&gt;</code>.
         *
         * @returns {array} array of ids of all the instance of <code>&lt;evt-reading&gt;</code>.
         */
        reading.getList = function() {
            return list;
        };
        /**
         * @ngdoc method
         * @name evtviewer.reading.evtReading#setCurrentAppEntry
         * @methodOf evtviewer.reading.evtReading
         *
         * @description
         * Set current critical apparatus entry.
         * @param {string} appId id of critical apparatus entry to be set as current one
         */
        reading.setCurrentAppEntry = function(appId) {
            currentAppEntry = appId;
        };
        /**
         * @ngdoc method
         * @name evtviewer.reading.evtReading#getCurrentAppEntry
         * @methodOf evtviewer.reading.evtReading
         *
         * @description
         * Retrieve current critical apparatus entry.
         * @returns {string} id of current critical apparatus entry
         */
        reading.getCurrentAppEntry = function(){
            return currentAppEntry;
        };
        /**
         * @ngdoc method
         * @name evtviewer.reading.evtReading#mouseOutAll
         * @methodOf evtviewer.reading.evtReading
         *
         * @description
         * Simulate a "*mouseout*" event on all instances of <code>&lt;evt-reading&gt;</code>
         */
        reading.mouseOutAll = function() {
            angular.forEach(collection, function(currentReading) {
                currentReading.mouseOut();
            });
        };
        /**
         * @ngdoc method
         * @name evtviewer.reading.evtReading#mouseOverByAppId
         * @methodOf evtviewer.reading.evtReading
         *
         * @description
         * Simulate a "*mouseover*" event on all instances of <code>&lt;evt-reading&gt;</code> 
         * connected to a given critical apparatus entry
         * @param {string} appId id of critical apparatus entry to handle
         */
        reading.mouseOverByAppId = function(appId) {
            angular.forEach(collection, function(currentReading) {
                if (currentReading.appId === appId) {
                    currentReading.mouseOver();
                } else {
                    currentReading.mouseOut();
                }
            });
        };
        /**
         * @ngdoc method
         * @name evtviewer.reading.evtReading#unselectAll
         * @methodOf evtviewer.reading.evtReading
         *
         * @description
         * Unselect all instances of <code>&lt;evt-reading&gt;</code>
         */
        reading.unselectAll = function() {
            angular.forEach(collection, function(currentReading) {
                currentReading.unselect();
            });
        };
        /**
         * @ngdoc method
         * @name evtviewer.reading.evtReading#closeAllApparatus
         * @methodOf evtviewer.reading.evtReading
         *
         * @description
         * <p>Close critical apparatus for all <code>&lt;evt-reading&gt;</code>s.</p>
         * <p>If a <code>skipId</code> is given, do not peform this action on
         * <code>&lt;evt-reading&gt;</code> with given id</p>
         * @param {string=} skipId id of reading to be skipped
         */
        reading.closeAllApparatus = function(skipId) {
            angular.forEach(collection, function(currentReading) {
                if (skipId === undefined) {
                    currentReading.closeApparatus();
                } else if (currentReading.uid !== skipId) {
                    currentReading.closeApparatus();
                }
            });
        };
        /**
         * @ngdoc method
         * @name evtviewer.reading.evtReading#selectById
         * @methodOf evtviewer.reading.evtReading
         *
         * @description
         * <p>Select all <code>&lt;evt-reading&gt;</code>s connected to a given critical apparatus entry.</p>
         * <p>Set given <code>appId</code> as current one 
         * ({@link evtviewer.reading.evtReading#setCurrentAppEntry setCurrentAppEntry()}).</p>
         * @param {string} appId id of critical apparatus entry to handle
         */
        reading.selectById = function(appId) {
            angular.forEach(collection, function(currentReading) {
                if (currentReading.appId === appId) {
                    currentReading.setSelected();
                } else {
                    currentReading.unselect();
                }
            }); 
            reading.setCurrentAppEntry(appId);
        };
        /**
         * @ngdoc method
         * @name evtviewer.reading.evtReading#destroy
         * @methodOf evtviewer.reading.evtReading
         *
         * @description
         * Delete the reference of the instance of a particular <code>&lt;evt-reading&gt;</code>
         * 
         * @param {string} tempId id of <code>&lt;evt-reading&gt;</code> to destroy
         */
        reading.destroy = function(tempId) {
            delete collection[tempId];
        };

        return reading;
    };

});