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

        var _console = $log.getInstance('select');
        _console.log('ciaolog');
        _console.debug('ciao');


        function toggleExpand() {
            var vm = this;
            select.closeAll(vm.uid);
            vm.expanded = !vm.expanded;

            // Selector.log('Controller - Toggle expand for ' + $scope.id);
        };

        function selectOption(option) {
            var vm = this;
            vm.optionSelected = option;
            if (vm.expanded) {
                vm.toggleExpand();
            }
        };

        select.build = function(scope) {
            var currentId = scope.id || scope.$id,
                currentType = scope.type || 'default',
                optionList,
                optionSelected;

            var scopeHelper = {};

            if (typeof(collection[currentId]) !== 'undefined') {
                return;
            }

            switch (currentType) {
                case 'page':
                    optionList = PageData.getPages();
                    optionSelected = optionList[0];
                    break;
                case 'edition':
                    optionList = PageData.getPages();
                    optionSelected = optionList[0];
                    break;
            };

            scopeHelper = {
                uid: currentId,
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
                    currentSelector.expanded = false;
                }
            });
        };

        return select;
    };

});