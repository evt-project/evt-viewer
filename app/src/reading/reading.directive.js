angular.module('evtviewer.reading')

.directive('evtReading', function(evtReading, parsedData) {
    return {
        restrict: 'E',
        scope: {
            appId       : '@',
            readingId   : '@',
            readingType : '@',
            variance    : '@'
        },
        transclude: true,
        templateUrl: 'src/reading/reading.directive.tmpl.html',
        controllerAs: 'vm',
        controller: 'ReadingCtrl',
        link: function(scope, element, attrs){
            // Initialize reading
            var currentReading = evtReading.build(scope.appId, scope);

            if (scope.vm.variance !== undefined) {
                var readingElem     = angular.element(element).find('.reading__text')[0];
                var entry = parsedData.getCriticalEntryByPos(scope.appId);
                var significantReadings = entry._indexes.readings._significant;
                if (entry.lemma !== '' && significantReadings.indexOf(entry.lemma) >= 0) {
                    significantReadings -= 1; //escludo lemma
                }
                var totWits = parsedData.getWitnessesList().length,
                    opacity = significantReadings/totWits;
                angular.element(readingElem).css('background', 'rgba(255, 138, 101, '+opacity+')');
            }

            scope.vm.toggleTooltipHover = function(e, vm) {
                e.stopPropagation();
                vm.toggleTooltipOver();
            };
            // Garbage collection
            scope.$on('$destroy', function() {
                if (currentReading){
                    currentReading.destroy();
                }     
            });
        }
    };
});