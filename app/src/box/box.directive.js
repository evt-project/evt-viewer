/**
 * @ngdoc directive
 * @module evtviewer.box
 * @name evtviewer.box.directive:box
 * @description
 * # box
 * <p>Container with an header with tools (optional), a body and a footer with tools (optional).
 * The content of the body will depend on box type. </p>
 * <p>Available types are:<ul>
 * <li> **image**: <ul>
 *  <li>Header: Page selector, Thumbnails button</li>
 *  <li>Body: Image viewer (to be implemented)</li>
 *  <li>Footer: hidden </li></ul></li>
 *
 * <li> **text**: <ul>
 *  <li>Header: Page selector, Document selector, Edition level selector&#8727;, Version selector&#8727;, Witnesses list button&#8727;,
 * info button&#8727;, Color legend keys button&#8727;</li>
 *  <li>Body: Text of the edition, updated to current document, page and edition level</li>
 *  <li>Footer: Critical entries filters and heat map buttons&#8727;, Entities selector&#8727;, Font size change buttons</li></ul></li>
 *
 * <li> **witness** <ul>
 *  <li>Header: Witnesses selector, Selected witness pages selector, Witness info button&#8727;, Witness close button</li>
 *  <li>Body: Text of selected witness, aligned to current page or current critical entry selected</li>
 *  <li>Footer: Critical entries filters buttons&#8727;, Font size change buttons</li></ul></li>
 *
 * <li> **source** <ul>
 *  <li>Header: Sources selector&#8727;, Source bibliographic reference button</li>
 *  <li>Body: Text of the current source text</li>
 *  <li>Footer: Font size change buttons</li></ul></li>
 *
 * <li> **version** <ul>
 *  <li>Header: Version selector&#8727;, Version close button</li>
 *  <li>Body: Text of the current selected version aligned to main text</li>
 *  <li>Footer: Font size change buttons</li></ul></li>
 *
 * <li> **pinnedBoard** <ul>
 *  <li>Header: Close button</li>
 *  <li>Body: Transcluded content (it will be a list of pinned elements)</li>
 *  <li>Footer: Pinned elements filter selector&#8727;</li></ul></li>
 *
 * <li> **empty** <ul>
 *  <li>Header: hidden</li>
 *  <li>Body: Transcluded content</li>
 *  <li>Footer: hidden</li></ul></li>
 *
 * <li> *no type* <ul>
 *  <li>Header: Close button</li>
 *  <li>Body: Transcluded content</li>
 *  <li>Footer: hidden</li></ul></li>
 * </ul>
 * <br/>&#8727; if available</p>
 * <p>Since each instance of box must be controlled in different
 * ways depending on type, the {@link evtviewer.box.controller:BoxCtrl controller} for this directive is dynamically defined inside the
 * {@link evtviewer.box.evtBox evtBox} provider.</p>
 *
 * @scope
 * @param {string=} id id of box to be shown
 * @param {string=} type type of box to be shown (can be 'image', 'text', 'witness', 'source', 'version', 'pinnedBoard', 'empty')
 * @param {string=} subtype subtype of box to be shown
 * @param {string=} witness scope witness
 * @param {string=} witpage scope witness page
 * @param {string=} edition scope edition
 * @param {string=} source scope source
 * @param {string=} version scope version
 *
 * @restrict E
**/
angular.module('evtviewer.box')

.directive('box', function($timeout, evtBox, evtInterface, xmlParser, config, parsedData, evtSearchResults, evtSearchBox, evtVirtualKeyboard, evtButtonSwitch) {

    return {
        restrict: 'E',
        scope: {
            id      : '@',
            type    : '@',
            subtype : '@',
            witness : '@',
            witpage : '@',
            edition : '@',
            source  : '@',
            version : '@'
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
                edition : scope.edition,
                source  : scope.source,
                version : scope.version
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
                    //BIND DEPRECATED, USE ON
                    angular.element(boxBody).bind('DOMMouseScroll mousewheel', function() {
                        var i       = 0,
                            visible = false,
                            id      = '',
                            pbElems = angular.element(element).find('.pb');
                        while ( i < pbElems.length && !visible ) {
                            var docViewTop = boxElem.scrollTop + 42,
                                docViewBottom = docViewTop + angular.element(boxElem).height();
                            id = pbElems[i].getAttribute('data-id');

                            var elemOffset = $('span.pb[data-id=\''+id+'\']').offset();
                            var elemTop;
                            if (elemOffset) {
                                elemTop =  elemOffset.top;
                            }
                            if (elemTop && (elemTop <= docViewBottom) && (elemTop >= docViewTop)) {
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
                    //     var witnesses = evtInterface.getState('currentWits'),
                    //     scopeWitnessIndex = witnesses.indexOf(scope.vm.witness);
                    //     return scopeWitnessIndex;
                    // }, function(newItem, oldItem) {
                    //     if (oldItem !== newItem) {
                    //         var appId = evtInterface.getState('currentAppEntry');
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
            // /////////////////////// //
            // END XSL TRANSFORMATION  //
            // ////////////////////// //

            /**
             * @ngdoc method
             * @name evtviewer.box.controller:BoxCtrl#getTotElementsOfType
             * @methodOf evtviewer.box.controller:BoxCtrl
             *
             * @description
             * <p>Get number of instances of <code>&lt;box&gt;</code>s of a particular type.</p>
             * <p>This function is necessary to handle box resizings depending on numbers of boxes.</p>
             *
             * @param {string} type type of <code>&lt;box&gt;</code> to handle
             *
             * @returns {number} number of instances of <code>&lt;box&gt;</code>s of a particular type
             */
            scope.vm.getTotElementsOfType = function(type){
                return evtBox.getListByType(type).length;
            };

            if (currentBox.type === 'witness' || currentBox.type === 'text' || currentBox.type === 'version') {
                /** @ngdoc method
                 * @name evtviewer.box.controller:BoxCtrl#scrollToPage
                 * @methodOf evtviewer.box.controller:BoxCtrl
                 *
                 * @description
                 * <p>Scroll box body container to a particular page anchor.</p>
                 * <p>This function is available only on <code>&lt;box&gt;</code>s of type **witness** and **text**.</p>
                 *
                 * @param {string} pageId id of page to consider during scrolling
                 */
                scope.vm.scrollToPage = function(pageId) {
                    $timeout(function(){
                        var pbElem = $('#'+currentBox.uid).find('#pb_'+pageId);
                        var padding = window.getComputedStyle(boxBody, null).getPropertyValue('padding-top').replace('px', '')*1;
                        if (pbElem.length > 0 && pbElem[0] !== undefined) {
                            boxBody.scrollTop = pbElem[0].offsetTop-padding;
                        }
                    });
                };
                /** @ngdoc method
                 * @name evtviewer.box.controller:BoxCtrl#scrollToAppEntry
                 * @methodOf evtviewer.box.controller:BoxCtrl
                 *
                 * @description
                 * <p>Scroll box body container to a particular critical apparatus entry.</p>
                 * <p>This function is available only on <code>&lt;box&gt;</code>s of type **witness** and **text**.</p>
                 *
                 * @param {string} appId id of critical apparatus entry to consider during scrolling
                 */
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
                    currentAppId = evtInterface.getState('currentAppEntry');
                if ( currentBox.type === 'witness' ) {
                    pageId = scope.vm.witness+'-'+evtInterface.getCurrentWitnessPage(scope.vm.witness);
                } else if ( currentBox.type === 'text' ) {
                    pageId = evtInterface.getState('currentPage');
                }
                scope.vm.scrollToPage(pageId);
                scope.vm.scrollToAppEntry(currentAppId);

                // scope.$watch(function() {
                //     return evtInterface.getState('currentAppEntry');
                // }, function(newItem, oldItem) {
                //     if (oldItem !== newItem) {
                //         if (evtInterface.getState('currentViewMode') === 'collation' && evtInterface.getState('currentWits').length > 0){
                //             scope.vm.scrollToAppEntry(newItem);
                //         }
                //     }
                // }, true);

            }

            if (currentBox.type === 'witness' || currentBox.type === 'text') {
              scope.$watch(function() {
                  return evtInterface.getState('currentDoc');
              }, function(newItem, oldItem) {
                  if (oldItem !== newItem && scope.vm.state.docId !== newItem) {
                      scope.vm.state.docId = newItem;
                      scope.vm.isLoading = true;
                      currentBox.updateContent();
                      if (scope.vm.currentType === 'text') {
                          var docObj = parsedData.getDocument(newItem),
                              docFront = docObj ? docObj.front : undefined;

                              var content = docFront && docFront.parsedContent ? docFront.parsedContent : '<div class="warningMsg">{{ \'MESSAGES.FRONT_NOT_AVAILABLE\' | translate }}</div>';
                              scope.vm.updateTopBoxContent(content);
                      }
                      /* aggiunta per msDesc*/
                      else if (scope.vm.currentType === 'image'){
                          var msDescObj = parsedData.getProjectInfo().msDesc ? parsedData.getProjectInfo().msDesc : '<div class="warningMsg">{{ \'MESSAGES.FRONT_NOT_AVAILABLE\' | translate }}</div>';
                          scope.vm.updateTopBoxContent(msDescObj); 
                      }
                      /* fine aggiunta*/
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

            //Added by CM
            if (currentBox.type === 'witness' || currentBox.type === 'text' || currentBox.type === 'version') {
                /** @ngdoc method
                 * @name evtviewer.box.controller:BoxCtrl#scrollToQuotesEntry
                 * @methodOf evtviewer.box.controller:BoxCtrl
                 *
                 * @description
                 * <p>Scroll box body container to a particular quote.</p>
                 * <p>This function is available only on <code>&lt;box&gt;</code>s of type **witness**, **text** and **version**.</p>
                 *
                 * @param {string} quoteId id of quote to consider during scrolling
                 */
                scope.vm.scrollToQuotesEntry = function(quoteId) {
                    $timeout(function(){
                        var appElem = $('#'+currentBox.uid).find('[data-quote-id=\''+quoteId+'\']');
                        var padding = window.getComputedStyle(boxBody, null).getPropertyValue('padding-top').replace('px', '')*1;
                        if (appElem.length > 0 && appElem[0] !== undefined) {
                            boxBody.scrollTop = appElem[0].offsetTop-padding;
                        }
                    });
                };
                /** @ngdoc method
                 * @name evtviewer.box.controller:BoxCtrl#scrollToAnaloguesEntry
                 * @methodOf evtviewer.box.controller:BoxCtrl
                 *
                 * @description
                 * <p>Scroll box body container to a particular analogue.</p>
                 * <p>This function is available only on <code>&lt;box&gt;</code>s of type **witness**, **text** and **version**.</p>
                 *
                 * @param {string} analogueId id of analogue to consider during scrolling
                 */
                scope.vm.scrollToAnaloguesEntry = function(analogueId) {
                    $timeout(function(){
                        var appElem = $('#'+currentBox.uid).find('[data-analogue-id=\''+analogueId+'\']');
                        var padding = window.getComputedStyle(boxBody, null).getPropertyValue('padding-top').replace('px', '')*1;
                        if (appElem.length > 0 && appElem[0] !== undefined) {
                            boxBody.scrollTop = appElem[0].offsetTop-padding;
                        }
                    });
                };
                /** @ngdoc method
                 * @name evtviewer.box.controller:BoxCtrl#scrollToVersionApparatus
                 * @methodOf evtviewer.box.controller:BoxCtrl
                 *
                 * @description
                 * <p>Scroll box body container to a particular critical apparatus entry on version text.</p>
                 * <p>If the version apparatus entry isn't visible, the box scrolls in order to show the apparatus completely.</p>
                 * <p>This function is available only on <code>&lt;box&gt;</code>s of type **witness**, **text** and **version**.</p>
                 *
                 * @param {string} appId id of critical apparatus entry to consider during scrolling
                 */
                scope.vm.scrollToVersionApparatus = function(appId) {
                    $timeout(function() {
                        var appEntryElem = $('#'+currentBox.uid).find('evt-version-apparatus-entry[data-app-id=\''+appId+'\']'),
                            padding = window.getComputedStyle(boxBody, null).getPropertyValue('padding-top').replace('px', '')*1;
                        if (appEntryElem.length > 0 && appEntryElem[0] !== undefined) {
                            var elementPosition = angular.element(appEntryElem[0]).position().top,
                                clientHeight = appEntryElem[0].offsetParent.clientHeight,
                                elemDiv = $('#'+currentBox.uid).find('div[class=\'version-apparatus-entry\']'),
                                elementHeight = angular.element(elemDiv).outerHeight() || 0;
                            if ((elementPosition + elementHeight) > clientHeight) {
                                boxBody.scrollTop += (elementPosition - clientHeight) + elementHeight;
                            }
                        }
                    });
                };
            }

            if (currentBox.type === 'source') {
                /** @ngdoc method
                 * @name evtviewer.box.controller:BoxCtrl#scrollToQuotesEntry
                 * @methodOf evtviewer.box.controller:BoxCtrl
                 *
                 * @description
                 * <p>Scroll box body container to a particular quote entry on source text.</p>
                 * <p>This function is available only on <code>&lt;box&gt;</code>s of type **source**.</p>
                 *
                 * @param {string} segId id of quote entry to consider during scrolling
                 */
                scope.vm.scrollToQuotesEntry = function(segId) {
                    $timeout(function(){
                        var appElem = $('#'+currentBox.uid).find('[data-seg-id=\''+segId+'\']');
                        var padding = window.getComputedStyle(boxBody, null).getPropertyValue('padding-top').replace('px', '')*1;
                        if (appElem.length > 0 && appElem[0] !== undefined) {
                            boxBody.scrollTop = appElem[0].offsetTop-padding;
                        }
                    });
                };
            }

            //TODO: aggiungere scroll per sources view

            if (currentBox.type === 'text') {
                if (currentBox.subtype === 'comparing') {
                  scope.$watch(function() {
                      return evtInterface.getState('currentComparingEdition');
                  }, function(newItem, oldItem) {
                      if (oldItem !== newItem && scope.vm.edition !== newItem) {
                         scope.vm.edition = newItem;
                         currentBox.updateContent();
   
                         evtVirtualKeyboard.unselectCurrentKeyboard(evtButtonSwitch, currentBox.id);
                         $timeout(function() {
                            var currentBoxId = scope.id,
                               searchInput = evtSearchBox.getInputValue(currentBoxId);
      
                            if(searchInput !== '') {
                               evtSearchResults.highlightSearchResults(currentBoxId, searchInput);
                            }
                         });
                      }
                  }, true);
                } else {
                  scope.$watch(function() {
                      return evtInterface.getState('currentEdition');
                  }, function(newItem, oldItem) {
                      if (oldItem !== newItem && scope.vm.edition !== newItem) {
                          scope.vm.edition = newItem;
                          currentBox.updateContent();
                          
                         evtVirtualKeyboard.unselectCurrentKeyboard(evtButtonSwitch, currentBox.id);
                         $timeout(function() {
                            var currentBoxId = scope.id,
                               searchInput = evtSearchBox.getInputValue(currentBoxId);
      
                            if(searchInput !== '') {
                               evtSearchResults.highlightSearchResults(currentBoxId, searchInput);
                            }
                         });
                      }
                  }, true);
                }

                scope.$watch(function() {
                    return evtInterface.getState('currentPage');
                }, function(newItem, oldItem) {
                    currentBox.updateContent();
   
                   $timeout(function() {
                      var currentBoxId = scope.id,
                         searchInput = evtSearchBox.getInputValue(currentBoxId);
   
                      if(searchInput !== '') {
                         evtSearchResults.highlightSearchResults(currentBoxId, searchInput);
                      }
                   });
                }, true);
            }

            if (currentBox.type === 'image') {
                scope.$watch(function() {
                    return evtInterface.getState('currentPage');
                }, function(newItem, oldItem) {
                    if (oldItem !== newItem && scope.vm.state.docId !== newItem) {
                        scope.vm.state.pageId = newItem;
                        currentBox.updateContent();
                    }
                }, true);
            }

            //Watchers for box of type "source"//
            //author: CM//
            if (currentBox.type === 'source') {

                //Watcher to intialize the sources texts, by parsing them.     //
                //The watcher checks if the source to parse has been loaded,   //
                //then updates the content of the box with current source text.//
                scope.$watch(function() {
                    return evtInterface.getProperty('isSourceLoading');
                }, function(newItem, oldItem) {
                    if (oldItem !== newItem) {
                        if (!newItem) {
                            scope.vm.source = evtInterface.getState('currentSourceText') ;
                            currentBox.updateContent();
                        }
                    }
                });

                //Watch to change the source text.                              //
                //Checks if the current Source text has changed and then updates//
                //the content of the box.                                       //
                scope.$watch(function() {
                    return evtInterface.getState('currentSourceText') ;
                }, function(newItem, oldItem) {
                    if (oldItem !== newItem) {
                        if (evtInterface.getProperty('parsedSourcesTexts').indexOf(newItem) >= 0) {
                            scope.vm.source = newItem;
                            currentBox.updateContent();
                        }
                    }
                });
            }

            if (currentBox.type === 'text' && evtInterface.getState('currentViewMode') === 'collation') {
                scope.$watch(function() {
                    return evtInterface.getState('currentVersion');
                }, function (newItem, oldItem) {
                    scope.vm.version = newItem;
                    currentBox.updateContent();
                });
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
