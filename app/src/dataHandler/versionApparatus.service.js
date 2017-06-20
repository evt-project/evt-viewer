angular.module('evtviewer.dataHandler')

.service('evtVersionApparatus', function(config, parsedData, evtCriticalApparatus) {
    var apparatus = {};

    apparatus.getContent = function(entry, scopeWit, scopeVer) {
        var appContent = {
            attributes : {
                values : entry.attributes || {},
                _keys : Object.keys(entry.attributes) || []
            },
            versions: {
                // versionId : {
                    // id
                    // lem
                    // significantReadings
                    // notSignificantReadings
                // }
            },
            note: '',
            _readings : false,
            _xmlSource: entry._xmlSource.replace('xmlns="http://www.tei-c.org/ns/1.0"', '')
        };
        for (var i in entry.content) {
            var verId = entry.content[i].versionId;
            appContent.versions[verId] = apparatus.getVersionContent(entry.content[i], scopeWit, scopeVer);
            if (appContent.versions[verId].significantReadings.length > 0 && appContent.versions[verId].notSignificantReadings.length > 0) {
                appContent._readings = true;
            }
        }
        appContent.note += entry.note;
        return appContent;
    };

    apparatus.getVersionContent = function(ver, scopeWit, scopeVer) {
        var version = {
            id : ver.versionId,
            lem : '',
            significantReadings : [],
            notSignificantReadings : []
        };
        var lemma = ver.content[ver.lemma];
        if (lemma !== undefined) {
            version.lem += '<span class="versionApp_lemma_content">'+evtCriticalApparatus.getLemma(lemma, scopeWit)+'</span>';
        }
        for (var i in ver.content) {
            if (i !== ver.lemma) {
                var readingContent = evtCriticalApparatus.getSignificantReading(ver.content[i]);
                if (ver.content[i]._significant) {
                    version.significantReadings.push(readingContent);
                } else {
                    version.notSignificantReadings.push(readingContent);
                }
            }
        }
        return version;
    };

    return apparatus;
});