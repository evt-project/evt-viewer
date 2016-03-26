angular.module('evtviewer.dataHandler')

.service('evtCriticalFormatter', function(parsedData, evtParser) {
    var formatter = {};

    formatter.formatCriticalEntry = function(entry, subApp) {
        // console.log('formatCriticalEntry', entry);
        var appText                    = '',
            lemmaText                  = '',
            significantReadingsText    = '',
            notSignificantReadingsText = '',
            readingGroupText           = '',
            criticalNoteText           = '';

        //Lemma
        var lemma = entry.content[entry.lemma];
        if (lemma !== undefined) {
            lemmaText += '<span class="reading__lemma">'+formatter.formatLemma(lemma)+'</span>';
        }

        //Readings
        var readings = entry._indexes.readings;

        var totReadings = readings._indexes;
        for (var i = 0; i < totReadings.length; i++) {
            var reading = entry.content[totReadings[i]];
            if (reading !== undefined) {
                if (readings._significant.indexOf(reading.id) >= 0) {
                    significantReadingsText    += ' '+formatter.formatSignificantReading(reading)+';';
                } else {
                    notSignificantReadingsText += '<li>'+formatter.formatSignificantReading(reading)+'</li>';
                }
            }
        }
        if (significantReadingsText != ''){
            significantReadingsText = significantReadingsText.slice(0, -1);
        }
        
        if (!subApp) {
            //Varianti di forma
            if (notSignificantReadingsText != '') {
                notSignificantReadingsText += '<div><strong>V. forma</strong><ul>'+notSignificantReadingsText+'</ul></div>';
            }

            //Raggruppamenti
            if (entry._indexes.groups.length > 0) {
                for (var i = 0; i < entry._indexes.groups.length; i++) {
                    var group = entry.content[entry._indexes.groups[i]];
                    if (group !== undefined) {
                        var groupHeader = '';
                        for (j in group.attributes) {
                            groupHeader += '<strong>'+j+': '+group.attributes[j]+'</strong>,';
                        }
                        groupHeader = groupHeader.trim().slice(0, -1);
                        var groupReadings = '';
                        for (var k = 0; k < group.content.length; k++) {
                            var groupEntry = entry.content[group.content[k]];
                            if (groupEntry !== undefined) {
                                groupReadings += '<li>'+formatter.formatSignificantReading(groupEntry)+'</li>';
                            }
                        }
                        if (groupReadings !== '') {
                            readingGroupText += '<div>'+groupHeader+'<ul>'+ groupReadings+'</ul></div>';
                        }
                    }
                }
            }

            if (entry.note !== '') {
                criticalNoteText += '<p>'+entry.note+'</p>';
            }
        }
        
        var mainContentText = '',
            subContentText  = '';
        mainContentText += lemmaText+significantReadingsText;
        if (mainContentText !== '') {
            if (entry._subApp) {
                appText += mainContentText;
            } else {
                appText += '<div class="reading__apparatus_main-content">'+mainContentText+'</div>';
            }
        }
        
        subContentText += notSignificantReadingsText+readingGroupText+criticalNoteText;
        appText += subContentText !== '' ? '<div class="reading__apparatus_other-content">'+subContentText+'</div>' : '';
        
        appText = appText.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, '');
        appText = formatter.formatCriticalEntryFragmentMilestones(appText);
        return appText;
    };

    formatter.formatLemma = function(lemma){
        var lemmaText = '';
        // lemma content
        for (var i = 0; i < lemma.content.length; i++) {
            if (lemma.content[i].type === 'subApp') {
                var subApp = parsedData.getCriticalEntryByPos(lemma.content[i].id);
                lemmaText += ' (('+formatter.formatCriticalEntry(subApp, true)+')) ';
            } else {
                lemmaText += lemma.content[i];
            }
        }

        lemmaText = formatter.formatCriticalEntryLacunaMilestones(lemmaText);

        if (lemmaText !== '') {
            lemmaText += formatter.formatCriticalEntryWitnesses(lemma, 'lem');
            lemmaText += formatter.formatCriticalEntryAttributes(lemma, 'lem');
            lemmaText += ']';
        }
        return lemmaText;
    };
    
    formatter.formatSignificantReading = function(reading){
        var readingText = '';

        for (var i = 0; i < reading.content.length; i++) {
            if (typeof(reading.content[i]) === 'string') {
                readingText += reading.content[i];
            } else {
                if (reading.content[i].type === 'subApp') {
                    var subApp = parsedData.getCriticalEntryByPos(reading.content[i].id);
                    readingText += ' (('+formatter.formatCriticalEntry(subApp, true)+')) ';
                } else {
                    readingText += reading.content[i].outerHTML;
                }
            }
        }
        if (readingText === '') {
            readingText = ' <i>omit.</i> ';
        }
        readingText = formatter.formatCriticalEntryLacunaMilestones(readingText);

        readingText += formatter.formatCriticalEntryWitnesses(reading, 'rdg');
        readingText += formatter.formatCriticalEntryAttributes(reading, 'rdg');

        return readingText;
    };

    formatter.formatCriticalEntryWitnesses = function(reading, elemType) {
        var witnesses  = '';
        if (reading.wits !== undefined ) {
            for (wit in reading.wits) {
                witnesses += '<evt-witness-ref witness="'+reading.wits[wit]+'"></evt-witness-ref>';
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