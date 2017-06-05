angular.module('evtviewer.select')

.provider('evtSelect', function() {

    var defaults = this.defaults;

    this.setDefaults = function(_defaults) {
        defaults = _defaults;
    };

    this.$get = function($log, config, parsedData, evtInterface, evtNamedEntityRef) {
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
                openUp      = scope.openUp || false,
                multiselect = scope.multiselect || false,
                optionList  = [],
                optionSelected,
                optionSelectedValue,
                callback,
                formatOptionList,
                formatOption,
                marginTop = 0; //Needed for selector that open up
            
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
                            var currentDocument = evtInterface.getCurrentDocument();
                            evtInterface.updateCurrentPage(newOption.value);
                            if ( newOption.docs.length > 0 && newOption.docs.indexOf(currentDocument) < 0 ) { // The page is not part of the document
                                evtInterface.updateCurrentDocument(newOption.docs[0]);
                            }
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
                            var currentPage = evtInterface.getCurrentPage();
                            evtInterface.updateCurrentDocument(newOption.value);
                            if ( newOption.pages.length > 0 && newOption.pages.indexOf(currentPage) < 0 ) { // The page is not part of the document
                                evtInterface.updateCurrentPage(newOption.pages[0]);
                            }
                            evtInterface.updateUrl();
                        }                        
                    };
                    formatOptionList = function(optionList) {
                        var formattedList = [];
                        for (var i = 0; i < optionList._indexes.length; i++ ) {
                            formattedList.push(optionList[optionList._indexes[i]]);
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
                case 'named-entities': 
                    optionSelectedValue = initValue;
                    var optionSelectAll = {
                            value : 'ALL',
                            label : 'Select All',
                            title : 'Select All Named Entities'
                        };
                    callback = function(oldOption, newOption) {
                        if (newOption !== undefined){
                            _console.log('Named Entities select callback ', newOption);
                            vm.selectOption(newOption);
                            if (newOption.value === 'ALL') {
                                // SELECT ALL OPTIONS
                                var optionListLength = optionList && optionList.length > 3 ? optionList.length-2 : 0; 
                                for (var i = 0; i < optionListLength; i++) {
                                    var optionToSelect = optionList[i];
                                    if (!vm.isOptionSelected(optionToSelect)) {
                                        vm.selectOption(optionToSelect);
                                        evtNamedEntityRef.addActiveType(optionToSelect.value);
                                    }
                                }
                                vm.selectOption(newOption);
                            } else if (newOption.value === 'NONE') {
                                // CLEAR SELECTION
                                var optionSelected = vm.optionSelected ? vm.optionSelected : []; 
                                for (var j = 0; j < optionSelected.length; j++) {
                                    var option = optionList[j];
                                    if (option.value !== 'ALL') {
                                        evtNamedEntityRef.removeActiveType(option.value);
                                    }
                                }
                                vm.optionSelected = [];
                                vm.selectOption(newOption);
                            } else {
                                if (vm.isOptionSelected(newOption)) {
                                    evtNamedEntityRef.addActiveType(newOption.value);
                                } else {
                                    evtNamedEntityRef.removeActiveType(newOption.value);
                                }
                            }
                        }
                    };

                    formatOptionList = function(optionList) {
                        var formattedList = [];
                        for (var i = 0; i < optionList.length; i++ ) {
                            var currentOption = optionList[i];
                            if (currentOption.available) {
                                var option = {
                                        icon  : 'fa-circle',
                                        value : currentOption.tagName,
                                        label : currentOption.label,
                                        title : currentOption.label
                                    };
                                formattedList.push(option);
                            }
                        }
                        formattedList.push(optionSelectAll);
                        formattedList.push({
                            value : 'NONE',
                            label : 'Clear',
                            title : 'Clear Selection'
                        });
                        return formattedList;
                    };

                    formatOption = function(option) {
                        return option;
                    };
                    optionList = formatOptionList(config.namedEntitiesToHandle);
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
            }

            if (openUp) {
                marginTop = optionList.length * 34; //34px is the height of each option
                marginTop += 28; //28px is the height of the selector itself when closed
                marginTop += 4; //4px is the margin I want between selector and option list 
                marginTop = -marginTop;
            }

            scopeHelper = {
                // expansion
                uid                    : currentId,
                defaults               : angular.copy(defaults),
                callback               : callback,
                initValue              : initValue,
                currentType            : currentType,
                multiselect            : multiselect,
                openUp                 : openUp,
                marginTop              : 'margin-top:'+marginTop+'px',
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