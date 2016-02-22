angular.module('evtviewer.dataHandler')

.service('evtCriticalFormatter', function(parsedData, evtParser) {
    var formatter = {};

    formatter.formatCriticalEntry = function(entry) {
        // console.log('formatCriticalEntry', entry);
        var appText  = '',
            readings = entry.readings,
            i        = 0;

        // se entry e' un raggruppamento di letture (<app> o <rdgGrp>), avra' delle letture
        if (readings !== undefined) {
            // ciclo le letture per ottenere la stampa del testo con sigla testimone
            for (i = 0; i < readings.length; i++) {
                var reading  = readings[readings[i]]
                    elemType = readings.__elemTypes[readings[i]];

                if ( entry.__lacuna === undefined || (entry.__lacuna && reading.content.toString().indexOf('lacuna') >= 0) ) {
                    appText += formatter.formatCriticalEntryContent(reading, elemType);

                    if (elemType === 'lem') {
                        appText = '<span class="variance variance-lem">'+appText+' ]</span> ';        
                    } else {
                        appText += '; ';
                    }
                }
            }
            
            appText = appText.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, '');
            
            formatter.formatCriticalEntryFragmentMilestones(appText);
        } 
        return appText.trim().slice(0, -1);
    };

    formatter.formatCriticalEntryContent = function(reading, elemType){
        var text    = '',
            content = '';
        if (elemType === 'lem' || elemType === 'rdg') { //lem o rdg
            // recupero il contenuto
            content = reading.content || [];
            for (var j = 0; j < content.length; j++) {
                if (typeof content[j] === 'object') { //annidamento
                    text += '{'+formatter.formatCriticalEntry(content[j])+'} ';
                } else {
                    text += content[j];
                }
            }
        } else if (elemType === 'rdgGrp' || elemType === 'app') { //rdgGrp o app
            text += '{'+formatter.formatCriticalEntry(reading)+'} ';
        }
        if (text === '') {
            text = '<i>omit.</i>';
        }
        
        text = formatter.formatCriticalEntryLacunaMilestones(text);
        
        // recupero i testimoni e gli altri attributi
        var witsAndAttr = formatter.formatCriticalEntryAttributes(reading, elemType);

        return text + witsAndAttr;
    };

    formatter.formatCriticalEntryAttributes = function(reading, elemType) {
        var witnesses  = '',
            attributes = '';
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
                                    witnesses += '<evt-witness-ref witness="'+witnessesInGroup[w]+'"></evt-witness-ref>';
                                }
                            } else {
                                witnesses += '<evt-witness-ref witness="'+sigla+'"></evt-witness-ref>';
                            }
                        } else {
                            witnesses += '<evt-witness-ref witness="'+sigla+'"></evt-witness-ref>';
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
            witnesses = '<span class="witnesses witnesses-'+elemType+'">'+witnesses+'</span>';
        }
        return witnesses+attributes;
    };

    formatter.formatCriticalEntryLacunaMilestones = function(appText){
        appText = appText.replace(/<lacunaStart(.|[\r\n])*?\/>/ig, '<i>beginning of a lacuna in </i>');
        appText = appText.replace(/<lacunaEnd(.|[\r\n])*?\/>/ig, '<i>end of a lacuna in </i>');
        return appText;
    };
    
    formatter.formatCriticalEntryFragmentMilestones = function(appText){
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
    };
    return formatter;
});