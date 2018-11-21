/**
 * @ngdoc object
 * @module evtviewer.toc
 * @name evtviewer.toc.controller:TocCtrl
 * @description
 * # TocCtrl
 * This is the controller for the {@link evtviewer.toc.directive:evtToc evtToc} directive.
 * @requires $log
 * @requires $scope
 * @requires evtviewer.dataHandler.parsedData
 * @requires evtviewer.interface.evtInterface
**/
angular.module('evtviewer.toc')

.controller('TocCtrl', function($log, $scope, parsedData, evtInterface) {
    var _console = $log.getInstance('toc');

    

    _console.log('TocCtrl running');
});
