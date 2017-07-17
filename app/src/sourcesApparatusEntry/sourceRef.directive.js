/**
 * @ngdoc directive
 * @module evtviewer.sourcesApparatusEntry
 * @name evtviewer.sourcesApparatusEntry.directive:evtSourceRef
 * @description 
 * # evtSourceRef
 * TODO: Add description!
 *
 * @scope
 * @param {string=} sourceId id of source
 * @param {string=} sourceAbbr abbreviation of source
 *
 * @restrict E
 *
 * @author Chiara Martignano
**/
angular.module('evtviewer.sourcesApparatusEntry')

.directive('evtSourceRef', function(evtSourcesApparatusEntry, evtBox, evtInterface, parsedData, evtSourceSeg, evtApparatuses) {
    return {
        restrict: 'E',
        scope: {
            sourceId : '@',
            sourceAbbr: '@'
        },
        transclude: true,
        templateUrl: 'src/sourcesApparatusEntry/sourceRef.directive.tmpl.html',
        link: function(scope, element, attrs) {
            scope.openSource = function() {
                
                var newSource = scope.sourceId;

                //Updates the source to show inside of the source text box
                if (evtInterface.getCurrentSourceText() !== newSource) {
                    evtInterface.updateCurrentSourceText(newSource);
                    evtInterface.updateCurrentSource(newSource);
                }
                
                //Switches to the "Source-Text" view
                if (evtInterface.getCurrentViewMode() !== 'srcTxt') {
                    evtInterface.updateCurrentViewMode('srcTxt');
                }

                //TODO: evtInterface.updateUrl();
                
                // Checks if the selected quote has a corresponding segment inside of the souce text. //
                // If so, it saves the reference inside of the the "segToAlign" variable. //
                var quoteToAlign = '',
                    segToAlign = '',
                    currentQuote = evtInterface.getCurrentQuote() || '',
                    corresp = parsedData.getSources()._indexes.correspId[scope.sourceId] || [];
                
                for (var i in Object.keys(corresp)) {
                    //TODO: sistemare qui
                    for (var j = 0; j < corresp[Object.keys(corresp)[i]].length; j++) {
                        if (corresp[Object.keys(corresp)[i]][j] === currentQuote) {
                            quoteToAlign = corresp[Object.keys(corresp)[i]][j];
                            segToAlign = Object.keys(corresp)[i];
                        }
                    }
                        
                }
                
                if (quoteToAlign !== '' && segToAlign !== '') {
                    //evtSourceSeg.updateCurrentQuote(currentQuote);
                    evtBox.alignScrollToQuote(quoteToAlign, segToAlign);
                    evtApparatuses.alignScrollToQuote(quoteToAlign, segToAlign);
                }
            };
        }
    };
});