angular.module('evtviewer.dataHandler')

.service('evtCriticalApparatus', function(parsedData, evtParser, config) {
    var apparatus = {};

    var skipWitnesses = config.skipWitnesses.split(',').filter(function(el) { return el.length !== 0; });

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
            criticalNote           : '',
            witnessesGroups        : [],
        };

        //Lemma
        var lemma = entry.content[entry.lemma];
        if (lemma !== undefined) {
            appContent.lemma.content += '<span class="app_lemma_content">'+apparatus.getLemma(lemma, scopeWit)+'</span>';
            appContent.lemma.attributes.values = lemma.attributes || {};
            appContent.lemma.attributes._keys  = Object.keys(lemma.attributes) || [];
        }

        //significant

        //Significant Readings
        var readings = entry._indexes.readings;
        var totReadings = readings._indexes;
        for (var i = 0; i < totReadings.length; i++) {
            var reading = entry.content[totReadings[i]];
            if (reading !== undefined) {
                if (readings._significant.indexOf(reading.id) >= 0) {
                    var r = apparatus.getSignificantReading(reading, scopeWit);
                    appContent.significantReadings.push(r);
                    var wits = reading.wits || [];
                    for (var j = 0; j < wits.length; j++) {
                        var wit = wits[j],
                            groups = appContent.witnessesGroups;
                        for (var h in groups) {
                            if (groups[h].witnesses.indexOf(wit) >= 0) {
                                if (groups[h].content === undefined) {
                                    groups[h].content = r.content;
                                } else {
                                    groups[h].content += r.content;
                                }
                            }
                        }
                    }
                    
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
            } else if (lemma.content[i].type === 'quote'
                        || lemma.content[i].type === 'analogue') {
                lemmaText += apparatus.getCriticalElementContent(lemma.content[i], scopeWit)
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
                subAppText += '; ';
            }
        }
        subAppText += ')) </span>';
        return subAppText;
    };

    apparatus.getSignificantReading = function(reading, scopeWit){
        var readingText = '',
            readingObj  = {};

        for (var i = 0; i < reading.content.length; i++) {
            if (typeof(reading.content[i]) === 'string') {
                readingText += reading.content[i];
            } else {
                if (reading.content[i].type === 'subApp') {
                    readingText += apparatus.getSubApparatus(reading.content[i].id, scopeWit);
                } else if (reading.content[i].type === 'genericElement') {
                    readingText += apparatus.getGenericContent(reading.content[i], scopeWit);
                //Added by CM    
                } else if (reading.content[i].type === 'quote'
                           ||reading.content[i].type === 'analogue') {
                    readingText += apparatus.getCriticalElementContent(reading.content[i], scopeWit)
                } else {
                    readingText += reading.content[i].outerHTML;
                }
            }
        }
        if (readingText === '') {
            readingText = ' <i>omit.</i> ';
        }
        readingText = apparatus.transformCriticalEntryLacunaMilestones(readingText);

        var readingWits = apparatus.getCriticalEntryWitnesses(reading, 'rdg', scopeWit);
        if (reading.wits === undefined || readingWits !== ''){
            readingText += readingWits;
            // readingText += apparatus.getCriticalEntryAttributes(reading, 'rdg');
            readingText = readingText.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, '');
            readingText = apparatus.transformCriticalEntryFragmentMilestones(readingText);

            readingObj = {
                content    : readingText,
                attributes : {
                    values : reading.attributes || {},
                    _keys  : Object.keys(reading.attributes) || []
                }
            }
        }
        return readingObj;
    };

    /*Method added by CM*/
    apparatus.getCriticalElementContent = function(element, scopeWit) {
        var content = element.content || [];
        var result = '<span class="'+element.type+' inApparatus">';
        for (var i in content) {
            if (typeof content[i] === 'string') {
                result += ' '+content[i];
            } else {
                var skip = ['EVT-POPOVER', 'lb', 'ptr', 'link', 'linkGrp', 'pb'];
                if (skip.indexOf(content[i].tagName) >= 0) {
                    result += '';
                } else if (content[i].type === 'app') {
                    var t = getAppText(content[i], scopeWit);
                    result += t;
                } else if (content[i].type === 'analogue') {
                    result += apparatus.getCriticalElementContent(content[i], scopeWit);
                } else if (content[i].type === 'quote') {
                    result += apparatus.getCriticalElementContent(content[i], scopeWit);
                } else if (content[i].content !== undefined) {
                    result += getText(content[i]);
                }
            }
        }
        
        result+= '</span>';
        return result;
    };
    
    //Eventualmente aggiungere parametro stringa per il valore della class di span (tipo 'author' o 'textNode')
    var getText = function(entry) {
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

     var getAppText = function(entry, scopeWit){
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

    apparatus.getCriticalEntryWitnesses = function(reading, elemType, scopeWit) {
        var witnesses  = '';
        if (reading.wits !== undefined && reading.wits.length > 0) {
            for (wit in reading.wits) {
                if (skipWitnesses.indexOf(wit) < 0){
                    witnesses += '<evt-witness-ref witness="'+reading.wits[wit]+'" data-scope-wit="'+scopeWit+'"></evt-witness-ref>';
                }
            }
        } else if (elemType === 'lem') {
            if (reading.autoWits !== undefined && reading.autoWits.length > 0) {
                for (wit in reading.autoWits) {
                    if (skipWitnesses.indexOf(wit) < 0){
                        witnesses += '<evt-witness-ref witness="'+reading.autoWits[wit]+'" data-scope-wit="'+scopeWit+'"></evt-witness-ref>';
                    }
                }
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