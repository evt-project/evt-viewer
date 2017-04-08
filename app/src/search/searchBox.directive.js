angular.module('evtviewer.search')

.directive('evtSearchBox', function(evtSearchBox) {
    return {
        restrict    : 'E',
        templateUrl : 'src/search/searchBox.directive.tmpl.html',
        replace     : true,
        controllerAs: 'vm',
        controller  : 'SearchBoxCtrl',
        link : function(scope, element, attrs) {
            
            // Initialize search box
            var search = evtSearchBox.build(scope, scope.vm);
            
            // Garbage collection
            scope.$on('$destroy', function() {
               if (search) {
                   search.destroy();
               } 
            });
        }
    };
});