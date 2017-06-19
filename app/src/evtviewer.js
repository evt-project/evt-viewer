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
    'ngAnimate',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'templates-main',
    'xml',
    'prettyXml',
    'evtviewer.core',
    'evtviewer.communication',
    'evtviewer.dataHandler',
    'evtviewer.interface',
    'evtviewer.box',
    'evtviewer.select',
    'evtviewer.buttonSwitch',
    'evtviewer.popover',
    'evtviewer.mobile',
    'evtviewer.criticalApparatusEntry',
    'evtviewer.reading',
    'evtviewer.dialog',
    'evtviewer.tabsContainer',
    'evtviewer.UItools',
    'evtviewer.quote',
    'evtviewer.sourcesApparatusEntry',
    'evtviewer.analogue',
    'evtviewer.analoguesApparatusEntry',
    'evtviewer.apparatuses',
    'evtviewer.versionReading',
    'evtviewer.versionApparatusEntry'
  ]);