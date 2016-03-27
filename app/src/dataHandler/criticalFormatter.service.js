angular.module('evtviewer.dataHandler')

.service('evtCriticalFormatter', function(parsedData, evtParser) {
    var formatter = {};

    formatter.formatCriticalEntry = function(entry, subApp, scopeWit) {
        // console.log('formatCriticalEntry', entry);
        var apparatus = {
            attributes             : {
                values : entry.attributes || {},
                _keys  : Object.keys(entry.attributes) || []
            },
            lemma                  : '',
            significantReadings    : [],
            notSignificantReadings : [],
            readingGroups          : [],
            criticalNote           : ''
        };

        //Lemma
        var lemma = entry.content[entry.lemma];
        if (lemma !== undefined) {
            apparatus.lemma += '<span class="reading__lemma">'+formatter.formatLemma(lemma, scopeWit)+'</span>';
        }

        //Significant Readings
        var readings = entry._indexes.readings;
        var totReadings = readings._indexes;
        for (var i = 0; i < totReadings.length; i++) {
            var reading = entry.content[totReadings[i]];
            if (reading !== undefined) {
                if (readings._significant.indexOf(reading.id) >= 0) {
                    apparatus.significantReadings.push(formatter.formatSignificantReading(reading, scopeWit));
                } else {
                    apparatus.notSignificantReadings.push(formatter.formatSignificantReading(reading, scopeWit));
                }
            }
        }
        
        if (!subApp) {
            //Raggruppamenti
            if (entry._indexes.groups.length > 0) {
                for (var i = 0; i < entry._indexes.groups.length; i++) {
                    var group = entry.content[entry._indexes.groups[i]];
                    if (group !== undefined) {
                        var groupHeader = [];
                        for (j in group.attributes) {
                            groupHeader.push({
                                label  : j,
                                values : group.attributes[j]
                            });
                        }

                        var groupReadings = [];
                        for (var k = 0; k < group.content.length; k++) {
                            var groupEntry = entry.content[group.content[k]];
                            if (groupEntry !== undefined) {
                                groupReadings.push(formatter.formatSignificantReading(groupEntry, scopeWit));
                            }
                        }
                        if (groupReadings.length > 0) {
                            apparatus.readingGroups.push({
                                header   : groupHeader,
                                readings : groupReadings
                            });
                        }
                    }
                }
            }
        }
        apparatus.criticalNote += entry.note;
        
        return apparatus;
    };

    formatter.formatLemma = function(lemma, scopeWit){
        var lemmaText = '';
        // lemma content
        for (var i = 0; i < lemma.content.length; i++) {
            if (lemma.content[i].type === 'subApp') {
                lemmaText += formatter.formatSubApparatus(lemma.content[i].id, scopeWit);
            } else {
                lemmaText += lemma.content[i];
            }
        }

        lemmaText = formatter.formatCriticalEntryLacunaMilestones(lemmaText);

        if (lemmaText !== '') {
            lemmaText += formatter.formatCriticalEntryWitnesses(lemma, 'lem', scopeWit);
            lemmaText += formatter.formatCriticalEntryAttributes(lemma, 'lem');
            lemmaText += ']';
        }

        lemmaText = lemmaText.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, '');
        lemmaText = formatter.formatCriticalEntryFragmentMilestones(lemmaText);

        return lemmaText;
    };
    
    formatter.formatSubApparatus = function(subAppId, scopeWit){
        var subAppText    = '';
        var subApp        = parsedData.getCriticalEntryByPos(subAppId);
        var subAppContent = formatter.formatCriticalEntry(subApp, true, scopeWit);
        
        subAppText += ' (('+subAppContent.lemma+" ";
        for (var i = 0; i < subAppContent.significantReadings.length; i++) {
            subAppText += subAppContent.significantReadings[i];
            if (i < subAppContent.significantReadings.length - 1) {
                subAppText += ';';
            }
        }
        subAppText += ')) ';
        return subAppText;
    };
    formatter.formatSignificantReading = function(reading, scopeWit){
        var readingText = '';

        for (var i = 0; i < reading.content.length; i++) {
            if (typeof(reading.content[i]) === 'string') {
                readingText += reading.content[i];
            } else {
                if (reading.content[i].type === 'subApp') {
                    readingText += formatter.formatSubApparatus(reading.content[i].id, scopeWit);
                } else {
                    readingText += reading.content[i].outerHTML;
                }
            }
        }
        if (readingText === '') {
            readingText = ' <i>omit.</i> ';
        }
        readingText = formatter.formatCriticalEntryLacunaMilestones(readingText);

        readingText += formatter.formatCriticalEntryWitnesses(reading, 'rdg', scopeWit);
        readingText += formatter.formatCriticalEntryAttributes(reading, 'rdg');

        readingText = readingText.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, '');
        readingText = formatter.formatCriticalEntryFragmentMilestones(readingText);

        return readingText;
    };

    formatter.formatCriticalEntryWitnesses = function(reading, elemType, scopeWit) {
        var witnesses  = '';
        if (reading.wits !== undefined ) {
            for (wit in reading.wits) {
                witnesses += '<evt-witness-ref witness="'+reading.wits[wit]+'" data-scope-wit="'+scopeWit+'"></evt-witness-ref>';
            }
        }
        if (witnesses !== '') {
            witnesses = '<span class="witnesses witnesses-'+elemType+'">'+witnesses+'</span>';
        }
        return witnesses;
    };

    //TODO: rivedere output raggruppamenti attributi
    formatter.formatCriticalEntryAttributes = function(reading, elemType) {
        var attributes = '';
        if (reading.attributes !== undefined) {
            for (var key in reading.attributes) {
                if (key !== 'wit' && key !== 'xml:id') {
                    attributes += '<span class="'+key+'">'+key+": "+reading.attributes[key]+'</span>';
                }
            }
        }
        if (attributes !== '') {
            attributes = '<span class="attributes" style="display:none">'+attributes+'</span>';
        }
        return attributes;
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
        return appText;
    };
    return formatter;
});