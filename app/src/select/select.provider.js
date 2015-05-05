angular.module('evtviewer.select')

.provider('evtSelect', function() {

    var defaults = this.defaults;

    this.setDefaults = function(_defaults) {
        defaults = _defaults;
    };

    this.$get = function($log, $location, $routeParams, parsedData) {
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
            vm.changeRoute.call(undefined, option);
            // vm.callback.call(undefined, option);

            _console.log('vm - selectOption ' + option.value);
        }

        function isOptionSelected(option) {
            var vm = this;
            if (typeof(vm.optionSelected) === 'undefined') {
                return;
            }
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
                callback,
                changeRoute;

            var scopeHelper = {};

            if (typeof(collection[currentId]) !== 'undefined') {
                return;
            }

            switch (currentType) {
                case 'page':
                    optionList = parsedData.getPages();
                    // TODO: add a general service for the current page in the application
                    // optionSelected = optionList[0]; how to take the reference to a undefined element?
                    callback = function(option) {
                        optionSelected = option;
                        _console.log('page select callback ' + option.label);
                    };
                    changeRoute = function(option) {
                        _console.log('page select changeRoute ' + option.label);  

                        var url = '/'+option.value;
                        if ( $routeParams.textId !== undefined ) {
                            url +='/'+$routeParams.textId;
                        }
                        $location.path( url );
                    };
                    break;
                case 'document':
                    optionList = parsedData.getDocuments();
                    optionSelected = optionList[0];
                    callback = function(option) {
                        _console.log('document select callback ' + option.label);
                    };
                    changeRoute = function(option) {
                        _console.log('document select changeRoute ' + option.label);  
                        var url = '/'+$routeParams.pageId+'/'+option.value;
                        $location.path( url );
                    };
                    break;
                case 'edition':
                    optionList = parsedData.getEditions();
                    optionSelected = optionList[0];
                    callback = function(option) {
                        _console.log('edition select callback ' + option.label);
                    };
                    changeRoute = function(option) {
                        _console.log('edition select changeRoute ' + option.label);  
                    };
                    break;
            }

            scopeHelper = {
                // expansion
                uid: currentId,
                defaults: angular.copy(defaults),
                callback: callback,
                changeRoute: changeRoute,

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