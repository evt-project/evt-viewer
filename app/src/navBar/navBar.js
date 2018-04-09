/**
 * @ngdoc overview
 * @name evtviewer.navBar
 * @module evtviewer.navBar
 * @description 
 * # evtviewer.navBar
 * It contains the directives and services used to handle the navBar available on the text.
 * ## Services
 * - {@link evtviewer.navBar.evtNavbar evtNavbar} where the scope of 
 * {@link evtviewer.navBar.directive:evtNavbar evtNavbar} directive 
 * is expanded and stored until the directive remains instantiated.
 *
 * ## Directives
 * - {@link evtviewer.navBar.directive:evtNavbar evtNavbar}: custom directive that 
 * create a navBar that can page the view mode. 
 * The scope of the directive is expanded and stored inside the 
 * {@link evtviewer.navBar.evtNavbar evtNavbar} provider.
 *
 * ## Controllers
 * - {@link  evtviewer.navBar.controller:NavbarCtrl NavbarCtrl}: controller for the directive 
 * {@link evtviewer.navBar.directive:evtNavbar evtNavbar}. 
**/
angular.module('evtviewer.navBar', []);