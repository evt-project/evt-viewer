
angular.module('evtviewer.glossary')

.directive('w', function(parsedData){
    return{
        restrict: 'C', 
        link: function ($scope, element, attrs){
            element.click(function() {
            	word = element.text().trim();
            	wordTS = word.toUpperCase();
            	
            	xml = parsedData.getExternalDocuments()['gloss'].content;
             	allEntry = xml.getElementsByTagName("entry");
             	
            	for (i=0; i<allEntry.length;i++){
					id = allEntry[i].getAttribute("xml:id");
					if (id==wordTS){
						def = allEntry[i].innerHTML;
					}
				}
                alert('DO SOMETHING FOR "' + element.text().trim() + '"' + def);
            });
        }
    }
});