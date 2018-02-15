angular.module('evtviewer.dialog')

.constant('DIALOGDEFAULTS', {

})

.config(function(evtDialogProvider, configProvider, DIALOGDEFAULTS) {
    var defaults = configProvider.makeDefaults('dialog', DIALOGDEFAULTS);
    evtDialogProvider.setDefaults(defaults);
});