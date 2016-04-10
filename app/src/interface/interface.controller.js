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
    
    $scope.getCurrentWitnessPage = function(wit) {
        return evtInterface.getCurrentWitnessPage(wit);
    };

    $scope.getAvailableViewModes = function() {
        return evtInterface.getAvailableViewModes();
    };
    
    $scope.existCriticalText = function() {
        return evtInterface.existCriticalText();
    };

    $scope.getCurrentAppEntry = function() {
        return evtInterface.getCurrentAppEntry();
    };

    $scope.updateCurrentAppEntry = function(entry) {
        console.log('updateCurrentAppEntry');
        evtInterface.updateCurrentAppEntry(entry);
        evtInterface.updateUrl();
    };

    $scope.getPinnedEntries = function() {
        return evtInterface.getPinnedEntries();
    };

    $scope.isLoading = function() {
        return evtInterface.isLoading();
    };

    $scope.isPinnedAppBoardOpened = function(){
        return evtInterface.isPinnedAppBoardOpened();
    };
    _console.log('InterfaceCtrl running');
})

//TODO: Move this directive in a proper file
.directive('ref', [function () {
    return {
        restrict: 'C',
        scope: {
            target : '@'
        },
        template: '<a href="{{target}}" ng-transclude></a>',
        replace: true,
        transclude: true,
        link: function (scope, iElement, iAttrs) {
            // scope.href = scope.target;
        }
    };
}]);