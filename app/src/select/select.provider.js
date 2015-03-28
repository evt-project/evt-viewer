angular.module('evtviewer.select')

.provider('evtSelect', function() {

    var defaults = this.defaults;

    this.setDefaults = function(_defaults) {
        defaults = _defaults;
    };

    this.$get = function($log, PageData) {
        var select = {},
            collection = {},
            list = [];

        var _console = $log.getInstance('select');


        // 
        // Control function
        // 

        function toggleExpand() {
            var vm = this;
            select.closeAll(vm.uid);
            vm.expanded = !vm.expanded;

            _console.log('vm - toggleExpand for ' + vm.uid);
        };

        function selectOption(option) {
            var vm = this;
            vm.optionSelected = option;
            if (vm.expanded) {
                vm.toggleExpand();
            }
            vm.callback.call(undefined, option);

            _console.log('vm - selectOption ', option);
        };

        function destroy() {
            var tempId = this.uid;
            // TODO: remove from list and collection
            this.$destroy();

            _console.log('vm - destroy ' + tempId);
        }


        // 
        // Select builder
        // 

        select.build = function(scope) {
            var currentId = scope.id || scope.$id,
                currentType = scope.type || 'default',
                optionList,
                optionSelected,
                callback;

            var scopeHelper = {};

            if (typeof(collection[currentId]) !== 'undefined') {
                return;
            }

            switch (currentType) {
                case 'page':
                    optionList = PageData.getPages();
                    optionSelected = optionList[0];
                    callback = function(option){
                        _console.log('page select callback'+option.label);
                    }
                    break;
                case 'document':
                    optionList = PageData.getPages();
                    optionSelected = optionList[0];
                    callback = function(option){
                        _console.log('document select callback'+option.label);
                    }
                    break;
                case 'edition':
                    optionList = PageData.getPages();
                    optionSelected = optionList[0];
                    callback = function(option){
                        _console.log('edition select callback'+option.label);
                    }
                    break;
            };

            scopeHelper = {
                // expansion
                uid: currentId,
                defaults: angular.copy(defaults),
                callback: callback,

                // model
                optionList: optionList,
                optionSelected: optionSelected,

                // function
                toggleExpand: toggleExpand,
                selectOption: selectOption,
                destroy: destroy
            };

            collection[currentId] = angular.extend(scope, scopeHelper);
            list.push({
                id: currentId,
                type: currentType
            });

            return collection[currentId];
        };


        //
        // Service function
        // 

        select.closeAll = function(skipId) {
            angular.forEach(collection, function(currentSelect, currentId) {
                if (currentId !== skipId) {
                    currentSelect.expanded = false;
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
        }

        select.getOptionSelected = function(currentId) {
            if (collection[currentId] !== 'undefined') {
                return collection[currentId].optionSelected;
            }
        };

        return select;
    };

});