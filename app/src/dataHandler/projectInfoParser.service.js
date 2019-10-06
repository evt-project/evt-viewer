/**
 * @ngdoc service
 * @module evtviewer.dataHandler
 * @name evtviewer.dataHandler.evtProjectInfoParser
 * @description 
 * # evtProjectInfoParser
 * Service containing methods to parse data regarding edition header information.
 *
 * @requires $q
 * @requires xmlParser
 * @requires evtviewer.dataHandler.parsedData
 * @requires evtviewer.dataHandler.evtParser
**/
angular.module('evtviewer.dataHandler')

.service('evtProjectInfoParser', function($q, parsedData, evtParser, xmlParser) {
    var parser = {};
    
    var projectInfoDef         = '<teiHeader>',
        fileDescriptionDef     = '<fileDesc>',
        encodingDescriptionDef = '<encodingDesc>',
        textProfileDef         = '<profileDesc>',
        outsideMetadataDef     = '<xenoData>',
        revisionHistoryDef     = '<revisionDesc>',
        msDesc                 = '<msDesc>';

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
                parser.parseMsDescription(element);
        });
        console.log('## parseProjectInfo ##', parsedData.getProjectInfo());
    };
    
    var editionStmt     = '<editionStmt>', //dichiarazione sul titolo
        extent          = '<extent>',
        notesStmt       = '<notesStmt>',
        publicationStmt = '<publicationStmt>',
        seriesStmt      = '<seriesStmt>',
        sourceDesc      = '<sourceDesc>',
        titleStmt       = '<titleStmt>';
        
    /**
     * @ngdoc method
     * @name evtviewer.dataHandler.evtProjectInfoParser#parseEditionReference
     * @methodOf evtviewer.dataHandler.evtProjectInfoParser
     *
     * @description
     * This method will parse references about the edition (e.g. title, author, publisher, etc.)
     * and store them into {@link evtviewer.dataHandler.parsedData parsedData} for future retrievements.
     *
     * @param {element} teiHeader XML element representing the TEI Header to be parsed
     *
     * @author CDP
     */
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
    /**
     * @ngdoc method
     * @name evtviewer.dataHandler.evtProjectInfoParser#parseFileDescription
     * @methodOf evtviewer.dataHandler.evtProjectInfoParser
     *
     * @description
     * This method will parse references about the file description
     * and store them into {@link evtviewer.dataHandler.parsedData parsedData} for future retrievements.
     * The file description usually contains a full bibliographical description of the computer file itself,
     * from which a user of the text could derive a proper bibliographic citation,
     * or which a librarian or archivist could use in creating a catalogue entry
     * recording its presence within a library or archive.  
     *
     * @param {element} teiHeader XML element representing the TEI Header to be parsed
     *
     * @author CDP
     */
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
    /**
     * @ngdoc method
     * @name evtviewer.dataHandler.evtProjectInfoParser#parseEncodingDescription
     * @methodOf evtviewer.dataHandler.evtProjectInfoParser
     *
     * @description
     * This method will parse references about the encoding description
     * and store them into {@link evtviewer.dataHandler.parsedData parsedData} for future retrievements.
     * The encoding description describes the relationship between an electronic text and its source or sources.
     *
     * @param {element} teiHeader XML element representing the TEI Header to be parsed
     *
     * @author CDP
     */
    parser.parseEncodingDescription = function(teiHeader){
        var currentDocument = angular.element(teiHeader);
        angular.forEach(currentDocument.find(encodingDescriptionDef.replace(/[<>]/g, '')), 
            function(element) {
                if (element.children.length > 0){
                    var encodingDescContent = '',
                        variantEncodingEl = angular.element(element).find('variantEncoding')[0];
                    if (variantEncodingEl){
                        var encodingDescParsedElement = evtParser.parseXMLElement(teiHeader, element, { skip: skipElementsFromParser, exclude: skipElementsFromInfo, context:'projectInfo' }).outerHTML;
                        encodingDescContent = encodingDescParsedElement ? encodingDescParsedElement : '';
                        encodingDescContent += '<span class="variantEncoding">{{ \'PROJECT_INFO.ENCODING_METHOD_USED\' | translate:\'{ method:  "'+variantEncodingEl.getAttribute('method')+'" }\' }}</span>';
                        parser.parseVariantEncodingInfo(variantEncodingEl);
                    }
                    parsedData.updateProjectInfoContent(encodingDescContent, 'encodingDescription');
                }
        });
        // console.log('## parseEncodingDescription ##', parsedData.getProjectInfo().encodingDescription);
    };
    /**
     * @ngdoc method
     * @name evtviewer.dataHandler.evtProjectInfoParser#parseVariantEncodingInfo
     * @methodOf evtviewer.dataHandler.evtProjectInfoParser
     *
     * @description
     * This method will parse the information about the variant encoding method and location
     * and store them into {@link evtviewer.dataHandler.parsedData parsedData} for future retrievements.
     *
     * @param {elem} variantEncoding XML element representing the encoding method for variants
     *
     * @author CM
     */
    parser.parseVariantEncodingInfo = function(elem) {
        if (elem.hasAttribute('method')) {
            parsedData.setEncodingDetail('variantEncodingMethod', elem.getAttribute('method'));
        }
        if (elem.hasAttribute('location')) {
            parsedData.setEncodingDetail('variantEncodingLocation', elem.getAttribute('location'));
        }
    }
    /**
     * @ngdoc method
     * @name evtviewer.dataHandler.evtProjectInfoParser#parseTextProfile
     * @methodOf evtviewer.dataHandler.evtProjectInfoParser
     *
     * @description
     * This method will parse references about the text profile
     * and store them into {@link evtviewer.dataHandler.parsedData parsedData} for future retrievements.
     * The text profile contains classificatory and contextual information about the text,
     * such as its subject matter, the situation in which it was produced,
     * the individuals described by or participating in producing it, and so forth.
     *
     * @param {element} teiHeader XML element representing the TEI Header to be parsed
     *
     * @author CDP
     */
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

    /**
     * @ngdoc method
     * @name evtviewer.dataHandler.evtProjectInfoParser#parseOutsideMetadata
     * @methodOf evtviewer.dataHandler.evtProjectInfoParser
     *
     * @description
     * This method will parse references about the outside metadata
     * and store them into {@link evtviewer.dataHandler.parsedData parsedData} for future retrievements.
     * The outside metadata is a container element which allows easy inclusion of metadata from non-TEI schemes.
     *
     * @param {element} teiHeader XML element representing the TEI Header to be parsed
     *
     * @author CDP
     */
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
    /**
     * @ngdoc method
     * @name evtviewer.dataHandler.evtProjectInfoParser#parseRevisionHistory
     * @methodOf evtviewer.dataHandler.evtProjectInfoParser
     *
     * @description
     * This method will parse references about the revision history
     * and store them into {@link evtviewer.dataHandler.parsedData parsedData} for future retrievements.
     * The revision history allows the encoder to provide a history of changes made
     * during the development of the electronic text.
     *
     * @param {element} teiHeader XML element representing the TEI Header to be parsed
     *
     * @author CDP
     */
    parser.parseRevisionHistory = function(teiHeader){
        var currentDocument = angular.element(teiHeader);
        angular.forEach(currentDocument.find(revisionHistoryDef.replace(/[<>]/g, '')), 
            function(element) {
                var revisionHistoryContent = evtParser.parseXMLElement(teiHeader, element, { skip: skipElementsFromParser, exclude: skipElementsFromInfo, context:'projectInfo' }).outerHTML;
                parsedData.updateProjectInfoContent(revisionHistoryContent, 'revisionHistory');
        });
        // console.log('## parseRevisionHistory ##', parsedData.getProjectInfo().revisionHistory);
    };
    
    parser.parseMsDescription = function (teiHeader) {
        var currentDocument = angular.element(teiHeader);
        angular.forEach(currentDocument.find(msDesc.replace(/[<>]/g, '')),
            function(element) {
                var msDescContent = evtParser.parseXMLElement(teiHeader, element, { skip: skipElementsFromParser, exclude: skipElementsFromInfo, context:'projectInfo' }).outerHTML;
                parsedData.updateProjectInfoContent(msDescContent, 'msDesc');
        });
       //  console.log('## parseMsDescription ##', parsedData.getProjectInfo().msDesc);
    };

    return parser;
});