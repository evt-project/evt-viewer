angular.module('evtviewer.interface')

.controller('InterfaceCtrl', function($log, $scope, $route, evtInterface) {
    var _console = $log.getInstance('interface');
    
    // _console.log(resolvedNav);

    _console.log('InterfaceCtrl running');

    $scope.$on('$routeChangeSuccess', function() {
        var currentPage, currentText;
        currentPage = $route.current.params.pageId;
        // if( $route.current.params.pageId !== undefined ) {
        //     currentPage = $route.current.params.pageId;
        //     evtInterface.updateCurrentPage(currentPage);    
        //     console.log('#ROUTE CHANGE SUCCESS#', currentPage);
        // }
        
        currentText = $route.current.params.docId;
        // if ( $route.current.params.docId !== undefined ) {
        //     currentText = $route.current.params.docId;
        //     evtInterface.updateCurrentText(currentText);
        // }        

        evtInterface.updateParams(currentPage, currentText);
    });
});