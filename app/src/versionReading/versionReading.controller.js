angular.module('evtviewer.versionReading')

.controller('versionReadingCtrl', function($scope, parsedData, config) {
    var vm = this;

    this.isScopeRecensioAvailable = function() {
        var boxVersion = $scope.$parent.vm.version || '',
            availableVer = parsedData.getVersionEntries()[vm.appId].content,
            defaultVer = config.versions[0],
            isAvailable = true;
        if (boxVersion !== '' && boxVersion !== defaultVer) {
            if (availableVer[boxVersion] === undefined) {
                isAvailable = false;
            }
        } else {
            if (availableVer[defaultVer] === undefined) {
                isAvailable = false;
            }
        }
        return isAvailable;
    };
});