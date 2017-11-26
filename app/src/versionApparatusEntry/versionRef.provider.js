/**
 * @ngdoc service
 * @module evtviewer.versionApparatusEntry
 * @name evtviewer.versionApparatusEntry.evtVersionRef
 * @description 
 * # evtVersionRef
 * This provider expands the scope of the
 * {@link evtviewer.versionApparatusEntry.directive:evtVersionRef evtVersionRef} 
 * directive and stores its reference untill the directive remains instantiated.
 *
 * @author CM
**/
angular.module('evtviewer.versionApparatusEntry')

.provider('evtVersionRef', function() {
    /**
     * @ngdoc object
     * @module evtviewer.versionApparatusEntry
     * @name evtviewer.versionApparatusEntry.controller:versionRefCtrl
     * @description 
     * # versionRefCtrl
     * <p>This is controller for the {@link evtviewer.versionApparatusEntry.directive:evtVersionRef evtVersionRef} directive. </p>
     * <p>It is not actually implemented separately but its methods are defined in the 
     * {@link evtviewer.versionApparatusEntry.evtVersionRef evtVersionRef} provider 
     * where the scope of the directive is extended with all the necessary properties and methods
     * according to specific values of initial scope properties.</p>
     **/
    this.$get = function(evtInterface, evtBox, parsedData, config) {
        var ref = {},
            collection = {},
            list = [],
            idx = 0;
        /**
         * @ngdoc method
         * @name evtviewer.versionApparatusEntry.evtVersionRef#build
         * @methodOf evtviewer.versionApparatusEntry.evtVersionRef
         *
         * @description
         * <p>This method will extend the scope of 
         * {@link evtviewer.versionApparatusEntry.directive:evtVersionRef evtVersionRef} directive 
         * according to selected configurations and parsed data.</p>
         * <p>In particular it will decide which sub content tabs have to be shown and which have to hidden.</p>
         *
         * @param {Object} scope initial scope of the directive
         *
         * @returns {Object} extended scope:
            <pre>
                var scopeHelper = {
                    uid,
                    id,
                    elId,
                    type,
                    target,
                    title,
                    callback,
                    currentViewMode
                };
            </pre>
         */
        ref.build = function(scope) {
            var currentId = scope.id || idx++,
                currentElId = scope.elId || '',
                type = scope.type || 'default',
                target = scope.target || '',
                title = scope.title || '',
                callback = function() {console.log('TODO '+type); },
                currentViewMode = evtInterface.getState('currentViewMode'),
                id = '';
            
            // SET CALLBACK //
            switch(type) {
                case 'version':
                    if (currentElId !== target && target !== config.versions[0]) {
                        title = 'VERSIONS.OPEN_TEXT';
                    }
                    id = parsedData.getVersionEntries()._indexes.versionId[target];
                    /**
                     * @ngdoc method
                     * @name evtviewer.versionApparatusEntry.controller:versionRefCtrl#callback
                     * @methodOf evtviewer.versionApparatusEntry.controller:versionRefCtrl
                     *
                     * @description
                     * <p>It runs some callback operation, depending on entry type.</p> 
                     * <p>If "*version*", it shows the complete text of the scope version of edition, 
                     * opening the "Multiple recensions" View if it is not the current one.</p>
                     */
                    callback = function() {
                        var vm = this;
                        if (currentElId !== target && target !== config.versions[0]) {
                            var versions = evtInterface.getState('currentVersions'),
                                scopeVersionIndex = versions.indexOf(currentElId);
                            if (versions.indexOf(target) >= 0 && versions.length > 1) {
                                evtInterface.removeVersion(target);
                            }
                            evtInterface.addVersion(target, scopeVersionIndex+1);
                            if (currentViewMode !== 'versions') {
                                evtInterface.updateState('currentViewMode', 'versions');
                            }
                            evtInterface.updateUrl()
                            var currentVersionAppId = evtInterface.getState('currentVersionEntry') || '';
                            if (currentVersionAppId !== '') {
                                var newBox = evtBox.getElementByValueOfParameter('version', target);
                                //TOCHECK: newBox is undefined because the if clause is executed before the viewMode changes
                                if (newBox !== undefined) {
                                    newBox.scrollToAppEntry(currentVersionAppId);
                                }
                            }
                        } else if (target === config.versions[0]) {
                            if (currentViewMode !== 'versions') {
                                evtInterface.updateState('currentViewMode', 'versions');
                            }
                            evtInterface.updateCurrentVersion(target);
                            var entry = parsedData.getVersionEntries()[evtInterface.getCurrentVersionEntry()].content;
                            var vers = Object.keys(entry);
                            var versions = evtInterface.getState('currentVersions');
                            for (var i = 0; i < vers.length; i++) {
                                if (versions.indexOf(vers[i]) < 0 && vers[i] !== config.versions[0]) {
                                    evtInterface.addVersion(vers[i]);
                                }
                            }                            
                            evtInterface.updateUrl()
                        }
                    };
                    break;
                default:
                    break;
            }
            
            var scopeHelper = {
                uid : currentId,
                id : id,
                elId : currentElId,
                type : type,
                target : target,
                title : title,
                callback : callback,
                currentViewMode : currentViewMode,
                ver: evtInterface.getCurrentVersion() || ''
            };
            
            collection[currentId] = angular.extend(scope.vm, scopeHelper);
            list.push({
                id: currentId,
                type : type
            });

            return collection[currentId];
        };
        /**
         * @ngdoc method
         * @name evtviewer.versionApparatusEntry.evtVersionRef#destroy
         * @methodOf evtviewer.versionApparatusEntry.evtVersionRef
         *
         * @description
         * Delete the reference of the instance of a particular <code>&lt;evt-version-ref&gt;</code>
         * 
         * @param {string} tempId id of <code>&lt;evt-version-ref&gt;</code> to destroy
         */
        ref.destroy = function(tempId) {
            delete collection[tempId];
        };

        return ref;
    };

});