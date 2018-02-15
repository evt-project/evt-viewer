/**
 * @ngdoc overview
 * @name evtviewer.versionReading
 * @module evtviewer.versionReading
 * @description 
 * # evtviewer.versionReading
 * It contains the directives and services for the handling of the double recensio readings inside the text
 * ## Services
 * - {@link evtviewer.versionReading.evtVersionReading evtVersionReading} where the scope of 
 * {@link evtviewer.versionReading.directive:evtVersionReading evtVersionReading} directive 
 * is expanded and stored untill the directive remains instantiated.
 *
 * ## Directives
 * - {@link evtviewer.versionReading.directive:evtVersionReading evtVersionReading}: custom directive that 
 * identify a double recensio reading connected to a specific double recensio apparatus. 
 * The scope of the directive is expanded and stored inside the 
 * {@link evtviewer.versionReading.evtVersionReading evtVersionReading} provider.
 *
 * ## Controllers
 * - {@link  evtviewer.versionReading.controller:versionReadingCtrl versionReadingCtrl}: controller for the directive 
 * {@link evtviewer.versionReading.directive:evtVersionReading evtVersionReading}. 
**/
angular.module('evtviewer.versionReading', []);