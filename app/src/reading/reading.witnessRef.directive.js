angular.module('evtviewer.reading')

.directive('evtWitnessRef', function(evtReading, parsedData, evtInterface) {
    return {
        restrict: 'E',
        require: '^evtReading',
        scope: {
            witness  : '@',
            scopeWit : '@'
        },
        transclude: true,
        templateUrl: 'src/reading/reading.witnessRef.directive.tmpl.html',
        link: function(scope, element, attrs){
            // Initialize reading
            if (scope.scopeWit === scope.witness) {
                scope.title = scope.witness+' is the current witness';
            } else {
                scope.title = 'Open witness '+scope.witness+' next to this box';
            }
            scope.openWit = function(){
                var newWit = scope.witness,
                    scopeWit = scope.scopeWit;
                if (evtInterface.getCurrentView !== 'critical') {
                    evtInterface.updateCurrentViewMode('critical');
                }
                if (newWit !== scopeWit) {
                    var witnesses = evtInterface.getCurrentWitnesses(),
                        scopeWitnessIndex = witnesses.indexOf(scopeWit);
                    if ( witnesses.indexOf(newWit) >= 0 ) {
                        evtInterface.removeWitness(newWit);
                    }
                    if (scopeWitnessIndex !== undefined) {
                        evtInterface.addWitnessAtIndex(newWit, scopeWitnessIndex+1);
                    }
                    evtInterface.updateUrl();
                }
            };
        }
    };
})