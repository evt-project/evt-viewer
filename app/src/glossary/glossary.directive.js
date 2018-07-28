angular.module('evtviewer.glossary')

.directive('evtGlossary', function(parsedData) {
    return {
        restrict: 'E',
        templateUrl: 'src/glossary/glossary.directive.tmpl.html',
        controller: 'GlossaryCtrl'
    }
});