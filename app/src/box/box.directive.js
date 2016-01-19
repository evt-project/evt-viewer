angular.module('evtviewer.box')

.directive('box', function(evtBox, evtInterface) {

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
            
            scope.vm.getTotElementsOfType = function(type){
                return evtBox.getListByType(type).length;
            };

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

            // if (currentBox.type === 'witness') {
            //     scope.$on('CHANGE_WITNESS_PAGE', function(event, option) {
            //         if (option !== undefined) {
            //             var docViewTop = boxElem.scrollTop + 42,
            //                 docViewBottom = docViewTop + angular.element(boxElem).height(),
            //                 elemTop =  $("span.pb[data-id='"+option.value+"']").offset().top;
            //             if ((elemTop >= docViewBottom) || (elemTop <= docViewTop)) {
            //                 var boxBody = angular.element(element).find('.box-body')[0];
            //                 boxBody.scrollTop = $("span.pb[data-id='"+option.value+"']").position().top;
            //             }
            //         }
            //     });
            // }
        }
    };
});