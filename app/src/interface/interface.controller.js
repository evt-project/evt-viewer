angular.module('evtviewer.interface')

.controller('InterfaceCtrl', function($log, resolvedNav) {
    var _console = $log.getInstance('interface');
    
    _console.log(resolvedNav);

    _console.log('InterfaceCtrl running');
});