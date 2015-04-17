angular.module('evtviewer.dataHandler')

.service('parsedData', function($log) {
    var parsedData = {};
    var _console = $log.getInstance('dataHandler');

    // TODO manage unique value for pages, documents and editions

    var pagesCollection = []; // {value: 'page', label: 'page label', title: 'page title'}
    var documentsCollection = []; // {value: 'document', label: 'document label', title: 'document title'}
    
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
    
    var mockText2 = [{
        title: 'Lorem ipsum',
        page: '104v',
        content: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc,',
    }, {
        title: 'Cicero',
        page: '105r',
        content: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur? At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere',
    }, {
        title:'Li Europan lingues',
        page: '105v',
        content: 'Li Europan lingues es membres del sam familie. Lor separat existentie es un myth. Por scientie, musica, sport etc, litot Europa usa li sam vocabular. Li lingues differe solmen in li grammatica, li pronunciation e li plu commun vocabules. Omnicos directe al desirabilite de un nov lingua franca: On refusa continuar payar custosi traductores. At solmen va esser necessi far uniform grammatica, pronunciation e plu sommun paroles. Ma quande lingues coalesce, li grammatica del resultant lingue es plu simplic e regulari quam ti del coalescent lingues. Li nov lingua franca va esser plu simplic e regulari quam li existent Europan lingues. It va esser tam simplic quam Occidental in fact, it va esser Occidental. A un Angleso it va semblar un simplificat Angles, quam un skeptic Cambridge amico dit me que Occidental es.Li Europan lingues es membres del sam familie. Lor separat existentie es un myth. Por scientie, musica, sport etc, litot Europa usa li sam vocabular. Li lingues differe solmen in li grammatica, li pronunciation e li plu commun vocabules. Omnicos directe al desirabilite de un nov lingua franca: On refusa continuar payar custosi traductores. At solmen va esser necessi far uniform grammatica, pronunciation e plu sommun paroles.',
    }];

    var mockThumb1 = [{
        id: '104v',
        url: 'http://i62.tinypic.com/f20hts.jpg',
    }, {
        id: '105r',
        url: 'http://i57.tinypic.com/312i5c9.jpg',
    }, {
        id: '105v',
        url: 'http://i58.tinypic.com/6jkie1.jpg',
    }, {
        id: '106r',
        url: 'http://i58.tinypic.com/29zvtyt.jpg',
    }, {
        id: '133v',
        url: 'http://i62.tinypic.com/f20hts.jpg',
    }, {
        id: '134r',
        url: 'http://i57.tinypic.com/312i5c9.jpg',
    }, {
        id: '134v',
        url: 'http://i58.tinypic.com/6jkie1.jpg',
    }, {
        id: '135r',
        url: 'http://i58.tinypic.com/29zvtyt.jpg',
    }, {
        id: '135v',
        url: 'http://i62.tinypic.com/f20hts.jpg',
    }, {
        id: '136r',
        url: 'http://i57.tinypic.com/312i5c9.jpg',
    }, {
        id: '136v',
        url: 'http://i58.tinypic.com/6jkie1.jpg',
    }, {
        id: '137r',
        url: 'http://i58.tinypic.com/29zvtyt.jpg',
    }];

    var mockSearchLetters = ['á','ā','Ā','æ','Æ','ǣ','ǽ','ƀ','đ','ð','Đ','é','ē','ę','ḡ','Ḡ','ħ','í','ł','ó','õ','þ','Þ','ƿ','ꞅ','ú','ý','ẏ'];

    var mockSearchFilters = [{
        id:'option1',
        content:'Option 1',
    }, {
        id:'option2',
        content:'Option 2',
    }, {
        id:'option3',
        content:'Option 3',
    }, {
        id:'option4',
        content:'Option 4',
    }, {
        id:'option5',
        content:'Option 5',
    }, {
        id:'option6',
        content:'Option 6',
    }];

    parsedData.getText = function (){
        return mockText1;
    };

    parsedData.getText2 = function (){
        return mockText2;
    };


    parsedData.getThumb = function (){
        return mockThumb1;
    };

    parsedData.getSearchLetters = function (){
        return mockSearchLetters;
    };

    parsedData.getSearchFilters = function (){
        return mockSearchFilters;
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
        return documentsCollection;
    };

    parsedData.addDocuments = function(value, label, title) {
        documentsCollection.push({
            value: value,
            label: label,
            title: title
        });
        _console.log('parsedData - addDocument ' + value);
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