/**
 * @name evtviewer.mobile
 */

angular.module('evtviewer.mobile')

.provider('mobile', function() {
    var defaults = this.defaults;

    this.setDefaults = function(_defaults) {
        defaults = _defaults;
    };

    this.$get = ['$log', function($log) {

        var mobile = {};
        var _console = $log.getInstance('mobile');

        var state = {
            currentView: 'image'
        };

        var stateEditionDipl= {
            currentEditionDipl: 'diplomatic'
        };

        var stateEditionInt= {
            currentEditionInt: 'interpretative'
        };

        mobile.getState = function() {
            return state;
        };

        mobile.getStateEditionDipl = function() {
            return stateEditionDipl;
        };

        mobile.getStateEditionInt = function() {
            return stateEditionInt;
        };

        mobile.getCurrentView = function() {
            return state.currentView;
        };

        mobile.getCurrentEditionDipl = function() {
            return stateEditionDipl.currentEditionDipl;
        };

        mobile.getCurrentEditionInt = function() {
            return stateEditionInt.currentEditionInt;
        };

        mobile.switchView = function(view) {
            state.currentView = view;
            _console.log('Switch of current view in: ' + view);
        };

        mobile.switchEditionDipl = function(editionDipl) {
            stateEditionDipl.currentEditionDipl = editionDipl;
            _console.log('Switch of current edition in: ' + editionDipl);
        };

        mobile.switchEditionInt = function(editionInt) {
            stateEditionInt.currentEditionInt = editionInt;
            _console.log('Switch of current edition in: ' + editionInt);
        };

        return mobile;
    }];

});