/**
 * @ngdoc overview
 * @name evtviewer.visColl
 * @module evtviewer.visColl
 * @description 
 * # evtviewer.visColl
 * It contains the directives and services used to handle visColl available on the text.
 * ## Services
 * - {@link evtviewer.visColl.evtViscoll evtViscoll} where the scope of 
 * {@link evtviewer.visColl.directive:evtViscoll evtViscoll} directive 
 * is expanded and stored until the directive remains instantiated.
 *
 * ## Directives
 * - {@link evtviewer.visColl.directive:evtViscoll evtViscoll}: custom directive that 
 * create a visColl that can page the view mode. 
 * The scope of the directive is expanded and stored inside the 
 * {@link evtviewer.visColl.evtViscoll evtViscoll} provider.
 *
 * ## Controllers
 * - {@link  evtviewer.visColl.controller:ViscollCtrl ViscollCtrl}: controller for the directive 
 * {@link evtviewer.visColl.directive:evtViscoll evtViscoll}. 
**/
angular.module('evtviewer.visColl', []);