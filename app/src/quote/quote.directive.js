angular.module('evtviewer.quote')

.directive('evtQuote', function(evtQuote, parsedData, evtInterface) {
    return {
        restrict: 'E',
        scope: {
            quoteId  : '@',
            scopeWit : '@',
            type: '@'
        },
        transclude: true,
        templateUrl: 'src/quote/quote.directive.tmpl.html',
        controllerAs: 'vm',
        controller: 'QuoteCtrl',
        link: function(scope, element, attrs){
            
            //scope.scopeViewMode = evtInterface.getCurrentViewMode();
            // Initialize quote
            var currentQuote = evtQuote.build(scope);
            
            // Garbage collection
            scope.$on('$destroy', function() {
                if (currentQuote){
                    currentQuote.destroy();
                }     
            });
        }
    };
});