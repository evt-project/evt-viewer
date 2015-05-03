/**
 * @name evtviewer.mobile
 */

angular.module('evtviewer.mobile')

.provider('mobile', function() {
    var defaults = this.defaults;

    this.setDefaults = function(_defaults) {
        defaults = _defaults;
    };

    this.$get = function($log) {

        var mobile = {};
        var _console = $log.getInstance('mobile');

        var state = {
            currentView: 'image'
        };

        mobile.getState = function() {
            return state;
        };

        mobile.getCurrentView = function() {
            return state.currentView;
        };

        mobile.switchView = function(view) {
            state.currentView = view;
            _console.log('Switch of current view in: ' + view);
        };

        return mobile;
    };

});