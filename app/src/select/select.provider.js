angular.module('evtviewer.select')

.provider('evtSelect', function() {

    var defaults = this.defaults;

    this.setDefaults = function(_defaults) {
        defaults = _defaults;
    };

    this.$get = function($log, $location, $routeParams, parsedData, $rootScope, evtInterface) {
        var select     = {},
            collection = {},
            list       = [],
            idx        = 0;

        var _console = $log.getInstance('select');

        // 
        // Select builder
        // 

        select.build = function(scope, vm) {
            var currentId   = scope.id      || idx++,
                currentType = scope.type    || 'default',
                currentWit  = scope.witness || undefined,
                optionList  = [],
                dataSource  = '',
                optionSelected,
                optionSelectedValue,
                callback,
                formatOptionList,
                formatOption;
            
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
                    callback = function(oldOption, newOption) {
                        // optionSelected = option;
                        _console.log('page select callback ', newOption);
                        if (newOption !== undefined){
                            vm.selectOption(newOption);
                            evtInterface.updateCurrentPage(newOption.value);
                        }                        
                    };
                    formatOptionList = function(optionList) {
                        var formattedList = [];
                        for (var i = 0; i < optionList.length; i++ ) {
                            formattedList.push(optionList[optionList[i]]);
                        }
                        return formattedList;
                    };
                    formatOption = function(option) {
                        return option;
                    };

                    break;
                case 'document':
                    optionList = parsedData.getDocuments();
                    dataSource = parsedData.getDocuments();
                    callback = function(oldOption, newOption) {
                        _console.log('document select callback ', newOption);
                        if (newOption !== undefined){
                            vm.selectOption(newOption);
                            evtInterface.updateCurrentDocument(newOption.value);
                        }                        
                    };
                    formatOptionList = function(optionList) {
                        var formattedList = [];
                        for (var i = 0; i < optionList.length; i++ ) {
                            formattedList.push(optionList[optionList[i]]);
                        }
                        return formattedList;
                    };
                    formatOption = function(option) {
                        return option;
                    };
                    break;
                case 'edition':
                    optionList = parsedData.getEditions();
                    optionList     = [];
                    dataSource     = parsedData.getEditions();
                    optionSelected = optionList[0];
                    callback = function(oldOption, newOption) {
                        if (newOption !== undefined){
                            vm.selectOption(newOption);
                            evtInterface.updateCurrentEdition(newOption.value);
                        }
                    };
                    formatOptionList = function(optionList) {
                        return optionList;
                    };
                    formatOption = function(option) {
                        return option;
                    };                    
                    break;
                case 'witness':
                    optionList          = [];
                    dataSource          = parsedData.getWitnesses();
                    optionSelectedValue = currentWit;
                    callback = function(oldOption, newOption) {
                        vm.collapse();
                        if (oldOption !== undefined) {
                            if (newOption !== undefined) {
                                evtInterface.switchWitnesses(oldOption.value, newOption.value);
                            }
                        } else if (newOption !== undefined) {
                            evtInterface.addWitness(newOption.value);
                        }
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
                                    title : currentOption.name
                                };
                                formattedList.push(option);
                            } else {
                                for (var j = 0; j < currentOption.content.length; j++ ) {
                                    var currentSubOpt = currentOption.content[currentOption.content[j]];
                                    option = {
                                        value : currentSubOpt.id,
                                        label : currentSubOpt.id,
                                        title : currentSubOpt.name
                                    };
                                    formattedList.push(option);
                                }
                            }
                        }
                        return formattedList;
                    };
                    formatOption = function(option) {
                        var formattedOption = {};
                        formattedOption = {
                            value : option.id,
                            label : option.id,
                            title : option.name
                        };
                        return formattedOption;
                    };                    
                    break;                
                case 'witness-page':
                    optionList = [];
                    dataSource = parsedData.getWitnessPages(currentWit);                    
                    // TODO: add a general service for the current page in the application
                    // optionSelected = optionList[0]; how to take the reference to a undefined element?
                    callback = function(oldOption, newOption) {
                        if (newOption !== undefined) {
                            vm.selectOption(newOption);
                            evtInterface.updateWitnessesPage(currentWit, newOption.value);
                        }
                    };
                    formatOptionList = function(optionList) {
                        var formattedList = [];
                        for (var i = 0; i < optionList.length; i++ ) {
                            formattedList.push(optionList[optionList[i]]);
                        }
                        return formattedList;
                    };
                    formatOption = function(option) {
                        return option;
                    };                    
                    break;
            }

            scopeHelper = {
                // expansion
                uid                    : currentId,
                defaults               : angular.copy(defaults),
                callback               : callback,
                currentWit             : currentWit,

                // model
                optionList             : optionList,
                dataSource             : dataSource,
                optionSelected         : optionSelected,
                optionSelectedValue    : optionSelectedValue,
                formatOptionList       : formatOptionList,
                formatOption           : formatOption
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