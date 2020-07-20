angular.module('evtviewer.dialog')

.constant('DIALOGDEFAULTS', {

})

.config(['evtDialogProvider', 'configProvider', 'DIALOGDEFAULTS', function(evtDialogProvider, configProvider, DIALOGDEFAULTS) {
    var defaults = configProvider.makeDefaults('dialog', DIALOGDEFAULTS);
    evtDialogProvider.setDefaults(defaults);
}]);