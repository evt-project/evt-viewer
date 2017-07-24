/**
 * @ngdoc overview
 * @name evtviewer.box
 * @description 
 * # evtviewer.box
 * Module referring to box, intended as a single content of text, image, other content, etc.
 * 
 * ## Services
 * - {@link evtviewer.box.evtBox evtBox} where the scope of 
 * {@link evtviewer.box.directive:box box} directive 
 * is expanded and stored untill the directive remains instantiated.
 *
 * ## Directives
 * - {@link evtviewer.box.directive:box box}: custom directive that will show a container 
 * with an header with tools (optional), a body and a footer with tools (optional). 
 * The content of the body will depend on box type. Since each instance of box must be controlled in different 
 * ways depending on type, the controller for this directive is dynamically defined inside the {@link evtviewer.box.evtBox evtBox} provider.
**/
angular.module('evtviewer.box', []);