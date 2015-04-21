angular.module('evtviewer.interface')

.service('evtInterface', function(evtCommunication, config, $routeParams, evtSelect, evtBox, parsedData) {
    var mainInterface = {};

        mainInterface.boot = function() {        
            evtCommunication.getData(config.dataUrl).then(function () {
                if ( $routeParams.pageId !== undefined ) {
                    mainInterface.updateCurrentPage($routeParams.pageId);
                }
              });
        };

        mainInterface.getCurrentPage = function(){
            var pageSelector = evtSelect.getById('page');
            if ( pageSelector !== 'undefined' ){
                return pageSelector.optionSelected.value;
            }
        };

        mainInterface.getCurrentDocument = function() {
            // return state.currentDocument;
        };

        mainInterface.updateCurrentPage = function(pageId) {
            console.log('#evtInterface#', 'updating current page');
            var option = { },
                pageSelector = { },
                mainTextBox = { },
                mainImageBox = { },
                text,
                img;
                
            option = parsedData.findPage(pageId);
            
            if ( option !== undefined ) {
                // Updating page Selected
                pageSelector = evtSelect.getById('page');
                pageSelector.optionSelected = option;
                pageSelector.callback(option);
            }
            
            text = parsedData.getPageText(pageId);
            img = parsedData.getPageImage(pageId);

            // Updating mainText Box content
            mainTextBox = evtBox.getById('mainText');
            if ( text !== undefined ) {
                mainTextBox.updateContent(text.diplomatic);
            } else {
                mainTextBox.updateContent('Testo non disponibile.');
            }
            
            // Updating mainImage Box content
            mainImageBox = evtBox.getById('mainImage');
            if ( img !== undefined ) {
                mainImageBox.updateContent('<img src="'+img.url+'" />');
            } else {
                mainImageBox.updateContent('Si è verificato un errore.');
            }

    };

    return mainInterface;
});