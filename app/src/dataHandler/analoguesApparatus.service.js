angular.module('evtviewer.dataHandler')

.service('evtAnaloguesApparatus', function(parsedData, evtParser, config, evtSourcesParser, evtCriticalApparatusParser, evtAnaloguesParser) {
    var apparatus = {};

    apparatus.getContent = function(analogue, scopeWit) {
        // console.log('getContent', analogue);
        var appContent = {
            attributes : {
                values: analogue.attributes || {},
                _keys: Object.keys(analogue.attributes) || []
            },
            sources : [], //Elenco delle fonti, ognuna con tutte le info necessarie
            //text: '', //Testo
            header: '', //Intestazione dell'entrata d'apparato
            //_sourceXml: [],
            _xmlSource: analogue._xmlSource.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, '') //Xml della citazione, cui si aggiungerà anche l'xml della source selezionata

        }
        
        for (var i = 0; i < analogue.sources.length; i++) {
            var source = apparatus.getSource(analogue.sources[i]);
            appContent.sources.push(source);
        }

        appContent.header = apparatus.getHeader(analogue, scopeWit);

        return appContent;
    };

    apparatus.getSource = function(entry) {
        var source = {
            id: entry.id,
            author: '',
            title: '',
            _xmlSource: entry._xmlSource.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, ''),
            text: '',
            bibl: '',
            url: entry.url
        }

        //Transform the bibliographic reference into strings
        var bibref = entry.bibl;
        for (var i = 0; i < bibref.length; i++) {
            source.bibl += apparatus.getText(bibref[i]);
        }
        
        //Tranform the names of the authors into strings
        var author = entry.author;
        for (var i = 0; i < author.length; i++) {
            source.author += apparatus.getText(author[i]);
        }

        //Get the text cited
        var text = '';
        if (entry.text.length > 0) {
            for (var i = 0; i < entry.text.length; i++) {
                text += apparatus.getText(entry.text[i]);
            }
            if (text !== '') {
                source.text = text;
            }
        }
        

        return source;
    };

    apparatus.getHeader = function (analogue, scopeWit) {
        var content = analogue.content || [];
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
                } else if (content[i].type === 'analogue') {
                    result += '(('+apparatus.getHeader(content[i], scopeWit)+'))';
                } else if (content[i].type === 'quote') {
                    result += '<span class="sub_quote"> (('+evtSourcesApparatus.getQuote(content[i], scopeWit)+')) </span>';
                } else if (content[i].content !== undefined) {
                    result += apparatus.getText(content[i]);
                } /*else {
                    result += apparatus.getHeader(content[i]);
                }*/
            }
        }
        return result;
    }

    //Eventualmente aggiungere parametro stringa per il valore della class di span (tipo 'author' o 'textNode')
    apparatus.getText = function(entry) {
        var result = '';
        var content = entry.content;
        if (content !== undefined) {
            for (var i = 0; i < content.length; i++) {
                if (typeof content[i] === 'string') {
                    result += '<span class="textNode">'+content[i]+'</span>';
                } else if (content[i].content !== undefined) {
                    result += apparatus.getText(content[i]);
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