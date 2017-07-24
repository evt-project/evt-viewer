/**
 * @ngdoc overview
 * @name evtviewer.dialog
 * @module evtviewer.dialog
 * @description 
 * # evtviewer.dialog
 * Module referring to dialog, intended as a single contentainer that opens up above everything 
 * and has a shadow below, hiding the lower contents.
 *
 * ## Services
 * - {@link evtviewer.dialog.evtDialog evtDialog} where the scope of 
 * {@link evtviewer.dialog.directive:evtDialog evtDialog} directive 
 * is expanded and stored untill the directive remains instantiated.
 *
 * ## Directives
 * - {@link evtviewer.dialog.directive:evtDialog evtDialog}: custom directive that will show a 
 * container that opens up above everything and has a shadow below, hiding the lower contents. 
 * The content shown can be added as transcluded content.
 * The general layout and colors will depend on dialog type. 
 * The controller for this directive is dynamically defined inside the {@link evtviewer.dialog.evtDialog evtDialog} provider.
 *
**/
angular.module('evtviewer.dialog', []);