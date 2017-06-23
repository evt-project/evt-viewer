angular.module('evtviewer.versionApparatusEntry')

.directive('evtVersionRef', function(evtVersionRef){
    return {
        restrict: 'E',
        scope: {
            type : '@',
            target : '@',//id of the element to open or external link
            elId : '@' //id of the current element
        },
        transclude: true,
        templateUrl : 'src/versionApparatusEntry/versionRef.directive.tmpl.html',
        link: function(scope, element, attrs) {
            scope.vm = {};
            var currentRef = evtVersionRef.build(scope);
            scope.$on('$destroy', function() {
                if (currentRef) {
                    evtVersionRef.destroy(currentRef.uid);
                }
            });
        }
    };
});