angular.module('evtviewer.dataHandler')

.service('evtSourcesApparatus', function(parsedData, evtParser, config, evtSourcesParser, evtCriticalApparatus, evtCriticalApparatusParser) {
    var apparatus = {};

    apparatus.getContent = function(quote, scopeWit) {
        // console.log('getContent', quote);
        var appContent = {
            attributes : {
                values: quote.attributes || {},
                _keys: Object.keys(quote.attributes) || []
            },
            sources : [], //Elenco delle fonti, ognuna con tutte le info necessarie
            //text: '', //Testo
            quote: '', //Intestazione dell'entrata d'apparato, che corrisponde alla citazione
            //_sourceXml: [],
            _xmlSource: quote._xmlSource.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, '') //Xml della citazione, cui si aggiungerà anche l'xml della source selezionata

        }
        
        var sourceId = quote._indexes.sourceId || [];
        var sourceRefId = quote._indexes.sourceRefId || [];
        for (var i = 0; i < sourceId.length; i++) {
            var source = parsedData.getSource(sourceId[i]);
            var entry = apparatus.getSource(source);
            appContent.sources.push(entry);
        }
        for (var j = 0;  j < sourceRefId.length; j++) {
            var source = parsedData.getSource(sourceRefId[j]);
            var entry = apparatus.getSource(source);
            appContent.sources.push(entry);
        }

        appContent.quote = apparatus.getQuote(quote, scopeWit);

        return appContent;
    };

    apparatus.getSource = function(entry) {
        var source = {
            id         : entry.id,
            abbr       : '',
            text       : '',
            bibl       : '',
            url        : '',
            _xmlSource : entry._xmlSource.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, ''),
        }
        
        //Creates the abbreviated reference of the source with ms identifier...
        if (entry.abbr.msId.length > 0) {
            for (var i = 0; i < entry.abbr.msId.length; i++) {
                source.abbr += '<span class="msId inSource">'+apparatus.getText(entry.abbr.msId[i])+'</span>';
            }
        } else {
            //...or author and title.
            if (entry.abbr.author.length > 0) {
                source.abbr += '<span class="author inSource">'+apparatus.getText(entry.abbr.author[0])+'</span>';
                if (entry.abbr.author.length > 1) {
                    source.abbr += 'et al., ';
                } else {
                    source.abbr += ', ';
                }
            }
            if (entry.abbr.title.length > 0) {
                source.abbr += '<span class="title inSource">'+apparatus.getText(entry.abbr.title[0])+'</span>';
            }
        }
        //If there is no author nor title, it uses the xml:id
        if (source.abbr === '') {
            source.abbr = entry.id;
        }
        
        var bibref = entry.bibl;
        for (var i = 0; i < bibref.length; i++) {
            source.bibl += apparatus.getText(bibref[i]);
        }

        //Get the text cited
        var text = '';
        if (entry.quote.length > 0) {
            for (var i = 0; i < entry.quote.length; i++) {
                text += apparatus.getText(entry.quote[i]);
            }
            if (text !== '') {
                source.text = text;
            }
        }
        
        //Prepares the links to the source text (online or in the source view)
        if (entry.url.length === 1) {
            if (entry.url[0].indexOf("http") >= 0) {
                source.url += '<span class="linkLabel">See source text online</span><a target="_blank" href="'+entry.url[0]+'">'+entry.url[0]+'</a><br/>';
            } else if (entry.url[0].indexOf(entry.id) >= 0) {
                source.url += '<span class="linkLabel">See source text in the "Source-Text" view</span><evt-source-ref data-source-id="'+entry.id+'">'+source.abbr+'</evt-source-ref>'
            }
        }

        return source;
    };

    apparatus.getSourceAbbr = function(entry) {
        var abbr = '';
        if (entry.abbr.msId.length > 0) {
            for (var i = 0; i < entry.abbr.msId.length; i++) {
                abbr += apparatus.getText(entry.abbr.msId[i])+' ';
            }
        } else {
            //...or author and title.
            if (entry.abbr.author.length > 0) {
                abbr += apparatus.getText(entry.abbr.author[0]);
                if (entry.abbr.author.length > 1) {
                    abbr += 'et al., ';
                } else {
                    abbr += ', ';
                }
            }
            if (entry.abbr.title.length > 0) {
                abbr += apparatus.getText(entry.abbr.title[0]);
            }
        }
        //If there is no author nor title, it uses the xml:id
        if (abbr === '') {
            abbr = entry.id;
        }
        return abbr;
    };

    apparatus.getQuote = function (quote, scopeWit) {
        var content = quote.content || [];
        var result = '';
        for (var i in content) {
            if (typeof content[i] === 'string') {
                result += ' '+content[i];
            } else {
                var skip = ['EVT-POPOVER', 'lb', 'ptr', 'link', 'linkGrp', 'pb'];
                if (skip.indexOf(content[i].tagName) >= 0) {
                    result += '';
                } else if (content[i].type === 'app') {
                    result += apparatus.getAppText(content[i], scopeWit);
                } else if (content[i].type === 'analogue') {
                    result += evtCriticalApparatus.getCriticalElementContent(content[i], scopeWit);
                } else if (content[i].type === 'quote') {
                    result += ' (('+apparatus.getQuote(content[i], scopeWit)+'))';
                } else if (content[i].content !== undefined) {
                    result += apparatus.getText(content[i]);
                } else {
                    result += apparatus.getQuote(content[i]);
                }
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
                    result += ' '+content[i];
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