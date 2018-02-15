/**
 * @ngdoc service
 * @module evtviewer.versionReading
 * @name evtviewer.versionReading.evtVersionReading
 * @description 
 * # evtVersionReading
 * This provider expands the scope of the
 * {@link evtviewer.versionReading.directive:evtVersionReading evtVersionReading} directive 
 * and stores its reference untill the directive remains instantiated.
 *
 * @author CM
**/
angular.module('evtviewer.versionReading')

.provider('evtVersionReading', function() {
    
    var currentVersionEntry = '';

    this.$get = function() {
        var versionReading = {},
            collection = {},
            list = [],
            idx = 0;
        /**
         * @ngdoc method
         * @name evtviewer.versionReading.evtVersionReading#build
         * @methodOf evtviewer.versionReading.evtVersionReading
         *
         * @description
         * <p>This method will extend the scope of {@link evtviewer.versionReading.directive:evtVersionReading evtVersionReading} directive 
         * according to selected configurations.</p>
         *
         * @param {Object} scope initial scope of the directive
         *
         * @returns {Object} extended scope:
            <pre>
                var scopeHelper = {
                    uid,
                    appId,
                    readingId,
                    type,
                    scopeWit,
                    scopeVersion,
                    over,
                    selected,
                    apparatus : {
                        opened,
                        _subContentOpened
                    },
                    highlightedText
                };
            </pre>
         */
        versionReading.build = function(scope) {
            var currentId = idx++,
                entryId = scope.appId || undefined;
            if (collection[currentId] !== undefined) {
                return;
            }
            var scopeHelper = {
                uid : currentId,
                appId : entryId,
                readingId : scope.readingId,
                type : scope.type,
                scopeWit : scope.scopeWit,
                scopeVersion : scope.scopeVersion,
                over : false,
                selected : entryId === versionReading.getCurrentVersionEntry(),
                apparatus : {
                    opened : false,
                    _subContentOpened : '',
                },
                highlightedText : false
            };

            collection[currentId] = angular.extend(scope.vm, scopeHelper);
            list.push({
                id: currentId
            });

            return collection[currentId];
        };
        /**
         * @ngdoc method
         * @name evtviewer.versionReading.evtVersionReading#getCurrentVersionEntry
         * @methodOf evtviewer.versionReading.evtVersionReading
         *
         * @description
         * Retrieve current double recensio apparatus entry.
         * @returns {string} id of current double recensio apparatus entry
         */
        versionReading.getCurrentVersionEntry = function() {
            return currentVersionEntry;
        };
        /**
         * @ngdoc method
         * @name evtviewer.versionReading.evtVersionReading#setCurrentVersionEntry
         * @methodOf evtviewer.versionReading.evtVersionReading
         *
         * @description
         * Set current double recensio apparatus entry.
         * @param {string} appId id of double recensio apparatus entry to be set as current one
         */
        versionReading.setCurrentVersionEntry = function(appId) {
            if (appId !== undefined && appId !== currentVersionEntry) {
                currentVersionEntry = appId;
            }
        };
        /**
         * @ngdoc method
         * @name evtviewer.versionReading.evtVersionReading#mouseOutAll
         * @methodOf evtviewer.versionReading.evtVersionReading
         *
         * @description
         * Simulate a "*mouseout*" event on all instances of <code>&lt;evt-version-reading&gt;</code>
         */
        versionReading.mouseOutAll = function() {
            angular.forEach(collection, function(currentReading) {
                currentReading.mouseOut();
            });
        };
        /**
         * @ngdoc method
         * @name evtviewer.versionReading.evtVersionReading#mouseOverByAppId
         * @methodOf evtviewer.versionReading.evtVersionReading
         *
         * @description
         * Simulate a "*mouseover*" event on all instances of <code>&lt;evt-version-reading&gt;</code> 
         * connected to a given double recensio apparatus entry
         * @param {string} appId id of double recensio apparatus entry to handle
         */
        versionReading.mouseOverByAppId = function(appId) {
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
         * @name evtviewer.versionReading.evtVersionReading#selectById
         * @methodOf evtviewer.versionReading.evtVersionReading
         *
         * @description
         * <p>Select all <code>&lt;evt-version-reading&gt;</code>s connected to a given double recensio apparatus entry.</p>
         * <p>Set given <code>appId</code> as current one 
         * ({@link evtviewer.versionReading.evtVersionReading#setCurrentAppEntry setCurrentAppEntry()}).</p>
         * @param {string} appId id of double recensio apparatus entry to handle
         */
        versionReading.selectById = function(appId) {
            angular.forEach(collection, function(currentReading) {
                if (currentReading.appId === appId) {
                    currentReading.setSelected();
                } else {
                    currentReading.unselect();
                }
            }); 
            versionReading.setCurrentVersionEntry(appId);
        };
        /**
         * @ngdoc method
         * @name evtviewer.versionReading.evtVersionReading#unselectAll
         * @methodOf evtviewer.versionReading.evtVersionReading
         *
         * @description
         * Unselect all instances of <code>&lt;evt-version-reading&gt;</code>
         */
        versionReading.unselectAll = function() {
            angular.forEach(collection, function(currentReading) {
                currentReading.unselect();
            });
        };
        /**
         * @ngdoc method
         * @name evtviewer.versionReading.evtVersionReading#closeAllApparatus
         * @methodOf evtviewer.versionReading.evtVersionReading
         *
         * @description
         * <p>Close double recensio apparatus for all <code>&lt;evt-version-reading&gt;</code>s.</p>
         * <p>If a <code>skipId</code> is given, do not peform this action on
         * <code>&lt;evt-version-reading&gt;</code> with given id</p>
         * @param {string=} skipId id of reading to be skipped
         */
        versionReading.closeAllApparatus = function(skipId) {
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
         * @name evtviewer.versionReading.evtVersionReading#destroy
         * @methodOf evtviewer.versionReading.evtVersionReading
         *
         * @description
         * Delete the reference of the instance of a particular <code>&lt;evt-version-reading&gt;</code>
         * 
         * @param {string} tempId id of <code>&lt;evt-version-reading&gt;</code> to destroy
         */
        versionReading.destroy = function(tempId) {
            delete collection[tempId];
        };
        
        return versionReading;
    };
});