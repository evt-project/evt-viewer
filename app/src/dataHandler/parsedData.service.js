angular.module('evtviewer.dataHandler')

.service('parsedData', function($log) {
    var parsedData = {};
    var _console = $log.getInstance('dataHandler');

    // TODO manage unique value for pages, documents and editions

    var pagesCollection = []; // {value: 'page', label: 'page label', title: 'page title'}

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

    var mockText1 = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc,';

    parsedData.getText = function (){
        return mockText1;
    };

    parsedData.getPages = function() {
        return pagesCollection;
    };

    // TODO: add attribute for the original xml reference
    parsedData.addPage = function(value, label, title) {
        pagesCollection.push({
            value: value,
            label: label,
            title: title
        });
        _console.log('parsedData - addPage ' + value);
    };

    parsedData.getDocuments = function() {
        return mockDocuments;
    };

    parsedData.addDocuments = function() {
        var mock = {
            value: 'document3',
            label: 'document3 label',
            title: 'document3 title'
        };
        mockDocuments.push(mock);
    };

    parsedData.getEditions = function() {
        return mockEditions;
    };

    parsedData.addEditions = function() {
        var mock = {
            value: 'edition3',
            label: 'edition3 label',
            title: 'edition3 title'
        };
        mockEditions.push(mock);
    };

    return parsedData;
});