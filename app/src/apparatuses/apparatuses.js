/**
 * @ngdoc overview
 * @name evtviewer.apparatuses
 * @description 
 * # evtviewer.apparatuses
 * Module referring to critical apparatuses box.
 * 
 * ## Services
 * - {@link evtviewer.apparatuses.evtApparatuses evtApparatuses} where the scope of 
 * {@link evtviewer.apparatuses.directive:evtApparatuses evtApparatuses} directive 
 * is expanded and stored untill the directive remains instantiated.
 *
 * ## Directives
 * - {@link evtviewer.apparatuses.directive:evtApparatuses evtApparatuses}: custom directive 
 * that will show a box with different critical apparatuses (critical entries, sources or analogues).
 *
 * ## Controllers
 * - {@link evtviewer.apparatuses.controller:apparatusesCtrl apparatusesCtrl}: controller for the 
 * {@link evtviewer.apparatuses.directive:evtApparatuses evtApparatuses} directive.
**/
angular.module('evtviewer.apparatuses', []);