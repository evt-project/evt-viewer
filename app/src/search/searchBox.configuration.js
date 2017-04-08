angular.module('evtviewer.search')

.constant('SEARCHDEFAULTS', {
	
})

.config(function(evtSeachBox, configProvider,
				 SEARCHDEFAULTS) {
	var defaults = configProvider.makeDefaults('search', SEARCHDEFAULTS);
    evtSearchProvider.setDefaults(defaults);
});