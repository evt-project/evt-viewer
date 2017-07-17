'use strict';

/**
 * @ngdoc overview
 * @name evtviewer
 * 
 * @description
 * # evtviewer
 * Main module of the application. 
 * A different module has been defined for each interface element. For each of them it is possible to have:
 * - a configuration file where the values of some constants are defined
 * - provider/service
 * - directive
 * - controller (where everything concerning the single instance of the directive is defined)
 * 
 * # Module organization
 * Some modules, especially those used to manage data, are defined exclusively by a service.
 * For the implementation of the services, provider was mainly used for modules that need to be instantiated more than once.
 * This choice was first driven by the fact that the provider can be injected into other modules depending from it during the configuration phase.
 * Moreover, from a theoretical point of view, it was possible to create components in a programmatic manner and 
 * to give to all functions defined in the service access to an object that is not directly defined by a directive.
 *
 * # Styling
 *
 * With regard to the graphic style, rules have been defined in SCSS and grouped in an external folder "styles". 
 * {@link http://susy.oddbird.net/ Susy} framework was chosen as a grid-layout engine.
 *
 * @requires ngAnimate
 * @requires ngCookies
 * @requires ngMessages
 * @requires ngResource
 * @requires ngSanitize
 * @requires ngTouch
 * @requires templates-main
 * @requires ngRoute
 * @requires xml
 * @requires prettyXml
 * @requires infinite-scroll
 * @requires pascalprecht.translate
 * @requires evtviewer.core
 * @requires evtviewer.communication
 * @requires evtviewer.translation
 * @requires evtviewer.dataHandler
 * @requires evtviewer.interface
 * @requires evtviewer.box
 * @requires evtviewer.select
 * @requires evtviewer.buttonSwitch
 * @requires evtviewer.mobile
 * @requires evtviewer.popover
 * @requires evtviewer.namedEntity
 * @requires evtviewer.criticalApparatusEntry
 * @requires evtviewer.reading
 * @requires evtviewer.dialog
 * @requires evtviewer.bibliography
 * @requires evtviewer.reference
 * @requires evtviewer.list
 * @requires evtviewer.quote
 * @requires evtviewer.tabsContainer
 * @requires evtviewer.sourcesApparatusEntry
 * @requires evtviewer.analogue
 * @requires evtviewer.analoguesApparatusEntry
 * @requires evtviewer.apparatuses
 * @requires evtviewer.versionReading
 * @requires evtviewer.versionApparatusEntry
 * @requires evtviewer.UItools
 */
angular
	.module('evtviewer', [
		'ngAnimate',
		'ngCookies',
		'ngMessages',
		'ngResource',
		'ngSanitize',
		'ngTouch',
		'templates-main',
		'ngRoute',
		'xml',
		'prettyXml',
		'infinite-scroll',
		'pascalprecht.translate',
		'evtviewer.core',
		'evtviewer.communication',
		'evtviewer.translation',
		'evtviewer.dataHandler',
		'evtviewer.interface',
		'evtviewer.box',
		'evtviewer.select',
		'evtviewer.buttonSwitch',
		'evtviewer.mobile',
		'evtviewer.popover',
		'evtviewer.namedEntity',
		'evtviewer.criticalApparatusEntry',
		'evtviewer.reading',
		'evtviewer.dialog',
		'evtviewer.bibliography',
		'evtviewer.reference',
		'evtviewer.list',
        'evtviewer.quote',
        'evtviewer.tabsContainer',
        'evtviewer.sourcesApparatusEntry',
        'evtviewer.analogue',
        'evtviewer.analoguesApparatusEntry',
        'evtviewer.apparatuses',
        'evtviewer.versionReading',
        'evtviewer.versionApparatusEntry',
        'evtviewer.UItools'
    ]);
