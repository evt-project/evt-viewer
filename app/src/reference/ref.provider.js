angular.module('evtviewer.reference')

.provider('evtRef', function() {

    var defaults = this.defaults;

    this.setDefaults = function(_defaults) {
        defaults = _defaults;
    };

    this.$get = function($log) {
        var reference  = {},
            collection = {},
            list       = [],
            idx        = 0;

        var _console = $log.getInstance('reference');

        // 
        // Dialog builder
        // 
        reference.build = function(scope) {
            var currentId   = scope.id    || idx++,
                currentType = scope.type  || 'link',
                currentTarget = scope.target || '';

            var scopeHelper = {};

            if (typeof(collection[currentId]) !== 'undefined') {
                return;
            }

            scopeHelper = {
                // expansion
                uid           : currentId,
                defaults      : angular.copy(defaults),

                // model
                type         : currentType,
                target       : currentTarget
            };

            collection[currentId] = angular.extend(scope.vm, scopeHelper);
            list.push({
                id   : currentId,
                type : currentType
            });
            return collection[currentId];
        };


        //
        // Service function
        // 
        reference.destroy = function(tempId) {
            delete collection[tempId];
        };

        reference.getByType = function(uid) {
            var refOfType = [];
            angular.forEach(collection, function(currentRef) {
                if (currentRef.uid === uid) {
                    refOfType.push(currentRef);
                }
            });
            return refOfType;
        };

        reference.getById = function(uid) {
            angular.forEach(collection, function(currentRef) {
                if (currentRef.uid === uid) {
                    return currentRef;
                }
            });  
        };

        return reference;
    };

});