/**
 * @ngdoc overview
 * @name evtviewer.criticalApparatusEntry
 * @description
 * # evtviewer.criticalApparatusEntry
 * It contains the directives and services used to handle the critical apparatus entries available on the text.
 *
 * ## Services
 * - {@link evtviewer.criticalApparatusEntry.evtCriticalApparatusEntry evtCriticalApparatusEntry} where the scope of 
 * {@link evtviewer.criticalApparatusEntry.directive:evtCriticalApparatusEntry evtCriticalApparatusEntry} directive 
 * is expanded and stored untill the directive remains instantiated.
 *
 * ## Directives
 * - {@link evtviewer.criticalApparatusEntry.directive:evtCriticalApparatusEntry evtCriticalApparatusEntry}: 
 * custom directive that identifies a critical apparatus entry, whose contents are properly organized. 
 * The scope of the directive is expanded and stored inside the 
 * {@link evtviewer.criticalApparatusEntry.evtCriticalApparatusEntry evtCriticalApparatusEntry} provider.
 * - {@link evtviewer.criticalApparatusEntry.directive:evtWitnessRef evtWitnessRef}: custom directive
 * that identifies the sigla of a witness to be used within the critical apparatus entry as an "access point"
 * to the context of a specific reading.
 *
 * ## Controllers
 * - {@link  evtviewer.criticalApparatusEntry.controller:CriticalApparatusEntryCtrl CriticalApparatusEntryCtrl}: 
 * controller for the directive 
 * {@link evtviewer.criticalApparatusEntry.directive:evtCriticalApparatusEntry evtCriticalApparatusEntry}. 
**/
angular.module('evtviewer.criticalApparatusEntry', []);