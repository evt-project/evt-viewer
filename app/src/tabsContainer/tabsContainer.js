/**
 * @ngdoc overview
 * @name evtviewer.tabsContainer
 * @module evtviewer.tabsContainer
 * @description 
 * # evtviewer.tabsContainer
 * <p>Module referring to tabs containers, intended as containers that will show a particular content 
 * organized in a structure similar to an unordered list of tabs that have hashes corresponding to tab ids. 
 * When the user clicks on each tab, only the container with the corresponding tab id will become visible.</p>
 * <p>Tabs can appear either on top of content ('*horizontal*' layout) or on the left-hand side of content ('*vertical*' layout).</p>
 * <p>The tabs and the content of each one are defined according to a particular type.</p>
 *
 * ## Services
 * - {@link evtviewer.tabsContainer.evtTabsContainer evtTabsContainer} where the scope of 
 * {@link evtviewer.tabsContainer.directive:evtTabsContainer evtTabsContainer} directive 
 * is expanded and stored untill the directive remains instantiated.
 *
 * ## Directives
 * - {@link evtviewer.tabsContainer.directive:evtTabsContainer evtTabsContainer}: custom directive that will 
 * show a particular content organized in a structure similar to an unordered list of tabs 
 * The scope of the directive is expanded and stored inside the 
 * {@link evtviewer.tabsContainer.evtTabsContainer evtTabsContainer} provider. 
 *
 * ## Controllers
 * - {@link  evtviewer.tabsContainer.controller:TabsContainerCtrl TabsContainerCtrl}: controller for the directive 
 * {@link evtviewer.tabsContainer.directive:evtTabsContainer evtTabsContainer}. Some methods of this controller 
 * are defined (and personalized according to type) in {@link evtviewer.tabsContainer.evtTabsContainer evtTabsContainer} provider.
**/
angular.module('evtviewer.tabsContainer', []);