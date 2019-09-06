/**
 * @ngdoc overview
 * @name evtviewer.toc
 * @module evtviewer.toc
 * @description 
 * # evtviewer.toc
 * <p>Module referring to tabs containers, intended as containers that will show a particular content 
 * organized in a structure similar to an unordered list of tabs that have hashes corresponding to tab ids. 
 * When the user clicks on each tab, only the container with the corresponding tab id will become visible.</p>
 * <p>Tabs can appear either on top of content ('*horizontal*' layout) or on the left-hand side of content ('*vertical*' layout).</p>
 * <p>The tabs and the content of each one are defined according to a particular type.</p>
 *
 * ## Services
 * - {@link evtviewer.toc.evtToc evtToc} where the scope of 
 * {@link evtviewer.toc.directive:evtToc evtToc} directive 
 * is expanded and stored untill the directive remains instantiated.
 *
 * ## Directives
 * - {@link evtviewer.toc.directive:evtToc evtToc}: custom directive that will 
 * show a particular content organized in a structure similar to an unordered list of tabs 
 * The scope of the directive is expanded and stored inside the 
 * {@link evtviewer.toc.evtToc evtToc} provider. 
 *
 * ## Controllers
 * - {@link  evtviewer.toc.controller:TocCtrl TocCtrl}: controller for the directive 
 * {@link evtviewer.toc.directive:evtToc evtToc}. Some methods of this controller 
 * are defined (and personalized according to type) in {@link evtviewer.toc.evtToc evtToc} provider.
**/
angular.module('evtviewer.toc', []);