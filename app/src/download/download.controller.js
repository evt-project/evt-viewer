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

    this.selectDoc = function(docIndex) {
        vm.currentDocIndex = docIndex;
        vm.currentFormat = Object.keys(vm.files[docIndex].formats)[0];
        vm.openedSelector = '';
    }
    
    this.selectFormat = function(format) {
        vm.currentFormat = format;
        vm.openedSelector = '';
    }

    this.toggleSelector = function(selector) {
        vm.openedSelector = vm.openedSelector === selector ? '' : selector;
    }

    _console.log('DownloadCtrl running');
});
