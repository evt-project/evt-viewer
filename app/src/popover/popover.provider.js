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

        popover.build = function(triggerText, tooltipText, vm) {
            var currentId = idx++,
                currentTriggerText = triggerText || '',
                currentTooltipText = tooltipText || '';

            var scopeHelper = {};

            if (typeof(collection[currentId]) !== 'undefined') {
                return;
            }

            scopeHelper = {
                // expansion
                uid: currentId,
                trigger: currentTriggerText,
                tooltip: currentTooltipText,
                expanded: angular.copy(defaults.expanded),
                tooltipOver: angular.copy(defaults.tooltipOver),
                defaults: angular.copy(defaults),
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
        popover.getById = function(currentId) {
            if (collection[currentId] !== 'undefined') {
                return collection[currentId];
            }
        };

        popover.getList = function() {
            return list;
        };

        popover.expandById = function(currentId, closeSiblings) {
            if (collection[currentId] !== 'undefined') {
                collection[currentId].expand();
                if (closeSiblings) {
                    popover.closeAll();
                }
            }
        };

        popover.closeAll = function(skipId) {
            angular.forEach(collection, function(currentPopover, currentId) {
                if (currentId !== skipId.toString()) {
                    currentPopover.collapse();
                }
            });
        };

        popover.mouseOutAll = function(skipId) {
            angular.forEach(collection, function(currentPopover, currentId) {
                if (currentId !== skipId.toString()) {
                    currentPopover.mouseOut();
                }
            });
        };

        popover.getIdTooltipOvered = function(){
            var tuid = -1;
            angular.forEach(collection, function(currentPopover) {
                if (currentPopover.tooltipOver) {
                    tuid = currentPopover.uid;
                }
            });
            return tuid;
        };

        return popover;
    };

});