angular.module('evtviewer.glossary')

.controller("CtrlGloss", function($scope, $http, baseData){
	$http.get("src/glossary/glossDucange.xml").then(function (response){
		baseData.addXMLExtDocument(response.data, "gloss"); 
	})
})