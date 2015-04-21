angular.module('evtviewer.interface')

.controller('InterfaceCtrl', function($log, $scope, $route, evtInterface) {
    var _console = $log.getInstance('interface');
    
    // _console.log(resolvedNav);

    _console.log('InterfaceCtrl running');

    $scope.$on('$routeChangeSuccess', function() {
        var currentPage;
        currentPage = $route.current.params.pageId;
        evtInterface.updateCurrentPage(currentPage);
        console.log('#ROUTE CHANGE SUCCESS#', currentPage);
    });

});