angular.module('evtviewer.select')

.provider('evtSelect', function() {

    var defaults = this.defaults;

    this.setDefaults = function(_defaults) {
        defaults = _defaults;
    };

    this.$get = function($log, parsedData) {
        var select = {},
            collection = {},
            list = [],
            idx = 0;

        var _console = $log.getInstance('select');


        // 
        // Control function
        // 

        function expand() {
            var vm = this;
            vm.expanded = true;
        }

        function collapse() {
            var vm = this;
            vm.expanded = false;
        }

        function toggleExpand(closeSiblings) {
            var vm = this;
            if (!closeSiblings) {
                select.closeAll(vm.uid);
            }
            vm.expanded = !vm.expanded;

            _console.log('vm - toggleExpand for ' + vm.uid);
        }

        function selectOption(option) {
            var vm = this;
            vm.optionSelected = option;
            if (vm.expanded) {
                vm.toggleExpand();
            }
            vm.callback.call(undefined, option);

            _console.log('vm - selectOption ' + option.value);
        }

        function isOptionSelected(option) {
            var vm = this;
            return vm.optionSelected.value === option.value;
        }

        function destroy() {
            var tempId = this.uid;
            // TODO: remove from list and collection
            // this.$destroy();

            _console.log('vm - destroy ' + tempId);
        }


        // 
        // Select builder
        // 

        select.build = function(vm) {
            var currentId = vm.id || idx++,
                currentType = vm.type || 'default',
                optionList,
                optionSelected,
                callback;

            var scopeHelper = {};

            if (typeof(collection[currentId]) !== 'undefined') {
                return;
            }

            switch (currentType) {
                case 'page':
                    optionList = parsedData.getPages();
                    optionSelected = optionList[0];
                    callback = function(option) {
                        _console.log('page select callback' + option.label);
                    };
                    break;
                case 'document':
                    optionList = parsedData.getDocuments();
                    optionSelected = optionList[0];
                    callback = function(option) {
                        _console.log('document select callback' + option.label);
                    };
                    break;
                case 'edition':
                    optionList = parsedData.getEditions();
                    optionSelected = optionList[0];
                    callback = function(option) {
                        _console.log('edition select callback' + option.label);
                    };
                    break;
            }

            scopeHelper = {
                // expansion
                uid: currentId,
                defaults: angular.copy(defaults),
                callback: callback,

                // model
                optionList: optionList,
                optionSelected: optionSelected,

                // function
                expand: expand,
                collapse: collapse,
                toggleExpand: toggleExpand,
                selectOption: selectOption,
                isOptionSelected: isOptionSelected,
                destroy: destroy
            };

            collection[currentId] = angular.extend(vm, scopeHelper);
            list.push({
                id: currentId,
                type: currentType
            });

            return collection[currentId];
        };


        //
        // Service function
        // 

        select.getById = function(currentId) {
            if (collection[currentId] !== 'undefined') {
                return collection[currentId];
            }
        };

        select.getList = function() {
            return list;
        };

        select.expandById = function(currentId, closeSiblings) {
            if (collection[currentId] !== 'undefined') {
                collection[currentId].expand();
                if (closeSiblings) {
                    select.closeAll();
                }
            }
        };

        select.closeAll = function(skipId) {
            angular.forEach(collection, function(currentSelect, currentId) {
                if (currentId !== skipId) {
                    currentSelect.collapse();
                }
            });
        };

        select.addOption = function(currentId, option) {
            if (collection[currentId] !== 'undefined') {
                collection[currentId].optionList.push(option);
            }
        };

        select.setCallback = function(currentId, callback) {
            if (collection[currentId] !== 'undefined') {
                collection[currentId].callback = callback;
            }
        };

        return select;
    };

});