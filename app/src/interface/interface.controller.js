angular.module('evtviewer.interface')

.controller('InterfaceCtrl', function($log, $injector, $scope, $route, evtInterface) {    
    var _console = $log.getInstance('interface');

    $scope.state = { 
        currentViewMode : evtInterface.getCurrentViewMode(),
        currentPage     : evtInterface.getCurrentPage(),
        currentDoc      : evtInterface.getCurrentDocument(),
        currentEdition  : evtInterface.getCurrentEdition(),
        currentWits     : evtInterface.getCurrentWitnesses()
    };
    $scope.availableViewModes = evtInterface.getAvailableViewModes();
    // =========================================== //
    // !! TODO                                  !! //
    // !! Questi watchers andrebbero tolti,     !! //
    // !! ma se li tolgo non funziona più nulla !! //
    // !! HELP                                  !! //
    // =========================================== //
    $scope.$watch(function() {
        return evtInterface.getCurrentViewMode();
    }, function(newItem, oldItem) {
        $scope.state.currentViewMode = newItem;
    }, true); 

    $scope.$watch(function() {
        return evtInterface.getCurrentPage();
    }, function(newItem, oldItem) {
        $scope.state.currentPage = newItem;
    }, true); 
    
    $scope.$watch(function() {
        return evtInterface.getCurrentDocument();
    }, function(newItem, oldItem) {
        $scope.state.currentDoc = newItem;
    }, true); 

    $scope.$watch(function() {
        return evtInterface.getCurrentEdition();
    }, function(newItem, oldItem) {
        $scope.state.currentEdition = newItem;
    }, true); 

    $scope.$watch(function() {
        return evtInterface.getCurrentWitnesses();
    }, function(newItem, oldItem) {
        $scope.state.currentWits = newItem;
    }, true); 

    _console.log('InterfaceCtrl running');
});