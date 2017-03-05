angular.module('evtviewer.dataHandler')

.controller('StyleSelectorCTRL', function($scope,config) {
	$scope.notify = function(selectedStyle){
		$scope.$emit('styleChangedEmit', {message: selectedStyle});
	}
	$scope.styles = config.allowedBibliographicStyles;

	//non volendo abusare di $watch all'inizio diamo un valore manuale alla select
	$scope.selectedStyle = $scope.styles[0];	
	//visto che non usiamo $watch, non viene lanciato ng-change,quindi dobbiamo farlo manualmente
	$scope.notify($scope.selectedStyle);},0);
