angular.module('evtviewer.box')

.directive('box', function(evtBox, evtParser, evtCriticalParser, xmlParser, parsedData) {
    return {
        restrict: 'E',
        scope: {
            id: '@',
            type: '@',
            subtype: '@'
        },
        templateUrl: 'src/box/box.dir.tmpl.html',
        link: function(scope, element, attrs) {

            // Add attributes in vm
            scope.vm = {
                id: scope.id,
                type: scope.type,
                subtype: scope.subtype,
                state: {}
            };

            // Initialize box
            var currentBox = evtBox.build(scope.vm);

            // Garbage collection
            scope.$on('$destroy', function() {
                if (currentBox){
                    currentBox.destroy();
                }     
            });

            if (currentBox.type === 'text') {
                scope.$on('UPDATE_EDITION', function(event, edition){
                    console.log('UPDATE_EDITION');
                    if ( scope.vm.state.edition !== edition ) {
                        var newContent;
                        scope.vm.state.edition = edition;
                        if (edition === 'critical') {
                            scope.vm.appFilters    = parsedData.getWitnesses();

                            if ( scope.vm.state.docId !== undefined ) {
                                newContent = parsedData.getCriticalText(scope.vm.state.docId);
                            }
                        }
                        scope.vm.state.filters = {};
                        scope.vm.state.filterBox = false;

                        if ( newContent !== undefined && newContent !== '') {
                            currentBox.updateContent(newContent.innerHTML);
                        } else {
                            currentBox.updateContent('Testo non disponibile.');
                        }
                    }
                });
                scope.$on('UPDATE_DOCUMENT', function(event, docId){
                    console.log('UPDATE_DOCUMENT');
                    if (scope.vm.state.docId !== docId) {
                        var newContent;
                        scope.vm.state.docId = docId;
                        if ( scope.vm.state.edition !== undefined && scope.vm.state.edition === 'critical') {
                            newContent = parsedData.getCriticalText(docId);   
                        }
                        if ( newContent !== undefined && newContent !== '') {
                            currentBox.updateContent(newContent.innerHTML);
                        } else {
                            currentBox.updateContent('Testo non disponibile.');
                        }
                    }
                });
            }
            if (currentBox.type === 'witness') {
                scope.$on('UPDATE_WITNESS', function(event, sigla){
                    if ( sigla !== undefined && sigla !== currentBox.getState('witness') ) {
                        var newContent = parsedData.getWitnessText(sigla) || undefined;
                        if ( newContent === undefined ) {
                            var documents  = parsedData.getDocuments(),
                                currentDoc = '';
                            if (documents.length > 0) {
                                currentDoc = documents[documents[0]];
                            }
                            if (currentDoc !== undefined) {
                                newContent = evtCriticalParser.parseWitnessText(xmlParser.parse(currentDoc.content), sigla);
                            }
                        }
                        
                        if ( newContent !== undefined && newContent !== '') {
                            currentBox.updateContent(newContent);
                        } else {
                            currentBox.updateContent('Testo non disponibile.');
                        }
                        currentBox.updateState('witness', sigla); 
                    }
                });
            }

            var raw = element[0];
            var boxBody = angular.element(element).find('.box-body')[0];
            angular.element(boxBody).bind('scroll', function() {
              console.log('scroll');
              // $('.box-body').scrollTop($(this).scrollTop());
            });

            scope.$watch(function() {
                if (scope.vm.state.filters !== undefined) {
                    return scope.vm.state.filters;
                }
            }, function(newItems, oldItems) {
                if (newItems !== oldItems) {
                    scope.$broadcast('UPDATE_APP_FILTERS', scope.vm.state.filters);
                }
            }, true);
        }
    };
});