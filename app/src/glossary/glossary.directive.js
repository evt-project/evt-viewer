
var app = angular.module('evtviewer.glossary', [])

app.directive('titolo', function(){
	return{
		restrict: "A", 
		//templateUrl: "/src/glossary/glossary.dir.tmpl.html",
		link: function ($scope, element, attrs){
			element.ready(function(){
				console.log("document ready");
				var documentResult = document.getElementsByClassName("w");
	      		console.log('document.getElementsByClassName: ', documentResult);
	      		setTimeout(function(){ console.log("lunghezza", documentResult.length);
	      			for (i=0;i<documentResult.length;i++){
	      			//console.log("nel for");
	      			documentResult[i].addEventListener("click", function(event){
    					alert(this.innerHTML);
    				event.stopPropagation();
	      			})
	      		}
				}, 100);
	      		
	      		
			})
		}
	}
});