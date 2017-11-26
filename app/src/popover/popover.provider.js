/**
 * @ngdoc service
 * @module evtviewer.popover
 * @name evtviewer.popover.evtPopover
 * @description 
 * # evtPopover
 * This provider expands the scope of the
 * {@link evtviewer.popover.directive:evtPopover evtPopover} directive 
 * and stores its reference untill the directive remains instantiated.
**/
angular.module('evtviewer.popover')

.provider('evtPopover', function() {

    var defaults = this.defaults;

    this.setDefaults = function(_defaults) {
        defaults = _defaults;
    };

    this.$get = function() {
        var popover = {},
            collection = {},
            list = [],
            idx = 0;

        // 
        // Popover builder
        // 
        /**
         * @ngdoc method
         * @name evtviewer.popover.evtPopover#build
         * @methodOf evtviewer.popover.evtPopover
         *
         * @description
         * <p>This method will extend the scope of {@link evtviewer.popover.directive:evtPopover evtPopover} directive 
         * according to selected configurations.</p>
         *
         * @param {string} triggerText string representing the HTML to be compiled and used as trigger element
         * @param {string} tooltipText strin representing the HTML to be compile and used as the content of the pop-up box
         * @param {Object} vm initial scope of the directive
         *
         * @returns {Object} extended scope:
            <pre>
                var scopeHelper = {
                    // expansion
                    uid,
                    trigger,
                    tooltip,
                    expanded,
                    tooltipOver,
                    defaults
                };
            </pre>
         */
        popover.build = function(triggerText, tooltipText, vm) {
            var currentId          = idx++,
                currentTriggerText = triggerText || '',
                currentTooltipText = tooltipText || '';

            var scopeHelper = {};

            if (typeof(collection[currentId]) !== 'undefined') {
                return;
            }

            scopeHelper = {
                // expansion
                uid         : currentId,
                trigger     : currentTriggerText,
                tooltip     : currentTooltipText,
                expanded    : angular.copy(defaults.expanded),
                tooltipOver : angular.copy(defaults.tooltipOver),
                defaults    : angular.copy(defaults),
            };

            collection[currentId] = angular.extend(vm, scopeHelper);
            list.push({
                id: currentId
            });

            return collection[currentId];
        };


        //
        // Service function
        // 
        /**
         * @ngdoc method
         * @name evtviewer.popover.evtPopover#getById
         * @methodOf evtviewer.popover.evtPopover
         *
         * @description
         * Get the reference of the instance of a particular <code>&lt;evt-popover&gt;</code>.
         * 
         * @param {string} currentId id of popover to retrieve
         *
         * @returns {Object} reference of the instance of <code>&lt;evt-popover&gt;</code> with given id
         */
        popover.getById = function(currentId) {
            if (collection[currentId] !== 'undefined') {
                return collection[currentId];
            }
        };
        /**
         * @ngdoc method
         * @name evtviewer.popover.evtPopover#getList
         * @methodOf evtviewer.popover.evtPopover
         *
         * @description
         * Get the list of all the instance of <code>&lt;evt-popover&gt;</code>.
         *
         * @returns {array} array of ids of all the instance of <code>&lt;evt-popover&gt;</code>.
         */
        popover.getList = function() {
            return list;
        };
        /**
         * @ngdoc method
         * @name evtviewer.popover.evtPopover#expandById
         * @methodOf evtviewer.popover.evtPopover
         *
         * @description
         * <p>Expand popover with a certain id.</p>
         * <p>This function is useful if we want to trigger the expansion from an external service/controller.</p>
         * <p> It eventually collapse all other <code>&lt;evt-popover&gt;</code>.</p>
         *
         * @param {string} currentId id of popover to expand
         * @param {boolean=} closeSiblings whether or not to collapse all other expanded popovers.
         */
        popover.expandById = function(currentId, closeSiblings) {
            if (collection[currentId] !== 'undefined') {
                collection[currentId].expand();
                if (closeSiblings) {
                    popover.closeAll(currentId);
                }
            }
        };
        /**
         * @ngdoc method
         * @name evtviewer.popover.evtPopover#closeAll
         * @methodOf evtviewer.popover.evtPopover
         *
         * @description
         * <p>Collapse all instantiated <code>&lt;evt-popover&gt;</code>,
         * expect that with given id.</p>
         *
         * @param {string} skipId id of popover to skip from closing
         */
        popover.closeAll = function(skipId) {
            angular.forEach(collection, function(currentPopover, currentId) {
                if (skipId === undefined) {
                    currentPopover.collapse();
                } else if (currentId !== skipId.toString()) {
                    currentPopover.collapse();
                }
            });
        };
        /**
         * @ngdoc method
         * @name evtviewer.popover.evtPopover#mouseOutAll
         * @methodOf evtviewer.popover.evtPopover
         *
         * @description
         * <p>Set *mouse out* to all instantiated <code>&lt;evt-popover&gt;</code>,
         * expect that with given id.</p>
         *
         * @param {string} skipId id of popover to skip from closing
         */
        popover.mouseOutAll = function(skipId) {
            angular.forEach(collection, function(currentPopover, currentId) {
                if (currentId !== skipId.toString()) {
                    currentPopover.mouseOut();
                }
            });
        };
        /**
         * @ngdoc method
         * @name evtviewer.popover.evtPopover#getIdTooltipOvered
         * @methodOf evtviewer.popover.evtPopover
         *
         * @description
         * <p>Get the id of current popover opened.</p>
         *
         * @returns {string} id of current popover opened
         */
        popover.getIdTooltipOvered = function(){
            var tuid = -1;
            angular.forEach(collection, function(currentPopover) {
                if (currentPopover.tooltipOver) {
                    tuid = currentPopover.uid;
                }
            });
            return tuid;
        };
        /**
         * @ngdoc method
         * @name evtviewer.popover.evtPopover#destroy
         * @methodOf evtviewer.popover.evtPopover
         *
         * @description
         * Delete the reference of the instance of a particular <code>&lt;evt-popover&gt;</code>
         * 
         * @param {string} tempId id of <code>&lt;evt-popover&gt;</code> to destroy
         */
        popover.destroy = function(tempId){
            delete collection[tempId];
        };
        return popover;
    };

});