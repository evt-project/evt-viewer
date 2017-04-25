angular.module('evtviewer.sourcesApparatusEntry')

.directive('evtSourceRef', function(evtSourcesApparatusEntry, evtBox, evtInterface, parsedData) {
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

                if (evtInterface.getCurrentSourceText() !== newSource) {
                    evtInterface.updateCurrentSourceText(newSource);
                    evtInterface.updateCurrentSource(newSource);
                }
                    if (evtInterface.getCurrentViewMode() !== 'srcTxt') {
                        evtInterface.updateCurrentViewMode('srcTxt');
                    }

                    //TODO: evtInterface.updateUrl();

                    var segToAlign = '';
                    var currentQuote = evtInterface.getCurrentQuote() || '';
                    var corresp = parsedData.getSources()._indexes.correspId[scope.sourceId] || [];
                    for (var i in Object.keys(corresp)) {
                        //TODO: sistemare qui
                        for (var j = 0; j < corresp[i].length; j++) {
                            if (corresp[i][j].indexOf(currentSource) >= 0) {
                                segToAlign = corresp[i][j];
                            }
                        }
                        
                    }
                    if (segToAlign !== '') {
                        var newBox = evtBox.getElementByValueOfParameter('witness', newWit);
                        if (newBox !== undefined) {
                            newBox.scrollToQuotesEntry(segToAlign);
                        }
                    }
                
            }
        }
    }
})