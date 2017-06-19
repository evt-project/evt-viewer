angular.module('evtviewer.versionReading')

.provider('evtVersionReading', function() {
    //
    this.$get = function() {
        var versionReading = {}
            collection = {},
            list = [],
            idx = 0;
        
        versionReading.build = function(scope) {
            var currentId = idx++,
                entryId = scope.appId || undefined;
            var scopeHelper = {};
        };
        
        return versionReading;
    }
});