/**
 * @ngdoc directive
 * @module evtviewer.quote
 * @name evtviewer.quote.directive:evtQuote
 * @description 
 * # evtQuote
 * TODO: Add description!
 * It uses the {@link evtviewer.quote.controller:QuoteCtrl QuoteCtrl} controller. 
 *
 * @scope
 * @param {string=} quoteId id of quote to be shown
 * @param {string=} scopeWit id of scope witness
 * @param {string=} type type of quote ('', 'subquote')
 *
 * @restrict E
**/
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
            scope.inlineApparatus = evtInterface.isSourcesInline();
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