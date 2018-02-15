/**
 * @ngdoc overview
 * @name evtviewer.dataHandler
 * @module evtviewer.dataHandler
 * @description 
 * #evtviewer.dataHandler
 * Module referring to parsing, storing and retrieving operations on source data.
 * It comprehends the following services:
 * - {@link evtviewer.dataHandler.baseData baseData} where XML retrieved strings are store and XML initial parsers are launched
 * - {@link evtviewer.dataHandler.parsedData parsedData} where data parsed from source encoded text 
 * are stored in proper JSON structures and can be retrieved from other modules when needed
 * - Parsers:
 *  - {@link evtviewer.dataHandler.evtParser evtParser} for parsing generic data (specific elements will have a dedicated service)
 *  - {@link evtviewer.dataHandler.evtAnaloguesParser evtAnaloguesParser} for parsing data regarding analogues
 *  - {@link evtviewer.dataHandler.evtBibliographyParser evtBibliographyParser} for parsing data regarding the edition bibliography
 *  - {@link evtviewer.dataHandler.evtCriticalApparatusParser evtCriticalApparatusParser} for parsing data regarding critical apparatus entries
 *  - {@link evtviewer.dataHandler.evtCriticalElementsParser evtCriticalElementsParser} for parsing data regarding the critical apparatuses 
 * (critical entries, sources, analogues)
 *  - {@link evtviewer.dataHandler.evtCriticalParser evtCriticalParser} for parsing data needed in a critical edition 
 * (excluding the critical apparatuses for which there are dedicated parsers)
 *  - {@link evtviewer.dataHandler.evtNamedEntitiesParser evtNamedEntitiesParser} for parsing data regarding named entities
 *  - {@link evtviewer.dataHandler.evtPrimarySourcesParser evtPrimarySourcesParser} for parsing data regarding the primary source (e.g. zones)
 *  - {@link evtviewer.dataHandler.evtProjectInfoParser evtProjectInfoParser} for parsing data regarding the header information about the edition
 *  - {@link evtviewer.dataHandler.evtSourcesParser evtSourcesParser} for parsing data regarding sources
 * - Retrieving services:
 *  - {@link evtviewer.dataHandler.evtAnaloguesApparatus evtAnaloguesApparatus} to retrieve data regarding analogues apparatus
 *  - {@link evtviewer.dataHandler.evtCriticalApparatus evtCriticalApparatus} to retrieve data regarding critical apparatus
 *  - {@link evtviewer.dataHandler.evtSourcesApparatus evtSourcesApparatus} to retrieve data regarding sources apparatus
 *  - {@link evtviewer.dataHandler.evtVersionApparatus evtVersionApparatus} to retrieve data regarding different versions of edition text
**/
angular.module('evtviewer.dataHandler', []);