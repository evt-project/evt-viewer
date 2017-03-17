angular.module('evtviewer.search')

.directive('evtSearchBox', function(evtButtonSwitch) {
    return {
        restrict: 'E',
        templateUrl: 'src/search/searchBox.directive.tmpl.html',
        replace: true
    };
});