/**
 * @ngdoc overview
 * @name evtviewer.depaReading
 * @module evtviewer.depaReading
 * @description 
 * # evtviewer.reading
 * It contains the directives and services used to handle the critical apparatus readings available on the text.
 * ## Services
 * - {@link evtviewer.depaRreading.evtDepaReading evtDepaReading} where the scope of 
 * {@link evtviewer.depaReading.directive:evtDepaReading evtDepaReading} directive 
 * is expanded and stored untill the directive remains instantiated.
 *
 * ## Directives
 * - {@link evtviewer.depaReading.directive:evtDepaReading evtDepaReading}: custom directive that 
 * identify a critical reading connected to a specific critical apparatus. 
 * The scope of the directive is expanded and stored inside the 
 * {@link evtviewer.depaReading.evtDepaReading evtDepaReading} provider.
 *
 * ## Controllers
 * - {@link  evtviewer.depaReading.controller:DepaReadingCtrl DepaReadingCtrl}: controller for the directive 
 * {@link evtviewer.depaReading.directive:evtDepaReading evtDepaReading}. 
**/
angular.module('evtviewer.depaReading', []);