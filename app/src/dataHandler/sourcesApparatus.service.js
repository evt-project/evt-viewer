angular.module('evtviewer.dataHandler')

.service('evtSourcesApparatus', function(parsedData, evtParser, config, evtSourcesParser, evtCriticalApparatusParser) {
    var apparatus = {};

    apparatus.getContent = function(quote, scopeWit) {
        // console.log('getContent', quote);
        var appContent = {
            attributes : {
                values: quote.attributes || {},
                _keys: Object.keys(quote.attributes) || []
            },
            sources : [], //Elenco delle fonti, ognuna con tutte le info necessarie
            text: '', //Testo della fonte, tab apposito
            quote: '', //Intestazione
            _xml: [] //Xml della citazione, cui si aggiungerà anche l'xml della source selezionata

        }
        
        appContent.quote = apparatus.getQuote(quote, scopeWit);
        //appContent.quote = 'collegamento riuscito';

        return appContent;
    };

    apparatus.getQuote = function (quote, scopeWit) {
        var content = quote.content || [];
        var result = '';
        for (var i in content) {
            if (typeof content[i] === 'string') {
                result += content[i];
            } else {
                if (content[i].tagName === 'EVT-POPOVER'){
                    result += '';
                } else if (content[i].type === 'app') {
                    if (scopeWit === '' || scopeWit === undefined) {
                        result += ''//evtCriticalApparatusParser.getEntryLemmaText(content[i]).innerHTML;
                    } else {
                        result += ''//evtCriticalApparatusParser.getEntryWitnessReadingText(content[i], scopeWit);
                    }
                } //else if...
                else if (content[i].type === 'quote') {
                    result += '<span class="sub_quote"> (('+apparatus.getQuote(content[i], scopeWit)+')) </span>';
                } else if (content[i].content !== undefined) {
                     if (content[i].content.length === 1 && typeof content[i].content[0] === 'string') {
                    result += content[i].content[0];
                } else {
                    for (var j = 0; j < content[i].content.length; j++) {
                        result += apparatus.getQuote(content[j], scopeWit);
                    }
                }
            }
            }
        }
        return result;
    }
    return apparatus;
});