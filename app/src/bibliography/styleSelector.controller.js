angular.module('evtviewer.dataHandler')

.controller('StyleSelectorCTRL', function($scope,config) {
	$scope.notify = function(selectedStyle){
		$scope.$emit('styleChangedEmit', {message: selectedStyle});
	}
	$scope.styles = config.allowedBibliographicStyles;
});