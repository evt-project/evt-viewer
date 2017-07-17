'use strict';

/**
 * @ngdoc overview
 * @name evtviewer
 *
 * @require ngAnimate
 * @require ngCookies
 * @require ngMessages
 * @require ngResource
 * @require ngSanitize
 * @require ngTouch
 * @require templates-main
 * @require ngRoute
 * @require xml
 * @require prettyXml
 * @require infinite-scroll
 * @require pascalprecht.translate
 * @require evtviewer.core
 * @require evtviewer.communication
 * @require evtviewer.translation
 * @require evtviewer.dataHandler
 * @require evtviewer.interface
 * @require evtviewer.box
 * @require evtviewer.select
 * @require evtviewer.buttonSwitch
 * @require evtviewer.mobile
 * @require evtviewer.popover
 * @require evtviewer.namedEntity
 * @require evtviewer.criticalApparatusEntry
 * @require evtviewer.reading
 * @require evtviewer.dialog
 * @require evtviewer.bibliography
 * @require evtviewer.reference
 * @require evtviewer.list
 * @require evtviewer.quote
 * @require evtviewer.tabsContainer
 * @require evtviewer.sourcesApparatusEntry
 * @require evtviewer.analogue
 * @require evtviewer.analoguesApparatusEntry
 * @require evtviewer.apparatuses
 * @require evtviewer.versionReading
 * @require evtviewer.versionApparatusEntry
 * @require evtviewer.UItools
 *
 * @description
 * # evtviewer
 * Main module of the application.
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
