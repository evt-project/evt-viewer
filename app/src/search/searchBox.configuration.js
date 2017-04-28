angular.module('evtviewer.search')

.constant('SEARCHDEFAULTS', {
   availableSearchBoxPositions : [
      'internal',
      'external'
   ],
	/**
     * @module evtviewerSearch
     * @ngdoc property
     * @name searchBoxPosition
     * @description
     * `property`
     *
     * Some info
     *
     * Default:
     * <pre>
     * searchBoxPosition: 'internal'
     * </pre>
     */
    searchBoxPosition: 'internal'
})

.config(function(evtSearchBoxProvider, configProvider,
				 SEARCHDEFAULTS) {
	var defaults = configProvider.makeDefaults('search', SEARCHDEFAULTS);
    evtSearchBoxProvider.setDefaults(defaults);
});
