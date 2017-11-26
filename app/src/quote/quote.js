/**
 * @ngdoc overview
 * @name evtviewer.quote
 * @module evtviewer.quote
 * @description 
 * # evtviewer.quote
 * Module containing the classes that determine how quotations inside the text are shown to the user and how to access the corresponding information.
 * 
 * ## Services
 * - {@link evtviewer.quote.evtQuote evtQuote} expands the scope of 
 * {@link evtviewer.quote.directive:evtQuote evtQuote} directive 
 * and stores it. The expanded scope is aaved inside the memory as long as the directive is instantiated.
 *
 * ## Directives
 * - {@link evtviewer.quote.directive:evtQuote evtQuote} is custom directive that will highlight the quotations within the running text and allow the user to click on them to access the corresponding sources apparatus entries.
 *
 * ## Controllers
 * - {@link evtviewer.quote.controller:QuoteCtrl QuoteCtrl}: controller for the {@link evtviewer.quote.directive:evtQuote evtQuote} directive.
**/
angular.module('evtviewer.quote', []);