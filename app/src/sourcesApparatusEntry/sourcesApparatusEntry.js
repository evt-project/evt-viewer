/**
 * @ngdoc overview
 * @name evtviewer.sourcesApparatusEntry
 * @module evtviewer.sourcesApparatusEntry
 * @description
 * # evtviewer.sourcesApparatusEntry
 * Module referring to source apparatus entries.
 * 
 * ## Services
 * - {@link evtviewer.sourcesApparatusEntry.evtSourcesApparatusEntry evtSourcesApparatusEntry} where the scope of 
 * {@link evtviewer.sourcesApparatusEntry.directive:evtSourcesApparatusEntry evtSourcesApparatusEntry} directive 
 * is expanded and stored untill the directive remains instantiated.
  * - {@link evtviewer.sourcesApparatusEntry.evtSourceSeg evtSourceSeg} where the scope of 
 * {@link evtviewer.sourcesApparatusEntry.directive:evtSourceSeg evtSourceSeg} directive 
 * is expanded and stored untill the directive remains instantiated.
 *
 * ## Directives
 * - {@link evtviewer.sourcesApparatusEntry.directive:evtSourcesApparatusEntry evtSourcesApparatusEntry}: custom directive 
 * that will show the content of a source apparatus entry.
 * - {@link evtviewer.sourcesApparatusEntry.directive:evtSourceRef evtSourceRef}: custom directive 
 * that will handle the connection between the source and the text in the Source-Text View.
 * - {@link evtviewer.sourcesApparatusEntry.directive:evtSourceSeg evtSourceSeg}: custom directive 
 * that will show the segment within the source text.
 *
 * ## Controllers
 * - {@link evtviewer.sourcesApparatusEntry.controller:sourcesApparatusEntryCtrl sourcesApparatusEntryCtrl}: controller for the 
 * {@link evtviewer.sourcesApparatusEntry.directive:evtSourcesApparatusEntry evtSourcesApparatusEntry} directive.
 * - {@link evtviewer.sourcesApparatusEntry.controller:sourceRefCtrl sourceRefCtrl}: controller for the 
 * {@link evtviewer.sourcesApparatusEntry.directive:evtSourceRef evtSourceRef} directive.
 * - {@link evtviewer.sourcesApparatusEntry.controller:sourceSegCtrl sourceSegCtrl}: controller for the 
 * {@link evtviewer.sourcesApparatusEntry.directive:evtSourceSeg evtSourceSeg} directive.
**/
angular.module('evtviewer.sourcesApparatusEntry', []);