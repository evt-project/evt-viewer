angular.module('evtviewer.dataHandler')

.service('evtProjectInfoParser', function($q, parsedData, evtParser, xmlParser) {
    var parser = {};
    
    var projectInfoDef         = '<teiHeader>',
        fileDescriptionDef     = '<fileDesc>',
        encodingDescriptionDef = '<encodingDesc>',
        textProfileDef         = '<profileDesc>',
        outsideMetadataDef     = '<xenoData>',
        revisionHistoryDef     = '<revisionDesc>';

    var skipElementsFromParser = '<evtNote>',
        skipElementsFromInfo   = '<listBibl>, <listWit>';
    parser.parseProjectInfo = function(doc){
        var currentDocument = angular.element(doc);
        angular.forEach(currentDocument.find(projectInfoDef.replace(/[<>]/g, '')), 
            function(element) {
                parser.parseEditionReference(element);
                parser.parseFileDescription(element);
                parser.parseEncodingDescription(element);
                parser.parseTextProfile(element);
                parser.parseOutsideMetadata(element);
                parser.parseRevisionHistory(element);
        });
        //console.log('## parseProjectInfo ##', parsedData.getProjectInfo());
    };

    /* **************** */
    /* File Description */
    /* *************************************************************************** */
    /* Containing a full bibliographical description of the computer file itself,  */
    /* from which a user of the text could derive a proper bibliographic citation, */ 
    /* or which a librarian or archivist could use in creating a catalogue entry   */
    /* recording its presence within a library or archive.                         */
    /* *************************************************************************** */
    var editionStmt     = '<editionStmt>', //dichiarazione sul titolo
        extent          = '<extent>',
        notesStmt       = '<notesStmt>',
        publicationStmt = '<publicationStmt>',
        seriesStmt      = '<seriesStmt>',
        sourceDesc      = '<sourceDesc>',
        titleStmt       = '<titleStmt>';

    parser.parseEditionReference = function(teiHeader){
        var currentDocument = angular.element(teiHeader);
        var title = currentDocument.find(titleStmt.replace(/[<>]/g, '')+ ' title')[0],
            author = currentDocument.find(titleStmt.replace(/[<>]/g, '')+ ' author')[0],
            publisher = currentDocument.find(publicationStmt.replace(/[<>]/g, '')+' publisher')[0];
        var reference = {
            title     : title ? title.textContent : '',
            author    : author ? author.textContent : '',
            publisher : publisher ? publisher.textContent : ''
        };
        parsedData.updateProjectInfoContent(reference, 'editionReference');
        // console.log('## parseEditionReference ##', parsedData.getProjectInfo().editionReference);
    };

    parser.parseFileDescription = function(teiHeader){
        var currentDocument = angular.element(teiHeader);
        angular.forEach(currentDocument.find(fileDescriptionDef.replace(/[<>]/g, '')), 
            function(element) {
                if (element.children.length > 0){
                    var fileDescContent = evtParser.parseXMLElement(teiHeader, element, { skip: skipElementsFromParser, exclude: skipElementsFromInfo, context:'projectInfo' }).outerHTML;
                    parsedData.updateProjectInfoContent(fileDescContent, 'fileDescription');
                }
        });
        // console.log('## parseFileDescription ##', parsedData.getProjectInfo().fileDescription);
    };

    /* ******************** */
    /* Encoding Description */
    /* ************************************************************************************** */
    /* which describes the relationship between an electronic text and its source or sources. */
    /* ************************************************************************************** */
    parser.parseEncodingDescription = function(teiHeader){
        var currentDocument = angular.element(teiHeader);
        angular.forEach(currentDocument.find(encodingDescriptionDef.replace(/[<>]/g, '')), 
            function(element) {
                if (element.children.length > 0){
                    var encodingDescContent = '',
                        variantEncodingEl = angular.element(element).find('variantEncoding')[0];
                    if (variantEncodingEl){
                        encodingDescParsedElement = evtParser.parseXMLElement(teiHeader, element, { skip: skipElementsFromParser, exclude: skipElementsFromInfo, context:'projectInfo' }).outerHTML;
                        encodingDescContent = encodingDescParsedElement ? encodingDescParsedElement : '';
                        encodingDescContent += '<span class="variantEncoding">{{ \'PROJECT_INFO.ENCODING_METHOD_USED\' | translate:\'{ method:  "'+variantEncodingEl.getAttribute('method')+'" }\' }}</span>';
                    }
                    parsedData.updateProjectInfoContent(encodingDescContent, 'encodingDescription');
                }
        });
        // console.log('## parseEncodingDescription ##', parsedData.getProjectInfo().encodingDescription);
    };

    /* ************ */
    /* Text Profile */
    /* *************************************************************************** */
    /* Containing classificatory and contextual information about the text,        */
    /* such as its subject matter, the situation in which it was produced,         */
    /* the individuals described by or participating in producing it, and so forth */
    /* *************************************************************************** */
    parser.parseTextProfile = function(teiHeader){
        var currentDocument = angular.element(teiHeader);
        angular.forEach(currentDocument.find(textProfileDef.replace(/[<>]/g, '')), 
            function(element) {
                if (element.children.length > 0){
                    var textProfileContent = evtParser.parseXMLElement(teiHeader, element, { skip: skipElementsFromParser, exclude: skipElementsFromInfo, context:'projectInfo' }).outerHTML;
                    parsedData.updateProjectInfoContent(textProfileContent, 'textProfile');
                }
        });
        // console.log('## parseTextProfile ##', parsedData.getProjectInfo().textProfile);
    };

    /* **************** */
    /* Outside Metadata */
    /* ****************************************************************************** */
    /* Container element which allows easy inclusion of metadata from non-TEI schemes */
    /* ****************************************************************************** */
    parser.parseOutsideMetadata = function(teiHeader){
        var currentDocument = angular.element(teiHeader);
        angular.forEach(currentDocument.find(outsideMetadataDef.replace(/[<>]/g, '')), 
            function(element) {
                if (element.children.length > 0){
                    var outsideMetadataContent = evtParser.parseXMLElement(teiHeader, element, { skip: skipElementsFromParser, exclude: skipElementsFromInfo, context:'projectInfo' }).outerHTML;
                    parsedData.updateProjectInfoContent(outsideMetadataContent, 'outsideMetadata');
                }
        });
        // console.log('## parseOutsideMetadata ##', parsedData.getProjectInfo().outsideMetadata);
    };

    /* **************** */
    /* Revision History */
    /* ************************************************************* */
    /* which allows the encoder to provide a history of changes made */
    /* during the development of the electronic text.                */
    /* ************************************************************* */
    parser.parseRevisionHistory = function(teiHeader){
        var currentDocument = angular.element(teiHeader);
        angular.forEach(currentDocument.find(revisionHistoryDef.replace(/[<>]/g, '')), 
            function(element) {
                var revisionHistoryContent = evtParser.parseXMLElement(teiHeader, element, { skip: skipElementsFromParser, exclude: skipElementsFromInfo, context:'projectInfo' }).outerHTML;
                parsedData.updateProjectInfoContent(revisionHistoryContent, 'revisionHistory');
        });
        // console.log('## parseRevisionHistory ##', parsedData.getProjectInfo().revisionHistory);
    };

    return parser;
});