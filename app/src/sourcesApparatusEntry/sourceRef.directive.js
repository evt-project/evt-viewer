/**
 * @ngdoc directive
 * @module evtviewer.sourcesApparatusEntry
 * @name evtviewer.sourcesApparatusEntry.directive:evtSourceRef
 * @description 
 * # evtSourceRef
 * <p>Custom directive that will handle the connection between the source and the text in the Source-Text View.</p>
 * <p>The {@link evtviewer.sourcesApparatusEntry.controller:sourceRefCtrl controller} for this directive is dynamically defined 
 * inside the <code>link</code> function.</p>
 * @scope
 * @param {string=} sourceId id of source
 * @param {string=} sourceAbbr abbreviation of source
 *
 * @restrict E
 *
 * @author CM
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

            /**
             * @ngdoc object
             * @module evtviewer.sourcesApparatusEntry
             * @name evtviewer.sourcesApparatusEntry.controller:sourceRefCtrl
             * @description 
             * # sourceSegCtrl
             * This is the controller for the {@link evtviewer.sourcesApparatusEntry.directive:evtSourceRef evtSourceRef} directive. 
             *
             * @author CM
            **/
            /**
             * @ngdoc method
             * @name evtviewer.sourcesApparatusEntry.controller:sourceRefCtrl#openSource
             * @methodOf evtviewer.sourcesApparatusEntry.controller:sourceRefCtrl
             *
             * @description
             * <p>Open the source connected to the scope quote.</p>
             * <p>It updates the source to show inside of the source text box.</p>
             * <p>It switches to the "Source-Text" view.</p>
             * <p>It checks if the selected quote has a corresponding segment inside of the souce text.
             * If so, it saves the reference inside of the the "segToAlign" variable.</p>
             */
            scope.openSource = function() {
                
                var newSource = scope.sourceId;

                //Updates the source to show inside of the source text box
                if (evtInterface.getState('currentSourceText')  !== newSource) {
                    evtInterface.updateCurrentSourceText(newSource);
                    evtInterface.updateState('currentSource', newSource);
                }
                
                //Switches to the "Source-Text" view
                if (evtInterface.getState('currentViewMode') !== 'srcTxt') {
                    evtInterface.updateState('currentViewMode', 'srcTxt');
                }

                //TODO: evtInterface.updateUrl();
                
                // Checks if the selected quote has a corresponding segment inside of the souce text. //
                // If so, it saves the reference inside of the the "segToAlign" variable. //
                var quoteToAlign = '',
                    segToAlign = '',
                    currentQuote = evtInterface.getState('currentQuote')  || '',
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