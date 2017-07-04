'use strict';

/**
 * @ngdoc overview
 * @name evtviewer
 * @description
 * # evtviewer
 *
 * Main module of the application.
 */
angular
	.module('evtviewer', [
// Needed for mobile (temporarily deactivated)
//		'ngAnimate',
//		'ngCookies',
//		'ngMessages',
//		'ngResource',
//		'ngSanitize',
//		'ngTouch',
//		'templates-main',
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
//		'evtviewer.mobile',
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
