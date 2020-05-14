/**
 * @ngdoc service
 * @module evtviewer.rune
 * FS
**/
angular.module('evtviewer.rune')

.provider('evtRune', function() {

	var defaults = this.defaults;

	this.setDefaults = function(_defaults) {
		defaults = _defaults;
	};

	this.$get = function(parsedData, $log, evtInterface) {
		var evtRune = {}
			collection = {},
			list = [],
			idx = 0;

      var _console = $log.getInstance('evtRune');
      evtRune.build = function(scope) {

      };
     return evtRune;
	};
});
