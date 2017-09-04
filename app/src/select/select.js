/**
 * @ngdoc overview
 * @name evtviewer.select
 * @module evtviewer.select
 * @description 
 * # evtviewer.select
 * <p>Module referring to selectors, intended as custom elements designed upon HTML &lt;select&gt;
 * that will populate options list and handle selection according to a particular type.</p>
 * 
 * ## Services
 * - {@link evtviewer.select.evtSelect evtSelect} where the scope of 
 * {@link evtviewer.select.directive:evtSelect evtSelect} directive 
 * is expanded and stored untill the directive remains instantiated.
 *
 * ## Directives
 * - {@link evtviewer.select.directive:evtSelect evtSelect}: custom directive designed upon HTML &lt;select&gt;
 * The scope of the directive is expanded and stored inside the 
 * {@link evtviewer.select.evtSelect evtSelect} provider.
 *
 * ## Controllers
 * - {@link  evtviewer.select.controller:SelectCtrl SelectCtrl}: controller for the directive 
 * {@link evtviewer.select.directive:evtSelect evtSelect}. Some methods of this controller 
 * are defined (and personalized according to type) in {@link evtviewer.select.evtSelect evtSelect} provider.
**/
angular.module('evtviewer.select', []);