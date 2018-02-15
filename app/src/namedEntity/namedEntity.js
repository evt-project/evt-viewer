/**
 * @ngdoc overview
 * @name evtviewer.namedEntity
 * @module evtviewer.namedEntity
 * @description 
 * # evtviewer.namedEntity
 * Module referring to named entities elements, intended as single contentainers showing the details
 * of a named entity.
 *
 * ## Services
 * - {@link evtviewer.namedEntity.evtNamedEntity evtNamedEntity} where the scope of 
 * {@link evtviewer.namedEntity.directive:evtNamedEntity evtNamedEntity} directive 
 * is expanded and stored untill the directive remains instantiated.
 *
 * - {@link evtviewer.namedEntity.evtNamedEntityRef evtNamedEntityRef} where the scope of 
 * {@link evtviewer.namedEntity.directive:evtNamedEntityRef evtNamedEntityRef} directive 
 * is expanded and stored untill the directive remains instantiated.
 *
 * - {@link evtviewer.namedEntity.evtGenericEntity evtGenericEntity} where are defined and 
 * exposed methods to handle the highlighting of "generic" elements
 * that should behave as named entities. 
 *
 * ## Directives
 * - {@link evtviewer.namedEntity.directive:evtNamedEntity evtNamedEntity}: custom directive that will show the details
 * of a specific named entity, properly organized e structures. 
 * All the information are retrieved from 
 * {@link evtviewer.dataHandler.parsedData}.
 * The {@link evtviewer.namedEntity.controller:NamedEntityCtrl controller} for this directive is dynamically defined inside the 
 * {@link evtviewer.namedEntity.evtNamedEntity evtNamedEntity} provider.
 *
 * - {@link evtviewer.namedEntity.directive:evtNamedEntityRef evtNamedEntityRef}: custom directive that will show an occurrence
 * of a particular named entity and is directly connected to it. 
 * All the information are retrieved from 
 * {@link evtviewer.dataHandler.parsedData}.
 * The {@link evtviewer.namedEntity.controller:NamedEntityRefCtrl controller} for this directive is dynamically defined inside the 
 * {@link evtviewer.namedEntity.evtNamedEntityRef evtNamedEntityRef} provider.
**/
angular.module('evtviewer.namedEntity', []);