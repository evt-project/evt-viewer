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
                console.log('Hey there!',  appContent.quote);

        //appContent.quote = 'collegamento riuscito';

        return appContent;
    };

    apparatus.getQuote = function (quote, scopeWit) {
        var content = quote.content || [];
        var result = '';
        for (var i in content) {
            if (typeof content[i] === 'string') {
                result += '<span class="textNode">'+content[i]+'</span>';
            } else {
                var skip = ['EVT-POPOVER', 'lb', 'ptr', 'link', 'linkGrp', 'pb'];
                if (skip.indexOf(content[i].tagName) >= 0) {
                    result += '';
                } else if (content[i].type === 'app') {
                    result += apparatus.getAppText(content[i], scopeWit);
                } //else if...analogue --> AnaloguesApparatus.getQuote(analogue).
                else if (content[i].type === 'quote') {
                    result += '<span class="sub_quote"> (('+apparatus.getQuote(content[i], scopeWit)+')) </span>';
                } else if (content[i].content !== undefined) {
                    result += apparatus.getText(content[i]);
                } else {
                    result += apparatus.getQuote(content[i]);
                }
            }
        }
        return result;
    }

    apparatus.getText = function(entry) {
        var result = '';
        var content = entry.content;
        for (var i in content){
            if (typeof content[i] === 'string') {
                result += '<span class="textNode">'+content[i]+'</span>';
            } else if (content[i].content !== undefined) {
                for (var j = 0; j < content[i].content.length; j++) {
                    result += apparatus.getText(content[i].content[j]);
                }
            }
        }
        return result;
    }

     apparatus.getAppText = function(entry, scopeWit){
            var result = '';
            if (scopeWit === ''
                || scopeWit === undefined
                || entry._indexes.witMap[scopeWit] === undefined) {
                    var lem = entry.lemma;
                    result += apparatus.getText(entry.content[lem]);
                } else {
                    var rdg = entry._indexes.witMap[scopeWit];
                    result += apparatus.getText(entry.content[rdg]);
                }
            return result;
        }

    return apparatus;
});