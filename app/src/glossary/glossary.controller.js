angular.module('evtviewer.glossary')

.controller("CtrlGloss", function($scope, $http, baseData, parsedData){
	$http.get("src/glossary/glossDucange.xml").then(function (response){
		baseData.addXMLExtDocument(response.data, 'gloss');
	})
})