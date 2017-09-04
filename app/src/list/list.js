/**
 * @ngdoc overview
 * @name evtviewer.list
 * @module evtviewer.list
 * @description 
 * # evtviewer.list
 * Module referring to named entities list, intended as a single contentainer showing a list of named entities,
 * (divided by indexing letter) which are not "loaded" or "initialized" all together, 
 * but in group of 5 elements when scrolling occurs 
 * (it uses infinite scrolling to perform the lazy loading of elements).
 *
 * ## Services
 * - {@link evtviewer.list.evtList evtList} where the scope of 
 * {@link evtviewer.list.directive:evtList evtList} directive 
 * is expanded and stored untill the directive remains instantiated.
 *
 * ## Directives
 * - {@link evtviewer.list.directive:evtList evtList}: custom directive that will show a list of named entities
 * divided by letter and initialized as the scrolling occurs. 
 * The list of elements itself depend on the type of list; elements are retrieved from 
 * {@link evtviewer.dataHandler.parsedData}.
 * The {@link evtviewer.list.controller:ListCtrl controller} for this directive is dynamically defined inside the 
 * {@link evtviewer.list.evtList evtList} provider.
**/
angular.module('evtviewer.list', []);