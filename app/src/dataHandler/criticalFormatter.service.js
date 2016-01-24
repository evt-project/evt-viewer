angular.module('evtviewer.dataHandler')

.service('evtCriticalFormatter', function(parsedData, evtParser) {
    var formatter = {};

    formatter.formatCriticalEntry = function(entry) {
        // console.log('formatCriticalEntry', entry);
        var appText  = '',
            readings = entry.readings,
            content  = '',
            i        = 0;
        // se entry e' un raggruppamento di letture (<app> o <rdgGrp>), avra' delle letture
        if (readings !== undefined) {
            // ciclo le letture per ottenere la stampa del testo con sigla testimone
            for (i = 0; i < readings.length; i++) {
                var reading    = readings[readings[i]],
                    text       = '',
                    witnesses  = '',
                    attributes = '';

                if (readings.__elemTypes[readings[i]] === 'lem' || readings.__elemTypes[readings[i]] === 'rdg') { //lem o rdg
                    // recupero il contenuto
                    content = reading.content || [];
                    for (var j = 0; j < content.length; j++) {
                        if (typeof content[j] === 'object') { //annidamento
                            text += '{'+formatter.formatCriticalEntry(content[j])+'} ';
                        } else {
                            text += content[j];
                        }
                    }
                } else if (readings.__elemTypes[readings[i]] === 'rdgGrp' || readings.__elemTypes[readings[i]] === 'app') { //rdgGrp o app
                    text += '{'+formatter.formatCriticalEntry(reading)+'} ';
                }
                if (text === '') {
                    text = '<i>omit.</i>';
                }
                text = text.replace(/<lacunaStart(.|[\r\n])*?\/>/ig, '<i>beginning of a lacuna in </i>');
                text = text.replace(/<lacunaEnd(.|[\r\n])*?\/>/ig, '<i>end of a lacuna in </i>');
                // recupero i testimoni e gli altri attributi
                if (reading.attributes !== undefined) {
                    for (var key in reading.attributes) {
                        if (key === 'wit') {
                            var wits = reading.attributes[key].split('#').filter(function(el) {return el.length !== 0;});
                            for(var s = 0; s < wits.length; s++ ){
                                var sigla = wits[s].replace(' ', '');
                                if (parsedData.isWitnessesGroup(sigla)) {
                                    var witnessesInGroup = parsedData.getWitnessesInGroup(sigla);
                                    if (witnessesInGroup.length > 0) {
                                        for(var w = 0; w < witnessesInGroup.length; w++ ){
                                            witnesses += '<evt-witness-ref witness="'+witnessesInGroup[w]+'"/>';
                                        }
                                    } else {
                                        witnesses += '<evt-witness-ref witness="'+sigla+'"/>';    
                                    }
                                } else {
                                    witnesses += '<evt-witness-ref witness="'+sigla+'"/>';
                                }
                            }
                        } else {
                            attributes += '<span class="'+key+'">'+reading.attributes[key]+'</span>';
                        }
                    }
                }
                if (attributes !== '') {
                    attributes = '<span class="attributes">'+attributes+'</span>';
                }
                if (witnesses !== '') {
                    witnesses = '<span class="witnesses witnesses-'+readings.__elemTypes[readings[i]]+'">'+witnesses+'</span>';
                }
                appText += text + witnesses + attributes;
                if (readings.__elemTypes[readings[i]] === 'lem') {
                    appText = '<span class="variance variance-lem">'+appText+' ]</span> ';        
                } else {
                    appText += '; ';
                }
            }
            appText = appText.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, '');
            var fragmentsStarts = appText.match(/<witStart(.|[\r\n])*?\/>/ig);
            if (fragmentsStarts !== null) {
                for (var i = 0; i < fragmentsStarts.length; i++) {
                    var matched = fragmentsStarts[i];
                    var wit = matched.match(/"#.*"/g);
                    if (wit !== null) {
                        wit = ' of '+wit[0].replace(/["#]/g, '');
                    } else {
                        wit = '';
                    }
                    var sRegExInput = new RegExp(matched, 'ig'); 
                    appText = appText.replace(sRegExInput, '<i> [beginning of fragment'+wit+'] </i>');
                    // text = text.replace(fragmentsStarts[i], )
                }
            }

            var fragmentsEnds = appText.match(/<witEnd(.|[\r\n])*?\/>/ig);
            if (fragmentsEnds !== null) {
                for (var i = 0; i < fragmentsEnds.length; i++) {
                    var matched = fragmentsEnds[i];
                    var wit = matched.match(/"#.*"/g);
                    if (wit !== null) {
                        wit = ' of '+wit[0].replace(/["#]/g, '');
                    } else {
                        wit = '';
                    }
                    var sRegExInput = new RegExp(matched, 'ig'); 
                    appText = appText.replace(sRegExInput, '<i> [end of fragment'+wit+'] </i>');
                }
            }
        } 
        return appText.trim().slice(0, -1);
    };

    return formatter;
});