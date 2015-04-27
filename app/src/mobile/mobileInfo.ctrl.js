angular.module('evtviewer.mobile')

.controller('MobileInfoCtrl', function($scope, mobile) {

    $scope.view = mobile.getState();

    /**
     * Refer to this by {@link MobileViewCtrl."info"}.
     * @namespace
     */
    
    $scope.dvb = [{
        url: 'http://vbd.humnet.unipi.it/',
        title: 'Digital Vercelli Book project',
        description: 'Digital Vercelli Book project',
    }, {
        url: 'http://sourceforge.net/projects/evt-project/',
        title: 'Edition Visualization Technology on SourceForge',
        description: 'Edition Visualization Technology',
    }, {
        url: 'https://visualizationtechnology.wordpress.com/',
        title: 'EVT Blog',
        description: 'EVT Blog',
    }, {
        url: 'mailto: editionvisualizationtechnology@gmail.com',
        title: 'Contact',
        description: 'Contact',
    }, ];

    

});