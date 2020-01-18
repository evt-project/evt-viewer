/**
 * @ngdoc module
 * @name evtviewer.3dhop
 * @module evtviewer.3dhop
 * @description 
 * # evtviewer.3dhop
 * It contains the directives and services used to handle the 3D view.
 * ## Services
 * - {@link evtviewer.3dhop.evtTreDHOP evtTreDHOP} where the scope of 
 * {@link evtviewer.3dhop.directive:evtTreDHOP evtTreDHOP} directive
 *  is expanded and stored until the directive remains instantiated.
 * 
 *  ## Directives
 * - {@link evtviewer.3dhop.directive:evtTreDHOP evtTreDHOP}: custom directive that 
 * create a 3dhop that can page the view mode. 
 * The scope of the directive is expanded and stored inside the 
 * {@link evtviewer.3dhop.evtTreDHOP evtTreDHOP} provider.
 *
 * ## Controllers
 * - {@link  evtviewer.3dhop.controller:TreDHOPCtrl TreDHOPCtrl}: controller for the directive 
 * {@link evtviewer.3dhop.directive:evtTreDHOPC evtTreDHOP}. 
**/
angular.module('evtviewer.3dhop', []);