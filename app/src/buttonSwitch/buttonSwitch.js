/**
 * @ngdoc overview
 * @name evtviewer.buttonSwitch
 * @description 
 * # evtviewer.buttonSwitch
 * Module referring Module referring to buttonSwitch, intended as a single content of text, image, other content, etc.
 * 
 * ## Services
 * - {@link evtviewer.buttonSwitch.evtButtonSwitch evtButtonSwitch} where the scope of 
 * {@link evtviewer.buttonSwitch.directive:buttonSwitch buttonSwitch} directive 
 * is expanded and stored untill the directive remains instantiated.
 *
 * ## Directives
 * - {@link evtviewer.buttonSwitch.directive:buttonSwitch buttonSwitch}: custom directive that will show a container 
 * with an header with tools (optional), a body and a footer with tools (optional). 
 * The content of the body will depend on buttonSwitch type. Since each instance of buttonSwitch must be controlled in different 
 * ways depending on type, the controller for this directive is dynamically defined inside the {@link evtviewer.buttonSwitch.evtButtonSwitch evtButtonSwitch} provider.
**/
angular.module('evtviewer.buttonSwitch', []);