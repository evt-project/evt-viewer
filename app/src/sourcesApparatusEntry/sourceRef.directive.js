angular.module('evtviewer.sourcesApparatusEntry')

.directive('evtSourceRef', function(evtSourcesApparatusEntry, evtBox, evtInterface, parsedData, evtSourceSeg) {
    return {
        restrict: 'E',
        //require: '^evtSourcesApparatusEntry',
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

                //Updates the selected source seg inside of the source text
                //evtSourceSeg.updateCurrentQuote(evtInterface.getCurrentQuote());

                //TODO: evtInterface.updateUrl();
                
                /* Checks if the selected quote has a corresponding segment inside of the souce text. */
                /* If so, it saves the reference inside of the the "segToAlign" variable. */
                var segToAlign = '',
                    currentQuote = evtInterface.getCurrentQuote() || '',
                    corresp = parsedData.getSources()._indexes.correspId[scope.sourceId] || [];
                
                for (var i in Object.keys(corresp)) {
                    //TODO: sistemare qui
                    for (var j = 0; j < corresp[Object.keys(corresp)[i]].length; j++) {
                        if (corresp[Object.keys(corresp)[i]][j] === currentQuote) {
                            segToAlign = corresp[Object.keys(corresp)[i]][j];
                        }
                    }
                        
                }
                
                if (segToAlign !== '') {
                    evtSourceSeg.updateCurrentQuote(currentQuote);
                    evtBox.alignScrollToQuote(segToAlign);
                }
            }
        }
    };
});