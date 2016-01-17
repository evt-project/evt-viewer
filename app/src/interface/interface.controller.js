angular.module('evtviewer.interface')

.controller('InterfaceCtrl', function($log, $injector, $scope, $route, evtInterface) {    
    var _console = $log.getInstance('interface');

    $scope.getCurrentViewMode = function() {
        return evtInterface.getCurrentViewMode();
    };

    $scope.getCurrentPage = function() {
        return evtInterface.getCurrentPage();
    };

    $scope.getCurrentDocument = function() {
        return evtInterface.getCurrentDocument();
    };

    $scope.getCurrentEdition = function() {
        return evtInterface.getCurrentEdition();
    };

    $scope.getCurrentWitnesses = function() {
        return evtInterface.getCurrentWitnesses();
    };
    
    $scope.getAvailableViewModes = function(){
        return evtInterface.getAvailableViewModes();
    };
    
    _console.log('InterfaceCtrl running');
});