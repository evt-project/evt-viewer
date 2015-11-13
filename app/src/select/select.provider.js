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

        function getOptionSelectedValue(){
            var vm = this;
            if (vm.optionSelected !== undefined) {
                return vm.optionSelected.value;
            }
        }
        // 
        // Select builder
        // 

        select.build = function(id, type, vm) {
            var currentId = id || idx++,
                currentType = type || 'default',
                optionList = [],
                optionSelected,
                callback,
                changeRoute;

            var scopeHelper = {};

            if (typeof(collection[currentId]) !== 'undefined') {
                return;
            }

            switch (currentType) {
                case 'page':
                    optionList = parsedData.getPagesList();
                    // TODO: add a general service for the current page in the application
                    // optionSelected = optionList[0]; how to take the reference to a undefined element?
                    callback = function(option) {
                        optionSelected = option;
                        _console.log('page select callback ' + option.label);
                    };
                    changeRoute = function(option) {
                        _console.log('page select changeRoute ' + option.label);  
                        var url = '/'+option.value;
                        if ( $routeParams.docId !== undefined ) {
                            url +='/'+$routeParams.docId;
                        }
                        $location.path( url );
                    };
                    break;
                case 'document':
                    optionList = parsedData.getDocumentsList();
                    callback = function(option) {
                        optionSelected = option;
                        _console.log('document select callback ' + option.label);
                    };
                    changeRoute = function(option) {
                        _console.log('document select changeRoute ' + option.label);  
                        var url = '/'+$routeParams.pageId+'/'+option.value;
                        $location.path( url );
                    };
                    break;
                case 'edition':
                    // optionList = parsedData.getEditions();
                    optionSelected = optionList[0];
                    callback = function(option) {
                        _console.log('edition select callback ' + option.label);
                    };
                    changeRoute = function(option) {
                        _console.log('edition select changeRoute ' + option.label);  
                    };
                    break;
                case 'witness':
                    optionList = parsedData.getWitnessesList();
                    optionSelected = optionList[0] || {};
                    callback = function(option) {
                        optionSelected = option;
                        _console.log('witness select callback ' + option.label);
                    };
                    changeRoute = function(option) {
                        //TODO: dovrò avere un parametro "multiplo" che mi salva tutti i testimoni visualizzati, 
                        //eventualmente nell'esatto ordine in cui sono visualizzati
                        var selectors = select.getList(),
                            witIds = '#';
                        angular.forEach(selectors, function(currentSelect) {
                            if (currentSelect.type === 'witness') {
                                var witSelect = select.getById(currentSelect.id);
                                witIds += witSelect.optionSelected.value+'#';
                            }
                        });

                        var url = '/'+$routeParams.pageId+'/'+$routeParams.docId+'/'+witIds;
                        $location.path( url );
                    };
                    break;
            }

            scopeHelper = {
                // expansion
                uid: currentId,
                defaults: angular.copy(defaults),
                callback: callback,
                changeRoute: changeRoute,
                getOptionSelectedValue: getOptionSelectedValue,
                // model
                optionList: optionList,
                optionSelected: optionSelected,
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
            if (collection[currentId] !== undefined) {
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