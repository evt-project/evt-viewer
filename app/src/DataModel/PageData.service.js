angular.module('evtviewer.dataModel')

.service('PageData', function(BaseComponent) {
    var pageData = new BaseComponent('PageData');

    return pageData;
});