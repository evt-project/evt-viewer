/**
 * @ngdoc directive
 * @module evtviewer.quote
 * @name evtviewer.quote.directive:evtQuote
 * @description 
 * # evtQuote
 * <p>Element that identify a quote connected to a specific source apparatus entry. </p>
 * <p>It is visually distinguished from the rest of the text.</p>
 * <p>When the user clicks on it, the connected source apparatus entry with all the information retrieved 
 * from the source encoded text (and stored in {@link evtviewer.dataHandler.parsedData parsedData}) will be shown.</p>
 *
 * <p>It uses the {@link evtviewer.quote.controller:QuoteCtrl QuoteCtrl} controller. </p>
 * <p>The initial scope is expanded in {@link evtviewer.quote.evtQuote evtQuote} provider.</p>
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
            
            //scope.scopeViewMode = evtInterface.getState('currentViewMode');
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