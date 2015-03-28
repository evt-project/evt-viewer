angular.module('evtviewer.selector')

.provider('select', function() {

    var options = this.options;

    this.setOptions = function(defaults) {
        options = defaults;
    };

    this.$get = function($log, PageData) {
        var select = {},
            collection = {},
            list = [];


        function toggleExpand() {
            var self = this;
            // Selector.log('Controller - Toggle expand for ' + $scope.id);
            self.expanded = !self.expanded;
        };

        function selectOption(option) {
            var self = this.$parent;
            self.optionSelected = option;
            if (self.expanded) {
                self.toggleExpand();
            }
        };

        select.build = function(scope) {
            var currentId = scope.id || scope.$id,
                currentType = scope.type || 'default',
                optionList,
                optionSelected;

            var scopeHelper = {};

            switch (currentType) {
                case 'page':
                    optionList = PageData.getPages();
                    optionSelected = optionList[0];
                    break;
                case 'edition':
                    console.log('ed');
                    break;
            };

            scopeHelper = {
                options: angular.copy(options),
                optionList: optionList,
                optionSelected: optionSelected,
                toggleExpand: toggleExpand,
                selectOption: selectOption
            };

            collection[currentId] = angular.extend(scope, scopeHelper);
            list.push({
                id: currentId,
                type: currentType
            });

            return collection[currentId];
        };

        select.closeAll = function(skipId) {
            angular.forEach(collection, function(currentSelector, currentId) {
                if (currentId !== skipId) {
                    currentSelector.toggleExpand();
                }
            });
        };

        return select;
    };

});