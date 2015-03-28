angular.module('evtviewer.dataModel')

.service('parsedData', function() {
    var parsedData = {};

    var mockPages = [{
        value: 'page1',
        label: 'page1 label',
        title: 'page1 title'
    }, {
        value: 'page2',
        label: 'page2 label',
        title: 'page2 title'
    }];

    var mockDocuments = [{
        value: 'documents1',
        label: 'documents1 label',
        title: 'documents1 title'
    }, {
        value: 'documents2',
        label: 'documents2 label',
        title: 'documents2 title'
    }];

    var mockEditions = [{
        value: 'edition1',
        label: 'edition1 label',
        title: 'edition1 title'
    }, {
        value: 'edition2',
        label: 'edition2 label',
        title: 'edition2 title'
    }];

    parsedData.getPages = function() {
        return mockPages;
    };

    parsedData.addPages = function() {
        var pageMock = {
            value: 'document3',
            label: 'document3 label',
            title: 'document3 title'
        };
        mock.push(pageMock);
    };

    parsedData.getDocuments = function() {
        return mockDocuments;
    };

    parsedData.addDocuments = function() {
        var pageMock = {
            value: 'document3',
            label: 'document3 label',
            title: 'document3 title'
        };
        mock.push(pageMock);
    };

    parsedData.getEditions = function() {
        return mockEditions;
    };

    parsedData.addEditions = function() {
        var pageMock = {
            value: 'edition3',
            label: 'edition3 label',
            title: 'edition3 title'
        };
        mock.push(pageMock);
    };

    return parsedData;
});