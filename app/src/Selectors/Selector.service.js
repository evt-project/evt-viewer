angular.module('evtviewer.selector')
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
.service('selector', function($rootScope, BaseComponent, SELECTORDEFAULTS) {
	var selector = new BaseComponent('Selector', SELECTORDEFAULTS);

	var focusedName = '';

	/*** OPTION CONTAINER ***/
	// Toggle option container
	selector.setFocused = function(name){
		if (focusedName === name) {
			focusedName = '';
		} else {
			focusedName = name;
		}
	};

	selector.getFocusedName = function(){
		return focusedName;
	};

	selector.log('Service running');

	return selector;
});
