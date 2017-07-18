/**
 * @ngdoc service
 * @module evtviewer.dataHandler
 * @name evtviewer.dataHandler.evtVersionApparatus
 * @description 
 * # evtVersionApparatus
 * TODO: Add description and comments for every method
 *
 * @author Chiara Martignano
**/
angular.module('evtviewer.dataHandler')

.service('evtVersionApparatus', function(config, parsedData, evtCriticalApparatus, evtParser) {
    var apparatus = {};

    apparatus.getContent = function(entry, scopeWit, scopeVer) {
        var appContent = {
            attributes : {
                values : entry.attributes || {},
                _keys : Object.keys(entry.attributes) || []
            },
            /*versions: {
                // versionId : {
                    // id
                    // lem
                    // significantReadings
                    // notSignificantReadings
                // }
            },*/
            versions: [],
            note: '',
            _readings : false,
            _xmlSource: entry._xmlSource.replace('xmlns="http://www.tei-c.org/ns/1.0"', '')
        };
        for (var i in entry.content) {
            var ver = apparatus.getVersionContent(entry.content[i], scopeWit, scopeVer),
                verPos = config.versions.indexOf(ver.value);
            appContent.versions.splice(verPos, 0, ver);
        }
        if (entry.note !== undefined && entry.note !== '') {
            appContent.note += entry.note;
        }
        if (ver.significantReadings.length > 0 || ver.notSignificantReadings.length > 0) {
            appContent._readings = true;
        }       
        return appContent;
    };

    apparatus.getVersionContent = function(ver, scopeWit, scopeVer) {
        var version = {
            id : ver.versionId,
            value : ver.id,
            lem : '',
            significantReadings : [],
            notSignificantReadings : [],
            attributes: {
                values : ver.attributes || {},
                _keys : Object.keys(ver.attributes) || []
            }
        };
        var lemma = ver.content[ver.lemma];
        if (lemma !== undefined) {
            var lem = evtCriticalApparatus.getLemma(lemma, scopeWit),
                lemTxt = evtCriticalApparatus.getText(lemma).replace(/<span class="textNode">|<\/span>/g, ''),
                lemLength = lemTxt.length;
            if (lemLength <= 70) {
                version.lem += '<span class="versionApp_lemma_content">'+lem+'</span>';
            } else {
                var lemNoWits = lem.substring(0, (lem.indexOf('<span class="witnesses'))),
                    lemWits = lem.substring((lem.indexOf('<span class="witnesses')), lem.length);
                version.lem = evtParser.createAbbreviation(lemNoWits, 70)+lemWits;
            }
            
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