/**
 * @ngdoc object
 * @module evtviewer.download
 * @name evtviewer.download.controller:DownloadCtrl
 * @description
 * # DownloadCtrl
 * This is the controller for the {@link evtviewer.download.directive:evtDownload evtDownload} directive.
 * @requires $log
**/
angular.module('evtviewer.download')

.controller('DownloadCtrl', function($log) {
    var _console = $log.getInstance('download');

    var vm = this;

    _console.log('DownloadCtrl running');
});
