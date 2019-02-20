'use strict';

/**
 * @ngdoc overview
 * @name evtviewer
 * 
 * @description
 * # evtviewer
 * Main module of the application. 
 *
 * @requires {@link https://docs.angularjs.org/api/ngAnimate ngAnimate}
 * @requires {@link https://docs.angularjs.org/api/ngCookies ngCookies}
 * @requires {@link https://docs.angularjs.org/api/ngMessages ngMessages}
 * @requires {@link https://docs.angularjs.org/api/ngResource ngResource}
 * @requires {@link https://docs.angularjs.org/api/ngSanitize ngSanitize}
 * @requires {@link https://docs.angularjs.org/api/ngTouch ngTouch}
 * @requires {@link https://docs.angularjs.org/api/ngRoute ngRoute}
 * @requires {@link https://github.com/johngeorgewright/angular-xml xml}
 * @requires {@link https://github.com/krtnio/angular-pretty-xml prettyXml}
 * @requires {@link https://sroze.github.io/ngInfiniteScroll/documentation.html infinite-scroll}
 * @requires {@link https://angular-translate.github.io/docs/#/api pascalprecht.translate}
 * @requires evtviewer.core
 * @requires evtviewer.communication
 * @requires evtviewer.translation
 * @requires evtviewer.dataHandler
 * @requires evtviewer.interface
 * @requires evtviewer.box
 * @requires evtviewer.select
 * @requires evtviewer.buttonSwitch
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
 * @requires evtviewer.search
 */
 //* @requires evtviewer.mobile
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
		'oc.lazyLoad',
		'evtviewer.core',
		'evtviewer.communication',
		'evtviewer.translation',
		'evtviewer.dataHandler',
		'evtviewer.interface',
		'evtviewer.box',
		'evtviewer.select',
		'evtviewer.buttonSwitch',
		//'evtviewer.mobile',
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
        'evtviewer.UItools',
    	'evtviewer.search',
        'evtviewer.3dhop'
    ]);
