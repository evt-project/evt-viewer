angular.module('evtviewer.criticalApparatusEntry')

.directive('evtWitnessRef', function(evtCriticalApparatusEntry, evtBox, parsedData, evtInterface) {
    return {
        restrict: 'E',
        require: '^evtCriticalApparatusEntry',
        scope: {
            witness  : '@',
            scopeWit : '@'
        },
        transclude: true,
        templateUrl: 'src/criticalApparatusEntry/criticalApparatusEntry.witnessRef.directive.tmpl.html',
        link: function(scope, element, attrs){
            if (scope.scopeWit === scope.witness) {
                scope.title = scope.witness+' is the current witness';
            } else {
                scope.title = 'Open witness '+scope.witness+' next to this box';
            }
            scope.openWit = function(){
                var newWit = scope.witness,
                    scopeWit = scope.scopeWit;
                
                if (newWit !== scopeWit) {
                    var witnesses = evtInterface.getCurrentWitnesses(),
                        scopeWitnessIndex = witnesses.indexOf(scopeWit);
                    if ( witnesses.indexOf(newWit) >= 0 ) {
                        evtInterface.removeWitness(newWit);
                    }
                    if (scopeWitnessIndex !== undefined) {
                        evtInterface.addWitnessAtIndex(newWit, scopeWitnessIndex+1);
                    }
                    if (evtInterface.getCurrentView !== 'collation') {
                        evtInterface.updateCurrentViewMode('collation');
                    }
                    evtInterface.updateUrl();
                    var currentAppId = evtInterface.getCurrentAppEntry() || '';
                    if (currentAppId !== '') {
                        var newBox = evtBox.getElementByValueOfParameter('witness', newWit);
                        if (newBox !== undefined) {
                            newBox.scrollToAppEntry(currentAppId);
                        }
                    }
                }

            };
        }
    };
});