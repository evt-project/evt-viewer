/**
 * @name evtviewer.mobile
 */

angular.module('evtviewer.mobile')

/**
 * @name evtviewer.MobileInfoCtrl
 * @extends evtviewer.mobile
 * @property {string} view
 * @property {string} dvb
 */

.controller('MobileInfoCtrl', ['$scope', 'mobile', function($scope, mobile) {

    $scope.view = mobile.getState();

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

    

}]);