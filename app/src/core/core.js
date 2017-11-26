/**
 * @ngdoc overview
 * @name evtviewer.core
 * @module evtviewer.core
 * @description 
 * # evtviewer.core
 * Core module of EVT 2, partially based on the Core module of {@link https://github.com/net7/pundit2 Pundit}
 * ## Services
 *  - {@link evtviewer.core.config config} that handle module configurations
 *  - {@link evtviewer.core.eventDispatcher eventDispatcher} to add, send and register events
 *  - {@link evtviewer.core.Utils Utils} that exposes useful (DOM/parsing) methods
 *
 * ## Directives
 * - {@link evtviewer.core.directive:compile compile}: custom directive that will dynamically 
 * compile an HTML string containing custom directives, too.
 *
 * ## Filters
 *  - {@link evtviewer.core.filter:camelToSpaces camelToSpaces}: transform camel string (ex: 'myStringInCamel') into more readable string that uses spaces (ex: 'my string in camel')
 *  - {@link evtviewer.core.filter:underscoresToSpaces underscoresToSpaces}: transform undescores in string (ex: 'my_string_with_underscores') into spaces producing a more readable string (ex: 'my string with underscores')
 *  - {@link evtviewer.core.filter:uppercase uppercase}: transform to uppercase a string (ex: 'lower case string' => 'LOWER CASE STRING')
**/
angular.module('evtviewer.core', []);