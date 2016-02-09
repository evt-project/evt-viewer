angular.module('evtviewer.box')

.directive('box', function($timeout, evtBox, evtInterface, xmlParser) {

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
            currentBox.updateContent();
            
            /* ****************** */
            /* XSL TRANSFORMATION */
            /* ****************** */
            function loadXMLDoc(filename) {
                if (window.ActiveXObject) {
                    xhttp = new ActiveXObject("Msxml2.XMLHTTP");
                } else {
                    xhttp = new XMLHttpRequest();
                }
                xhttp.open("GET", filename, false);
                try {
                    xhttp.responseType = "msxml-document"
                } catch (err) {} // Helping IE11
                xhttp.send("");
                return xhttp.responseXML;
            }

            function displayResult(sc, xsltUrl) {
                if (xsltUrl != '') {
                    var xml = xmlParser.parse(scope.vm.content),
                        xsl = loadXMLDoc(xsltUrl);
                    // code for IE
                    if (window.ActiveXObject || xhttp.responseType == "msxml-document") {
                        ex = xml.transformNode(xsl);
                        scope.vm.content = ex;
                    }
                    // code for Chrome, Firefox, Opera, etc.
                    else if (document.implementation && document.implementation.createDocument) {
                        xsltProcessor = new XSLTProcessor();
                        xsltProcessor.importStylesheet(xsl);
                        resultDocument = xsltProcessor.transformToFragment(xml, document);
                        scope.vm.content = resultDocument;
                    }
                }
            }
            displayResult(scope, scope.vm.defaults.xsltUrl);
            /* ****************** */
            /* XSL TRANSFORMATION */
            /* ****************** */
            
            scope.vm.getTotElementsOfType = function(type){
                return evtBox.getListByType(type).length;
            };

            // Garbage collection
            scope.$on('$destroy', function() {
                if (currentBox){
                    currentBox.destroy();
                }     
            });
            
            var boxElem = angular.element(element).find('.box')[0],
                boxBody = angular.element(element).find('.box-body')[0];

            if (currentBox.type === 'witness' || currentBox.type === 'text') {
                scope.vm.scrollToPage = function(pageId) {
                    var pbElem = $('#'+currentBox.uid).find('#pb_'+pageId);
                    var padding = window.getComputedStyle(boxBody, null).getPropertyValue('padding-top').replace('px', '')*1;
                    if (pbElem.length > 0 && pbElem[0] !== undefined) {
                        boxBody.scrollTop = pbElem[0].offsetTop-padding;
                    }
                };

                // Necessary for first load page alignment
                $timeout(function(){
                    var pageId;
                    if ( currentBox.type === 'witness' ) {
                        pageId = scope.vm.witness+'-'+evtInterface.getCurrentWitnessPage(scope.vm.witness);
                    } else if ( currentBox.type === 'text' ) {
                        pageId = evtInterface.getCurrentPage();
                    }
                    scope.vm.scrollToPage(pageId);
                });

                // Scrolling evt
                angular.element(boxBody).bind('DOMMouseScroll mousewheel', function(e) {
                    var i       = 0,
                        visible = false,
                        id      = '',
                        pbElems = angular.element(element).find('.pb');
                    while ( i < pbElems.length && !visible ) {
                        var docViewTop = boxElem.scrollTop + 42,
                            docViewBottom = docViewTop + angular.element(boxElem).height(),
                            id = pbElems[i].getAttribute('data-id'),
                            elemTop =  $("span.pb[data-id='"+id+"']").offset().top;
                        if ((elemTop <= docViewBottom) && (elemTop >= docViewTop)) {
                            visible = true;
                        } else {
                            i++;
                        }
                    }
                    if (visible) {
                        if (currentBox.type === 'witness'){
                            evtInterface.updateWitnessesPage(scope.witness, id.split('-')[1]);
                            evtInterface.updateUrl();
                        }
                    }
                });
            }

            if (currentBox.type === 'text') {
                scope.$watch(function() {
                    return evtInterface.getCurrentDocument();
                }, function(newItem, oldItem) {
                    if (scope.vm.state.docId !== newItem) {
                        scope.vm.state.docId = newItem;
                        currentBox.updateContent();
                    }
                }, true); 

                scope.$watch(function() {
                    return evtInterface.getCurrentEdition();
                }, function(newItem, oldItem) {
                    if (scope.vm.edition !== newItem) {
                        scope.vm.edition = newItem;
                        currentBox.updateContent();
                    }
                }, true);
            }

            if (currentBox.type === 'image') {
                scope.$watch(function() {
                    return evtInterface.getCurrentPage();
                }, function(newItem, oldItem) {
                    if (scope.vm.state.docId !== newItem) {
                        scope.vm.state.pageId = newItem;
                        currentBox.updateContent();
                    }
                }, true); 
            }
        }
    };
});