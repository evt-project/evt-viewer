angular.module('evtviewer.versionApparatusEntry')

.provider('evtVersionRef', function() {

    this.$get = function(evtInterface, evtBox, parsedData, config) {
        var ref = {},
            collection = {},
            list = [],
            idx = 0;
        
        ref.build = function(scope) {
            var currentId = scope.id || idx++,
                currentElId = scope.elId || '',
                type = scope.type || 'default',
                target = scope.target || '',
                title = scope.title || '',
                callback = function() {console.log('TODO '+type); },
                currentViewMode = evtInterface.getCurrentViewMode(),
                id = '';
            
            /* SET CALLBACK */
            switch(type) {
                case 'version':
                    if (currentElId !== target && target !== config.versions[0]) {
                        title = 'Open version text';
                    }
                    id = parsedData.getVersionEntries()._indexes.versionId[target];
                    callback = function() {
                        var vm = this;
                        if (currentElId !== target && target !== config.versions[0]) {
                            var versions = evtInterface.getCurrentVersions(),
                                scopeVersionIndex = versions.indexOf(currentElId);
                            if (versions.indexOf(target) >= 0 && versions.length > 1) {
                                evtInterface.removeVersion(target);
                            }
                            evtInterface.addVersion(target, scopeVersionIndex+1);
                            if (currentViewMode !== 'versions') {
                                evtInterface.updateCurrentViewMode('versions');
                            }
                            var currentVersionAppId = evtInterface.getCurrentVersionEntry() || '';
                            if (currentVersionAppId !== '') {
                                var newBox = evtBox.getElementByValueOfParameter('version', target);
                                if (newBox !== undefined) {
                                    newBox.scrollToAppEntry(currentVersionAppId);
                                }
                            }
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
                currentViewMode : currentViewMode
            };
            
            collection[currentId] = angular.extend(scope.vm, scopeHelper);
            list.push({
                id: currentId,
                type : type
            });

            return collection[currentId];
        };

        ref.destroy = function(tempId) {
            delete collection[tempId];
        };

        return ref;
    };

});