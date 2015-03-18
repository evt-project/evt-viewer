angular.module('evtviewer.mobile')

.service('Mobile', function(BaseComponent) {
    var mobile = new BaseComponent('Mobile');

    var state = {
        currentView: 'texttext'
    };

    mobile.getState = function() {
        return state;
    };

    mobile.getCurrentView = function() {
        return state.currentView;
    };

    mobile.switchView = function(view) {
        state.currentView = view;
    };

    return mobile;
});