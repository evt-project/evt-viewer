/**
 * @ngdoc service
 * @module evtviewer.reference
 * @name evtviewer.reference.evtRef
 * @description 
 * # evtRef
 * This provider expands the scope of the
 * {@link evtviewer.reference.directive:ref ref} directive 
 * and stores its reference untill the directive remains instantiated.
 *
 * @requires $log
**/
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
        /**
         * @ngdoc method
         * @name evtviewer.reference.evtRef#build
         * @methodOf evtviewer.reference.evtRef
         *
         * @description
         * <p>This method will extend the scope of {@link evtviewer.reference.directive:ref ref} directive 
         * according to selected configurations and parsed data.</p>
         * 
         * @param {Object} scope initial scope of the directive:
            <pre>
                var scope: {
                    target: '@',
                    type: '@'
                };
            </pre>
         *
         * @returns {Object} extended scope:
            <pre>
                var scopeHelper = {
                    // expansion
                    uid,
                    defaults,

                    // model
                    type,
                    target
                };
            </pre>
         */
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
        /**
         * @ngdoc method
         * @name evtviewer.reference.evtRef#destroy
         * @methodOf evtviewer.reference.evtRef
         *
         * @description
         * Delete the reference of the instance of a particular <code>&lt;ref&gt;</code>
         * 
         * @param {string} tempId id of <code>&lt;ref&gt;</code> to destroy
         */
        reference.destroy = function(tempId) {
            delete collection[tempId];
        };
        /**
         * @ngdoc method
         * @name evtviewer.reference.evtRef#getListByType
         * @methodOf evtviewer.reference.evtRef
         *
         * @description
         * Get the references of the instance of a all <code>&lt;ref&gt;</code>s of a particular type.
         *
         * @param {string} type type of dialogs to retrieve
         *
         * @returns {array} array of references of the instance of <code>&lt;ref&gt;</code>s of given type
         *
         */
        reference.getListByType = function(type) {
            var listType = [];
            for (var i in collection) {
                if (collection[i].type === type) {
                    listType.push(collection[i]);
                }
            }
            return listType;
        };
        /**
         * @ngdoc method
         * @name evtviewer.reference.evtRef#getById
         * @methodOf evtviewer.reference.evtRef
         *
         * @description
         * Get the reference of the instance of a particular <code>&lt;ref&gt;</code>.
         *
         * @param {string} uid id of reference to retrieve
         *
         * @returns {Object} reference of the instance of <code>&lt;ref&gt;</code> with given id
         */ 
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