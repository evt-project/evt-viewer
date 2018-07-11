
var app = angular.module('evtviewer.glossary', [])

app.directive('titolo', function(){
	return{
	restrict: "EAC", 
	templateUrl: "/src/glossary/glossary.dir.tmpl.html",
	link: function ($scope, element, attrs){
		var documentResult = document.getElementsByClassName("w");
      	console.log('document.getElementsByClassName: ', documentResult);
      	
		if (documentResult.length>0){
			alert("dentro");}
		
      	//console.log('document.getElementsByClassName: ', documentResult[0]);
	}
}
});