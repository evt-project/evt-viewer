angular.module('evtviewer.rune')

.constant('RUNEDEFAULTS', {

})

.config(function(evtRuneProvider, configProvider, RUNEDEFAULTS) {
    var defaults = configProvider.makeDefaults('rune', RUNEDEFAULTS);
    evtRuneProvider.setDefaults(defaults);
});
