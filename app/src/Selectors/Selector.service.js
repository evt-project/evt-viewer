angular.module('evtviewer.Selector')

// TODO: add default expanded, add default width, etc.
.constant('SELECTORDEFAULTS', {
    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#Dashboard.containerHeight
     *
     * @description
     * `number`
     *
     * Dashboard default height
     *
     * Default value:
     * <pre> containerHeight: 300 </pre>
     */
    containerMaxHeight: 170
})

.service('Selector', function($rootScope, BaseComponent, SELECTORDEFAULTS) {
    var selector = new BaseComponent('Selector', SELECTORDEFAULTS);

    var state = {
        selectors: []
    };

    var focusedName = '';

    /*** OPTION CONTAINER ***/
    // Toggle option container
    selector.setFocused = function(name) {
        if (focusedName === name) {
            focusedName = '';
        } else {
            focusedName = name;
        }
    };

    selector.getFocusedName = function() {
        return focusedName;
    };

    selector.addReference = function(scope) {
        var currentTitle = scope.title;

        if (typeof(state.selectors[currentTitle]) === 'undefined') {
            state.selectors[currentTitle] = {
                title: currentTitle
                    // expanded, width, optionSelected, options
            };
        }
    };

    selector.log('Service running');

    return selector;
});