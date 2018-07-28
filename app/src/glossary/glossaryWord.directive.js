angular.module('evtviewer.glossary')

.directive('w', function(parsedData) {
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
                    
                    if (glossaryEntry) {
                        console.log(glossaryEntry);
                        alert('DO SOMETHING FOR "' + glossaryEntry.content);
                    } else {
                        alert('Entry not found');
                    }
                }
            });
        }
    }
});