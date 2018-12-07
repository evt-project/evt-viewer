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
    }
    
    this.selectFormat = function(format) {
        vm.currentFormat = format;
    }

    this.toggleSelector = function(selector) {
        var index = vm.openedSelectors.indexOf(selector);
        if (index < 0) {
            vm.openedSelectors.push(selector);
        } else {
            vm.openedSelectors.splice(index, 1);
        }
    }

    _console.log('DownloadCtrl running');
});
