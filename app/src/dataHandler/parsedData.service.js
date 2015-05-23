angular.module('evtviewer.dataHandler')

.service('parsedData', function($log) {
    var parsedData = {};
    var _console = $log.getInstance('dataHandler');

    // TODO manage unique value for pages, documents and editions

    var pagesCollection = []; // {value: 'page', label: 'page label', title: 'page title'}
    var documentsCollection = []; // {value: 'document', label: 'document label', title: 'document title'}
    
    var pagesCollectionTexts = []; 
    // var mockDocuments = [{
    //     value: 'documents1',
    //     label: 'documents1 label',
    //     title: 'documents1 title'
    // }, {
    //     value: 'documents2',
    //     label: 'documents2 label',
    //     title: 'documents2 title'
    // }];

    var mockEditions = [{
        value: 'edition1',
        label: 'edition1 label',
        title: 'edition1 title'
    }, {
        value: 'edition2',
        label: 'edition2 label',
        title: 'edition2 title'
    }]; 

    var mockImage = 'http://i57.tinypic.com/k3b1mq.jpg';

    var mockImage1 = [{
        title: 'The Dream of the Rood',
        page: 'VB_fol_104v',
        page2: '104v',
        url:'http://i57.tinypic.com/k3b1mq.jpg',
    }, {
        title: 'The Dream of the Rood',
        page: 'VB_fol_105r',
        page2: '105r',
        url:'http://i61.tinypic.com/w1v6ag.jpg',
    }, {
        title: 'The Dream of the Rood',
        page: 'VB_fol_105v',
        page2: '105v',
        url:'http://i58.tinypic.com/k4wc41.jpg',
    }, {
        title: 'The Dream of the Rood',
        page: 'VB_fol_106r',
        page2: '106r',
        url:'http://i62.tinypic.com/99nbds.jpg',
    }];

    var mockBook1 = [{
        title: 'The Dream of the Rood',
        page: 'VB_fol_104v - VB_fol_105r',
        url:'http://i59.tinypic.com/ajur7b.jpg',
    }, {
        title: 'The Dream of the Rood',
        page: 'VB_fol_105v - VB_fol_106r',
        url:'http://i62.tinypic.com/6ft8g2.jpg',
    }];

    var mockText1 = [{
        title: 'Lorem ipsum',
        page: 'VB_fol_104v',
        page2: '104v',
        diplomatic: '<evt-popover data-trigger="click" data-tooltip="Prova 2 testo in tooltip">Lorem ipsum dolor</evt-popover> sit amet, <strong>consectetuer</strong> adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, <evt-popover data-trigger="click" data-tooltip="Prova tooltip">fringilla vel</evt-popover>, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, <evt-popover data-trigger="click" data-tooltip="Prova tooltip">augue velit cursus nunc</evt-popover>.',
        interpretative: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc,',
    }, {
        title: 'Cicero',
        page: 'VB_fol_105r',
        page2: '105r',
        diplomatic: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur? At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere',
        interpretative: 'But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure? On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee',
    }, {
        title:'Far far away',
        page: 'VB_fol_105v',
        page2: '105v',
        diplomatic: 'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean. A small river named Duden flows by their place and supplies it with the necessary regelialia. It is a paradisematic country, in which roasted parts of sentences fly into your mouth. Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic life One day however a small line of blind text by the name of Lorem Ipsum decided to leave for the far World of Grammar. The Big Oxmox advised her not to do so, because there were thousands of bad Commas, wild Question Marks and devious Semikoli, but the Little Blind Text didn’t listen. She packed her seven versalia, put her initial into the belt and made herself on the way. When she reached the first hills of the Italic Mountains, she had a last view back on the skyline of her hometown Bookmarksgrove, the headline of Alphabet Village and the subline of her own road, the Line Lane. Pityful a rethoric question ran over her cheek',
        interpretative: 'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean. A small river named Duden flows by their place and supplies it with the necessary regelialia. It is a paradisematic country, in which roasted parts of sentences fly into your mouth. Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic life One day however a small line of blind text by the name of Lorem Ipsum decided to leave for the far World of Grammar. The Big Oxmox advised her not to do so, because there were thousands of bad Commas, wild Question Marks and devious Semikoli, but the Little Blind Text didn’t listen. She packed her seven versalia, put her initial into the belt and made herself on the way. When she reached the first hills of the Italic Mountains, she had a last view back on the skyline of her hometown Bookmarksgrove, the headline of Alphabet Village and the subline of her own road, the Line Lane. Pityful a rethoric question ran over her cheek',
    },{
        title:'Werther',
        page: 'VB_fol_106r',
        page2: '106r',
        diplomatic: 'A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart. I am alone, and feel the charm of existence in this spot, which was created for the bliss of souls like mine. I am so happy, my dear friend, so absorbed in the exquisite sense of mere tranquil existence, that I neglect my talents. I should be incapable of drawing a single stroke at the present moment; and yet I feel that I never was a greater artist than now. When, while the lovely valley teems with vapour around me, and the meridian sun strikes the upper surface of the impenetrable foliage of my trees, and but a few stray gleams steal into the inner sanctuary, I throw myself down among the tall grass by the trickling stream; and, as I lie close to the earth, a thousand unknown plants are noticed by me: when I hear the buzz of the little world among the stalks, and grow familiar with the countless indescribable forms of the insects and flies, then I feel the presence of the Almighty, who formed us in his own image, and the breath',
        interpretative: 'A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart. I am alone, and feel the charm of existence in this spot, which was created for the bliss of souls like mine. I am so happy, my dear friend, so absorbed in the exquisite sense of mere tranquil existence, that I neglect my talents. I should be incapable of drawing a single stroke at the present moment; and yet I feel that I never was a greater artist than now. When, while the lovely valley teems with vapour around me, and the meridian sun strikes the upper surface of the impenetrable foliage of my trees, and but a few stray gleams steal into the inner sanctuary, I throw myself down among the tall grass by the trickling stream; and, as I lie close to the earth, a thousand unknown plants are noticed by me: when I hear the buzz of the little world among the stalks, and grow familiar with the countless indescribable forms of the insects and flies, then I feel the presence of the Almighty, who formed us in his own image, and the breath',
    }];

    var mockThumb1 = [{
        id: 'VB_fol_104v',
        page: '104v',
        url: 'http://i62.tinypic.com/f20hts.jpg',
    }, {
        id: 'VB_fol_105r',
        page: '105r',
        url: 'http://i57.tinypic.com/312i5c9.jpg',
    }, {
        id: 'VB_fol_105v',
        page: '105v',
        url: 'http://i58.tinypic.com/6jkie1.jpg',
    }, {
        id: 'VB_fol_106r',
        page: '106r',
        url: 'http://i58.tinypic.com/29zvtyt.jpg',
    }];

    var mockThumbBook1 = [{
        id: 'VB_fol_104v - VB_fol_105r',
        page: '104v - 105r',
        url: 'http://i62.tinypic.com/2mpbyg8.jpg',
    }, {
        id: 'VB_fol_105v - VB_fol_106r',
        page: '105v - 106r',
        url: 'http://i60.tinypic.com/b97tx1.jpg',
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

    parsedData.getImage = function() {
        return mockImage;
    };

    parsedData.getImage1 = function (){
        return mockImage1;
    };

    parsedData.getBook1 = function (){
        return mockBook1;
    };

    parsedData.getText1 = function() {
        return mockText1;
    };

    parsedData.getThumb = function() {
        return mockThumb1;
    };

    parsedData.getThumbBook = function() {
        return mockThumbBook1;
    };

    parsedData.getSearchLetters = function() {
        return mockSearchLetters;
    };

    parsedData.getSearchFilters = function() {
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
        pagesCollectionTexts[value] = parsedData.getPageText(value);
        _console.log('parsedData - addPage ' + value);
    };
    parsedData.findPage = function(value) {
        var i = 0;
        while ( i < pagesCollection.length && pagesCollection[i].value !== value) {
            i++;
        }
        return pagesCollection[i];
    };


    parsedData.getPageText = function(pageId) {
        var texts = mockText1;

        var i = 0;
        while ( i < texts.length && texts[i].page !== pageId) {
            i++;
        }
        return texts[i];
    };

    parsedData.getPageImage = function(pageId) {
        var images = mockImage1;

        var i = 0;
        while ( i < images.length && images[i].page !== pageId) {
            i++;
        }
        return images[i];
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