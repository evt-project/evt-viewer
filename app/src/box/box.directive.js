angular.module('evtviewer.box')

.directive('box', function($timeout, evtBox, evtInterface, xmlParser, config) {

    return {
        restrict: 'E',
        scope: {
            id      : '@',
            type    : '@',
            subtype : '@',
            witness : '@',
            witpage : '@',
            edition : '@'
        },
        transclude : true,
        templateUrl: 'src/box/box.dir.tmpl.html',
        link: function(scope, element, attrs) {
            // Add attributes in vm
            scope.vm = {
                id      : scope.id,
                type    : scope.type,
                subtype : scope.subtype,
                witness : scope.witness,
                witPage : scope.witpage,
                edition : scope.edition
            };

            // Initialize box
            var currentBox = evtBox.build(scope, scope.vm);
            var boxElem = angular.element(element).find('.box')[0],
                boxBody = angular.element(element).find('.box-body')[0];

            $timeout(function(){
                // We used $timeout to be sure that the view has been instantiated
                currentBox.updateContent();
                
                if (currentBox.type === 'witness' || currentBox.type === 'text') {
                    // Scrol box to update page numbers 
                    angular.element(boxBody).bind('DOMMouseScroll mousewheel', function() {
                        var i       = 0,
                            visible = false,
                            id      = '',
                            pbElems = angular.element(element).find('.pb');
                        while ( i < pbElems.length && !visible ) {
                            var docViewTop = boxElem.scrollTop + 42,
                                docViewBottom = docViewTop + angular.element(boxElem).height();
                            id = pbElems[i].getAttribute('data-id');
                            var elemTop =  $('span.pb[data-id=\''+id+'\']').offset().top;
                            if ((elemTop <= docViewBottom) && (elemTop >= docViewTop)) {
                                visible = true;
                            } else {
                                i++;
                            }
                        }
                        if (visible) {
                            if (currentBox.type === 'witness') {
                                if (evtInterface.getCurrentWitnessPage(scope.witness) !== id.split('-')[1]) {
                                    evtInterface.updateWitnessesPage(scope.witness, id.split('-')[1]);
                                    evtInterface.updateUrl();
                                }
                            }
                        }
                    });
                }

                if ( currentBox.type === 'witness' ) {
                    // Align new witness to selected app entry
                    // scope.$watch(function() {
                    //     var witnesses = evtInterface.getCurrentWitnesses(),
                    //     scopeWitnessIndex = witnesses.indexOf(scope.vm.witness);
                    //     return scopeWitnessIndex;
                    // }, function(newItem, oldItem) {
                    //     if (oldItem !== newItem) {
                    //         var appId = evtInterface.getCurrentAppEntry();
                    //         scope.vm.scrollToAppEntry(appId);
                    //     }
                    // }, true);
                }
                displayResult(scope, config.xsltUrl);
            });
            
            /* ****************** */
            /* XSL TRANSFORMATION */
            /* ****************** */
            var loadXMLDoc = function(filename) {
                var xhttp;
                if (window.ActiveXObject) {
                    xhttp = new ActiveXObject('Msxml2.XMLHTTP');
                } else {
                    xhttp = new XMLHttpRequest();
                }
                xhttp.open('GET', filename, false);
                try {
                    xhttp.responseType = 'msxml-document';
                } catch (err) {} // Helping IE11
                xhttp.send('');
                return xhttp.responseXML;
            };

            var displayResult = function(sc, xsltUrl) {
                if (xsltUrl !== '') {
                    var xml = xmlParser.parse(scope.vm.content),
                        xsl = loadXMLDoc(xsltUrl);
                    // code for IE
                    if (window.ActiveXObject) {
                        var ex = xml.transformNode(xsl);
                        scope.vm.content = ex;
                    }
                    // code for Chrome, Firefox, Opera, etc.
                    else if (document.implementation && document.implementation.createDocument) {
                        var xsltProcessor = new XSLTProcessor();
                        xsltProcessor.importStylesheet(xsl);
                        var resultDocument = xsltProcessor.transformToFragment(xml, document);
                        scope.vm.content = resultDocument;
                    }
                }
            };
            /* ****************** */
            /* XSL TRANSFORMATION */
            /* ****************** */
            
            // Necessary to handle box resizings depending on numbers of boxes
            scope.vm.getTotElementsOfType = function(type){
                return evtBox.getListByType(type).length;
            };
            
            if (currentBox.type === 'witness' || currentBox.type === 'text') {
                scope.vm.scrollToPage = function(pageId) {
                    $timeout(function(){
                        var pbElem = $('#'+currentBox.uid).find('#pb_'+pageId);
                        var padding = window.getComputedStyle(boxBody, null).getPropertyValue('padding-top').replace('px', '')*1;
                        if (pbElem.length > 0 && pbElem[0] !== undefined) {
                            boxBody.scrollTop = pbElem[0].offsetTop-padding;
                        }
                    });
                };

                scope.vm.scrollToAppEntry = function(appId) {
                    $timeout(function(){
                        var appElem = $('#'+currentBox.uid).find('[data-app-id=\''+appId+'\']');
                        var padding = window.getComputedStyle(boxBody, null).getPropertyValue('padding-top').replace('px', '')*1;
                        if (appElem.length > 0 && appElem[0] !== undefined) {
                            boxBody.scrollTop = appElem[0].offsetTop-padding;
                        }
                    });
                };
                
                // Necessary for first load page/app entry alignment
                var pageId, 
                    currentAppId = evtInterface.getCurrentAppEntry();
                if ( currentBox.type === 'witness' ) {
                    pageId = scope.vm.witness+'-'+evtInterface.getCurrentWitnessPage(scope.vm.witness);
                } else if ( currentBox.type === 'text' ) {
                    pageId = evtInterface.getCurrentPage();
                }
                scope.vm.scrollToPage(pageId);
                scope.vm.scrollToAppEntry(currentAppId);
                
                // scope.$watch(function() {
                //     return evtInterface.getCurrentAppEntry();
                // }, function(newItem, oldItem) {
                    // if (oldItem !== newItem) {
                        // if (evtInterface.getCurrentViewMode() === 'collation' && evtInterface.getCurrentWitnesses().length > 0){
                            // scope.vm.scrollToAppEntry(newItem);
                        // }
                    // }
                // }, true);
                
                scope.$watch(function() {
                    return evtInterface.getCurrentDocument();
                }, function(newItem, oldItem) {
                    if (oldItem !== newItem && scope.vm.state.docId !== newItem) {
                        scope.vm.state.docId = newItem;
                        scope.vm.isLoading = true;
                        currentBox.updateContent();
                        if (scope.vm.currentType === 'text') {
                            var docObj = parsedData.getDocument(newItem),
                                docFront = docObj ? docObj.front : undefined;

                                var content = docFront && docFront.parsedContent ? docFront.parsedContent : '<div class="warningMsg">Front is not available</div>';
                                scope.vm.updateTopBoxContent(newTopBoxContent);
                        }
                    }
                }, true);

                scope.$watch(function() {
                    return scope.vm.state.filters._totActive;
                }, function(newItem, oldItem) {
                    if (oldItem !== newItem) {
                        $timeout(function(){
                            var filtersActiveElem = angular.element(element).find('.filters-in-box')[0];
                            var height = angular.element(filtersActiveElem).height();
                            var boxBodyLastChild = angular.element(element).find('.box-body > *:last-child')[0];
                            angular.element(boxBodyLastChild).css('margin-bottom', (height+20)+'px');
                        });
                    }
                }, true);
            }

            if (currentBox.type === 'text') {
                scope.$watch(function() {
                    return evtInterface.getCurrentEdition();
                }, function(newItem, oldItem) {
                    if (oldItem !== newItem && scope.vm.edition !== newItem) {
                        scope.vm.edition = newItem;
                        currentBox.updateContent();

                    }
                }, true);

                scope.$watch(function() {
                    return evtInterface.getCurrentPage();
                }, function(newItem, oldItem) {
                    currentBox.updateContent();
                }, true);
            }

            if (currentBox.type === 'image') {
                scope.$watch(function() {
                    return evtInterface.getCurrentPage();
                }, function(newItem, oldItem) {
                    if (oldItem !== newItem && scope.vm.state.docId !== newItem) {
                        scope.vm.state.pageId = newItem;
                        currentBox.updateContent();
                    }
                }, true); 
            }

            // Garbage collection
            scope.$on('$destroy', function() {
                if (currentBox){
                    currentBox.destroy();
                }     
            });
        }
    };
});