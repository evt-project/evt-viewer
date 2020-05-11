/**
 * @ngdoc overview
 * @name evtviewer.rune
 * @module evtviewer.rune
 * @description
 * # evtviewer.rune
 * Module referring to rune, intended as a single contentainer that opens up above everything
 * and has a shadow below, hiding the lower contents.
 *
 * ## Services
 * - {@link evtviewer.rune.evtDialog evtDialog} where the scope of
 * {@link evtviewer.rune.directive:evtDialog evtDialog} directive
 * is expanded and stored untill the directive remains instantiated.
 *
 * ## Directives
 * - {@link evtviewer.rune.directive:evtDialog evtDialog}: custom directive that will show a
 * container that opens up above everything and has a shadow below, hiding the lower contents.
 * The content shown can be added as transcluded content.
 * The general layout and colors will depend on rune type.
 * The controller for this directive is dynamically defined inside the {@link evtviewer.rune.evtDialog evtDialog} provider.
 *
**/
angular.module('evtviewer.rune', []);
