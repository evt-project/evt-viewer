/**
 * @ngdoc service
 * @module evtviewer.versionApparatusEntry
 * @name evtviewer.versionApparatusEntry.evtVersionApparatusEntry
 * @description 
 * # evtVersionApparatusEntry
 * TODO: Add description and comments for every method
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

        versionEntry.destroy = function(tempId) {
            delete collection[tempId];
        };
        
        return versionEntry;
    };
});