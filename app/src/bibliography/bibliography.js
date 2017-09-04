/**
 * @ngdoc overview
 * @name evtviewer.bibliography
 * @description 
 * # evtviewer.bibliography
 * Module referring to bibliography references and lists.
 * 
 * ## Services
 * - {@link evtviewer.bibliography.evtBibliography evtBibliography} where the scope of 
 * {@link evtviewer.bibliography.directive:evtBibliography evtBibliography}
 * directive is expanded and stored untill the directive remains instantiated.
 * - {@link evtviewer.bibliography.evtHighlightService evtHighlightService} service, where information about highlighted bibliographic entry
 * are stored to be retrieved in different moments.
 *
 * ## Directives
 * - {@link evtviewer.bibliography.directive:evtBibliography evtBibliography}: custom directive that will show the bibliography of the edition with all 
 * the tools that allows to reorder the entries or format them according to a specific style.
 * - {@link evtviewer.bibliography.directive:evtBiblElem evtBiblElem}: custom directive to show a single bibliographic entry.
 * - {@link evtviewer.bibliography.directive:evtScrollIf evtScrollIf} custom directive that will scroll the content of the element to the first 
 * highlighted entry.
 *
 * ## Controllers
 * - {@link evtviewer.bibliography.controller:BibliographyCtrl BibliographyCtrl}: controller for the 
 * {@link evtviewer.bibliography.directive:evtBibliography evtBibliography} directive.
 * - {@link evtviewer.bibliography.controller:BiblElemCtrl BiblElemCtrl}: controller for the 
 * {@link evtviewer.bibliography.directive:evtBiblElem evtBiblElem} directive.
**/
angular.module('evtviewer.bibliography', []);
