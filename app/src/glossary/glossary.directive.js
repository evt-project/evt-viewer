
angular.module('evtviewer.glossary')

.directive('w', function(){
    return{
        restrict: 'C', 
        link: function ($scope, element, attrs){
            element.click(function() {
                alert('DO SOMETHING FOR "' + element.text().trim() + '"');
            });
        }
    }
});