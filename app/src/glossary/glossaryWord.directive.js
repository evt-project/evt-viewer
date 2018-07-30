angular.module('evtviewer.glossary')

.directive('w', function(parsedData, config) {
    return {
        restrict: 'C',
        link: function($scope, element, attrs) {
            element.click(function() {
                if (parsedData.getGlossaryStatus() !== 'loaded') {
                    alert('Glossary not loaded yet. Please try again later.');
                } else {
                    var word = element.text().trim();
                    var wordTS = word.toUpperCase();
                    var glossaryEntry = parsedData.getGlossaryEntryById(wordTS);
                    var glossUrl
                    if (config.glossaryUrl == "data/glossDucange.xml"){
                        glossUrl = "http://ducange.enc.sorbonne.fr/" + word;
                    }
                    else if (config.glossaryUrl == "data/glossarioXML.xml"){
                        glossUrl = "http://bosworth.ff.cuni.cz/finder/3/" + word;
                    }
                    if (glossaryEntry) {
                        console.log(glossaryEntry);
                        alert('DO SOMETHING FOR "' + glossaryEntry.content + " " + glossUrl);
                    } else {
                        alert('Entry not found in glossary' + glossUrl);
                    }
                }
            });
        }
    }
});