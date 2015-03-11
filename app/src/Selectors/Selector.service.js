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
        selectors: []
    };


    selector.addReference = function(scope) {
        var currentTitle = scope.title;
        if (typeof(state.selectors[currentTitle]) === 'undefined') {
            state.selectors[currentTitle] = {
                title: currentTitle,
                expanded: selector.options.defaultExpanded,
                elementWidth: selector.options.defaultWidth,
                optionSelected: selector.options.defaultOptionSelected,
                optionList: []
                    // expanded, width, optionSelected, options
            };
        }
    };

    selector.getReference = function(currentId) {
        if (state.selectors[currentId] !== 'undefined') {
            return state.selectors[currentId];
        }
    };

    selector.toggleExpand = function(currentId) {
        if (state.selectors[currentId] !== 'undefined') {
            
            angular.forEach(state.selectors, function(item) {
                selector.log('State BEFORE for '+item.title+': '+item.expanded);
                item.expanded = false;
                selector.log('State AFTER for '+item.title+': '+item.expanded);
            });

            selector.log('State BEFORE for '+currentId+': '+state.selectors[currentId].expanded);
            state.selectors[currentId].expanded = !state.selectors[currentId].expanded;
            //$rootScope.$$phase || $rootScope.$digest();
            selector.log('State AFTER for '+currentId+': '+state.selectors[currentId].expanded);
        }
    };

    selector.selectOption = function(scope, option) {
        var currentId = scope.title;
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