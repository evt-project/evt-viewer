angular.module('evtviewer.glossary')

.directive('w', function(parsedData, config) {
    return {
        restrict: 'C',
        link: function($scope, element, attrs) {
            element.click(function() {
                if (parsedData.getGlossaryStatus() !== 'loaded') {
                    alert('Glossary not loaded yet. Please try again later.');
                } else {
                    var lemma;
                    var lemmaref;
                    var word;

                    if (attrs["lemma"] !== undefined ){
                        alert("dentro");
                        word=attrs["lemma"];
                    } 
                    else {
                        word = element.text().trim();
                    }
                    
                    console.log(lemma);
                    /*var lemma=element.getAttribute("data-lemma");
                    alert(lemma);*/
                    var wordTS = word.toUpperCase();
                    var glossaryEntry = parsedData.getGlossaryEntryById(wordTS);
                    var glossUrl ="";
                    if (attrs["lemmaref"] !== undefined){
                        glossUrl=attrs["lemmaref"];
                    } 
                    else{
                        if (config.glossaryUrl == "data/glossDucange.xml"){
                            glossUrl = "http://ducange.enc.sorbonne.fr/" + word;
                        }
                        else if (config.glossaryUrl == "data/glossarioXML.xml"){
                            glossUrl = "http://bosworth.ff.cuni.cz/finder/3/" + word;
                        }
                    }
                    if (glossaryEntry) {
                        console.log(glossaryEntry);
                        alert('DO SOMETHING FOR "' + glossaryEntry.content + " " + glossUrl);
                    } /*else {
                        var len=Math.round((wordTS.length)/2)+1;
                        var entries = parsedData.getGlossaryEntry();
                        for (var key in entries){
                            var rad1="";
                            var rad2=""
                            for (i=0; i<len;i++){
                                    rad1 += key[i];
                                    rad2 += wordTS[i];
                                }
                            //alert(rad1 + "    "+ rad2);
                            if (rad1 == rad2){
                                glossaryEntry = parsedData.getGlossaryEntryById(key);
                                alert('Do for' + glossaryEntry.content)
                                break;
                            }
                        }
                        //alert('Entry not found in glossary' + glossUrl);
                    }*/
                }
            });
        }
    }
});