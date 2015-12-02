angular.module('evtviewer.box')

.directive('box', function(evtBox, evtParser, xmlParser, parsedData) {
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

            if (currentBox.subtype === 'critical') {
                scope.$on('UPDATE_DOCUMENT', function(event, boxId){
                    var newContent = parsedData.getCriticalText(boxId)[0];
                    if ( newContent !== undefined && newContent !== '') {
                        currentBox.updateContent(newContent.innerHTML);
                    } else {
                        currentBox.updateContent('Testo non disponibile.');
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
                                newContent = evtParser.parseWitnessText(xmlParser.parse(currentDoc.content), sigla);
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
                console.log('update filters', scope.vm.state.filters);
                if (newItems !== oldItems) {
                    scope.$broadcast('UPDATE_APP_FILTERS', scope.vm.state.filters);
                }
            }, true);
        }
    };
});