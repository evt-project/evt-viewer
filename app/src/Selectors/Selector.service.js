angular.module('evtviewer.selector')

// TODO: add default expanded, add default width, etc.
.constant('SELECTORDEFAULTS', {

    defaultExpanded: false,

    defaultWidth: 150,

    defaultOptionSelected: {
        label: 'Select...',
        value: '--',
        title: 'Select...'
    },
    /* Container options Max Height */
    containerMaxHeight: 170
})

.service('Selector', function($rootScope, BaseComponent, SELECTORDEFAULTS) {
    var selector = new BaseComponent('Selector', SELECTORDEFAULTS);

    var state = {
        selectors: {}
    };


    selector.addReference = function(scope) {
        var currentId = scope.id;
        if (typeof(state.selectors[currentId]) === 'undefined') {
            state.selectors[currentId] = {
                id: currentId,
                expanded: selector.options.defaultExpanded,
                elementWidth: selector.options.defaultWidth,
                optionSelected: selector.options.defaultOptionSelected,
                optionList: []
                    // expanded, width, optionSelected, options
            };
            selector.populate(currentId);
        }
    };

    selector.getReference = function(currentId) {
        if (state.selectors[currentId] !== 'undefined') {
            return state.selectors[currentId];
        }
    };

    selector.addOption = function(currentId, option) {
        if (state.selectors[currentId] !== 'undefined') {
            state.selectors[currentId].optionList.push(option);
        }
    };

    /* GET MOCK DATA*/
    selector.populate = function(currentId) {
        var i = 0;
        var option = {};

        if (currentId === 'Pages') {
            for (i = 1; i <= 6; i++) {
                option = {
                    label: 'Page ' + i,
                    value: 'page' + i,
                    title: 'Page ' + i
                };
                selector.addOption(currentId, option);
            }
        } else if (currentId === 'Documents') {
            for (i = 1; i <= 5; i++) {
                option = {
                    label: 'Doc ' + i,
                    value: 'doc' + i,
                    title: 'Doc ' + i
                };
                selector.addOption(currentId, option);
            }
        } else if (currentId === 'EditionLevels') {
            for (i = 1; i <= 2; i++) {
                option = {
                    label: 'Level ' + i,
                    value: 'level' + i,
                    title: 'Level ' + i
                };
                selector.addOption(currentId, option);
            }
        }
    };

    // TODO: java way? :) do we really need it? 
    // selector.closeAll = function() {
    //     for (var sel in state.selectors) {
    //         state.selectors[sel].expanded = false;
    //     }
    // };

    selector.closeAll = function(skipId) {
        angular.forEach(state.selectors, function(currentSelector, currentId) {
            if (currentId !== skipId) {
                currentSelector.expanded = false;
            }
        });
    };

    selector.toggleExpand = function(currentId) {
        if (state.selectors[currentId] !== 'undefined') {
            selector.closeAll(currentId);
            state.selectors[currentId].expanded = !state.selectors[currentId].expanded;
        }
    };

    selector.selectOption = function(currentId, option) {
        if (state.selectors[currentId] !== 'undefined') {
            state.selectors[currentId].optionSelected = option;
            if (state.selectors[currentId].expanded === true) {
                selector.toggleExpand(currentId);
            }
        }
    };

    selector.getOptionSelected = function(currentId) {
        if (state.selectors[currentId] !== 'undefined') {
            return state.selectors[currentId].optionSelected;
        } else {
            return selector.options.defaultOptionSelected;
        }
    };

    selector.log('Service running');

    return selector;
});