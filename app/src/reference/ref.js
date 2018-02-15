/**
 * @ngdoc overview
 * @name evtviewer.reference
 * @module evtviewer.reference
 * @description 
 * # evtviewer.reference
 * Module referring to references, intended as elements pointing to internal or external resources.
 *
 * ## Services
 * - {@link evtviewer.reference.evtRef evtRef} where the scope of 
 * {@link evtviewer.reference.directive:ref ref} directive 
 * is expanded and stored untill the directive remains instantiated.
 *
 * ## Directives
 * - {@link evtviewer.reference.directive:ref ref}: custom directive that handle the click
 * event on elements pointing to internal or external resources. 
 * The scope of the directive is expanded and stored inside the 
 * {@link evtviewer.reference.evtRef evtRef} provider.
 *
 * ## Controllers
 * - {@link  evtviewer.reference.controller:RefCtrl RefCtrl}: controller for the directive 
 * {@link evtviewer.reference.directive:ref ref}.
 **/
angular.module('evtviewer.reference', []);