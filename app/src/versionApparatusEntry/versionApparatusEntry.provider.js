/**
 * @ngdoc service
 * @module evtviewer.versionApparatusEntry
 * @name evtviewer.versionApparatusEntry.evtVersionApparatusEntry
 * @description 
 * # evtVersionApparatusEntry
 * This provider expands the scope of the
 * {@link evtviewer.versionApparatusEntry.directive:evtVersionApparatusEntry evtVersionApparatusEntry} 
 * directive and stores its reference untill the directive remains instantiated.
 *
 * @requires evtviewer.dataHandler.parsedData
 * @requires evtviewer.dataHandler.evtVersionApparatus
 * @requires evtviewer.core.config
 *
 * @author CM
**/
angular.module('evtviewer.versionApparatusEntry')

.provider('evtVersionApparatusEntry', function() {
    
    this.$get = function(parsedData, evtVersionApparatus, config) {
        
        var versionEntry = {},
            collection = {},
            list = [],
            idx = 0;
        /**
         * @ngdoc method
         * @name evtviewer.versionApparatusEntry.evtVersionApparatusEntry#build
         * @methodOf evtviewer.versionApparatusEntry.evtVersionApparatusEntry
         *
         * @description
         * <p>This method will extend the scope of 
         * {@link evtviewer.versionApparatusEntry.directive:evtVersionApparatusEntry evtVersionApparatusEntry} directive 
         * according to selected configurations and parsed data.</p>
         * <p>In particular it will decide which sub content tabs have to be shown and which have to hidden.</p>
         *
         * @param {Object} scope initial scope of the directive
         *
         * @returns {Object} extended scope:
            <pre>
                var scopeHelper = {
                    uid,
                    scopeWit,
                    scopeVer,
                    appId,
                    readingId,
                    content,
                    _subContentOpened,
                    tabs,
                    currentViewMode,
                    currentVer
                };
            </pre>
         */
        versionEntry.build = function(scope) {
            var currentId = idx++,
                entryId = scope.appId || undefined,
                scopeWit = scope.scopeWit || '',
                scopeVer = scope.scopeVer || '',
                currentVer = scope.$parent.$parent.$parent.vm.version || '';
            if (currentVer === '' && scope.$parent.$parent.$parent.type === 'text') {
                currentVer = config.versions[0];
            }
            
            if (collection[currentId] !== undefined) {
                return;
            }
            
            var entry = parsedData.getVersionEntries()[entryId],
                entryContent,
                firstSubContentOpened = '',
                tabs = {
                    _indexes : []
                };
            
            if (entry !== undefined) {
                entryContent = evtVersionApparatus.getContent(entry, scopeWit, scopeVer);
                if (entryContent.note !== '') {
                    tabs._indexes.push('criticalNote');
                    tabs.criticalNote = {
                        label : 'VERSIONS.CRITICAL_NOTE'
                    };
                }
                if (entryContent._readings) {
                    tabs._indexes.push('readings');
                    tabs.readings = {
                        label: 'VERSIONS.VERSION_READING'
                    };
                }
                if (entryContent.attributes._keys.length > 0) {
                    tabs._indexes.push('moreInfo');
                    tabs.moreInfo = {
                        label: 'VERSIONS.MORE_INFO'
                    };
                }
                if (entryContent._xmlSource !== '') {
                    tabs._indexes.push('xmlSource');
                    tabs.xmlSource = {
                        label: 'VERSIONS.XML'
                    };
                }
            }

            var scopeHelper = {
                uid : currentId,
                scopeWit : scopeWit,
                scopeVer : scopeVer,
                appId : entryId,
                readingId : scope.readingId,
                content : entryContent,
                _subContentOpened : firstSubContentOpened,
                tabs : tabs,
                currentViewMode : scope.scopeViewMode,
                currentVer : currentVer
            };

            collection[currentId] = angular.extend(scope.vm, scopeHelper);
            list.push({
                id: currentId
            });

            return collection[currentId];
        };
        /**
         * @ngdoc method
         * @name evtviewer.versionApparatusEntry.evtVersionApparatusEntry#destroy
         * @methodOf evtviewer.versionApparatusEntry.evtVersionApparatusEntry
         *
         * @description
         * Delete the reference of the instance of a particular <code>&lt;evt-version-apparatus-entry&gt;</code>
         * 
         * @param {string} tempId id of <code>&lt;evt-version-apparatus-entry&gt;</code> to destroy
         */
        versionEntry.destroy = function(tempId) {
            delete collection[tempId];
        };
        
        return versionEntry;
    };
});