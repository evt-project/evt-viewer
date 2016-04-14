angular.module('evtviewer.dataHandler')

.service('evtCriticalApparatus', function(parsedData, evtParser) {
    var apparatus = {};

    apparatus.getContent = function(entry, subApp, scopeWit) {
        // console.log('getContent', entry);
        var appContent = {
            attributes             : {
                values : entry.attributes || {},
                _keys  : Object.keys(entry.attributes) || []
            },
            lemma                  : {
                content    : '',
                attributes : {
                    values : {},
                    _keys  : []
                }
            },
            significantReadings    : [],
            notSignificantReadings : [],
            readingGroups          : [],
            criticalNote           : ''
        };

        //Lemma
        var lemma = entry.content[entry.lemma];
        if (lemma !== undefined) {
            appContent.lemma.content += '<span class="app_lemma_content">'+apparatus.getLemma(lemma, scopeWit)+'</span>';
            appContent.lemma.attributes.values = lemma.attributes || {};
            appContent.lemma.attributes._keys  = Object.keys(lemma.attributes) || [];
        }

        //Significant Readings
        var readings = entry._indexes.readings;
        var totReadings = readings._indexes;
        for (var i = 0; i < totReadings.length; i++) {
            var reading = entry.content[totReadings[i]];
            if (reading !== undefined) {
                if (readings.significant.indexOf(reading.id) >= 0) {
                    appContent.significantReadings.push(apparatus.getSignificantReading(reading, scopeWit));
                } else {
                    appContent.notSignificantReadings.push(apparatus.getSignificantReading(reading, scopeWit));
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
                                groupReadings.push(apparatus.getSignificantReading(groupEntry, scopeWit));
                            }
                        }
                        if (groupReadings.length > 0) {
                            appContent.readingGroups.push({
                                header   : groupHeader,
                                readings : groupReadings
                            });
                        }
                    }
                }
            }
        }
        appContent.criticalNote += entry.note;
        
        return appContent;
    };

    apparatus.getGenericContent = function(element, scopeWit){
        var genericContentText;
        
        genericContentText = '<span class="'+element.tagName+' inApparatus">';
        for (var i = 0; i < element.content.length; i++) {
            if (typeof(element.content[i]) === 'string') {
                genericContentText += element.content[i];
            } else if (element.content[i].type === 'subApp') {
                    genericContentText += apparatus.getSubApparatus(element.content[i].id, scopeWit);
            } else if (element.content[i].type === 'genericElement') {
                genericContentText += apparatus.getGenericContent(element.content[i], scopeWit);
            } else {
                genericContentText += element.content[i].outerHTML;
            }
        }
        genericContentText += '</span>';
        return genericContentText;
    };

    apparatus.getLemma = function(lemma, scopeWit){
        var lemmaText = '';
        // lemma content
        for (var i = 0; i < lemma.content.length; i++) {
            if (lemma.content[i].type === 'subApp') {
                lemmaText += apparatus.getSubApparatus(lemma.content[i].id, scopeWit);
            } else if (lemma.content[i].type === 'genericElement') {
                lemmaText += apparatus.getGenericContent(lemma.content[i], scopeWit);
            } else {
                lemmaText += lemma.content[i];
            }
        }

        lemmaText = apparatus.transformCriticalEntryLacunaMilestones(lemmaText);

        if (lemmaText !== '') {
            lemmaText += apparatus.getCriticalEntryWitnesses(lemma, 'lem', scopeWit);
        }

        lemmaText = lemmaText.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, '');
        lemmaText = apparatus.transformCriticalEntryFragmentMilestones(lemmaText);

        return lemmaText;
    };
    
    apparatus.getSubApparatus = function(subAppId, scopeWit){
        var subAppText    = '';
        var subApp        = parsedData.getCriticalEntryById(subAppId);
        var subAppContent = apparatus.getContent(subApp, true, scopeWit);
        
        subAppText += '<span class="sub_app"> (('+subAppContent.lemma.content+" ";
        for (var i = 0; i < subAppContent.significantReadings.length; i++) {
            subAppText += subAppContent.significantReadings[i].content;
            if (i < subAppContent.significantReadings.length - 1) {
                subAppText += ';';
            }
        }
        subAppText += ')) </span>';
        return subAppText;
    };

    apparatus.getSignificantReading = function(reading, scopeWit){
        var readingText = '';

        for (var i = 0; i < reading.content.length; i++) {
            if (typeof(reading.content[i]) === 'string') {
                readingText += reading.content[i];
            } else {
                if (reading.content[i].type === 'subApp') {
                    readingText += apparatus.getSubApparatus(reading.content[i].id, scopeWit);
                } else if (reading.content[i].type === 'genericElement') {
                    readingText += apparatus.getGenericContent(reading.content[i], scopeWit);
                } else {
                    readingText += reading.content[i].outerHTML;
                }
            }
        }
        if (readingText === '') {
            readingText = ' <i>omit.</i> ';
        }
        readingText = apparatus.transformCriticalEntryLacunaMilestones(readingText);

        readingText += apparatus.getCriticalEntryWitnesses(reading, 'rdg', scopeWit);
        // readingText += apparatus.getCriticalEntryAttributes(reading, 'rdg');

        readingText = readingText.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, '');
        readingText = apparatus.transformCriticalEntryFragmentMilestones(readingText);

        var readingObj = {
            content    : readingText,
            attributes : {
                values : reading.attributes || {},
                _keys  : Object.keys(reading.attributes) || []
            }
        }
        return readingObj;
    };

    apparatus.getCriticalEntryWitnesses = function(reading, elemType, scopeWit) {
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
    apparatus.getCriticalEntryAttributes = function(reading, elemType) {
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

    apparatus.transformCriticalEntryLacunaMilestones = function(appText){
        appText = appText.replace(/<lacunaStart(.|[\r\n])*?\/>/ig, '<i>beginning of a lacuna in </i>');
        appText = appText.replace(/<lacunaEnd(.|[\r\n])*?\/>/ig, '<i>end of a lacuna in </i>');
        return appText;
    };
    
    apparatus.transformCriticalEntryFragmentMilestones = function(appText){
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

    return apparatus;
});