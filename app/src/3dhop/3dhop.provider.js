/**
 * @ngdoc service
 * @module evtviewer.3dhop
 * @name evtviewer.3dhop.evtTreDHOP
 * @description 
 * # evtTreDHOP
 * This provider expands the scope of the
 * {@link evtviewer.3dhop.directive:evtTreDHOP evtTreDHOP} directive 
 * and stores its reference untill the directive remains instantiated.
 *
 * @requires $log
 * @requires evtviewer.interface.evtInterface
 * @requires evtviewer.core.config
 * @requires evtviewer.dataHandler.parsedData
**/
angular.module('evtviewer.3dhop')

.provider('evtTreDHOP', function() {

    this.$get = function($timeout, parsedData) {

    }
	
});