angular.module('evtviewer.select')

.directive('evtSelect', function($timeout, evtSelect, evtInterface) {
    return {
        restrict: 'E',
        scope: {
            id: '@',
            type: '@',
            init: '@',
            openUp: '@',
            multiselect: '@'
        },
        templateUrl: 'src/select/select.directive.tmpl.html',
        controllerAs: 'vm',
        controller: 'SelectCtrl',
        link: function(scope, element) {
            // Initialize select
            var currentSelect = evtSelect.build(scope, scope.vm);

            $timeout(function(){
                if (currentSelect.openUp) {
                    var optionContainer = element.find('.option_container'),
                        selector = element.find('.selector'),
                        labelSelected = element.find('.label_selected');
                    optionContainer.show();    
                    optionContainer.css('visibility', 'hidden');
                    optionContainer.css('position', 'relative');
                    var newMarginTop = optionContainer.height() + selector.height() + 2; 
                    optionContainer.css('margin-top', -newMarginTop + 'px')
                    optionContainer.css('position', 'absolute');
                    optionContainer.css('visibility', 'visible');
                    optionContainer.css('display', '');
                }

                if (currentSelect !== undefined) {
                    if (scope.init !== undefined && scope.init !== '') {
                        currentSelect.selectOptionByValue(scope.init);
                    } else {
                        currentSelect.callback(undefined, scope.vm.optionList[0]);
                    }
                }
            });

            if (scope.type === 'witness-page') {
                var witness = scope.$parent.vm.witness;
                scope.$watch(function() {
                    return evtInterface.getCurrentWitnessPage(witness);
                }, function(newItem, oldItem) {
                    if (oldItem !== newItem) {
                        currentSelect.selectOptionByValue(witness+'-'+newItem);
                    }
                }, true); 
            }

            if (scope.type === 'page') {
                scope.$watch(function() {
                    return evtInterface.getCurrentPage();
                }, function(newItem, oldItem) {
                    if (oldItem !== newItem) {
                        currentSelect.selectOptionByValue(newItem);
                    }
                }, true); 
            }

            if (scope.type === 'document') {
                scope.$watch(function() {
                    return evtInterface.getCurrentDocument();
                }, function(newItem, oldItem) {
                    if (oldItem !== newItem) {
                        currentSelect.selectOptionByValue(newItem);
                    }
                }, true); 
            }

            // Garbage collection
            scope.$on('$destroy', function() {
                if (currentSelect){
                    currentSelect.destroy();
                }     
            });
        }
    };
});