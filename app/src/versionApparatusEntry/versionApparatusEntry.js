/**
 * @ngdoc overview
 * @name evtviewer.versionApparatusEntry
 * @module evtviewer.versionApparatusEntry
 * @description 
 * # evtviewer.versionApparatusEntry
 * Module referring to double recensio apparatus entries.
 * 
 * ## Services
 * - {@link evtviewer.versionApparatusEntry.evtVersionApparatusEntry evtVersionApparatusEntry} where the scope of 
 * {@link evtviewer.versionApparatusEntry.directive:evtVersionApparatusEntry evtVersionApparatusEntry} directive 
 * is expanded and stored untill the directive remains instantiated.
  * - {@link evtviewer.versionApparatusEntry.evtVersionRef evtVersionRef} where the scope of 
 * {@link evtviewer.versionApparatusEntry.directive:evtVersionRef evtVersionRef} directive 
 * is expanded and stored untill the directive remains instantiated.
 *
 * ## Directives
 * - {@link evtviewer.versionApparatusEntry.directive:evtVersionApparatusEntry evtVersionApparatusEntry}: custom directive 
 * that will show the content of a double recensio apparatus entry.
 * - {@link evtviewer.versionApparatusEntry.directive:evtVersionRef evtVersionRef}: custom directive 
 * that will handle the connection between the double recensio entry and the text in the "Multiple recensions" View.
 *
 * ## Controllers
 * - {@link evtviewer.versionApparatusEntry.controller:versionApparatusEntryCtrl versionApparatusEntryCtrl}: controller for the 
 * {@link evtviewer.versionApparatusEntry.directive:evtVersionApparatusEntry evtVersionApparatusEntry} directive.
 * - {@link evtviewer.versionApparatusEntry.controller:versionRefCtrl versionRefCtrl}: controller for the 
 * {@link evtviewer.versionApparatusEntry.directive:evtVersionRef evtVersionRef} directive.
**/
angular.module('evtviewer.versionApparatusEntry', []);