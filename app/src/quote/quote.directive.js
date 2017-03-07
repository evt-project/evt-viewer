angular.module('evtviewer.quote')

.directive('evtQuote', function(evtQuote, parsedData) {
    return {
        restrict: 'E',
        scope: {
            appId       : '@',
            readingId   : '@',
            readingType : '@',
            variance    : '@',
            scopeWit    : '@',
            type        : '@'
        },
        transclude: true,
        //templateUrl: 'src/quote/quote.directive.tmpl.html',
        //controllerAs: 'vm',
        //controller: 'QuoteCtrl',
        link: function(scope, element, attrs){
            // Initialize reading
            var currentQuote = evtQuote.build(scope.quoteId, scope);
            
            // Garbage collection
            scope.$on('$destroy', function() {
                if (currentQuote){
                    currentQuote.destroy();
                }     
            });
        }
    };
});