angular.module('evtviewer.select')

.provider('evtSelect', function() {

    var defaults = this.defaults;

    this.setDefaults = function(_defaults) {
        defaults = _defaults;
    };

    this.$get = function($log, $location, $routeParams, parsedData) {
        var select     = {},
            collection = {},
            list       = [],
            idx        = 0;

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
            var currentId   = id   || idx++,
                currentType = type || 'default',
                optionList  = [],
                dataSource  = '',
                optionSelected,
                callback,
                changeRoute,
                formatOptionList;

            var scopeHelper = {};

            if (typeof(collection[currentId]) !== 'undefined') {
                return;
            }

            switch (currentType) {
                case 'page':
                    optionList = parsedData.getPages();
                    dataSource = parsedData.getPages();
                    // TODO: add a general service for the current page in the application
                    // optionSelected = optionList[0]; how to take the reference to a undefined element?
                    callback = function(option) {
                        optionSelected = option;
                        _console.log('page select callback ' + option.label);
                    };
                    changeRoute = function(option) {
                        _console.log('page select changeRoute ' + option.label);  
                        var url = '/' + option.value;
                        if ( $routeParams.docId !== undefined ) {
                            url += '/' + $routeParams.docId;
                        }
                        // $location.path( url );
                    };
                    formatOptionList = function(optionList) {
                        var formattedList = [];
                        for (var i = 0; i < optionList.length; i++ ) {
                            formattedList.push(optionList[optionList[i]]);
                        }
                        return formattedList;
                    };
                    break;
                case 'document':
                    optionList = parsedData.getDocuments();
                    dataSource = parsedData.getDocuments();
                    callback = function(option) {
                        optionSelected = option;
                        _console.log('document select callback ' + option.label);
                    };
                    changeRoute = function(option) {
                        _console.log('document select changeRoute ' + option.label);  
                        var url = '/' + $routeParams.pageId + '/' + option.value;
                        // $location.path( url );
                    };
                    formatOptionList = function(optionList) {
                        var formattedList = [];
                        for (var i = 0; i < optionList.length; i++ ) {
                            formattedList.push(optionList[optionList[i]]);
                        }
                        return formattedList;
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
                    formatOptionList = function(optionList) {
                        return optionList;
                    };
                    break;
                case 'witness':
                    optionList     = [];
                    dataSource     = parsedData.getWitnesses();
                    callback = function(option) {
                        optionSelected = option;
                        _console.log('witness select callback ' + option.label);
                    };
                    changeRoute = function(option) {
                        //TODO: dovrò avere un parametro "multiplo" che mi salva tutti i testimoni visualizzati, 
                        //eventualmente nell'esatto ordine in cui sono visualizzati
                        var selectors = select.getList(),
                            witIds = '#',
                            witSelect;
                        angular.forEach(selectors, function(currentSelect) {
                            if (currentSelect.type === 'witness') {
                                witSelect = select.getById(currentSelect.id);
                                if (witSelect.optionSelected !== undefined) {
                                    witIds += witSelect.optionSelected.value+'#';
                                }
                            }
                        });

                        var url = '/' + $routeParams.pageId + '/' + $routeParams.docId + '/' + witIds;
                        // $location.path( url );
                    };
                    formatOptionList = function(optionList) {
                        var formattedList = [];
                        for (var i = 0; i < optionList.length; i++ ) {
                            var option,
                                currentOption = optionList[optionList[i]];
                            if ( currentOption.type === 'witness' ) {
                                option = {
                                    value : currentOption.id,
                                    label : currentOption.id,
                                    title : currentOption.name,
                                }
                                formattedList.push(option);
                            } else {
                                for (var j = 0; j < currentOption.content.length; j++ ) {
                                    var currentSubOpt = currentOption.content[currentOption.content[j]];
                                    option = {
                                        value : currentSubOpt.id,
                                        label : currentSubOpt.id,
                                        title : currentSubOpt.name,
                                    }
                                    formattedList.push(option);
                                }
                            }
                        }
                        return formattedList;
                    };
                    break;
            }

            scopeHelper = {
                // expansion
                uid                    : currentId,
                defaults               : angular.copy(defaults),
                callback               : callback,
                changeRoute            : changeRoute,
                getOptionSelectedValue : getOptionSelectedValue,
                // model
                optionList             : optionList,
                dataSource             : dataSource,
                optionSelected         : optionSelected,
                formatOptionList       : formatOptionList
            };

            collection[currentId] = angular.extend(vm, scopeHelper);
            list.push({
                id   : currentId,
                type : currentType
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