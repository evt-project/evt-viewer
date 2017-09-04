/**
 * @ngdoc overview
 * @name evtviewer.reading
 * @module evtviewer.reading
 * @description 
 * # evtviewer.reading
 * It contains the directives and services used to handle the critical apparatus readings available on the text.
 * ## Services
 * - {@link evtviewer.reading.evtReading evtReading} where the scope of 
 * {@link evtviewer.reading.directive:evtReading evtReading} directive 
 * is expanded and stored untill the directive remains instantiated.
 *
 * ## Directives
 * - {@link evtviewer.reading.directive:evtReading evtReading}: custom directive that 
 * identify a critical reading connected to a specific critical apparatus. 
 * The scope of the directive is expanded and stored inside the 
 * {@link evtviewer.reading.evtReading evtReading} provider.
 *
 * ## Controllers
 * - {@link  evtviewer.reading.controller:ReadingCtrl ReadingCtrl}: controller for the directive 
 * {@link evtviewer.reading.directive:evtReading evtReading}. 
**/
angular.module('evtviewer.reading', []);