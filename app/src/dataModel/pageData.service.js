angular.module('evtviewer.dataModel')

.service('PageData', function(BaseComponent) {
    var pageData = new BaseComponent('PageData');

    var mock = [{
        value: 'page1',
        label: 'page1 label',
        title: 'page1 title'
    }, {
        value: 'page2',
        label: 'page2 label',
        title: 'page2 title'
    }];

    pageData.getPages = function() {
        return mock;
    };

    pageData.addPage = function() {
        var pageMock = {
            value: 'page3',
            label: 'page3 label',
            title: 'page3 title'
        };
        mock.push(pageMock);
    }

    return pageData;
});