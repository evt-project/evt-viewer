angular.module('evtviewer.parser')

.service('Parser', function(BaseComponent) {
    var parser = new BaseComponent('Parser');

    return parser;
});