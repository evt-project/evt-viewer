angular.module('evtviewer.box')

.directive('box', function(evtBox, evtParser, evtCriticalParser, xmlParser, parsedData, evtInterface) {

    return {
        restrict: 'E',
        scope: {
            id      : '@',
            type    : '@',
            subtype : '@',
            witness : '@',
            edition : '@'
        },
        templateUrl: 'src/box/box.dir.tmpl.html',
        link: function(scope, element, attrs) {
            console.log('scope.edition', scope.edition);
            // Add attributes in vm
            scope.vm = {
                id      : scope.id,
                type    : scope.type,
                subtype : scope.subtype,
                witness : scope.witness,
                edition : scope.edition
            };

            // Initialize box
            var currentBox = evtBox.build(scope, scope.vm);

            // Garbage collection
            scope.$on('$destroy', function() {
                if (currentBox){
                    currentBox.destroy();
                }     
            });

            // Scrolling evt
            var raw = element[0];
            var boxElem = angular.element(element).find('.box')[0],
                boxBody = angular.element(element).find('.box-body')[0];
            angular.element(boxBody).bind('scroll', function() {
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
                    // scope.$broadcast('UPDATE_WITNESS_PAGE', id);
                }
                
              // console.log('scroll');
              // $('.box-body').scrollTop($(this).scrollTop());
            });


            // Watchers
            if (currentBox.type === 'text') {
                scope.$watch(function() {
                    return evtInterface.getCurrentDocument();
                }, function(newItem, oldItem) {
                    if (scope.vm.state.docId !== newItem) {
                        var newContent;
                        scope.vm.state.docId = newItem;
                        if ( scope.vm.edition !== undefined && scope.vm.edition === 'critical') {
                            newContent = parsedData.getCriticalText(scope.vm.state.docId);   
                        }
                        if ( newContent !== undefined && newContent !== '') {
                            currentBox.updateContent(newContent.innerHTML);
                        } else {
                            currentBox.updateContent('Text not available.2');
                        }
                    }
                }, true); 
                
                scope.$watch(function() {
                    return evtInterface.getCurrentEdition();
                }, function(newItem, oldItem) {
                    if (scope.vm.edition !== newItem) {
                        scope.vm.edition = newItem;
                        
                        var newContent;
                        if ( scope.vm.edition !== undefined && scope.vm.edition === 'critical') {
                            newContent = parsedData.getCriticalText(currentBox.getState('docId'));
                        }
                        if ( newContent !== undefined && newContent !== '') {
                            currentBox.updateContent(newContent.innerHTML);
                        } else {
                            currentBox.updateContent('Text of '+scope.vm.edition+' edition not available.');
                        }
                    }
                }, true);                
            }
            if (currentBox.type === 'witness') {
                scope.$on('CHANGE_WITNESS_PAGE', function(event, option) {
                    if (option !== undefined) {
                        var docViewTop = boxElem.scrollTop + 42,
                            docViewBottom = docViewTop + angular.element(boxElem).height(),
                            elemTop =  $("span.pb[data-id='"+option.value+"']").offset().top;
                        if ((elemTop >= docViewBottom) || (elemTop <= docViewTop)) {
                            var boxBody = angular.element(element).find('.box-body')[0];
                            boxBody.scrollTop = $("span.pb[data-id='"+option.value+"']").position().top;
                        }
                    }
                });
            }
        }
    };
});