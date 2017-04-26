angular.module('evtviewer.select')

.provider('evtSelect', function() {

    var defaults = this.defaults;

    this.setDefaults = function(_defaults) {
        defaults = _defaults;
    };

    this.$get = function($log, parsedData, evtInterface, evtSourcesApparatus) {
        var select     = {},
            collection = {},
            list       = [],
            idx        = 0;

        var _console = $log.getInstance('select');

        // 
        // Select builder
        // 
        
        select.build = function(scope, vm) {
            var currentId   = scope.id   || idx++,
                currentType = scope.type || 'default',
                initValue   = scope.init || undefined,
                optionList  = [],
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
                    callback = function(oldOption, newOption) {
                        _console.log('page select callback ', newOption);
                        if (newOption !== undefined){
                            vm.selectOption(newOption);
                            evtInterface.updateCurrentPage(newOption.value);
                            evtInterface.updateUrl();
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
                    optionList = formatOptionList(parsedData.getPages());
                    break;
                case 'document':
                    callback = function(oldOption, newOption) {
                        // _console.log('document select callback ', newOption);
                        if (newOption !== undefined){
                            vm.selectOption(newOption);
                            evtInterface.updateCurrentDocument(newOption.value);
                            evtInterface.updateUrl();
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
                    optionList = formatOptionList(parsedData.getDocuments());
                    break;
                case 'edition':
                    callback = function(oldOption, newOption) {
                        if (newOption !== undefined){
                            vm.selectOption(newOption);
                            evtInterface.updateCurrentEdition(newOption.value);
                            evtInterface.updateUrl();
                        }
                    };
                    formatOptionList = function(optionList) {
                        return optionList;
                    };
                    formatOption = function(option) {
                        return option;
                    };
                    optionList = formatOptionList(parsedData.getEditions());         
                    break;
                case 'witness':
                    optionSelectedValue = initValue;
                    callback = function(oldOption, newOption) {
                        vm.collapse();
                        if (oldOption !== undefined) {
                            if (newOption !== undefined) {
                                evtInterface.switchWitnesses(oldOption.value, newOption.value);
                                evtInterface.updateUrl();
                            }
                        } else if (newOption !== undefined) {
                            evtInterface.addWitness(newOption.value);
                            evtInterface.updateUrl();
                        }
                    };
                    formatOptionList = function(optionList) {
                        var formattedList = [],
                            witnesses     = optionList._indexes.witnesses;
                        for (var i = 0; i < witnesses.length; i++ ) {
                            var currentOption = optionList[witnesses[i]];
                            var option = {
                                    value : currentOption.id,
                                    label : currentOption.id,
                                    title : currentOption.description
                                };
                            formattedList.push(option);
                        }
                        return formattedList;
                    };
                    formatOption = function(option) {
                        var formattedOption = {};
                        formattedOption = {
                            value : option.id,
                            label : option.id,
                            title : option.description
                        };
                        return formattedOption;
                    };  
                    optionList = formatOptionList(parsedData.getWitnesses());
                    break;                
                case 'witness-page':
                    var witness = scope.$parent.vm.witness;
                    optionSelectedValue = initValue;
                    callback = function(oldOption, newOption) {
                        if (newOption !== undefined) {
                            vm.selectOption(newOption);
                            evtInterface.updateWitnessesPage(witness, newOption.value.split('-')[1]);
                            evtInterface.updateUrl();
                            scope.$parent.vm.scrollToPage(newOption.value);
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
                    optionList = formatOptionList(parsedData.getWitnessPages(witness));                  
                    break;
                /*Case added By CM*/
                case 'source':
                    callback = function(oldOption, newOption) {
                        if (newOption !== undefined) {
                            vm.selectOption(newOption);
                            evtInterface.updateCurrentSourceText(newOption.value);
                            evtInterface.updateCurrentSource(newOption.value);
                        }
                    }
                     formatOptionList = function(optionList) {
                        var formattedList = [];
                        for (var i = 0; i < optionList.length; i++) {
                            var currentOption = optionList[i];
                            var option = {
                                value : currentOption.id,
                                label : evtSourcesApparatus.getSourceAbbr(currentOption),
                                title : 'See full text'
                            };
                            formattedList.push(option);
                        }
                        return formattedList;
                    }
                    formatOption = function(option) {
                        var formattedOption = {};
                        formattedOption = {
                            value : option.id,
                            label : evtSourcesApparatus.getSourceAbbr(option),
                            title : 'See full text'
                        };
                        return formattedOption;
                    }
                    optionList = formatOptionList(parsedData.getSources()._indexes.availableTexts);
                    break;
            }

            scopeHelper = {
                // expansion
                uid                    : currentId,
                defaults               : angular.copy(defaults),
                callback               : callback,
                initValue              : initValue,
                currentType            : currentType,

                // model
                optionList             : optionList,
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

        select.destroy = function(tempId) {
            delete collection[tempId];
        };
        return select;
    };

});